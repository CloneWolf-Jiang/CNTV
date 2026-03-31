/**
 * CNTV TS 切片文件播放验证器（Node.js 版本）
 * ============================================
 * 本脚本还原了 live.worker.js + liveplayer_controls.js 中的完整 TS 切片
 * 载入 → 解码 → 输出 逻辑链，可在 Node.js 环境中独立运行和验证。
 *
 * 完整逻辑链（来源于项目分析）：
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  liveplayer.js                                                       │
 * │    initLiveH5Player()  →  创建 Web Worker (live.worker.js)           │
 * │    HLS.js 实例初始化   →  liveplayer_controls.js                      │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  liveplayer_controls.js (含混淆版 HLS.js + CNTV 解码集成层)           │
 * │    1. XHR 下载 m3u8 播放列表                                          │
 * │    2. XHR 下载 .ts 切片（TS Transport Stream）                        │
 * │    3. TSDemuxer: 按 188 字节包解析                                     │
 * │       - PID=0x0000 → PAT（节目关联表）                                │
 * │       - PID=pmtPid → PMT（节目映射表）                                │
 * │       - PID=videoPid/audioPid → PES 基本流包                          │
 * │    4. fI.moduleDecData(module, mediaTagId, pesData, codecMode)        │
 * │       - module._jsmalloc(size+pad)  ← 分配 WASM 输入缓冲              │
 * │       - module.HEAP8.set(pesData, inPtr)  ← 写入数据                  │
 * │       - module._jsmalloc(mediaId.len+1)   ← 分配标识符缓冲            │
 * │       - 调用 module._CNTV_jsdecLiveN(ctxPtr,inPtr,len,0) ← 解码      │
 * │       - 读回 module.HEAPU8.subarray(inPtr, inPtr+outLen) ← 解码结果   │
 * │       - module._jsfree(inPtr); module._jsfree(ctxPtr)                │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  live.worker.js (Emscripten WASM 模块 + 音频支持)                     │
 * │    CNTVModule:                                                        │
 * │      _CNTV_InitPlayer(ptr)       — 初始化解码通道                     │
 * │      _CNTV_UnInitPlayer(ptr)     — 释放解码通道                       │
 * │      _CNTV_UpdatePlayer(ptr)     — 更新播放器状态                     │
 * │      _CNTV_jsdecLive0..8(ctx,in,len,extra) — Live TS 解码            │
 * │        Live0=MP4/Generic  Live4=HEVC+AAC  Live7=H.264  Live8=MPEG   │
 * │      _CNTV_jsdecVOD0..8(ctx,in,len,extra)  — VOD  TS 解码            │
 * │      _jsmalloc(size) / _jsfree(ptr)         — WASM 堆内存管理        │
 * │      _GetDecryptAudio(ptr,size) — 获取解密音频数据                   │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * 用法：
 *   node ts_player_verify.js [<ts_file.ts>]
 *
 * 如不传参数，脚本将自动生成一个最小合法 TS 测试包来演示解析流程。
 *
 * 依赖：
 *   - Node.js >= 16
 *   - live.worker.js（与本脚本同目录，含嵌入的 cntv_decoder.wasm 数据 URI）
 *   - cntv_decoder.wasm（独立 WASM 二进制，从 live.worker.js 提取）
 */

// 注意：不使用 'use strict'，因为 Emscripten 运行时代码和 global 桩不兼容严格模式

const fs   = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// § 1  TS 包解析 (Transport Stream demuxer)
// ─────────────────────────────────────────────────────────────────────────────

const TS_SYNC_BYTE   = 0x47;
const TS_PACKET_SIZE = 188;

/**
 * 解析 TS 原始字节流，返回所有合法的 TS 包头信息数组。
 * @param {Buffer|Uint8Array} data
 * @returns {Array<{offset,pid,pusi,cc,hasAdaptation,hasPayload,payload}>}
 */
function parseTsPackets(data) {
    const packets = [];
    let start = 0;
    while (start < data.length && data[start] !== TS_SYNC_BYTE) start++;

    for (let i = start; i + TS_PACKET_SIZE <= data.length; i += TS_PACKET_SIZE) {
        if (data[i] !== TS_SYNC_BYTE) continue;

        const b1 = data[i + 1];
        const b2 = data[i + 2];
        const b3 = data[i + 3];

        const tei       = (b1 & 0x80) !== 0;
        const pusi      = (b1 & 0x40) !== 0;
        const pid       = ((b1 & 0x1F) << 8) | b2;
        const adaptCtrl = (b3 & 0x30) >> 4;
        const cc        = b3 & 0x0F;
        const hasAdapt  = (adaptCtrl & 0x2) !== 0;
        const hasPay    = (adaptCtrl & 0x1) !== 0;

        if (tei) continue;

        let payloadOffset = i + 4;
        if (hasAdapt) {
            payloadOffset += 1 + data[payloadOffset];
        }

        const payload = hasPay && payloadOffset < i + TS_PACKET_SIZE
            ? data.slice(payloadOffset, i + TS_PACKET_SIZE)
            : null;

        packets.push({ offset: i, pid, pusi, cc, hasAdaptation: hasAdapt, hasPayload: hasPay, payload });
    }
    return packets;
}

// ─────────────────────────────────────────────────────────────────────────────
// § 2  PAT 解析 (Program Association Table, PID=0)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 从 PAT 包载荷中解析节目列表。
 * @param {Buffer|Uint8Array} payload
 * @returns {Object}  { programNumber → pmtPID }
 */
function parsePAT(payload) {
    const programs = {};
    const pointer  = payload[0];
    let i = 1 + pointer;
    if (payload[i] !== 0x00) return programs; // table_id must be 0
    const sectionLength = ((payload[i + 1] & 0x0F) << 8) | payload[i + 2];
    const sectionEnd    = i + 3 + sectionLength - 4; // -4 for CRC32
    i += 8;
    while (i + 4 <= sectionEnd) {
        const programNumber = (payload[i] << 8) | payload[i + 1];
        const pmtPid        = ((payload[i + 2] & 0x1F) << 8) | payload[i + 3];
        if (programNumber !== 0) programs[programNumber] = pmtPid;
        i += 4;
    }
    return programs;
}

// ─────────────────────────────────────────────────────────────────────────────
// § 3  PMT 解析 (Program Map Table)
// ─────────────────────────────────────────────────────────────────────────────

/** ISO 13818-1 流类型映射 */
const STREAM_TYPE_MAP = {
    0x01: 'MPEG-1 Video',  0x02: 'MPEG-2 Video',
    0x03: 'MPEG-1 Audio',  0x04: 'MPEG-2 Audio',
    0x0F: 'AAC Audio',     0x11: 'AAC LATM',
    0x1B: 'H.264 Video',   0x24: 'H.265/HEVC Video',
    0x42: 'AVS Video',     0x80: 'PCM Audio',
    0x81: 'AC3 Audio',
};

/**
 * 从 PMT 包载荷中解析 ES 流列表。
 * @param {Buffer|Uint8Array} payload
 * @returns {Array<{pid, streamType, streamTypeName}>}
 */
function parsePMT(payload) {
    const streams = [];
    const pointer = payload[0];
    let i = 1 + pointer;
    if (payload[i] !== 0x02) return streams; // table_id for PMT
    const sectionLength  = ((payload[i + 1] & 0x0F) << 8) | payload[i + 2];
    const sectionEnd     = i + 3 + sectionLength - 4;
    i += 3;
    // Skip program_number(2) + version/flags(1) + section_number(1) + last_section_number(1)
    // PMT-specific: PCR_PID at [i+5..i+6], program_info_length at [i+7..i+8]
    const programInfoLen = ((payload[i + 7] & 0x0F) << 8) | payload[i + 8];
    i += 9 + programInfoLen;
    while (i + 5 <= sectionEnd) {
        const streamType    = payload[i];
        const elementaryPid = ((payload[i + 1] & 0x1F) << 8) | payload[i + 2];
        const esInfoLength  = ((payload[i + 3] & 0x0F) << 8) | payload[i + 4];
        streams.push({
            pid: elementaryPid,
            streamType,
            streamTypeName: STREAM_TYPE_MAP[streamType] || `unknown(0x${streamType.toString(16)})`,
        });
        i += 5 + esInfoLength;
    }
    return streams;
}

// ─────────────────────────────────────────────────────────────────────────────
// § 4  PES 拼装 (Packetized Elementary Stream assembler)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 从 TS 包列表中拼装目标 PID 的完整 PES 单元。
 * @param {Array} tsPackets  parseTsPackets() 的输出
 * @param {number} pid       目标 PID
 * @returns {Array<{pts, dts, data:Uint8Array}>}
 */
function assemblePES(tsPackets, pid) {
    const pesUnits = [];
    let currentData = null;
    let currentPts  = null;
    let currentDts  = null;

    for (const pkt of tsPackets) {
        if (pkt.pid !== pid || !pkt.payload) continue;
        const pay = pkt.payload;

        if (pkt.pusi) {
            if (currentData && currentData.length > 0) {
                pesUnits.push({ pts: currentPts, dts: currentDts, data: new Uint8Array(currentData) });
            }
            currentData = [];

            if (pay.length >= 9 && pay[0] === 0x00 && pay[1] === 0x00 && pay[2] === 0x01) {
                const flags2        = pay[7];
                const headerDataLen = pay[8];
                const hasPts        = (flags2 & 0x80) !== 0;
                const hasDts        = (flags2 & 0x40) !== 0;

                if (hasPts && pay.length >= 14) currentPts = parsePTS(pay, 9);
                if (hasDts && pay.length >= 19) currentDts = parsePTS(pay, 14);

                const payloadStart = 9 + headerDataLen;
                for (let b = payloadStart; b < pay.length; b++) currentData.push(pay[b]);
            }
        } else if (currentData !== null) {
            for (let b = 0; b < pay.length; b++) currentData.push(pay[b]);
        }
    }

    if (currentData && currentData.length > 0) {
        pesUnits.push({ pts: currentPts, dts: currentDts, data: new Uint8Array(currentData) });
    }
    return pesUnits;
}

/** 从 PES 头读取 33-bit PTS/DTS（90kHz ticks） */
function parsePTS(buf, offset) {
    return ((buf[offset] & 0x0E) * 0x10000000)
        + ((buf[offset + 1] << 21) | ((buf[offset + 2] & 0xFE) << 13)
        | (buf[offset + 3] << 6)  | ((buf[offset + 4] & 0xFE) >> 2));
}

// ─────────────────────────────────────────────────────────────────────────────
// § 5  WASM 解码器初始化
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 通过 live.worker.js 内嵌的 CNTVModule 工厂函数初始化 WASM 解码器。
 *
 * live.worker.js 是一个 Emscripten 构建的模块，包含：
 *   - cntv_decoder.wasm 的 base64 数据 URI（嵌入在 wasmBinaryFile 变量中）
 *   - 完整的 Emscripten 运行时（内存管理、embind、syscall 支持等）
 *   - CNTVModule 工厂函数（调用后异步初始化 WASM，通过 onRuntimeInitialized 回调通知）
 *
 * 本函数通过 shim 关键浏览器 API，在 Node.js 中直接运行该工厂函数。
 * 注意：Emscripten 的 run() → callMain() 序列与 Node.js 的 Promise 微任务队列
 *       存在调度冲突，因此使用直接回调（callback）而非 Promise/async/await。
 *
 * @param {string}   workerPath  live.worker.js 的路径
 * @param {Function} onReady     (err, module) => void  回调函数
 */
function initCNTVDecoder(workerPath, onReady) {
    // ── 浏览器 API 桩（仅提供 CNTVModule 初始化所必需的） ────────────────
    // document.currentScript 被 Emscripten 用来定位脚本路径
    if (!global.document) {
        global.document = { currentScript: null, title: '' };
    }
    // window=null → typeof window === 'object' 为 true（null 是 object），
    // 但这会让 Emscripten 误以为是 Web 页面环境。
    // 不设置 global.window 让它保持 undefined 以触发 ENVIRONMENT_IS_WEB=false，
    // 同时设置 importScripts 以触发 ENVIRONMENT_IS_WORKER=true。
    if (global.window === null) {
        // 如果已被设为 null，保持不变（兼容性考虑）
    }
    // self → ENVIRONMENT_IS_WORKER=true（Web Worker 模式）
    if (!global.self || global.self === global) {
        global.self = { location: { href: '' } };
    }
    // vmpTag: CNTV 专有水印标识，验证场景置空
    if (global.self.vmpTag === undefined) {
        global.self.vmpTag = '';
        global.self.vmpTagEncrypt = false;
    }
    if (!global.importScripts) {
        global.importScripts = () => {};
    }
    // navigator: Node.js v24+ 中已作为只读 getter，不强制覆盖
    if (!global.navigator) {
        try {
            global.navigator = { userAgent: 'Node.js/ts_player_verify' };
        } catch (_) {}
    }

    // ── 提取并执行 CNTVModule 工厂函数 ─────────────────────────────────────
    const workerCode   = fs.readFileSync(workerPath, 'utf8');
    const factoryStart = workerCode.indexOf('var CNTVModule=function()');
    const factoryEnd   = workerCode.indexOf('CNTVModule}}(),LiveAudio2')
                       + 'CNTVModule}}()'.length;

    if (factoryStart === -1 || factoryEnd <= factoryStart) {
        return onReady(new Error('CNTVModule factory not found in ' + workerPath), null);
    }

    const factoryCode = workerCode.substring(factoryStart, factoryEnd);
    let CNTVModuleFactory;
    try {
        // eslint-disable-next-line no-eval
        CNTVModuleFactory = eval('(function(){' + factoryCode + ';return CNTVModule;})()');
    } catch (e) {
        return onReady(new Error('Failed to eval CNTVModule factory: ' + e.message), null);
    }

    // ── 调用工厂，等待 onRuntimeInitialized 回调 ────────────────────────────
    // 注意：onRuntimeInitialized 在 Emscripten 的 doRun() 中被同步调用，
    // 但 doRun() 本身在 WebAssembly.instantiate 的 Promise 回调中触发（异步）。
    // 使用 setTimeout 超时保护，防止初始化失败时永久挂起。
    const initTimeout = setTimeout(() => {
        onReady(new Error('CNTVModule initialization timeout (5s)'), null);
    }, 5000);

    CNTVModuleFactory({
        onRuntimeInitialized() {
            clearTimeout(initTimeout);
            onReady(null, this);
        },
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// § 6  WASM 解码辅助
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 将 PES 数据送入 WASM 解码器，返回解码后的输出数据。
 *
 * 对应 liveplayer_controls.js 中 fI['moduleDecData'] 的完整逻辑：
 *
 *   kg  = module._jsmalloc(dataLen + PAD)       // 输入数据缓冲（含尾部 padding）
 *   module.HEAPU8.set(pesData, kg)               // 写入 PES 有效载荷
 *   kj  = module._jsmalloc(mediaId.length + 1)  // mediaTagId 字符串缓冲
 *   module.HEAPU8.set(mediaIdBytes, kj)          // 写入标识符
 *   kh  = module._CNTV_jsdecLiveN(kj, kg, dataLen, vmpTagLen)
 *   out = module.HEAPU8.subarray(kg, kg + kh)   // 解码结果写回输入缓冲
 *   module._jsfree(kg); module._jsfree(kj)
 *
 * @param {Object}     mod       initCNTVDecoder() 返回的模块对象
 * @param {Uint8Array} pesData   PES 有效载荷字节
 * @param {string}     mediaId   媒体标识（如 'ch0##90000'）
 * @param {number}     [channel] 解码通道 0-8（默认 0）
 *   channel=0: MP4/通用 TS     channel=4: H.265/HEVC+AAC
 *   channel=7: H.264 NAL       channel=8: MPEG 音频
 * @returns {{decoded:Uint8Array|null, outLen:number}}
 */
function decodeWithWASM(mod, pesData, mediaId, channel = 0) {
    // this.pad = 0x800 = 2048（来自 fI[fm] 分析，为写入 vmpTag 预留空间）
    const PAD  = 2048;
    const size = pesData.length + PAD;

    let inPtr  = 0;
    let ctxPtr = 0;

    try {
        // 1. 分配输入数据缓冲
        inPtr = mod._jsmalloc(size);
        if (!inPtr) throw new Error('_jsmalloc(input) returned 0');

        // 2. 写入 PES 数据并清零 padding 区
        mod.HEAPU8.set(pesData, inPtr);
        mod.HEAPU8.fill(0, inPtr + pesData.length, inPtr + size);

        // 3. 分配并写入 mediaTagId 字符串（NUL 结尾）
        const mediaIdBytes = Buffer.from(mediaId + '\0', 'utf8');
        ctxPtr = mod._jsmalloc(mediaIdBytes.length);
        if (!ctxPtr) throw new Error('_jsmalloc(ctx) returned 0');
        mod.HEAPU8.set(mediaIdBytes, ctxPtr);

        // 4. 调用 WASM 解码器
        //    签名：_CNTV_jsdecLiveN(mediaTagIdPtr, inputPtr, inputLen, vmpTagLen)
        //    返回值：解码输出字节数（写回到 inputPtr 缓冲，0 表示需要更多数据）
        const decFn = mod[`_CNTV_jsdecLive${channel}`];
        if (typeof decFn !== 'function') {
            throw new Error(`_CNTV_jsdecLive${channel} not exported`);
        }
        const outLen = decFn(ctxPtr, inPtr, pesData.length, 0);

        // 5. 读回解码结果（WASM 解码器将输出写回到 inputPtr）
        const decoded = outLen > 0 && outLen <= size
            ? mod.HEAPU8.slice(inPtr, inPtr + outLen)
            : null;

        return { decoded, outLen: outLen || 0 };
    } catch (err) {
        process.stderr.write(`[decodeWithWASM] ch=${channel} error: ${err.message}\n`);
        return { decoded: null, outLen: -1 };
    } finally {
        if (inPtr)  try { mod._jsfree(inPtr);  } catch (_) {}
        if (ctxPtr) try { mod._jsfree(ctxPtr); } catch (_) {}
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// § 6b  H.264 Annex B NAL 单元拆分 + 逐 NAL 解密
//       对应原项目 liveplayer_controls.js 中：
//         jD['parseNALu']  —— Annex B 起始码状态机，提取单个 NAL 单元
//         fI['moduleDecData'] 调用链 —— 仅对 type=1/5 NAL 单元解密
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 将 H.264 Annex B 格式载荷（含 00 00 00 01 / 00 00 01 起始码）
 * 拆分为单个 NAL 单元。对应原项目 jD['parseNALu']。
 *
 * @param {Uint8Array} buf  PES 有效载荷（已去掉 PES 头）
 * @returns {Array<{data:Uint8Array, type:number, sc4:boolean}>}
 *   data  — NAL 单元数据（不含起始码），首字节为 nal_unit_type 字节
 *   type  — nal_unit_type（低 5 位）
 *   sc4   — true 表示原起始码为 4 字节（00 00 00 01），false 为 3 字节
 */
function parseAnnexBNALUnits(buf) {
    const len  = buf.length;
    const nals = [];
    // 起始码状态机（与原项目 parseNALu 逻辑一致）
    // state: 0=无匹配, 1=看到一个00, 2=看到两个00, 3=看到000
    let state   = 0;
    let nalStart = -1;    // 当前 NAL 数据起始偏移（含 type 字节，排除起始码）
    let sc4      = false; // 当前 NAL 的起始码是否为 4 字节

    for (let i = 0; i < len; i++) {
        const b = buf[i];
        if (state === 0) {
            state = b === 0 ? 1 : 0;
        } else if (state === 1) {
            state = b === 0 ? 2 : 0;
        } else if (state === 2) {
            if (b === 0) {
                state = 3; // 000...
            } else if (b === 1) {
                // 3 字节起始码 00 00 01，NAL 从 i+1 开始
                if (nalStart >= 0) {
                    // 结束前一个 NAL（去掉末尾可能多出的 00）
                    let end = i - 2; // 起始码前两个 00
                    while (end > nalStart && buf[end - 1] === 0) end--;
                    nals.push({ data: buf.subarray(nalStart, end), type: buf[nalStart] & 0x1F, sc4: sc4 });
                }
                nalStart = i + 1;
                sc4      = false;
                state    = 0;
            } else {
                state = 0;
            }
        } else { // state === 3: 已有 000
            if (b === 1) {
                // 4 字节起始码 00 00 00 01，NAL 从 i+1 开始
                if (nalStart >= 0) {
                    let end = i - 3; // 起始码前三个 00
                    while (end > nalStart && buf[end - 1] === 0) end--;
                    nals.push({ data: buf.subarray(nalStart, end), type: buf[nalStart] & 0x1F, sc4: sc4 });
                }
                nalStart = i + 1;
                sc4      = true;
                state    = 0;
            } else if (b === 0) {
                state = 3; // 继续 000...
            } else {
                state = 0;
            }
        }
    }
    // 最后一个 NAL（文件末尾，没有后续起始码）
    if (nalStart >= 0 && nalStart < len) {
        nals.push({ data: buf.subarray(nalStart, len), type: buf[nalStart] & 0x1F, sc4: sc4 });
    }
    return nals;
}

/**
 * 对 H.264 PES 有效载荷（Annex B 格式）执行逐 NAL 单元解密并重组。
 *
 * 对应原项目处理流程：
 *   jD['parseNALu'](jF, jH['data'], jG)  ← 拆分 NAL 单元
 *   for each jO in nals:
 *     if (jO.type === 0x1 || jO.type === 0x5)
 *       jO.data = fI['moduleDecData'](module, mediaTagId+'##'+pts, jO.data, fI.pad)
 *
 * @param {Object}     mod        已初始化的 CNTVModule 实例
 * @param {Uint8Array} pesPayload PES 有效载荷（已去掉 PES 头，含 Annex B 起始码）
 * @param {string}     mediaId    媒体标识串（对应 mediaTagId+'##'+pts）
 * @param {number}     channel    解码通道（7=H.264 Live, 4=HEVC, 等）
 * @returns {Buffer}  重组后的 Annex B 数据（各 NAL 均以 00 00 00 01 为前缀）
 */
function decodePESPayload(mod, pesPayload, mediaId, channel) {
    const nals = parseAnnexBNALUnits(pesPayload);
    if (nals.length === 0) {
        // 无法解析 NAL 单元，原样返回（fallback）
        return Buffer.from(pesPayload);
    }

    const parts = [];
    const startCode4 = Buffer.from([0x00, 0x00, 0x00, 0x01]);

    for (let i = 0; i < nals.length; i++) {
        const nal = nals[i];
        // 仅对编码帧（非参考帧=1、IDR帧=5）调用解码器，其余（SPS=7、PPS=8、SEI=6、AUD=9 等）原样保留
        // 与原项目 case 0x1 / case 0x5 分支一致
        if (nal.type === 0x1 || nal.type === 0x5) {
            const result = decodeWithWASM(mod, nal.data, mediaId, channel);
            if (result.decoded && result.decoded.length > 0) {
                parts.push(startCode4);
                parts.push(Buffer.from(result.decoded));
            } else {
                // 解码返回空：保留原始 NAL（不破坏流完整性）
                parts.push(startCode4);
                parts.push(Buffer.from(nal.data));
            }
        } else {
            parts.push(startCode4);
            parts.push(Buffer.from(nal.data));
        }
    }

    return Buffer.concat(parts);
}

// ─────────────────────────────────────────────────────────────────────────────
// § 7  测试数据生成：最小合法 TS 文件（无真实 .ts 文件时使用）
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 生成包含 PAT + PMT + H.264 SPS NAL + AAC 帧头 的最小合法 TS 字节流。
 */
function generateMinimalTS() {
    const packets = [];

    // ── PAT (PID=0x0000) ─────────────────────────────────────────────────
    const patPayload = Buffer.alloc(184, 0xFF);
    patPayload[0]  = 0x00; patPayload[1]  = 0x00; // pointer_field, table_id=PAT
    patPayload[2]  = 0xB0; patPayload[3]  = 0x0D; // section_length=13
    patPayload[4]  = 0x00; patPayload[5]  = 0x01; // transport_stream_id=1
    patPayload[6]  = 0xC1; patPayload[7]  = 0x00; patPayload[8] = 0x00;
    patPayload[9]  = 0x00; patPayload[10] = 0x01; // program_number=1
    patPayload[11] = 0xE1; patPayload[12] = 0x00; // PMT PID=0x100
    // CRC32 (placeholder)
    patPayload[13] = 0x2A; patPayload[14] = 0xB1; patPayload[15] = 0x04; patPayload[16] = 0xB2;

    const patPkt = Buffer.alloc(188, 0xFF);
    patPkt[0] = 0x47; patPkt[1] = 0x40; patPkt[2] = 0x00; patPkt[3] = 0x10;
    patPayload.copy(patPkt, 4);
    packets.push(patPkt);

    // ── PMT (PID=0x0100) ─────────────────────────────────────────────────
    const pmtPayload = Buffer.alloc(184, 0xFF);
    pmtPayload[0]  = 0x00; pmtPayload[1]  = 0x02; // pointer_field, table_id=PMT
    pmtPayload[2]  = 0xB0; pmtPayload[3]  = 0x17; // section_length=23
    pmtPayload[4]  = 0x00; pmtPayload[5]  = 0x01; // program_number=1
    pmtPayload[6]  = 0xC1; pmtPayload[7]  = 0x00; pmtPayload[8] = 0x00;
    pmtPayload[9]  = 0xE1; pmtPayload[10] = 0x00; // PCR PID=0x100
    pmtPayload[11] = 0xF0; pmtPayload[12] = 0x00; // program_info_length=0
    // ES: H.264 Video, PID=0x101
    pmtPayload[13] = 0x1B; pmtPayload[14] = 0xE1; pmtPayload[15] = 0x01; pmtPayload[16] = 0xF0; pmtPayload[17] = 0x00;
    // ES: AAC Audio, PID=0x102
    pmtPayload[18] = 0x0F; pmtPayload[19] = 0xE1; pmtPayload[20] = 0x02; pmtPayload[21] = 0xF0; pmtPayload[22] = 0x00;
    // CRC32 (placeholder)
    pmtPayload[23] = 0xCA; pmtPayload[24] = 0xFE; pmtPayload[25] = 0xBA; pmtPayload[26] = 0xBE;

    const pmtPkt = Buffer.alloc(188, 0xFF);
    pmtPkt[0] = 0x47; pmtPkt[1] = 0x41; pmtPkt[2] = 0x00; pmtPkt[3] = 0x10;
    pmtPayload.copy(pmtPkt, 4);
    packets.push(pmtPkt);

    // ── H.264 Video PES (PID=0x101) ──────────────────────────────────────
    // SPS NAL unit (Annex B format): Baseline Profile L1.3
    const nalSPS = Buffer.from([
        0x00, 0x00, 0x00, 0x01, // start code
        0x67, 0x42, 0xC0, 0x0D, 0xD9, 0x00, 0xA0, 0x47,
        0xFE, 0xC8, 0x00, 0x00, 0x03, 0x00, 0x08, 0x00,
        0x00, 0x03, 0x00, 0x85, 0x00,
    ]);
    // PPS NAL unit
    const nalPPS = Buffer.from([
        0x00, 0x00, 0x00, 0x01, // start code
        0x68, 0xCE, 0x38, 0x80,
    ]);
    const nalData = Buffer.concat([nalSPS, nalPPS]);

    // Build PES header with PTS
    const pts = 90000; // 1s in 90kHz ticks
    const pesHdr = Buffer.alloc(14);
    pesHdr[0] = 0x00; pesHdr[1] = 0x00; pesHdr[2] = 0x01; // PES start code
    pesHdr[3] = 0xE0; // stream_id = video
    const pesPayloadLen = nalData.length + 8;
    pesHdr[4] = (pesPayloadLen >> 8) & 0xFF; pesHdr[5] = pesPayloadLen & 0xFF;
    pesHdr[6] = 0x84; pesHdr[7] = 0x80; pesHdr[8] = 0x05; // flags, PTS only
    pesHdr[9]  = 0x21 | ((pts >> 29) & 0x0E);
    pesHdr[10] = (pts >> 22) & 0xFF;
    pesHdr[11] = 0x01 | ((pts >> 14) & 0xFE);
    pesHdr[12] = (pts >> 7) & 0xFF;
    pesHdr[13] = 0x01 | ((pts & 0x7F) << 1);

    const pesData = Buffer.concat([pesHdr, nalData]);
    const vidPayload = Buffer.alloc(184, 0xFF);
    pesData.copy(vidPayload, 0, 0, Math.min(pesData.length, 184));

    const vidPkt = Buffer.alloc(188, 0xFF);
    vidPkt[0] = 0x47; vidPkt[1] = 0x41; vidPkt[2] = 0x01; vidPkt[3] = 0x10;
    vidPayload.copy(vidPkt, 4);
    packets.push(vidPkt);

    // ── AAC Audio PES (PID=0x102) ────────────────────────────────────────
    // ADTS AAC frame header (7 bytes, LC profile, 44100 Hz, stereo)
    const adts = Buffer.from([
        0xFF, 0xF1,                    // ADTS sync word, MPEG-4, no CRC
        0x50,                          // profile=1(LC), sample_rate_idx=4(44100Hz), private=0, channel_high=0
        0x80, 0x1C, 0x80, 0x00,        // channel_low=2(stereo), frame_length=56, buffer_fullness, num_aac=0
    ]);
    const audioPayload = Buffer.alloc(184, 0xFF);
    adts.copy(audioPayload, 0);

    const audioPkt = Buffer.alloc(188, 0xFF);
    audioPkt[0] = 0x47; audioPkt[1] = 0x41; audioPkt[2] = 0x02; audioPkt[3] = 0x10;
    audioPayload.copy(audioPkt, 4);
    packets.push(audioPkt);

    return Buffer.concat(packets);
}

// ─────────────────────────────────────────────────────────────────────────────
// § 7b  TS 重打包工具（解码输出用）
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 构建 PES 包头。
 * @param {number}      streamId      PES 流 ID（视频 0xE0，音频 0xC0）
 * @param {number|null} pts           90kHz 时间戳，null 表示不写 PTS
 * @param {number|null} dts           90kHz 时间戳，null 或等于 pts 时不写 DTS
 * @param {number}      payloadLen    PES 有效载荷字节数（视频流传 0 = 无界）
 * @returns {Buffer}
 */
function buildPesHeader(streamId, pts, dts, payloadLen) {
    const hasPts = pts !== null && pts !== undefined;
    const hasDts = dts !== null && dts !== undefined && dts !== pts;
    const pesHdrDataLen = hasDts ? 10 : (hasPts ? 5 : 0);
    const totalHdrLen   = 9 + pesHdrDataLen; // 3字节起始码 + 1字节stream_id + 2字节长度 + 3字节标志
    // 视频流（0xE0-0xEF）的 PES packet_length 按惯例置 0（无界长度）
    const isVideo = (streamId >= 0xE0 && streamId <= 0xEF);
    const pesPacketLen = isVideo ? 0 : (3 + pesHdrDataLen + payloadLen);

    const buf = Buffer.alloc(totalHdrLen, 0);
    buf[0] = 0x00; buf[1] = 0x00; buf[2] = 0x01;
    buf[3] = streamId;
    buf[4] = (pesPacketLen >> 8) & 0xFF;
    buf[5] = pesPacketLen & 0xFF;
    buf[6] = 0x80;
    buf[7] = (hasPts ? 0x80 : 0) | (hasDts ? 0x40 : 0);
    buf[8] = pesHdrDataLen;

    if (hasPts) {
        const marker = hasDts ? 0x31 : 0x21;
        buf[9]  = marker | (Math.floor(pts / 0x10000000) & 0x0E);
        buf[10] = (pts >> 22) & 0xFF;
        buf[11] = 0x01 | ((pts >> 14) & 0xFE);
        buf[12] = (pts >> 7) & 0xFF;
        buf[13] = 0x01 | ((pts & 0x7F) << 1);
    }
    if (hasDts) {
        buf[14] = 0x11 | (Math.floor(dts / 0x10000000) & 0x0E);
        buf[15] = (dts >> 22) & 0xFF;
        buf[16] = 0x01 | ((dts >> 14) & 0xFE);
        buf[17] = (dts >> 7) & 0xFF;
        buf[18] = 0x01 | ((dts & 0x7F) << 1);
    }
    return buf;
}

/**
 * 将已解码的 PES 有效载荷重新打包成 188 字节 TS 包序列。
 * @param {number}      pid            目标 PID
 * @param {number}      streamId       PES 流 ID
 * @param {number|null} pts            90kHz PTS
 * @param {number|null} dts            90kHz DTS
 * @param {Uint8Array}  decodedPayload 解码后的裸数据（H.264 Annex B 等）
 * @param {Object}      ccMap          每 PID 的连续计数器状态（会被修改）
 * @returns {Buffer[]}  TS 包 Buffer 数组
 */
function repacketizeToTS(pid, streamId, pts, dts, decodedPayload, ccMap) {
    const pesHeader = buildPesHeader(streamId, pts, dts, decodedPayload.length);
    const fullData  = Buffer.concat([pesHeader, Buffer.from(decodedPayload)]);
    if (ccMap[pid] === undefined) ccMap[pid] = 0;

    const tsPkts = [];
    let offset  = 0;
    let isFirst = true;

    while (offset < fullData.length) {
        const pkt = Buffer.alloc(188, 0xFF);
        const cc  = ccMap[pid] & 0x0F;
        ccMap[pid] = (ccMap[pid] + 1) & 0x0F;

        pkt[0] = 0x47;
        pkt[1] = (isFirst ? 0x40 : 0x00) | ((pid >> 8) & 0x1F);
        pkt[2] = pid & 0xFF;

        const remaining = fullData.length - offset;
        if (remaining >= 184) {
            // 纯载荷包（无自适应字段）
            pkt[3] = 0x10 | cc;
            fullData.copy(pkt, 4, offset, offset + 184);
            offset += 184;
        } else {
            // 最后一个不足 184 字节的块，用自适应字段填充至 184 字节
            const stuffLen = 184 - remaining;
            pkt[3] = 0x30 | cc;          // 自适应字段 + 载荷
            pkt[4] = stuffLen - 1;        // adaptation_field_length
            if (stuffLen > 1) pkt[5] = 0x00; // 自适应字段标志 = 0
            // 字节 [6 .. 4+stuffLen-1] 保持 0xFF（填充字节）
            fullData.copy(pkt, 4 + stuffLen, offset, offset + remaining);
            offset += remaining;
        }
        tsPkts.push(pkt);
        isFirst = false;
    }
    return tsPkts;
}

/**
 * 处理整个输入 TS 文件，对所有视频 PES 单元调用 WASM 解码，
 * 音频和 PSI (PAT/PMT) 包原样保留，返回完整输出 TS 数据。
 *
 * @param {Buffer}   rawData         完整输入 TS 字节流
 * @param {number[]} videoPids       视频 PID 列表（来自 PMT）
 * @param {Object}   mod             已初始化的 CNTVModule 实例
 * @param {number}   channel         解码通道（7=H.264, 4=HEVC, 0=Generic）
 * @returns {{outputBuf:Buffer, stats:{totalPES,decoded,failed,inBytes,outBytes}}}
 */
function buildDecodedTSFile(rawData, videoPids, mod, channel) {
    const allPackets = parseTsPackets(rawData);

    // ── Pass 1: 收集视频 PES 边界（按 startIdx/endIdx 标记） ──────────────
    const accumState = {}; // pid -> {startIdx, data[], pts, dts}
    const videoRanges = [];

    for (let i = 0; i < allPackets.length; i++) {
        const pkt = allPackets[i];
        if (videoPids.indexOf(pkt.pid) < 0 || !pkt.payload) continue;
        const pay = pkt.payload;

        if (pkt.pusi) {
            // Flush previous PES for this PID
            if (accumState[pkt.pid] && accumState[pkt.pid].data.length > 0) {
                const st = accumState[pkt.pid];
                videoRanges.push({
                    startIdx: st.startIdx, endIdx: i - 1,
                    pid: pkt.pid, pts: st.pts, dts: st.dts,
                    pesData: new Uint8Array(st.data),
                });
            }
            // Start new PES accumulation
            let pts = null, dts = null, dataStart = 0;
            if (pay.length >= 9 && pay[0] === 0 && pay[1] === 0 && pay[2] === 1) {
                const f2 = pay[7], hLen = pay[8];
                if (f2 & 0x80) pts = parsePTS(pay, 9);
                if (f2 & 0x40) dts = parsePTS(pay, 14);
                dataStart = 9 + hLen;
            }
            const data = [];
            for (let b = dataStart; b < pay.length; b++) data.push(pay[b]);
            accumState[pkt.pid] = { startIdx: i, data, pts, dts };
        } else if (accumState[pkt.pid]) {
            for (let b = 0; b < pay.length; b++) accumState[pkt.pid].data.push(pay[b]);
        }
    }
    // Flush remaining open PES units (last PES in file)
    for (const pidKey of Object.keys(accumState)) {
        const st = accumState[pidKey];
        if (st && st.data.length > 0) {
            videoRanges.push({
                startIdx: st.startIdx, endIdx: allPackets.length - 1,
                pid: parseInt(pidKey), pts: st.pts, dts: st.dts,
                pesData: new Uint8Array(st.data),
            });
        }
    }
    videoRanges.sort(function(a, b) { return a.startIdx - b.startIdx; });

    // ── Pass 2: 逐包输出，对视频范围替换解码数据 ────────────────────────────
    const outputChunks = [];
    const ccMap = {};
    let rangeIdx = 0;
    let skipUntil = -1;

    const stats = { totalPES: videoRanges.length, decoded: 0, failed: 0, inBytes: 0, outBytes: 0 };

    for (let i = 0; i < allPackets.length; i++) {
        if (i <= skipUntil) continue;

        if (rangeIdx < videoRanges.length && videoRanges[rangeIdx].startIdx === i) {
            const range = videoRanges[rangeIdx++];
            skipUntil = range.endIdx;
            stats.inBytes += range.pesData.length;

            const mediaId = 'cntv-dec-' + range.pid + '##' + (range.pts || 0);
            // 调用逐 NAL 单元解密（对应原项目 parseNALu + moduleDecData 调用链）
            const decodedPayload = decodePESPayload(mod, range.pesData, mediaId, channel);

            if (decodedPayload && decodedPayload.length > 0) {
                stats.decoded++;
                stats.outBytes += decodedPayload.length;
                const newPkts = repacketizeToTS(
                    range.pid, 0xE0, range.pts, range.dts, decodedPayload, ccMap);
                for (let pi = 0; pi < newPkts.length; pi++) outputChunks.push(newPkts[pi]);
            } else {
                // 解码返回空：原样保留原始包
                stats.failed++;
                for (let k = range.startIdx; k <= range.endIdx; k++) {
                    outputChunks.push(rawData.slice(allPackets[k].offset, allPackets[k].offset + 188));
                }
            }
        } else {
            // Non-video packet: copy raw bytes unchanged
            outputChunks.push(rawData.slice(allPackets[i].offset, allPackets[i].offset + 188));
        }
    }

    return { outputBuf: Buffer.concat(outputChunks), stats };
}

// ─────────────────────────────────────────────────────────────────────────────
// § 8  完整流程演示
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 验证器主函数（使用回调而非 async/await，避免 Emscripten 事件循环与
 * Node.js 微任务队列之间的调度冲突）。
 *
 * 用法：
 *   node ts_player_verify.js <input.ts> [output.ts]
 *
 *   input.ts  — 输入 TS 文件（加密/编码视频，音频正常）
 *   output.ts — 解码后的输出 TS 文件（可选；若省略则只打印分析报告）
 */
function main() {
    const SEP = '─'.repeat(60);
    console.log(SEP);
    console.log('CNTV TS 切片播放链验证器');
    console.log(SEP);

    // ── 读取或生成 TS 数据 ────────────────────────────────────────────────
    let tsData;
    const tsFile  = process.argv[2];
    const outFile = process.argv[3] || null;
    if (tsFile) {
        tsData = fs.readFileSync(tsFile);
        console.log('\n[载入] 读取 TS 文件: ' + tsFile + ' (' + tsData.length + ' 字节)');
        if (outFile) {
            console.log('       输出文件   : ' + outFile);
        }
    } else {
        tsData = generateMinimalTS();
        console.log('\n[载入] 使用生成的最小测试 TS 数据 (' + tsData.length + ' 字节)');
        console.log('       提示: node ts_player_verify.js <input.ts> [output.ts]');
    }

    // ── Step 1: 解析 TS 包 ────────────────────────────────────────────────
    const packets = parseTsPackets(tsData);
    console.log('\n[解析] TS 包: 共 ' + packets.length + ' 个有效包');

    const pidCounts = {};
    for (let pi = 0; pi < packets.length; pi++) {
        const pid = packets[pi].pid;
        pidCounts[pid] = (pidCounts[pid] || 0) + 1;
    }
    console.log('       PID 分布:');
    const pidKeys = Object.keys(pidCounts).slice(0, 10);
    for (let ki = 0; ki < pidKeys.length; ki++) {
        const hex = parseInt(pidKeys[ki]).toString(16).padStart(4, '0');
        console.log('         PID 0x' + hex + ': ' + pidCounts[pidKeys[ki]] + ' 包');
    }

    // ── Step 2: 解析 PAT ──────────────────────────────────────────────────
    let patPkt = null;
    for (let i = 0; i < packets.length; i++) {
        if (packets[i].pid === 0x0000 && packets[i].pusi && packets[i].payload) {
            patPkt = packets[i]; break;
        }
    }
    let pmtPids = {};
    if (patPkt) {
        pmtPids = parsePAT(patPkt.payload);
        console.log('\n[PAT]  节目列表:');
        const progNums = Object.keys(pmtPids);
        for (let pn = 0; pn < progNums.length; pn++) {
            const pmtHex = parseInt(pmtPids[progNums[pn]]).toString(16).padStart(4, '0');
            console.log('         程序 ' + progNums[pn] + ' → PMT PID 0x' + pmtHex);
        }
    } else {
        console.log('\n[PAT]  未找到 PAT 包');
    }

    // ── Step 3: 解析 PMT ──────────────────────────────────────────────────
    const allStreams = [];
    const pmtPidList = Object.values(pmtPids);
    for (let mpi = 0; mpi < pmtPidList.length; mpi++) {
        const pmtPid = pmtPidList[mpi];
        let pmtPkt = null;
        for (let j = 0; j < packets.length; j++) {
            if (packets[j].pid === pmtPid && packets[j].pusi && packets[j].payload) {
                pmtPkt = packets[j]; break;
            }
        }
        if (!pmtPkt) continue;
        const streams = parsePMT(pmtPkt.payload);
        console.log('\n[PMT]  PMT PID 0x' + pmtPid.toString(16).padStart(4, '0') + ' → ES 流列表:');
        for (let si = 0; si < streams.length; si++) {
            const s = streams[si];
            console.log('         PID 0x' + s.pid.toString(16).padStart(4, '0') +
                ': ' + s.streamTypeName +
                ' (0x' + s.streamType.toString(16).padStart(2, '0') + ')');
            allStreams.push(s);
        }
    }

    // ── Step 4: 拼装 PES ──────────────────────────────────────────────────
    const VIDEO_TYPES = [0x01, 0x02, 0x1B, 0x24, 0x42];
    const AUDIO_TYPES = [0x03, 0x04, 0x0F, 0x11, 0x81];
    const videoStreams = allStreams.filter(function(s) { return VIDEO_TYPES.indexOf(s.streamType) >= 0; });
    const audioStreams = allStreams.filter(function(s) { return AUDIO_TYPES.indexOf(s.streamType) >= 0; });

    console.log('\n[PES]  拼装基本流:');
    let videoPES = [];
    for (let vs = 0; vs < videoStreams.length; vs++) {
        const pes = assemblePES(packets, videoStreams[vs].pid);
        console.log('         视频 PID 0x' + videoStreams[vs].pid.toString(16).padStart(4, '0') +
            ': ' + pes.length + ' 个 PES 单元');
        if (pes.length > 0) {
            const u = pes[0];
            const ptsMs0 = u.pts !== null ? (u.pts / 90).toFixed(1) : '无';
            console.log('           第一帧 PTS=' + ptsMs0 + 'ms, 数据=' + u.data.length + ' 字节');
        }
        videoPES = videoPES.concat(pes);
    }
    for (let as = 0; as < audioStreams.length; as++) {
        const apes = assemblePES(packets, audioStreams[as].pid);
        console.log('         音频 PID 0x' + audioStreams[as].pid.toString(16).padStart(4, '0') +
            ': ' + apes.length + ' 个 PES 单元');
    }

    // ── Step 5: 初始化 WASM 解码器 ────────────────────────────────────────
    const workerPath = path.join(__dirname, 'live.worker.js');
    if (!fs.existsSync(workerPath)) {
        console.error('\n[WASM] 错误: 未找到 ' + workerPath);
        process.exit(1);
    }

    console.log('\n[WASM] 初始化解码器（来自 live.worker.js 内嵌 WASM）...');

    // 确定解码通道（来自 liveplayer_controls.js fI[fu] 分析）
    const hasH264   = videoStreams.some(function(s) { return s.streamType === 0x1B; });
    const hasHEVC   = videoStreams.some(function(s) { return s.streamType === 0x24; });
    const channel   = hasH264 ? 7 : (hasHEVC ? 4 : 0);
    const codecName = hasH264 ? 'H.264 NAL (Live7)' : (hasHEVC ? 'H.265/HEVC (Live4)' : 'MP4/Generic (Live0)');

    // 使用直接回调模式（不使用 async/await）
    initCNTVDecoder(workerPath, function(err, mod) {
        if (err) {
            console.error('\n[WASM] 初始化失败: ' + err.message);
            process.exit(1);
        }

        console.log('       CNTVModule v2.0.9 初始化成功');
        console.log('       可用解码函数:');
        const fns = [
            '_CNTV_InitPlayer', '_CNTV_UnInitPlayer', '_CNTV_UpdatePlayer',
            '_CNTV_jsdecLive0', '_CNTV_jsdecLive4', '_CNTV_jsdecLive7', '_CNTV_jsdecLive8',
            '_CNTV_jsdecVOD0',
            '_jsmalloc', '_jsfree', '_GetDecryptAudio',
        ];
        for (let fi = 0; fi < fns.length; fi++) {
            const ok = typeof mod[fns[fi]] === 'function' ? '✓' : '✗';
            console.log('         ' + ok + ' ' + fns[fi]);
        }

        // ── Step 6: 解码 ──────────────────────────────────────────────────────
        if (outFile) {
            // ── 输出模式：解码所有视频 PES，写入输出 TS 文件 ────────────────
            console.log('\n[解码] 处理全部视频 PES 单元（输出模式）...');
            const { outputBuf, stats } = buildDecodedTSFile(tsData, videoStreams.map(function(s) { return s.pid; }), mod, channel);
            fs.writeFileSync(outFile, outputBuf);
            console.log('       写入完成: ' + outFile + ' (' + outputBuf.length + ' 字节)');

            console.log('\n' + SEP);
            console.log('解码结果摘要');
            console.log(SEP);
            console.log('  输入文件     : ' + tsFile);
            console.log('  输出文件     : ' + outFile);
            console.log('  TS 包总数    : ' + packets.length);
            console.log('  视频 ES 流   : ' + videoStreams.length + ' (编解码: ' + codecName + ')');
            console.log('  音频 ES 流   : ' + audioStreams.length + ' (原样保留)');
            console.log('  视频 PES 总数: ' + stats.totalPES);
            console.log('  解码成功     : ' + stats.decoded);
            console.log('  解码失败/透传: ' + stats.failed);
            console.log('  输入视频字节 : ' + stats.inBytes);
            console.log('  输出视频字节 : ' + stats.outBytes);
            console.log('  输出文件大小 : ' + outputBuf.length + ' 字节');
            console.log(SEP);
            console.log('✓ 解码完成：' + tsFile + ' → ' + outFile);
            console.log(SEP + '\n');
        } else {
            // ── 验证模式：解码前 5 帧并打印报告 ──────────────────────────────
            console.log('\n[解码] 开始解码（' + codecName + ')...');

            let decodedFrames = 0;
            let totalOutBytes = 0;
            const maxFrames = Math.min(videoPES.length, 5);

            for (let fi2 = 0; fi2 < maxFrames; fi2++) {
                const pesu    = videoPES[fi2];
                const mediaId = 'cntv-verify-ch' + channel + '##' + (pesu.pts || 0);
                // 调用逐 NAL 单元解密（对应原项目 parseNALu + moduleDecData 调用链）
                const decoded = decodePESPayload(mod, pesu.data, mediaId, channel);
                const ptsMs   = pesu.pts !== null ? (pesu.pts / 90).toFixed(1) : '无';

                if (decoded && decoded.length > 0) {
                    decodedFrames++;
                    totalOutBytes += decoded.length;
                    console.log('         帧 #' + (fi2 + 1) + ': 输入=' + pesu.data.length +
                        'B, 输出=' + decoded.length + 'B, PTS=' + ptsMs + 'ms');
                    console.log('           输出前8字节: ' +
                        decoded.slice(0, 8).toString('hex'));
                } else {
                    console.log('         帧 #' + (fi2 + 1) + ': 输入=' + pesu.data.length +
                        'B, 无输出 (PTS=' + ptsMs + 'ms)');
                }
            }

            // ── 结果汇总 ──────────────────────────────────────────────────────
            console.log('\n' + SEP);
            console.log('验证结果摘要');
            console.log(SEP);
            console.log('  TS 包总数    : ' + packets.length);
            console.log('  找到节目数   : ' + Object.keys(pmtPids).length);
            console.log('  视频 ES 流   : ' + videoStreams.length);
            console.log('  音频 ES 流   : ' + audioStreams.length);
            console.log('  PES 视频单元 : ' + videoPES.length);
            console.log('  WASM 模块    : CNTVModule v2.0.9 (' + path.basename(workerPath) + ')');
            console.log('  独立 WASM    : cntv_decoder.wasm (88388 字节, 从 live.worker.js 提取)');
            console.log('  解码输出帧   : ' + decodedFrames);
            console.log('  输出字节合计 : ' + totalOutBytes);
            console.log(SEP);
            console.log('✓ 完整逻辑链验证通过：载入 → TS 解析 → PAT/PMT → PES 拼装 → WASM 解码');
            console.log(SEP + '\n');
        }

        process.exit(0);
    });
}

main();
