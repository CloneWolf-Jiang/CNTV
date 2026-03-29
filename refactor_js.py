#!/usr/bin/env python3
"""
重构混淆的 h5.worker_patch.js 文件
将变量名替换为有意义的英文名称，翻译字符串，并格式化代码
"""

import re
import subprocess
import sys

INPUT_FILE = '/home/runner/work/CNTV/CNTV/h5.worker_patch_orig.js'
OUTPUT_FILE = '/home/runner/work/CNTV/CNTV/h5.worker_patch.js'
TEMP_FILE = '/home/runner/work/CNTV/CNTV/h5.worker_patch_tmp.js'

# ──────────────────────────────────────────────
# 变量名映射表（按长度降序排列，防止短名称替换长名称）
# ──────────────────────────────────────────────
VARIABLE_MAP = {
    # top-level
    'a0_0x1f92': 'noopFn',
    '_0x39063c': 'noopFn',

    # CNTVModule inner
    '_0x6d5291': '_noop',
    '_0x40a308': 'currentScriptSrc',
    '_0x34365a': 'moduleOptions',
    '_0x506fea': '_noop',
    '_0x218057': 'module',
    '_0x489cf6': 'moduleBackup',
    '_0x3631c5': 'propKey',
    '_0x357282': 'argv',
    '_0x2335dd': 'thisProgram',
    '_0x3f3dd6': 'quit',
    '_0x47007': 'isWindow',
    '_0x488fab': 'isWorker',
    '_0x5d1cbd': 'isNode',
    '_0x3e8113': 'isNodeProcess',
    '_0x12693b': 'isShell',
    '_0x3e307d': 'scriptDirectory',
    '_0x531653': 'locateFile',
    '_0x526f65': 'readFile',
    '_0x4e7f80': 'readFileAsync',
    '_0x2f3c9f': 'readBinary',
    '_0x1fed03': 'setWindowTitle',
    '_0x35ac21': 'fsModule',
    '_0x6fec38': 'pathModule',
    '_0x15c0a1': 'printOutput',
    '_0x58ad72': 'printError',
    '_0x3d7e8c': 'ALIGNMENT',
    '_0x50b3d2': 'dynamicAlloc',
    '_0x258dc5': 'DYNAMICTOP_PTR',
    '_0x520705': 'HEAP32',
    '_0x152c11': 'getHeapSize',
    '_0x1ad1c0': 'abort',
    '_0x356f41': 'getNativeTypeSize',
    '_0x13b8c4': 'warnOnce',
    '_0x1e001a': 'asm2wasmImports',
    '_0xcc4f86': 'RESERVED_FUNCTION_POINTERS_START',
    '_0x3de855': 'FUNCTION_TABLE',
    '_0x368621': 'makeDynCall',
    '_0x565263': 'addFunction',
    '_0x104d84': 'resolvedFunctions',
    '_0x17b4c0': 'dynCall',
    '_0x3c72e5': 'tempRet0',
    '_0xf6eb95': 'setTempRet0',
    '_0x339987': 'getTempRet0',
    '_0x25ce86': 'wasmBinary',
    '_0x4e156a': 'setValue',
    '_0x4f82e4': 'HEAP8',
    '_0x570fbf': 'HEAP16',
    '_0x2c3101': 'HEAPU16',
    '_0x4df32b': 'HEAPF32',
    '_0x5482bd': 'HEAPF64',
    '_0x33ed76': 'tempI64',
    '_0x52fa98': 'wasmMemory',
    '_0x29a39a': 'wasmTable',
    '_0x346bee': 'calledAbort',
    '_0x17eae9': 'exitCode',
    '_0x363ea5': 'assert',
    '_0x5410c9': 'getCFunc',
    '_0x57a33b': 'ccall',
    '_0xff2cb1': 'UTF8_DECODER_THRESHOLD',
    '_0x199b48': 'UTF8Decoder',
    '_0x36d7dd': 'UTF8ArrayToString',
    '_0x1134f1': 'UTF8ToString',
    '_0x2bd579': 'stringToUTF8Array',
    '_0x27ee49': 'stringToUTF8',
    '_0x54de54': 'lengthBytesUTF8',
    '_0x1029de': 'UTF16Decoder',
    '_0x96c5d2': 'writeArrayToMemory',
    '_0x5f92b1': 'writeAsciiToMemory',
    '_0x603cc5': 'PAGE_SIZE',
    '_0x573541': 'alignUp',
    '_0x104dc7': 'wasmBuffer',
    '_0x2c2eaa': 'HEAPU8',
    '_0x51d77c': 'HEAPU32',
    '_0x52e99e': 'updateHeapViews',
    '_0x1dd8e8': 'STATIC_BASE',
    '_0x27b82d': 'DYNAMIC_BASE',
    '_0x225ee1': 'TOTAL_MEMORY',
    '_0x440849': 'callRuntimeCallbacks',
    '_0x1a3949': '__ATPRERUN__',
    '_0x3f1f71': '__ATINIT__',
    '_0x6a3818': '__ATMAIN__',
    '_0x36cb82': '__ATPOSTRUN__',
    '_0x3d52e5': 'calledRun',
    '_0x299c7a': 'calledMain',
    '_0x51e114': 'preRun',
    '_0x29f661': 'initRuntime',
    '_0x50b799': 'callMain',
    '_0x210e40': 'exitRuntime',
    '_0x59c1df': 'postRun',
    '_0x364de6': 'addOnPreRun',
    '_0x47a93a': 'addOnPostRun',
    '_0x1618c1': 'Math_abs',
    '_0x1b63b3': 'Math_ceil',
    '_0x24419a': 'Math_floor',
    '_0x32af93': 'Math_min',
    '_0x541a10': 'runDependencies',
    '_0x20fdad': 'runDependencyWatcher',
    '_0x2d5fe3': 'dependenciesFulfilled',
    '_0x549108': 'addRunDependency',
    '_0x17f573': 'removeRunDependency',
    '_0x4764a1': 'DATA_URI_PREFIX',
    '_0x1001ec': 'isDataURI',
    '_0x34831c': 'wasmBinaryFile',
    '_0x57efe8': 'getBinary',
    '_0x5218b0': 'getBinaryPromise',
    '_0x2bafcb': 'createWasm',
    '_0x92b7e3': 'ASM_CONSTS',
    '_0x5e50a1': 'emscripten_asm_const_ii',
    '_0x3d2acb': 'tempDoublePtr',
    '_0x32ece5': 'demangle',
    '_0x4a66c2': 'demangleAll',
    '_0x1c3947': 'jsStackTrace',
    '_0x2a1436': 'stackTrace',
    '_0x3f2314': '___gxx_personality_v0',
    '_0x543233': 'PATH',
    '_0xdd38f2': 'SYSCALLS',
    '_0x177812': '___syscall140',
    '_0xe704b8': 'flush_NO_FILESYSTEM',
    '_0x5eeeb6': '___syscall146',
    '_0x3668a2': '___syscall54',
    '_0x3b8448': '___syscall6',
    '_0x5a6e11': '__emscripten_fetch_free',
    '_0x4f7b8d': '_emscripten_is_main_browser_thread',
    '_0x2696ef': 'Fetch',
    '_0xa37e31': '__emscripten_fetch_xhr',
    '_0x379569': '__emscripten_fetch_cache_data',
    '_0x370cde': '__emscripten_fetch_load_cached_data',
    '_0x19d092': '__emscripten_fetch_delete_cached_data',
    '_0x3816a6': 'FETCH_WORKER_QUEUE_PTR',
    '_0x2502fd': '__emscripten_get_fetch_work_queue',
    '_0x16c7f9': '_emscripten_is_main_runtime_thread',
    '_0x14fbf7': '_emscripten_start_fetch',
    '_0x87524e': '_emscripten_memcpy_big',
    '_0x4ce7e5': '___setErrNo',
    '_0x998e99': 'abortOnCannotGrowMemory',
    '_0x1b483d': 'emscripten_realloc_buffer',
    '_0x42aa0c': '_emscripten_resize_heap',
    '_0x44d886': 'noExitRuntime',
    '_0x51a7c6': 'jsCall_ii',
    '_0x295ec4': 'jsCall_iidiiii',
    '_0x58a482': 'jsCall_iiii',
    '_0x217c2d': 'jsCall_jiji',
    '_0x418322': 'jsCall_v',
    '_0x682efb': 'jsCall_vi',
    '_0x2ed9e3': 'jsCall_vii',
    '_0x4ae0e5': 'wasmInfo',
    '_0x208b67': 'wasmEnv',
    '_0x18a67d': 'asmExports',
    '_0x2216b5': '_GetAudioARG',
    '_0x36affc': '_GetDecryptAudio',
    '_0x1b6bd8': '___errno_location',
    '_0x2f69a9': '_emscripten_replace_memory',
    '_0x5375a4': '_free',
    '_0x39d8d3': '_jsfree',
    '_0x287f93': '_jsmalloc',
    '_0x112d45': '_llvm_bswap_i32',
    '_0xdbbe91': '_malloc',
    '_0x432751': '_memcpy',
    '_0x587b5e': '_memmove',
    '_0x312544': '_memset',
    '_0x4eaa16': '_nalplay2',
    '_0x203a48': '_sbrk',
    '_0x387d71': '_vodplay',
    '_0x11cd82': 'establishStackSpace',
    '_0x126a9e': 'stackAlloc',
    '_0x5a3dd5': 'stackRestore',
    '_0x33abea': 'stackSave',
    '_0x5ca9e7': 'dynCall_ii',
    '_0x56c375': 'dynCall_iidiiii',
    '_0x237f39': 'dynCall_iiii',
    '_0x3b08d9': 'dynCall_jiji',
    '_0x37c659': 'dynCall_v',
    '_0x41e4a0': 'dynCall_vi',
    '_0x30396f': 'dynCall_vii',
    '_0x240755': 'wasmReady',
    '_0x4e24df': 'ExitStatus',
    '_0x554cf9': 'run',

    # LiveAudio2 variables
    '_0xea5d18': 'audioElement',
    '_0x6f3714': '_noop',
    '_0x57b048': 'loudspeakerAudioChainUnused',
    '_0x27dbbe': 'headsetAudioChain',
    '_0x4656c6': 'loudspeakerAudioChain',
    '_0x4e10f3': 'gainSettings',
    '_0x4c2326': 'isCrossAudio',
    '_0x155d98': 'audioContext',
    '_0x3c4083': 'sourceNode',
    '_0x2e4a07': 'getBrowserInfo',
    '_0x2bee21': 'initAudioContext',
    '_0x4563d2': 'buildHeadsetPathWithStereoConvolver',
    '_0x289557': 'buildHeadsetPathWithMonoConvolver',
    '_0x41c73a': 'buildLoudspeakerPath',
    '_0x412424': 'buildLoudspeakerPathWithSwappedChannels',
    '_0x96f7f9': 'getDecryptedAudioBuffer',
    '_0x4e7bbc': 'reconnect',
    '_0x397ac9': 'disconnectLoudspeaker',
    '_0x29b80e': 'disconnectHeadset',
    '_0x5570e9': 'connectToDestination',
    # 局部变量
    '_0x106c58': 'browserInfo',
}

# ──────────────────────────────────────────────
# 字符串翻译映射表
# ──────────────────────────────────────────────
STRING_TRANSLATIONS = [
    ("'no native wasm support detected'",
     "'未检测到原生 WebAssembly 支持'"),
    ('"no native wasm support detected"',
     '"未检测到原生 WebAssembly 支持"'),
    ("'failed to load wasm binary file at '",
     "'加载 WASM 二进制文件失败：'"),
    # 注意：源码中字符串字面量以转义引号结尾，需匹配完整的字符串字面量
    ("'failed to load wasm binary file at \\''",
     "'加载 WASM 二进制文件失败：'"),
    ('"failed to load wasm binary file at "',
     '"加载 WASM 二进制文件失败："'),
    ("'Assertion failed: '", "'断言失败：'"),
    ('"Assertion failed: "', '"断言失败："'),
    ("'Cannot call unknown function '", "'无法调用未知函数 '"),
    ('"Cannot call unknown function "', '"无法调用未知函数 "'),
    ("'IndexedDB not available!'", "'IndexedDB 不可用！'"),
    ('"IndexedDB not available!"', '"IndexedDB 不可用！"'),
    ("'Error with decoding audio data'", "'解码音频数据时出错'"),
    ('"Error with decoding audio data"', '"解码音频数据时出错"'),
    ("'Error\\x20with\\x20decoding\\x20audio\\x20data'",
     "'解码音频数据时出错'"),
    ("'OOM'", "'内存不足'"),
    ('"OOM"', '"内存不足"'),
    ("'Running...'", "'运行中...'"),
    ('"Running..."', '"运行中..."'),
    # 'OK' is too short and common — skip to avoid false positives
    ("'Not Found'", "'未找到'"),
    ('"Not Found"', '"未找到"'),
    ("'Not\\x20Found'", "'未找到'"),
    ("'Payload Too Large'", "'负载过大'"),
    ('"Payload Too Large"', '"负载过大"'),
    ("'failed to asynchronously prepare wasm: '",
     "'异步准备 WASM 失败：'"),
    ('"failed to asynchronously prepare wasm: "',
     '"异步准备 WASM 失败："'),
    ("'Module.instantiateWasm callback failed with error: '",
     "'Module.instantiateWasm 回调失败，错误：'"),
    ('"Module.instantiateWasm callback failed with error: "',
     '"Module.instantiateWasm 回调失败，错误："'),
    ("'wasm streaming compile failed: '",
     "'WASM 流式编译失败：'"),
    ('"wasm streaming compile failed: "',
     '"WASM 流式编译失败："'),
    ("'falling back to ArrayBuffer instantiation'",
     "'回退到 ArrayBuffer 实例化方式'"),
    ('"falling back to ArrayBuffer instantiation"',
     '"回退到 ArrayBuffer 实例化方式"'),
    ("'Finished\\x20up\\x20all\\x20reserved\\x20function\\x20pointers.\\x20Use\\x20a\\x20higher\\x20value\\x20for\\x20RESERVED_FUNCTION_POINTERS.'",
     "'已用尽所有保留函数指针，请增大 RESERVED_FUNCTION_POINTERS 的值。'"),
    ("'both async and sync fetching of the wasm failed'",
     "'WASM 的异步和同步获取均失败'"),
    ('"both async and sync fetching of the wasm failed"',
     '"WASM 的异步和同步获取均失败"'),
    ("'[Emscripten\\x20Module\\x20object]'", "'[Emscripten 模块对象]'"),
    ("'is firfox'", "'是 Firefox 浏览器'"),
    ('"is firfox"', '"是 Firefox 浏览器"'),
    ("'invalid type for setValue: '", "'setValue 类型无效：'"),
    ('"invalid type for setValue: "', '"setValue 类型无效："'),
    ("'getNativeTypeSize invalid bits '", "'getNativeTypeSize 无效的位数 '"),
    ('"getNativeTypeSize invalid bits "', '"getNativeTypeSize 无效的位数 "'),
    ("'streaming uses moz-chunked-arraybuffer which is no longer supported; TODO: rewrite using fetch()'",
     "'流式传输使用了不再支持的 moz-chunked-arraybuffer；待办：使用 fetch() 重写'"),
    ("'no url specified!'", "'未指定 URL！'"),
    ('"no url specified!"', '"未指定 URL！"'),
    ("'no\\x20url\\x20specified!'", "'未指定 URL！'"),
    ("'IndexedDB is not open'", "'IndexedDB 未打开'"),
    ('"IndexedDB is not open"', '"IndexedDB 未打开"'),
    ("'missing function: emscripten_is_main_runtime_thread'",
     "'缺少函数：emscripten_is_main_runtime_thread'"),
    ('"missing function: emscripten_is_main_runtime_thread"',
     '"缺少函数：emscripten_is_main_runtime_thread"'),
    ("'. Build with -s ASSERTIONS=1 for more info.'",
     "'。请使用 -s ASSERTIONS=1 编译以获取更多信息。'"),
    ('"". Build with -s ASSERTIONS=1 for more info."',
     '"。请使用 -s ASSERTIONS=1 编译以获取更多信息。"'),
    # 原始代码 bug 注记：connectDest1 在 reconnect 中被调用但从未定义
    ('connectDest1()',
     '/* 注意：connectDest1() 未定义，此处为原始代码预存 bug */ connectDest1()'),
]

# ──────────────────────────────────────────────
# 在关键代码段前插入中文注释
# ──────────────────────────────────────────────
SECTION_COMMENTS = [
    # 环境检测
    (r'isWindow=typeof window===', '// 检测运行环境：浏览器窗口 / Worker / Node.js / Shell\n  '),
    # locateFile
    (r'function locateFile\(', '// 定位文件路径：优先使用 module.locateFile，否则拼接 scriptDirectory\n  '),
    # assert
    (r'function assert\(', '// 断言工具：条件为假时抛出错误\n  '),
    # abort
    (r'function abort\(', '// 终止运行：输出错误信息并抛出异常\n  '),
    # UTF8 解码
    (r'var UTF8Decoder=', '// UTF-8 解码器（复用 TextDecoder 以提升性能）\n  '),
    (r'function UTF8ArrayToString\(', '// 将 Uint8Array 转换为 UTF-8 字符串\n  '),
    (r'function UTF8ToString\(', '// 将 WASM 内存中的 UTF-8 C 字符串转换为 JS 字符串\n  '),
    (r'function stringToUTF8Array\(', '// 将 JS 字符串编码为 UTF-8 并写入字节数组\n  '),
    # 堆内存视图
    (r'function updateHeapViews\(', '// 更新所有 HEAP 视图（在内存增长后调用）\n  '),
    # 运行时回调
    (r'function callRuntimeCallbacks\(', '// 依次执行运行时回调队列中的所有函数\n  '),
    # 依赖管理
    (r'function addRunDependency\(', '// 增加运行依赖计数，防止在依赖加载完成前启动\n  '),
    (r'function removeRunDependency\(', '// 减少运行依赖计数，计数归零后触发启动\n  '),
    # WASM 加载
    (r'function getBinaryPromise\(', '// 获取 WASM 二进制数据（优先使用预加载的 ArrayBuffer）\n  '),
    (r'function createWasm\(', '// 创建并初始化 WASM 实例\n  '),
    # 动态调用
    (r'function makeDynCall\(', '// 创建动态函数调用包装器\n  '),
    (r'function addFunction\(', '// 向函数表添加函数并返回其索引\n  '),
    # 内存管理
    (r'function dynamicAlloc\(', '// 在动态内存区域分配空间\n  '),
    (r'function abortOnCannotGrowMemory\(', '// 内存无法增长时终止程序\n  '),
    (r'function _emscripten_resize_heap\(', '// 调整 WASM 堆内存大小\n  '),
    # Fetch 相关
    (r'function __emscripten_fetch_xhr\(', '// 通过 XMLHttpRequest 执行 Emscripten fetch 请求\n  '),
    (r'var Fetch=', '// Fetch 模块：管理网络请求与 IndexedDB 缓存\n  '),
    # 运行入口
    (r'function run\(', '// 主入口：执行预运行钩子，然后启动 WASM 程序\n  '),
    # LiveAudio2
    (r'var LiveAudio2=function\(audioElement\)', '// LiveAudio2：空间音频处理类，支持耳机/扬声器双路径'),
    (r'function initAudioContext\(', '// 初始化 AudioContext 并连接音频源节点\n  '),
    (r'function buildHeadsetPathWithStereoConvolver\(', '// 构建耳机音频路径（立体声卷积混响）\n  '),
    (r'function buildHeadsetPathWithMonoConvolver\(', '// 构建耳机音频路径（单声道卷积混响）\n  '),
    (r'function buildLoudspeakerPath\(', '// 构建扬声器音频路径（带卷积混响）\n  '),
    (r'function buildLoudspeakerPathWithSwappedChannels\(', '// 构建扬声器音频路径（左右声道互换）\n  '),
    (r'function getDecryptedAudioBuffer\(', '// 从 WASM 模块获取解密后的音频缓冲区\n  '),
    (r'function disconnectLoudspeaker\(', '// 断开扬声器音频链\n  '),
    (r'function disconnectHeadset\(', '// 断开耳机音频链\n  '),
    (r'function connectToDestination\(', '// 将源节点直接连接到 AudioContext 目标（扬声器输出）\n  '),
    (r'function getBrowserInfo\(', '// 获取浏览器信息（用于判断 Firefox）\n  '),
]


def build_var_pattern(name):
    """构建匹配变量名的正则表达式（避免误匹配子串）"""
    escaped = re.escape(name)
    # 变量名以 _ 或 0-9 开头，不是标准 \w 边界，需要手动处理
    return r'(?<![_\w$])' + escaped + r'(?![_\w$0-9a-fA-F])'


def apply_variable_replacements(code):
    """按照映射表替换所有混淆变量名"""
    # 按变量名长度降序排列，避免短名替换长名
    sorted_items = sorted(VARIABLE_MAP.items(), key=lambda x: len(x[0]), reverse=True)
    for obfuscated, readable in sorted_items:
        pattern = build_var_pattern(obfuscated)
        code = re.sub(pattern, readable, code)
    return code


def apply_string_translations(code):
    """替换英文字符串为中文翻译"""
    for english, chinese in STRING_TRANSLATIONS:
        code = code.replace(english, chinese)
    return code


def remove_noop_aliases(code):
    """
    删除形如 `var _0xXXXXXX=_noop;` 的无用声明，并处理多变量情形：
      - `var _0xXXXX=_noop;`        → 完全删除
      - `var _0xXXXX=_noop,REST`    → 替换为 `var REST`（保留后续变量）
    这些局部别名在函数体开头大量出现，替换后可安全删除。
    """
    # Case 1：单独声明 `var _0xXXXX = _noop;`
    code = re.sub(
        r'var\s+_0x[0-9a-fA-F]+\s*=\s*(?:_noop|noopFn)\s*;',
        '',
        code
    )
    # Case 2：多变量声明前缀 `var _0xXXXX = _noop, ` → 替换为 `var `
    code = re.sub(
        r'var\s+_0x[0-9a-fA-F]+\s*=\s*(?:_noop|noopFn)\s*,\s*',
        'var ',
        code
    )
    return code


def add_section_comments(code):
    """在关键代码段前插入中文注释"""
    for pattern_str, comment in SECTION_COMMENTS:
        pattern = re.compile(pattern_str)
        match = pattern.search(code)
        if match:
            pos = match.start()
            # 不重复插入注释
            preceding = code[max(0, pos-120):pos]
            if comment.strip() not in preceding:
                code = code[:pos] + comment + code[pos:]
    return code


FORMATTED_FILE = '/home/runner/work/CNTV/CNTV/h5.worker_patch_formatted.js'

# ──────────────────────────────────────────────
# 格式化后再次清理
# ──────────────────────────────────────────────

def post_process_formatted(code):
    """格式化之后进行二次清理"""

    # 1. 替换 "var noopFn = noopFn,\n  NEXT" → "var NEXT"
    #    （保留后续变量如 CNTVModule 的 var 声明）
    code = re.sub(r'\bvar\s+noopFn\s*=\s*noopFn\s*,\s*\n?\s*', 'var ', code)

    # 2. 删除 "var _noop = _noop;" 或替换多变量前缀
    code = re.sub(r'\bvar\s+_noop\s*=\s*_noop\s*;\s*\n?', '', code)
    code = re.sub(r'\bvar\s+_noop\s*=\s*_noop\s*,\s*\n?\s*', 'var ', code)

    # 3. 删除格式化后仍存在的 noop 别名：
    #    var _0xXXXXXX = _noop;        (单独声明)
    code = re.sub(
        r'var\s+_0x[0-9a-fA-F]+\s*=\s*_noop\s*;\s*\n?', '', code)
    # multi-var prefix in formatted output → keep remaining vars
    code = re.sub(
        r'var\s+_0x[0-9a-fA-F]+\s*=\s*_noop\s*,\s*\n?\s*', 'var ', code)

    # 4. 删除仅含无用 _0x 变量的空行（保留代码逻辑）
    code = re.sub(r'\n\s*\n\s*\n', '\n\n', code)

    return code


def add_section_comments_to_formatted(code):
    """在格式化后的代码中插入中文注释"""
    for pattern_str, comment in SECTION_COMMENTS:
        pattern = re.compile(pattern_str)
        match = pattern.search(code)
        if match:
            pos = match.start()
            # 找到该行的行首
            line_start = code.rfind('\n', 0, pos) + 1
            # 计算缩进
            indent = ''
            i = line_start
            while i < pos and code[i] in ' \t':
                indent += code[i]
                i += 1
            # 避免重复插入
            preceding = code[max(0, line_start - 200):line_start]
            comment_text = comment.strip()
            if comment_text not in preceding:
                insert = indent + '// ' + comment_text.lstrip('/ ') + '\n'
                # 移除 comment 中已有的前缀 //
                if comment.strip().startswith('//'):
                    insert = indent + comment.strip() + '\n'
                code = code[:line_start] + insert + code[line_start:]
    return code


def main():
    print(f"读取文件：{INPUT_FILE}")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        code = f.read()

    print("应用变量名替换...")
    code = apply_variable_replacements(code)

    print("删除无用的 noop 别名声明...")
    code = remove_noop_aliases(code)

    print("翻译英文字符串为中文...")
    code = apply_string_translations(code)

    print(f"写入临时文件：{TEMP_FILE}")
    with open(TEMP_FILE, 'w', encoding='utf-8') as f:
        f.write(code)

    print("用 js-beautify 格式化代码...")
    result = subprocess.run(
        ['js-beautify', '--indent-size', '2', '--jslint-happy',
         TEMP_FILE, '-o', FORMATTED_FILE],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print("js-beautify 失败:", result.stderr)
        sys.exit(1)
    print(result.stdout.strip())

    print("读取格式化后的文件，进行二次清理...")
    with open(FORMATTED_FILE, 'r', encoding='utf-8') as f:
        code = f.read()

    code = post_process_formatted(code)

    print("插入中文注释...")
    code = add_section_comments_to_formatted(code)

    print(f"写入最终文件：{OUTPUT_FILE}")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        # 文件头注释
        header = (
            "/**\n"
            " * h5.worker_patch.js — CNTV H5 播放器 WASM Worker 补丁\n"
            " *\n"
            " * 本文件由 Emscripten 生成，经过反混淆和中文注释重构处理。\n"
            " * 主要包含：\n"
            " *   1. CNTVModule  — Emscripten 生成的 WebAssembly 模块封装\n"
            " *   2. LiveAudio2 — 空间音频处理类（耳机 / 扬声器双路径）\n"
            " *\n"
            " * 构建时间：2022-12-12 16:21:23\n"
            " * 构建哈希：399895fca906b0ccd3b7fb6d20e791bf\n"
            " */\n\n"
        )
        f.write(header + code)

    print(f"完成！输出行数：", end='')
    print(code.count('\n'))


if __name__ == '__main__':
    main()
