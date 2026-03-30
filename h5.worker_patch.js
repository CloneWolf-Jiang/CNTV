/**
 * h5.worker_patch.js — CNTV H5 播放器 WASM Worker 补丁
 *
 * 本文件由 Emscripten 生成，经过反混淆和中文注释重构处理。
 * 主要包含：
 *   1. CNTVModule  — Emscripten 生成的 WebAssembly 模块封装
 *   2. LiveAudio2 — 空间音频处理类（耳机 / 扬声器双路径）
 *
 * 构建时间：2022-12-12 16:21:23
 * 构建哈希：399895fca906b0ccd3b7fb6d20e791bf
 */

var key, wb;
var _wasmBinaryReady = fetch(new URL('CNTV.wasm', self.location.href))
  .then(function (res) {
    return res.arrayBuffer();
  })
  .then(function (buf) {
    wb = buf;
  });
var noopFn = function () {};
var CNTVModule = function () {
    var currentScriptSrc = typeof document !== 'undefined' && document['currentScript'] ? document['currentScript']['src'] : undefined;
    return function (moduleOptions) {
      moduleOptions = moduleOptions || {};
      var module = typeof moduleOptions !== 'undefined' ? moduleOptions : {},
        moduleBackup = {},
        propKey;
      for (propKey in module) {
        module['hasOwnProperty'](propKey) && (moduleBackup[propKey] = module[propKey]);
      }
      var argv = [],
        thisProgram = './this.program',
        quit = function (code, e) {
          throw e;
        },
        isWindow = ![],
        isWorker = ![],
        isNode = ![],
        isNodeProcess = ![],
        isShell = ![];
      isWindow = typeof window === 'object', isWorker = typeof importScripts === 'function', isNodeProcess = typeof process === 'object' && typeof process['versions'] === 'object' && typeof process['versions']['node'] === 'string', isNode = isNodeProcess && !isWindow && !isWorker, isShell = !isWindow && !isNode && !isWorker;
      var scriptDirectory = '';

      // 定位文件路径：优先使用 module.locateFile，否则拼接 scriptDirectory
      function locateFile(fileName) {
        if (module['locateFile']) return module['locateFile'](fileName, scriptDirectory);
        return scriptDirectory + fileName;
      }
      var readFile, readFileAsync, readBinary, setWindowTitle;
      if (isNode) {
        scriptDirectory = __dirname + '/';
        var fsModule, pathModule;
        readFile = function readFileSync(filename, returnUint8Array) {
          var data;
          if (!fsModule) fsModule = require('fs');
          if (!pathModule) pathModule = require('path');
          return filename = pathModule['normalize'](filename), data = fsModule['readFileSync'](filename), returnUint8Array ? data : data['toString']();
        }, readBinary = function readBinarySync(filename) {
          var content = readFile(filename, !![]);
          return !content['buffer'] && (content = new Uint8Array(content)), assert(content['buffer']), content;
        }, process['argv']['length'] > 0x1 && (thisProgram = process['argv'][0x1]['replace'](/\\/g, '/')), argv = process['argv']['slice'](0x2), process['on']('uncaughtException', function (e) {
          if (!(e instanceof ExitStatus)) throw e;
        }), process['on']('unhandledRejection', abort), quit = function (code) {
          process['exit'](code);
        }, module['inspect'] = function () {
          return '[Emscripten 模块对象]';
        };
      } else {
        if (isShell) {
          typeof read != 'undefined' && (readFile = function readFileShell(filename) {
            return read(filename);
          });
          readBinary = function readBinaryShell(filename) {
            var data;
            if (typeof readbuffer === 'function') return new Uint8Array(readbuffer(filename));
            return data = read(filename, 'binary'), assert(typeof data === 'object'), data;
          };
          if (typeof scriptArgs != 'undefined') argv = scriptArgs;
          else typeof arguments != 'undefined' && (argv = arguments);
          typeof quit === 'function' && (quit = function (code) {
            quit(code);
          });
          if (typeof print !== 'undefined') {
            if (typeof console === 'undefined') console = {};
            console['log'] = print, console['warn'] = console['error'] = typeof printErr !== 'undefined' ? printErr : print;
          }
        } else {
          if (isWindow || isWorker) {
            if (isWorker) scriptDirectory = self['location']['href'];
            else document['currentScript'] && (scriptDirectory = document['currentScript']['src']);
            currentScriptSrc && (scriptDirectory = currentScriptSrc), scriptDirectory['indexOf']('blob:') !== 0x0 ? scriptDirectory = scriptDirectory['substr'](0x0, scriptDirectory['lastIndexOf']('/') + 0x1) : scriptDirectory = '', readFile = function readFileXHR(url) {
              var xhr = new XMLHttpRequest();
              return xhr['open']('GET', url, ![]), xhr['send'](null), xhr['responseText'];
            }, isWorker && (readBinary = function readBinaryXHR(url) {
              var xhr = new XMLHttpRequest();
              return xhr['open']('GET', url, ![]), xhr['responseType'] = 'arraybuffer', xhr['send'](null), new Uint8Array(xhr['response']);
            }), readFileAsync = function readFileAsyncXHR(url, onSuccess, onError) {
              var xhr = new XMLHttpRequest();
              xhr['open']('GET', url, !![]), xhr['responseType'] = 'arraybuffer', xhr['onload'] = function onXHRLoad() {
                if (xhr['status'] == 0xc8 || xhr['status'] == 0x0 && xhr['response']) {
                  onSuccess(xhr['response']);
                  return;
                }
                onError();
              }, xhr['onerror'] = onError, xhr['send'](null);
            }, setWindowTitle = function (title) {
              document['title'] = title;
            };
          } else {}
        }
      }
      var printOutput = module['print'] || console['log']['bind'](console),
        printError = module['printErr'] || console['warn']['bind'](console);
      for (propKey in moduleBackup) {
        moduleBackup['hasOwnProperty'](propKey) && (module[propKey] = moduleBackup[propKey]);
      }
      moduleBackup = null;
      if (module['arguments']) argv = module['arguments'];
      if (module['thisProgram']) thisProgram = module['thisProgram'];
      if (module['quit']) quit = module['quit'];
      var ALIGNMENT = 0x10;

      // 在动态内存区域分配空间
      function dynamicAlloc(size) {
        var ret = HEAP32[DYNAMICTOP_PTR >> 0x2],
          newDynamicTop = ret + size + 0xf & -0x10;
        return newDynamicTop > getHeapSize() && abort(), HEAP32[DYNAMICTOP_PTR >> 0x2] = newDynamicTop, ret;
      }

      function getNativeTypeSize(typeName) {
        switch (typeName) {
        case 'i1':
        case 'i8':
          return 0x1;
        case 'i16':
          return 0x2;
        case 'i32':
          return 0x4;
        case 'i64':
          return 0x8;
        case 'float':
          return 0x4;
        case 'double':
          return 0x8;
        default: {
          if (typeName[typeName['length'] - 0x1] === '*') return 0x4;
          else {
            if (typeName[0x0] === 'i') {
              var bits = parseInt(typeName['substr'](0x1));
              return assert(bits % 0x8 === 0x0, 'getNativeTypeSize 无效的位数 ' + bits + ', 类型 ' + typeName), bits / 0x8;
            } else return 0x0;
          }
        }
        }
      }

      function warnOnce(text) {
        if (!warnOnce['shown']) warnOnce['shown'] = {};
        !warnOnce['shown'][text] && (warnOnce['shown'][text] = 0x1, printError(text));
      }
      var asm2wasmImports = {
          'f64-rem': function (x, y) {
            return x % y;
          },
          'debugger': function () {}
        },
        RESERVED_FUNCTION_POINTERS_START = 0x1,
        FUNCTION_TABLE = new Array(0xe);

      // 创建动态函数调用包装器
      function makeDynCall(func, sig) {
        var typeSection = [0x1, 0x0, 0x1, 0x60],
          retType = sig['slice'](0x0, 0x1),
          paramTypes = sig['slice'](0x1),
          typeMap = {
            'i': 0x7f,
            'j': 0x7e,
            'f': 0x7d,
            'd': 0x7c
          };
        typeSection['push'](paramTypes['length']);
        for (var i = 0x0; i < paramTypes['length']; ++i) {
          typeSection['push'](typeMap[paramTypes[i]]);
        }
        retType == 'v' ? typeSection['push'](0x0) : typeSection = typeSection['concat']([0x1, typeMap[retType]]);
        typeSection[0x1] = typeSection['length'] - 0x2;
        var bytes = new Uint8Array([0x0, 0x61, 0x73, 0x6d, 0x1, 0x0, 0x0, 0x0]['concat'](typeSection, [0x2, 0x7, 0x1, 0x1, 0x65, 0x1, 0x66, 0x0, 0x0, 0x7, 0x5, 0x1, 0x1, 0x66, 0x0, 0x0])),
          wasmMod = new WebAssembly['Module'](bytes),
          wasmInst = new WebAssembly[('Instance')](wasmMod, {
            'e': {
              'f': func
            }
          }),
          wrappedFunc = wasmInst['exports']['f'];
        return wrappedFunc;
      }

      // 向函数表添加函数并返回其索引
      function addFunction(funcToAdd, funcSig) {
        var startIdx = 0x0;
        for (var i = startIdx; i < startIdx + 0xe; i++) {
          if (!FUNCTION_TABLE[i]) return FUNCTION_TABLE[i] = funcToAdd, RESERVED_FUNCTION_POINTERS_START + i;
        }
        throw '已用尽所有保留函数指针，请增大 RESERVED_FUNCTION_POINTERS 的值。';
      }
      var resolvedFunctions = {};

      function dynCall(sig, funcPtr, callArgs) {
        return callArgs && callArgs['length'] ? module['dynCall_' + sig]['apply'](null, [funcPtr]['concat'](callArgs)) : module['dynCall_' + sig]['call'](null, funcPtr);
      }
      var tempRet0 = 0x0,
        setTempRet0 = function (value) {
          tempRet0 = value;
        },
        getTempRet0 = function () {
          return tempRet0;
        },
        wasmBinary;
      if (module['wasmBinary']) wasmBinary = module['wasmBinary'];
      typeof WebAssembly !== 'object' && printError('未检测到原生 WebAssembly 支持');

      function setValue(ptr, value, type, noSafe) {
        type = type || 'i8';
        if (type['charAt'](type['length'] - 0x1) === '*') type = 'i32';
        switch (type) {
        case 'i1':
          HEAP8[ptr >> 0x0] = value;
          break;
        case 'i8':
          HEAP8[ptr >> 0x0] = value;
          break;
        case 'i16':
          HEAP16[ptr >> 0x1] = value;
          break;
        case 'i32':
          HEAP32[ptr >> 0x2] = value;
          break;
        case 'i64':
          tempI64 = [value >>> 0x0, (tempDouble = value, +Math_abs(tempDouble) >= 0x1 ? tempDouble > 0x0 ? (Math_min(+Math_floor(tempDouble / 0x100000000), 0xffffffff) | 0x0) >>> 0x0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0x0)) / 0x100000000) >>> 0x0 : 0x0)], HEAP32[ptr >> 0x2] = tempI64[0x0], HEAP32[ptr + 0x4 >> 0x2] = tempI64[0x1];
          break;
        case 'float':
          HEAPF32[ptr >> 0x2] = value;
          break;
        case 'double':
          HEAPF64[ptr >> 0x3] = value;
          break;
        default:
          abort('setValue 类型无效：' + type);
        }
      }
      var wasmMemory, wasmTable, calledAbort = ![],
        exitCode = 0x0;

      // 断言工具：条件为假时抛出错误
      function assert(condition, message) {
        !condition && abort('断言失败：' + message);
      }

      function getCFunc(funcName) {
        var cfunc = module['_' + funcName];
        return assert(cfunc, '无法调用未知函数 ' + funcName + ', make sure it is exported'), cfunc;
      }

      function ccall(ident, returnType, argTypes, args, opts) {
        var converters = {
          'string': function (value) {
            var ptr = 0x0;
            if (value !== null && value !== undefined && value !== 0x0) {
              var length = (value['length'] << 0x2) + 0x1;
              ptr = stackAlloc(length), stringToUTF8(value, ptr, length);
            }
            return ptr;
          },
          'array': function (arr) {
            var ptr = stackAlloc(arr['length']);
            return writeArrayToMemory(arr, ptr), ptr;
          }
        };

        function convertReturnValue(ret) {
          if (returnType === 'string') return UTF8ToString(ret);
          if (returnType === 'boolean') return Boolean(ret);
          return ret;
        }
        var func = getCFunc(ident),
          convertedArgs = [],
          stackPtr = 0x0;
        if (args)
          for (var i = 0x0; i < args['length']; i++) {
            var converter = converters[argTypes[i]];
            if (converter) {
              if (stackPtr === 0x0) stackPtr = stackSave();
              convertedArgs[i] = converter(args[i]);
            } else convertedArgs[i] = args[i];
          }
        var ret = func['apply'](null, convertedArgs);
        ret = convertReturnValue(ret);
        if (stackPtr !== 0x0) stackRestore(stackPtr);
        return ret;
      }
      var UTF8_DECODER_THRESHOLD = 0x3,
        UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

      // 将 Uint8Array 转换为 UTF-8 字符串
      function UTF8ArrayToString(heap, idx, maxBytesToRead) {
        var endIdx = idx + maxBytesToRead,
          endIdx = idx;
        while (heap[endIdx] && !(endIdx >= endIdx)) ++endIdx;
        if (endIdx - idx > 0x10 && heap['subarray'] && UTF8Decoder) return UTF8Decoder['decode'](heap['subarray'](idx, endIdx));
        else {
          var result = '';
          while (idx < endIdx) {
            var byte = heap[idx++];
            if (!(byte & 0x80)) {
              result += String['fromCharCode'](byte);
              continue;
            }
            var secondByte = heap[idx++] & 0x3f;
            if ((byte & 0xe0) == 0xc0) {
              result += String['fromCharCode']((byte & 0x1f) << 0x6 | secondByte);
              continue;
            }
            var thirdByte = heap[idx++] & 0x3f;
            (byte & 0xf0) == 0xe0 ? byte = (byte & 0xf) << 0xc | secondByte << 0x6 | thirdByte : byte = (byte & 0x7) << 0x12 | secondByte << 0xc | thirdByte << 0x6 | heap[idx++] & 0x3f;
            if (byte < 0x10000) result += String['fromCharCode'](byte);
            else {
              var codePoint = byte - 0x10000;
              result += String['fromCharCode'](0xd800 | codePoint >> 0xa, 0xdc00 | codePoint & 0x3ff);
            }
          }
        }
        return result;
      }

      // 将 WASM 内存中的 UTF-8 C 字符串转换为 JS 字符串
      function UTF8ToString(ptr, maxBytesToRead) {
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
      }

      // 将 JS 字符串编码为 UTF-8 并写入字节数组
      function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
        if (!(maxBytesToWrite > 0x0)) return 0x0;
        var startOutIdx = outIdx,
          endOutIdx = outIdx + maxBytesToWrite - 0x1;
        for (var i = 0x0; i < str['length']; ++i) {
          var charCode = str['charCodeAt'](i);
          if (charCode >= 0xd800 && charCode <= 0xdfff) {
            var nextCharCode = str['charCodeAt'](++i);
            charCode = 0x10000 + ((charCode & 0x3ff) << 0xa) | nextCharCode & 0x3ff;
          }
          if (charCode <= 0x7f) {
            if (outIdx >= endOutIdx) break;
            outU8Array[outIdx++] = charCode;
          } else {
            if (charCode <= 0x7ff) {
              if (outIdx + 0x1 >= endOutIdx) break;
              outU8Array[outIdx++] = 0xc0 | charCode >> 0x6, outU8Array[outIdx++] = 0x80 | charCode & 0x3f;
            } else {
              if (charCode <= 0xffff) {
                if (outIdx + 0x2 >= endOutIdx) break;
                outU8Array[outIdx++] = 0xe0 | charCode >> 0xc, outU8Array[outIdx++] = 0x80 | charCode >> 0x6 & 0x3f, outU8Array[outIdx++] = 0x80 | charCode & 0x3f;
              } else {
                if (outIdx + 0x3 >= endOutIdx) break;
                outU8Array[outIdx++] = 0xf0 | charCode >> 0x12, outU8Array[outIdx++] = 0x80 | charCode >> 0xc & 0x3f, outU8Array[outIdx++] = 0x80 | charCode >> 0x6 & 0x3f, outU8Array[outIdx++] = 0x80 | charCode & 0x3f;
              }
            }
          }
        }
        return outU8Array[outIdx] = 0x0, outIdx - startOutIdx;
      }

      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
      }

      function lengthBytesUTF8(str) {
        var len = 0x0;
        for (var i = 0x0; i < str['length']; ++i) {
          var charCode = str['charCodeAt'](i);
          if (charCode >= 0xd800 && charCode <= 0xdfff) charCode = 0x10000 + ((charCode & 0x3ff) << 0xa) | str['charCodeAt'](++i) & 0x3ff;
          if (charCode <= 0x7f) ++len;
          else {
            if (charCode <= 0x7ff) len += 0x2;
            else {
              if (charCode <= 0xffff) len += 0x3;
              else len += 0x4;
            }
          }
        }
        return len;
      }
      var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

      function writeArrayToMemory(array, buffer) {
        HEAP8['set'](array, buffer);
      }

      function writeAsciiToMemory(str, buffer, dontAddNull) {
        for (var i = 0x0; i < str['length']; ++i) {
          HEAP8[buffer++ >> 0x0] = str['charCodeAt'](i);
        }
        if (!dontAddNull) HEAP8[buffer >> 0x0] = 0x0;
      }
      var PAGE_SIZE = 0x10000;

      function alignUp(x, multiple) {
        return x % multiple > 0x0 && (x += multiple - x % multiple), x;
      }
      var wasmBuffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

      // 更新所有 HEAP 视图（在内存增长后调用）
      function updateHeapViews() {
        module['HEAP8'] = HEAP8 = new Int8Array(wasmBuffer), module['HEAP16'] = HEAP16 = new Int16Array(wasmBuffer), module['HEAP32'] = HEAP32 = new Int32Array(wasmBuffer), module['HEAPU8'] = HEAPU8 = new Uint8Array(wasmBuffer), module['HEAPU16'] = HEAPU16 = new Uint16Array(wasmBuffer), module['HEAPU32'] = HEAPU32 = new Uint32Array(wasmBuffer), module['HEAPF32'] = HEAPF32 = new Float32Array(wasmBuffer), module['HEAPF64'] = HEAPF64 = new Float64Array(wasmBuffer);
      }
      var STATIC_BASE = 0x6e10,
        DYNAMIC_BASE = 0x506e10,
        DYNAMICTOP_PTR = 0x6df0,
        TOTAL_MEMORY = module['TOTAL_MEMORY'] || 0x1000000;
      module['wasmMemory'] ? wasmMemory = module['wasmMemory'] : wasmMemory = new WebAssembly[('Memory')]({
        'initial': TOTAL_MEMORY / PAGE_SIZE
      });
      wasmMemory && (wasmBuffer = wasmMemory['buffer']);
      TOTAL_MEMORY = wasmBuffer['byteLength'], updateHeapViews(), HEAP32[DYNAMICTOP_PTR >> 0x2] = DYNAMIC_BASE;

      // 依次执行运行时回调队列中的所有函数
      function callRuntimeCallbacks(callbacks) {
        while (callbacks['length'] > 0x0) {
          var callback = callbacks['shift']();
          if (typeof callback == 'function') {
            callback();
            continue;
          }
          var cbFunc = callback['func'];
          typeof cbFunc === 'number' ? callback['arg'] === undefined ? module['dynCall_v'](cbFunc) : module['dynCall_vi'](cbFunc, callback['arg']) : cbFunc(callback['arg'] === undefined ? null : callback['arg']);
        }
      }
      var __ATPRERUN__ = [],
        __ATINIT__ = [],
        __ATMAIN__ = [],
        __ATPOSTRUN__ = [],
        calledRun = ![],
        calledMain = ![];

      function preRun() {
        if (module['preRun']) {
          if (typeof module['preRun'] == 'function') module['preRun'] = [module['preRun']];
          while (module['preRun']['length']) {
            addOnPreRun(module['preRun']['shift']());
          }
        }
        callRuntimeCallbacks(__ATPRERUN__);
      }

      function initRuntime() {
        calledRun = !![], callRuntimeCallbacks(__ATINIT__);
      }

      function callMain() {
        callRuntimeCallbacks(__ATMAIN__);
      }

      function exitRuntime() {
        calledMain = !![];
      }

      function postRun() {
        if (module['postRun']) {
          if (typeof module['postRun'] == 'function') module['postRun'] = [module['postRun']];
          while (module['postRun']['length']) {
            addOnPostRun(module['postRun']['shift']());
          }
        }
        callRuntimeCallbacks(__ATPOSTRUN__);
      }

      function addOnPreRun(fn) {
        __ATPRERUN__['unshift'](fn);
      }

      function addOnPostRun(fn) {
        __ATPOSTRUN__['unshift'](fn);
      }
      var Math_abs = Math['abs'],
        Math_ceil = Math['ceil'],
        Math_floor = Math['floor'],
        Math_min = Math['min'],
        runDependencies = 0x0,
        runDependencyWatcher = null,
        dependenciesFulfilled = null;

      // 增加运行依赖计数，防止在依赖加载完成前启动
      function addRunDependency(id) {
        runDependencies++, module['monitorRunDependencies'] && module['monitorRunDependencies'](runDependencies);
      }

      // 减少运行依赖计数，计数归零后触发启动
      function removeRunDependency(id) {
        runDependencies--;
        module['monitorRunDependencies'] && module['monitorRunDependencies'](runDependencies);
        if (runDependencies == 0x0) {
          runDependencyWatcher !== null && (clearInterval(runDependencyWatcher), runDependencyWatcher = null);
          if (dependenciesFulfilled) {
            var fn = dependenciesFulfilled;
            dependenciesFulfilled = null, fn();
          }
        }
      }
      module['preloadedImages'] = {}, module['preloadedAudios'] = {};
      var DATA_URI_PREFIX = 'data:application/octet-stream;base64,';

      function isDataURI(filename) {
        return String['prototype']['startsWith'] ? filename['startsWith'](DATA_URI_PREFIX) : filename['indexOf'](DATA_URI_PREFIX) === 0x0;
      }
      if (wb instanceof ArrayBuffer) {
        wasmBinary = wb;
      }
      var wasmBinaryFile = (wb instanceof ArrayBuffer) ? null : wb;
      if (wasmBinaryFile && !isDataURI(wasmBinaryFile)) wasmBinaryFile = locateFile(wasmBinaryFile);

      function getBinary() {
        try {
          if (wasmBinary) return new Uint8Array(wasmBinary);
          if (readBinary) return readBinary(wasmBinaryFile);
          else throw 'WASM 的异步和同步获取均失败';
        } catch (e) {
          abort(e);
        }
      }

      // 获取 WASM 二进制数据（优先使用预加载的 ArrayBuffer）
      function getBinaryPromise() {
        if (!wasmBinary && typeof fetch === 'function') return fetch(wasmBinaryFile, {
          'credentials': 'same-origin'
        })['then'](function (response) {
          if (!response['ok']) throw '加载 WASM 二进制文件失败：' + wasmBinaryFile + '\x27';
          return response['arrayBuffer']();
        })['catch'](function () {
          return getBinary();
        });
        return new Promise(function (resolve, reject) {
          resolve(getBinary());
        });
      }

      // 创建并初始化 WASM 实例
      function createWasm(env) {
        var asmLibraryArg = {
          'env': env,
          'global': {
            'NaN': NaN,
            'Infinity': Infinity
          },
          'global.Math': Math,
          'asm2wasm': asm2wasmImports
        };

        function receiveInstance(output, imports) {
          var exports = output['exports'];
          module['asm'] = exports, removeRunDependency('wasm-instantiate');
        }
        addRunDependency('wasm-instantiate');

        function receiveInstantiationResult(result) {
          receiveInstance(result['instance']);
        }

        function receiveInstantiatedSource(callback) {
          return getBinaryPromise()['then'](function (binary) {
            return WebAssembly['instantiate'](binary, asmLibraryArg);
          })['then'](callback, function (err) {
            printError('异步准备 WASM 失败：' + err), abort(err);
          });
        }

        function instantiateAsync() {
          if (!wasmBinary && typeof WebAssembly['instantiateStreaming'] === 'function' && !isDataURI(wasmBinaryFile) && typeof fetch === 'function') fetch(wasmBinaryFile, {
            'credentials': 'same-origin'
          })['then'](function (response) {
            streamResult = WebAssembly['instantiateStreaming'](response, asmLibraryArg);
            return streamResult['then'](receiveInstantiationResult, function (err) {
              printError('WASM 流式编译失败：' + err), printError('回退到 ArrayBuffer 实例化方式'), receiveInstantiatedSource(receiveInstantiationResult);
            });
          });
          else return receiveInstantiatedSource(receiveInstantiationResult);
        }
        if (module['instantiateWasm']) try {
          var customWasm = module['instantiateWasm'](asmLibraryArg, receiveInstance);
          return customWasm;
        } catch (e) {
          return printError('Module.instantiateWasm 回调失败，错误：' + e), ![];
        }
        return instantiateAsync(), {};
      }
      module['asm'] = function (globalArg, env, buffer) {
        env['memory'] = wasmMemory, env['table'] = wasmTable = new WebAssembly[('Table')]({
          'initial': 0xa0,
          'maximum': 0xa0,
          'element': 'anyfunc'
        }), env['__memory_base'] = 0x400, env['__table_base'] = 0x0;
        var exports = createWasm(env);
        return exports;
      };
      var tempDouble, tempI64, ASM_CONSTS = [function (ptr) {
        const urlStr = UTF8ToString(ptr);
        var xhr = new XMLHttpRequest();
        xhr['timeout'] = 0x0, xhr['responseType'] = '', xhr['open']('GET', urlStr, ![]), xhr['onload'] = function (event) {
          this['status'] == 0xc8 && (tmpstr = this['responseText']);
        }, xhr['send']();
        const byteLen = lengthBytesUTF8(tmpstr) + 0x1,
          outPtr = _malloc(byteLen);
        return stringToUTF8(tmpstr, outPtr, byteLen), outPtr;
      }, function (ptr) {
        var code = UTF8ToString(ptr),
          result = eval(code),
          byteLen = lengthBytesUTF8(result) + 0x1,
          outPtr = _malloc(byteLen);
        return stringToUTF8(result, outPtr, byteLen), outPtr;
      }, function (ptr) {
        const code = UTF8ToString(ptr),
          result = eval(code),
          byteLen = lengthBytesUTF8(result) + 0x1,
          outPtr = _malloc(byteLen);
        return stringToUTF8(result, outPtr, byteLen), outPtr;
      }];

      function emscripten_asm_const_ii(idx, ptr) {
        return ASM_CONSTS[idx](ptr);
      }
      var tempDoublePtr = 0x6e00;

      function demangle(symbol) {
        return symbol;
      }

      function demangleAll(text) {
        var funcRegex = /\b__Z[\w\d_]+/g;
        return text['replace'](funcRegex, function (mangledFunc) {
          var demangled = demangle(mangledFunc);
          return mangledFunc === demangled ? mangledFunc : demangled + ' [' + mangledFunc + ']';
        });
      }

      function jsStackTrace() {
        var err = new Error();
        if (!err['stack']) {
          try {
            throw new Error(0x0);
          } catch (e) {
            err = e;
          }
          if (!err['stack']) return '(no stack trace available)';
        }
        return err['stack']['toString']();
      }

      function stackTrace() {
        var stackStr = jsStackTrace();
        if (module['extraStackTrace']) stackStr += '\x0a' + module['extraStackTrace']();
        return demangleAll(stackStr);
      }

      function ___gxx_personality_v0() {}
      var PATH = {
          'splitPath': function (path) {
            var splitRegex = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return splitRegex['exec'](path)['slice'](0x1);
          },
          'normalizeArray': function (parts, allowAboveRoot) {
            var upCount = 0x0;
            for (var i = parts['length'] - 0x1; i >= 0x0; i--) {
              var last = parts[i];
              if (last === '.') parts['splice'](i, 0x1);
              else {
                if (last === '..') parts['splice'](i, 0x1), upCount++;
                else upCount && (parts['splice'](i, 0x1), upCount--);
              }
            }
            if (allowAboveRoot)
              for (; upCount; upCount--) {
                parts['unshift']('..');
              }
            return parts;
          },
          'normalize': function (path) {
            var isAbsolute = path['charAt'](0x0) === '/',
              trailingSlash = path['substr'](-0x1) === '/';
            return path = PATH['normalizeArray'](path['split']('/')['filter'](function (part) {
              return !!part;
            }), !isAbsolute)['join']('/'), !path && !isAbsolute && (path = '.'), path && trailingSlash && (path += '/'), (isAbsolute ? '/' : '') + path;
          },
          'dirname': function (path) {
            var result = PATH['splitPath'](path),
              root = result[0x0],
              dir = result[0x1];
            if (!root && !dir) return '.';
            return dir && (dir = dir['substr'](0x0, dir['length'] - 0x1)), root + dir;
          },
          'basename': function (path) {
            if (path === '/') return '/';
            var lastSlash = path['lastIndexOf']('/');
            if (lastSlash === -0x1) return path;
            return path['substr'](lastSlash + 0x1);
          },
          'extname': function (path) {
            return PATH['splitPath'](path)[0x3];
          },
          'join': function () {
            var parts = Array['prototype']['slice']['call'](arguments, 0x0);
            return PATH['normalize'](parts['join']('/'));
          },
          'join2': function (a, b) {
            return PATH['normalize'](a + '/' + b);
          }
        },
        SYSCALLS = {
          'buffers': [null, [],
            []
          ],
          'printChar': function (fd, chr) {
            var buf = SYSCALLS['buffers'][fd];
            chr === 0x0 || chr === 0xa ? ((fd === 0x1 ? printOutput : printError)(UTF8ArrayToString(buf, 0x0)), buf['length'] = 0x0) : buf['push'](chr);
          },
          'varargs': 0x0,
          'get': function (_typeHint) {
            SYSCALLS['varargs'] += 0x4;
            var val = HEAP32[SYSCALLS['varargs'] - 0x4 >> 0x2];
            return val;
          },
          'getStr': function () {
            var str = UTF8ToString(SYSCALLS['get']());
            return str;
          },
          'get64': function () {
            var lo = SYSCALLS['get'](),
              hi = SYSCALLS['get']();
            return lo;
          },
          'getZero': function () {
            SYSCALLS['get']();
          }
        };

      function ___syscall140(which, varargs) {
        SYSCALLS['varargs'] = varargs;
        try {
          var stream = SYSCALLS['getStreamFromFD'](),
            offset_high = SYSCALLS['get'](),
            offset_low = SYSCALLS['get'](),
            whence = SYSCALLS['get'](),
            result = SYSCALLS['get']();
          return 0x0;
        } catch (e) {
          if (typeof FS === 'undefined' || !(e instanceof FS['ErrnoError'])) abort(e);
          return -e['errno'];
        }
      }

      // 刷新输出缓冲区（无文件系统版本）
      function flush_NO_FILESYSTEM() {
        var fflushFn = module['_fflush'];
        if (fflushFn) fflushFn(0x0);
        var buffers = SYSCALLS['buffers'];
        if (buffers[0x1]['length']) SYSCALLS['printChar'](0x1, 0xa);
        if (buffers[0x2]['length']) SYSCALLS['printChar'](0x2, 0xa);
      }

      function ___syscall146(which, varargs) {
        SYSCALLS['varargs'] = varargs;
        try {
          var fd = SYSCALLS['get'](),
            iov = SYSCALLS['get'](),
            iovcnt = SYSCALLS['get'](),
            ret = 0x0;
          for (var i = 0x0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 0x8 >> 0x2],
              len = HEAP32[iov + (i * 0x8 + 0x4) >> 0x2];
            for (var j = 0x0; j < len; j++) {
              SYSCALLS['printChar'](fd, HEAPU8[ptr + j]);
            }
            ret += len;
          }
          return ret;
        } catch (e) {
          if (typeof FS === 'undefined' || !(e instanceof FS['ErrnoError'])) abort(e);
          return -e['errno'];
        }
      }

      function ___syscall54(which, varargs) {
        SYSCALLS['varargs'] = varargs;
        try {
          return 0x0;
        } catch (e) {
          if (typeof FS === 'undefined' || !(e instanceof FS['ErrnoError'])) abort(e);
          return -e['errno'];
        }
      }

      function ___syscall6(which, varargs) {
        SYSCALLS['varargs'] = varargs;
        try {
          var stream = SYSCALLS['getStreamFromFD']();
          return 0x0;
        } catch (e) {
          if (typeof FS === 'undefined' || !(e instanceof FS['ErrnoError'])) abort(e);
          return -e['errno'];
        }
      }

      function __emscripten_fetch_free(xhrIdx) {
        delete Fetch['xhrs'][xhrIdx - 0x1];
      }

      function getHeapSize() {
        return HEAP8['length'];
      }

      function _emscripten_is_main_browser_thread() {
        return !isWorker;
      }
      var Fetch = {
        'xhrs': [],
        'setu64': function (addr, val) {
          HEAPU32[addr >> 0x2] = val, HEAPU32[addr + 0x4 >> 0x2] = val / 0x100000000 | 0x0;
        },
        'openDatabase': function (dbName, version, onSuccess, onError) {
          try {
            var dbRequest = indexedDB['open'](dbName, version);
          } catch (e) {
            return onError(e);
          }
          dbRequest['onupgradeneeded'] = function (event) {
            db = event['target']['result'];
            db['objectStoreNames']['contains']('FILES') && db['deleteObjectStore']('FILES'), db['createObjectStore']('FILES');
          }, dbRequest['onsuccess'] = function (event) {
            onSuccess(event['target']['result']);
          }, dbRequest['onerror'] = function (event) {
            onError(event);
          };
        },
        'staticInit': function () {
          var isNotFetchWorker = typeof ENVIRONMENT_IS_FETCH_WORKER === 'undefined',
            onDBOpen = function (dbInstance) {
              Fetch['dbInstance'] = dbInstance, isNotFetchWorker && removeRunDependency('library_fetch_init');
            },
            onDBError = function () {
              Fetch['dbInstance'] = ![], isNotFetchWorker && removeRunDependency('library_fetch_init');
            };
          Fetch['openDatabase']('emscripten_filesystem', 0x1, onDBOpen, onDBError);
          if (typeof ENVIRONMENT_IS_FETCH_WORKER === 'undefined' || !ENVIRONMENT_IS_FETCH_WORKER) addRunDependency('library_fetch_init');
        }
      };

      // 通过 XMLHttpRequest 执行 Emscripten fetch 请求
      function __emscripten_fetch_xhr(fetch, onSuccess, onError, onProgress, onReadyStateChange) {
        var fetchAttrFlags = HEAPU32[fetch + 0x8 >> 0x2];
        if (!fetchAttrFlags) {
          onError(fetch, 0x0, '未指定 URL！');
          return;
        }
        var url = UTF8ToString(fetchAttrFlags),
          requestStruct = fetch + 0x70,
          method = UTF8ToString(requestStruct);
        if (!method) method = 'GET';
        var id = HEAPU32[requestStruct + 0x20 >> 0x2],
          fetchAttrFlags = HEAPU32[requestStruct + 0x34 >> 0x2],
          timeoutMs = HEAPU32[requestStruct + 0x38 >> 0x2],
          withCredentials = !!HEAPU32[requestStruct + 0x3c >> 0x2],
          timeout = HEAPU32[requestStruct + 0x40 >> 0x2],
          userNamePtr = HEAPU32[requestStruct + 0x44 >> 0x2],
          passwordPtr = HEAPU32[requestStruct + 0x48 >> 0x2],
          headersPtr = HEAPU32[requestStruct + 0x4c >> 0x2],
          mimeTypePtr = HEAPU32[requestStruct + 0x50 >> 0x2],
          bodyPtr = HEAPU32[requestStruct + 0x54 >> 0x2],
          bodyLen = HEAPU32[requestStruct + 0x58 >> 0x2],
          loadToMem = !!(fetchAttrFlags & 0x1),
          streamData = !!(fetchAttrFlags & 0x2),
          persistFile = !!(fetchAttrFlags & 0x4),
          isViaIDB = !!(fetchAttrFlags & 0x8),
          noDownload = !!(fetchAttrFlags & 0x10),
          syncXHR = !!(fetchAttrFlags & 0x40),
          waitIDB = !!(fetchAttrFlags & 0x80),
          userName = userNamePtr ? UTF8ToString(userNamePtr) : undefined,
          password = passwordPtr ? UTF8ToString(passwordPtr) : undefined,
          mimeType = mimeTypePtr ? UTF8ToString(mimeTypePtr) : undefined,
          xhrObj = new XMLHttpRequest();
        xhrObj['withCredentials'] = withCredentials, xhrObj['open'](method, url, !syncXHR, userName, password);
        if (!syncXHR) xhrObj['timeout'] = timeoutMs;
        xhrObj['url_'] = url, assert(!streamData, '流式传输使用了不再支持的 moz-chunked-arraybuffer；待办：使用 fetch() 重写'), xhrObj['responseType'] = 'arraybuffer';
        mimeTypePtr && xhrObj['overrideMimeType'](mimeType);
        if (headersPtr)
          for (;;) {
            var headerKeyPtr = HEAPU32[headersPtr >> 0x2];
            if (!headerKeyPtr) break;
            var headerValPtr = HEAPU32[headersPtr + 0x4 >> 0x2];
            if (!headerValPtr) break;
            headersPtr += 0x8;
            var headerKey = UTF8ToString(headerKeyPtr),
              headerVal = UTF8ToString(headerValPtr);
            xhrObj['setRequestHeader'](headerKey, headerVal);
          }
        Fetch['xhrs']['push'](xhrObj);
        var xhrIdx = Fetch['xhrs']['length'];
        HEAPU32[fetch + 0x0 >> 0x2] = xhrIdx;
        var bodyData = bodyPtr && bodyLen ? HEAPU8['slice'](bodyPtr, bodyPtr + bodyLen) : null;
        xhrObj['onload'] = function (event) {
          byteLen = xhrObj['response'] ? xhrObj['response']['byteLength'] : 0x0,
            dataPtr = 0x0,
            dataLen = 0x0;
          loadToMem && !streamData && (dataLen = byteLen, dataPtr = _malloc(dataLen), HEAPU8['set'](new Uint8Array(xhrObj['response']), dataPtr));
          HEAPU32[fetch + 0xc >> 0x2] = dataPtr, Fetch['setu64'](fetch + 0x10, dataLen), Fetch['setu64'](fetch + 0x18, 0x0);
          byteLen && Fetch['setu64'](fetch + 0x20, byteLen);
          HEAPU16[fetch + 0x28 >> 0x1] = xhrObj['readyState'];
          if (xhrObj['readyState'] === 0x4 && xhrObj['status'] === 0x0) {
            if (byteLen > 0x0) xhrObj['status'] = 0xc8;
            else xhrObj['status'] = 0x194;
          }
          HEAPU16[fetch + 0x2a >> 0x1] = xhrObj['status'];
          if (xhrObj['statusText']) stringToUTF8(xhrObj['statusText'], fetch + 0x2c, 0x40);
          if (xhrObj['status'] >= 0xc8 && xhrObj['status'] < 0x12c) {
            if (onSuccess) onSuccess(fetch, xhrObj, event);
          } else {
            if (onError) onError(fetch, xhrObj, event);
          }
        }, xhrObj['onerror'] = function (event) {
          status = xhrObj['status'];
          if (xhrObj['readyState'] === 0x4 && status === 0x0) status = 0x194;
          HEAPU32[fetch + 0xc >> 0x2] = 0x0, Fetch['setu64'](fetch + 0x10, 0x0), Fetch['setu64'](fetch + 0x18, 0x0), Fetch['setu64'](fetch + 0x20, 0x0), HEAPU16[fetch + 0x28 >> 0x1] = xhrObj['readyState'], HEAPU16[fetch + 0x2a >> 0x1] = status;
          if (onError) onError(fetch, xhrObj, event);
        }, xhrObj['ontimeout'] = function (event) {
          if (onError) onError(fetch, xhrObj, event);
        }, xhrObj['onprogress'] = function (progressEvent) {
          chunkLen = loadToMem && streamData && xhrObj['response'] ? xhrObj['response']['byteLength'] : 0x0,
            chunkPtr = 0x0;
          loadToMem && streamData && (chunkPtr = _malloc(chunkLen), HEAPU8['set'](new Uint8Array(xhrObj['response']), chunkPtr));
          HEAPU32[fetch + 0xc >> 0x2] = chunkPtr, Fetch['setu64'](fetch + 0x10, chunkLen), Fetch['setu64'](fetch + 0x18, progressEvent['loaded'] - chunkLen), Fetch['setu64'](fetch + 0x20, progressEvent['total']), HEAPU16[fetch + 0x28 >> 0x1] = xhrObj['readyState'];
          if (xhrObj['readyState'] >= 0x3 && xhrObj['status'] === 0x0 && progressEvent['loaded'] > 0x0) xhrObj['status'] = 0xc8;
          HEAPU16[fetch + 0x2a >> 0x1] = xhrObj['status'];
          if (xhrObj['statusText']) stringToUTF8(xhrObj['statusText'], fetch + 0x2c, 0x40);
          if (onProgress) onProgress(fetch, xhrObj, progressEvent);
        }, xhrObj['onreadystatechange'] = function (event) {
          HEAPU16[fetch + 0x28 >> 0x1] = xhrObj['readyState'];
          xhrObj['readyState'] >= 0x2 && (HEAPU16[fetch + 0x2a >> 0x1] = xhrObj['status']);
          if (onReadyStateChange) onReadyStateChange(fetch, xhrObj, event);
        };
        try {
          xhrObj['send'](bodyData);
        } catch (e) {
          if (onError) onError(fetch, xhrObj, e);
        }
      }

      function __emscripten_fetch_cache_data(db, fetch, data, onSuccess, onError) {
        if (!db) {
          onError(fetch, 0x0, 'IndexedDB 不可用！');
          return;
        }
        var requestStruct = fetch + 0x70,
          urlPtr = HEAPU32[requestStruct + 0x40 >> 0x2];
        if (!urlPtr) urlPtr = HEAPU32[fetch + 0x8 >> 0x2];
        var urlStr = UTF8ToString(urlPtr);
        try {
          var transaction = db['transaction'](['FILES'], 'readwrite'),
            store = transaction['objectStore']('FILES'),
            request = store['put'](data, urlStr);
          request['onsuccess'] = function (event) {
            HEAPU16[fetch + 0x28 >> 0x1] = 0x4, HEAPU16[fetch + 0x2a >> 0x1] = 0xc8, stringToUTF8('OK', fetch + 0x2c, 0x40), onSuccess(fetch, 0x0, urlStr);
          }, request['onerror'] = function (event) {
            HEAPU16[fetch + 0x28 >> 0x1] = 0x4, HEAPU16[fetch + 0x2a >> 0x1] = 0x19d, stringToUTF8('负载过大', fetch + 0x2c, 0x40), onError(fetch, 0x0, event);
          };
        } catch (e) {
          onError(fetch, 0x0, e);
        }
      }

      function __emscripten_fetch_load_cached_data(db, fetch, onSuccess, onError) {
        if (!db) {
          onError(fetch, 0x0, 'IndexedDB 不可用！');
          return;
        }
        var requestStruct = fetch + 0x70,
          urlPtr = HEAPU32[requestStruct + 0x40 >> 0x2];
        if (!urlPtr) urlPtr = HEAPU32[fetch + 0x8 >> 0x2];
        var urlStr = UTF8ToString(urlPtr);
        try {
          var transaction = db['transaction'](['FILES'], 'readonly'),
            store = transaction['objectStore']('FILES'),
            request = store['get'](urlStr);
          request['onsuccess'] = function (event) {
            if (event['target']['result']) {
              var result = event['target']['result'],
                byteLen = result['byteLength'] || result['length'],
                ptr = _malloc(byteLen);
              HEAPU8['set'](new Uint8Array(result), ptr), HEAPU32[fetch + 0xc >> 0x2] = ptr, Fetch['setu64'](fetch + 0x10, byteLen), Fetch['setu64'](fetch + 0x18, 0x0), Fetch['setu64'](fetch + 0x20, byteLen), HEAPU16[fetch + 0x28 >> 0x1] = 0x4, HEAPU16[fetch + 0x2a >> 0x1] = 0xc8, stringToUTF8('OK', fetch + 0x2c, 0x40), onSuccess(fetch, 0x0, result);
            } else HEAPU16[fetch + 0x28 >> 0x1] = 0x4, HEAPU16[fetch + 0x2a >> 0x1] = 0x194, stringToUTF8('未找到', fetch + 0x2c, 0x40), onError(fetch, 0x0, 'no data');
          }, request['onerror'] = function (e) {
            HEAPU16[fetch + 0x28 >> 0x1] = 0x4, HEAPU16[fetch + 0x2a >> 0x1] = 0x194, stringToUTF8('未找到', fetch + 0x2c, 0x40), onError(fetch, 0x0, e);
          };
        } catch (e) {
          onError(fetch, 0x0, e);
        }
      }

      function __emscripten_fetch_delete_cached_data(db, fetch, onSuccess, onError) {
        if (!db) {
          onError(fetch, 0x0, 'IndexedDB 不可用！');
          return;
        }
        var requestStruct = fetch + 0x70,
          urlPtr = HEAPU32[requestStruct + 0x40 >> 0x2];
        if (!urlPtr) urlPtr = HEAPU32[fetch + 0x8 >> 0x2];
        var urlStr = UTF8ToString(urlPtr);
        try {
          var transaction = db['transaction'](['FILES'], 'readwrite'),
            store = transaction['objectStore']('FILES'),
            request = store['delete'](urlStr);
          request['onsuccess'] = function (event) {
            result = event['target']['result'];
            HEAPU32[fetch + 0xc >> 0x2] = 0x0, Fetch['setu64'](fetch + 0x10, 0x0), Fetch['setu64'](fetch + 0x18, 0x0), Fetch['setu64'](fetch + 0x20, 0x0), HEAPU16[fetch + 0x28 >> 0x1] = 0x4, HEAPU16[fetch + 0x2a >> 0x1] = 0xc8, stringToUTF8('OK', fetch + 0x2c, 0x40), onSuccess(fetch, 0x0, result);
          }, request['onerror'] = function (event) {
            HEAPU16[fetch + 0x28 >> 0x1] = 0x4, HEAPU16[fetch + 0x2a >> 0x1] = 0x194, stringToUTF8('未找到', fetch + 0x2c, 0x40), onError(fetch, 0x0, event);
          };
        } catch (e) {
          onError(fetch, 0x0, e);
        }
      }
      var FETCH_WORKER_QUEUE_PTR = 0x6de0;

      function __emscripten_get_fetch_work_queue() {
        return FETCH_WORKER_QUEUE_PTR;
      }

      function _emscripten_is_main_runtime_thread() {
        printError('缺少函数：emscripten_is_main_runtime_thread'), abort(-0x1);
      }

      function _emscripten_start_fetch(fetchPtr, onSuccess, onError, onProgress, onReadyState) {
        if (typeof module !== 'undefined') module['noExitRuntime'] = !![];
        var requestStruct = fetchPtr + 0x70,
          requestType = UTF8ToString(requestStruct),
          successCallback = HEAPU32[requestStruct + 0x24 >> 0x2],
          progressCallback = HEAPU32[requestStruct + 0x28 >> 0x2],
          errorCallback = HEAPU32[requestStruct + 0x2c >> 0x2],
          readyStateCallback = HEAPU32[requestStruct + 0x30 >> 0x2],
          fetchAttributes = HEAPU32[requestStruct + 0x34 >> 0x2],
          loadToMemory = !!(fetchAttributes & 0x1),
          streamData = !!(fetchAttributes & 0x2),
          persistFile = !!(fetchAttributes & 0x4),
          noDownload = !!(fetchAttributes & 0x20),
          isViaIDB = !!(fetchAttributes & 0x8),
          syncXHR = !!(fetchAttributes & 0x10),
          fetchOnSuccess = function (fetch, _xhr, _event) {
            if (successCallback) dynCall_vi(successCallback, fetch);
            else {
              if (onSuccess) onSuccess(fetch);
            }
          },
          fetchOnProgress = function (fetch, _xhr, _event) {
            if (errorCallback) dynCall_vi(errorCallback, fetch);
            else {
              if (onProgress) onProgress(fetch);
            }
          },
          fetchOnError = function (fetch, _xhr, _event) {
            if (progressCallback) dynCall_vi(progressCallback, fetch);
            else {
              if (onError) onError(fetch);
            }
          },
          fetchOnReadyState = function (fetch, _xhr, _event) {
            if (readyStateCallback) dynCall_vi(readyStateCallback, fetch);
            else {
              if (onReadyState) onReadyState(fetch);
            }
          },
          doXHR = function (fetch, _xhr, _event) {
            __emscripten_fetch_xhr(fetch, fetchOnSuccess, fetchOnError, fetchOnProgress, fetchOnReadyState);
          },
          onXHRSuccess = function (fetch, xhr, event) {
            onXHRSuccessInner = function (fetch, _xhr, _event) {
                if (successCallback) dynCall_vi(successCallback, fetch);
                else {
                  if (onSuccess) onSuccess(fetch);
                }
              },
              onXHRSuccessInner2 = function (fetch, _xhr, _event) {
                if (successCallback) dynCall_vi(successCallback, fetch);
                else {
                  if (onSuccess) onSuccess(fetch);
                }
              };
            __emscripten_fetch_cache_data(Fetch['dbInstance'], fetch, xhr['response'], onXHRSuccessInner, onXHRSuccessInner2);
          },
          doXHRAndStore = function (fetch, _xhr, _event) {
            __emscripten_fetch_xhr(fetch, onXHRSuccess, fetchOnError, fetchOnProgress, fetchOnReadyState);
          },
          needsDB = !syncXHR || requestType === 'EM_IDB_STORE' || requestType === 'EM_IDB_DELETE';
        if (needsDB && !Fetch['dbInstance']) return fetchOnError(fetchPtr, 0x0, 'IndexedDB 未打开'), 0x0;
        if (requestType === 'EM_IDB_STORE') {
          var dataPtr = HEAPU32[requestStruct + 0x54 >> 0x2];
          __emscripten_fetch_cache_data(Fetch['dbInstance'], fetchPtr, HEAPU8['slice'](dataPtr, dataPtr + HEAPU32[requestStruct + 0x58 >> 0x2]), fetchOnSuccess, fetchOnError);
        } else {
          if (requestType === 'EM_IDB_DELETE') __emscripten_fetch_delete_cached_data(Fetch['dbInstance'], fetchPtr, fetchOnSuccess, fetchOnError);
          else {
            if (!syncXHR) __emscripten_fetch_load_cached_data(Fetch['dbInstance'], fetchPtr, fetchOnSuccess, noDownload ? fetchOnError : persistFile ? doXHRAndStore : doXHR);
            else {
              if (!noDownload) __emscripten_fetch_xhr(fetchPtr, persistFile ? onXHRSuccess : fetchOnSuccess, fetchOnError, fetchOnProgress, fetchOnReadyState);
              else return 0x0;
            }
          }
        }
        return fetchPtr;
      }

      function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8['set'](HEAPU8['subarray'](src, src + num), dest);
      }

      function ___setErrNo(value) {
        if (module['___errno_location']) HEAP32[module['___errno_location']() >> 0x2] = value;
        return value;
      }

      // 内存无法增长时终止程序
      function abortOnCannotGrowMemory(requestedSize) {
        abort('内存不足');
      }

      function emscripten_realloc_buffer(requestedSize) {
        var pageSize = 0x10000;
        requestedSize = alignUp(requestedSize, pageSize);
        var oldSize = wasmBuffer['byteLength'];
        try {
          var result = wasmMemory['grow']((requestedSize - oldSize) / 0x10000);
          return result !== (-0x1 | 0x0) ? (wasmBuffer = wasmMemory['buffer'], !![]) : ![];
        } catch (e) {
          return ![];
        }
      }

      // 调整 WASM 堆内存大小
      function _emscripten_resize_heap(requestedSize) {
        var currentSize = getHeapSize(),
          pageSize = 0x10000,
          maxHeap = 0x80000000 - pageSize;
        if (requestedSize > maxHeap) return ![];
        var minHeap = 0x1000000,
          newSize = Math['max'](currentSize, minHeap);
        while (newSize < requestedSize) {
          newSize <= 0x20000000 ? newSize = alignUp(0x2 * newSize, pageSize) : newSize = Math['min'](alignUp((0x3 * newSize + 0x80000000) / 0x4, pageSize), maxHeap);
        }
        if (!emscripten_realloc_buffer(newSize)) return ![];
        return updateHeapViews(), !![];
      }
      Fetch['staticInit']();
      var noExitRuntime = ![];

      function jsCall_ii(idx, a1) {
        return FUNCTION_TABLE[idx](a1);
      }

      function jsCall_iidiiii(idx, a1, a2, a3, a4, a5, a6) {
        return FUNCTION_TABLE[idx](a1, a2, a3, a4, a5, a6);
      }

      function jsCall_iiii(idx, a1, a2, a3) {
        return FUNCTION_TABLE[idx](a1, a2, a3);
      }

      function jsCall_jiji(idx, a1, a2, a3) {
        return FUNCTION_TABLE[idx](a1, a2, a3);
      }

      function jsCall_v(idx) {
        FUNCTION_TABLE[idx]();
      }

      function jsCall_vi(idx, a1) {
        FUNCTION_TABLE[idx](a1);
      }

      function jsCall_vii(idx, a1, a2) {
        FUNCTION_TABLE[idx](a1, a2);
      }
      var wasmInfo = {},
        wasmEnv = {
          'abort': abort,
          'setTempRet0': setTempRet0,
          'getTempRet0': getTempRet0,
          'jsCall_ii': jsCall_ii,
          'jsCall_iidiiii': jsCall_iidiiii,
          'jsCall_iiii': jsCall_iiii,
          'jsCall_jiji': jsCall_jiji,
          'jsCall_v': jsCall_v,
          'jsCall_vi': jsCall_vi,
          'jsCall_vii': jsCall_vii,
          '___gxx_personality_v0': ___gxx_personality_v0,
          '___setErrNo': ___setErrNo,
          '___syscall140': ___syscall140,
          '___syscall146': ___syscall146,
          '___syscall54': ___syscall54,
          '___syscall6': ___syscall6,
          '__emscripten_fetch_cache_data': __emscripten_fetch_cache_data,
          '__emscripten_fetch_delete_cached_data': __emscripten_fetch_delete_cached_data,
          '__emscripten_fetch_free': __emscripten_fetch_free,
          '__emscripten_fetch_load_cached_data': __emscripten_fetch_load_cached_data,
          '__emscripten_fetch_xhr': __emscripten_fetch_xhr,
          '__emscripten_get_fetch_work_queue': __emscripten_get_fetch_work_queue,
          '_emscripten_asm_const_ii': emscripten_asm_const_ii,
          '_emscripten_get_heap_size': getHeapSize,
          '_emscripten_is_main_browser_thread': _emscripten_is_main_browser_thread,
          '_emscripten_is_main_runtime_thread': _emscripten_is_main_runtime_thread,
          '_emscripten_memcpy_big': _emscripten_memcpy_big,
          '_emscripten_resize_heap': _emscripten_resize_heap,
          '_emscripten_start_fetch': _emscripten_start_fetch,
          'abortOnCannotGrowMemory': abortOnCannotGrowMemory,
          'demangle': demangle,
          'demangleAll': demangleAll,
          'emscripten_realloc_buffer': emscripten_realloc_buffer,
          'flush_NO_FILESYSTEM': flush_NO_FILESYSTEM,
          'jsStackTrace': jsStackTrace,
          'stackTrace': stackTrace,
          'tempDoublePtr': tempDoublePtr,
          'DYNAMICTOP_PTR': DYNAMICTOP_PTR
        },
        asmExports = module['asm'](wasmInfo, wasmEnv, wasmBuffer);
      module['asm'] = asmExports;
      var _GetAudioARG = module['_GetAudioARG'] = function () {
          return module['asm']['_GetAudioARG']['apply'](null, arguments);
        },
        _GetDecryptAudio = module['_GetDecryptAudio'] = function () {
          return module['asm']['_GetDecryptAudio']['apply'](null, arguments);
        },
        ___errno_location = module['___errno_location'] = function () {
          return module['asm']['___errno_location']['apply'](null, arguments);
        },
        _emscripten_replace_memory = module['_emscripten_replace_memory'] = function () {
          return module['asm']['_emscripten_replace_memory']['apply'](null, arguments);
        },
        _free = module['_free'] = function () {
          return module['asm']['_free']['apply'](null, arguments);
        },
        _jsfree = module['_jsfree'] = function () {
          return module['asm']['_jsfree']['apply'](null, arguments);
        },
        _jsmalloc = module['_jsmalloc'] = function () {
          return module['asm']['_jsmalloc']['apply'](null, arguments);
        },
        _llvm_bswap_i32 = module['_llvm_bswap_i32'] = function () {
          return module['asm']['_llvm_bswap_i32']['apply'](null, arguments);
        },
        _malloc = module['_malloc'] = function () {
          return module['asm']['_malloc']['apply'](null, arguments);
        },
        _memcpy = module['_memcpy'] = function () {
          return module['asm']['_memcpy']['apply'](null, arguments);
        },
        _memmove = module['_memmove'] = function () {
          return module['asm']['_memmove']['apply'](null, arguments);
        },
        _memset = module['_memset'] = function () {
          return module['asm']['_memset']['apply'](null, arguments);
        },
        _nalplay2 = module['_nalplay2'] = function () {
          return module['asm']['_nalplay2']['apply'](null, arguments);
        },
        _sbrk = module['_sbrk'] = function () {
          return module['asm']['_sbrk']['apply'](null, arguments);
        },
        _vodplay = module['_vodplay'] = function () {
          return module['asm']['_vodplay']['apply'](null, arguments);
        },
        establishStackSpace = module['establishStackSpace'] = function () {
          return module['asm']['establishStackSpace']['apply'](null, arguments);
        },
        stackAlloc = module['stackAlloc'] = function () {
          return module['asm']['stackAlloc']['apply'](null, arguments);
        },
        stackRestore = module['stackRestore'] = function () {
          return module['asm']['stackRestore']['apply'](null, arguments);
        },
        stackSave = module['stackSave'] = function () {
          return module['asm']['stackSave']['apply'](null, arguments);
        },
        dynCall_ii = module['dynCall_ii'] = function () {
          return module['asm']['dynCall_ii']['apply'](null, arguments);
        },
        dynCall_iidiiii = module['dynCall_iidiiii'] = function () {
          return module['asm']['dynCall_iidiiii']['apply'](null, arguments);
        },
        dynCall_iiii = module['dynCall_iiii'] = function () {
          return module['asm']['dynCall_iiii']['apply'](null, arguments);
        },
        dynCall_jiji = module['dynCall_jiji'] = function () {
          return module['asm']['dynCall_jiji']['apply'](null, arguments);
        },
        dynCall_v = module['dynCall_v'] = function () {
          return module['asm']['dynCall_v']['apply'](null, arguments);
        },
        dynCall_vi = module['dynCall_vi'] = function () {
          return module['asm']['dynCall_vi']['apply'](null, arguments);
        },
        dynCall_vii = module['dynCall_vii'] = function () {
          return module['asm']['dynCall_vii']['apply'](null, arguments);
        };
      module['asm'] = asmExports, module['addFunction'] = addFunction;
      var wasmReady;
      module['then'] = function (callback) {
        if (wasmReady) callback(module);
        else {
          var oldHandler = module['onRuntimeInitialized'];
          module['onRuntimeInitialized'] = function () {
            if (oldHandler) oldHandler();
            callback(module);
          };
        }
        return module;
      };

      function ExitStatus(status) {
        this['name'] = 'ExitStatus', this['message'] = 'Program terminated with exit(' + status + ')', this['status'] = status;
      }
      dependenciesFulfilled = function checkDependencies() {
        if (!wasmReady) run();
        if (!wasmReady) dependenciesFulfilled = checkDependencies;
      };

      // 主入口：执行预运行钩子，然后启动 WASM 程序
      function run(args) {
        args = args || argv;
        if (runDependencies > 0x0) return;
        preRun();
        if (runDependencies > 0x0) return;

        function doRun() {
          if (wasmReady) return;
          wasmReady = !![];
          if (calledAbort) return;
          initRuntime(), callMain();
          if (module['onRuntimeInitialized']) module['onRuntimeInitialized']();
          postRun();
        }
        module['setStatus'] ? (module['setStatus']('运行中...'), setTimeout(function () {
          setTimeout(function () {
            module['setStatus']('');
          }, 0x1), doRun();
        }, 0x1)) : doRun();
      }
      module['run'] = run;

      // 终止运行：输出错误信息并抛出异常
      function abort(what) {
        module['onAbort'] && module['onAbort'](what);
        what += '', printOutput(what), printError(what), calledAbort = !![], exitCode = 0x1;
        throw '程序中止(' + what + ')。请使用 -s ASSERTIONS=1 编译以获取更多信息。';
      }
      module['abort'] = abort;
      if (module['preInit']) {
        if (typeof module['preInit'] == 'function') module['preInit'] = [module['preInit']];
        while (module['preInit']['length'] > 0x0) {
          module['preInit']['pop']()();
        }
      }
      return module['noExitRuntime'] = !![], run(), moduleOptions;
    };
  }();
if (typeof exports === 'object' && typeof module === 'object') module['exports'] = CNTVModule;
else {
  if (typeof define === 'function' && define['amd']) define([], function () {
    return CNTVModule;
  });
  else {
    if (typeof exports === 'object') exports['CNTVModule'] = CNTVModule;
  }
}
var LiveAudio2 = function (audioElement) {
  'use strict';
  var loudspeakerAudioChainUnused = {},
    headsetAudioChain = {},
    loudspeakerAudioChain = {},
    gainSettings = {},
    isCrossAudio = !![],
    audioContext, sourceNode, getBrowserInfo = function () {
      var browserInfo = new Object();
      return browserInfo['isMozilla'] = typeof document['implementation'] != 'undefined' && typeof document['implementation']['createDocument'] != 'undefined' && typeof HTMLDocument != 'undefined', browserInfo['isIE'] = window['ActiveXObject'] ? !![] : ![], browserInfo['isFirefox'] = navigator['userAgent']['toLowerCase']()['indexOf']('firefox') != -0x1, browserInfo['isSafari'] = navigator['userAgent']['toLowerCase']()['indexOf']('safari') != -0x1 && navigator['userAgent']['toLowerCase']()['indexOf']('chrome') == -0x1, browserInfo['isOpera'] = navigator['userAgent']['toLowerCase']()['indexOf']('opera') != -0x1, browserInfo['isMicromessenger'] = navigator['userAgent']['toLowerCase']()['indexOf']('micromessenger') != -0x1, browserInfo['isChrome'] = navigator['userAgent']['toLowerCase']()['indexOf']('chrome') != -0x1, console['log'](navigator['userAgent']), browserInfo;
    },
    initAudioContext = function (audioElement) {
      if (audioContext) return;
      try {
        var browserInfo = getBrowserInfo();
        browserInfo['isFirefox'] ? (console['log']('是 Firefox 浏览器'), gainSettings['louderSpeakerGain'] = 0x1, gainSettings['headSetGain'] = 1.5) : (gainSettings['louderSpeakerGain'] = 1.8, gainSettings['headSetGain'] = 0x2), audioContext = new(window[('AudioContext')] || window[('webkitAudioContext')])(), sourceNode = audioContext['createMediaElementSource'](audioElement), sourceNode['connect'](audioContext['destination']);
      } catch (e) {
        console['log'](e);
      }
      return;
    };
  this['connectDestLoudspeaker'] = function () {
    try {
      disconnectLoudspeaker();
      if (loudspeakerAudioChain && loudspeakerAudioChain['masterFirst']) {
        sourceNode['connect'](loudspeakerAudioChain['masterFirst']), loudspeakerAudioChain['masterEnd']['connect'](audioContext['destination']);
        return;
      }
      loudspeakerAudioChain['masterEnd'] = audioContext['createGain'](), loudspeakerAudioChain['masterFirst'] = audioContext['createGain'](), loudspeakerAudioChain['masterFirst']['connect'](loudspeakerAudioChain['masterEnd']), buildLoudspeakerPath(loudspeakerAudioChain['masterFirst'], loudspeakerAudioChain['masterEnd']), buildLoudspeakerPathWithSwappedChannels(loudspeakerAudioChain['masterFirst'], loudspeakerAudioChain['masterEnd']), sourceNode['connect'](loudspeakerAudioChain['masterFirst']), loudspeakerAudioChain['masterEnd']['connect'](audioContext['destination']);
    } catch (e) {
      console['log'](e);
    }
  }, this['connectDestHeadset'] = function () {
    try {
      disconnectHeadset();
      if (headsetAudioChain['masterFirst'] && headsetAudioChain['masterEnd']) {
        sourceNode['connect'](headsetAudioChain['masterFirst']), headsetAudioChain['masterEnd']['connect'](audioContext['destination']);
        return;
      }
      var masterFirstGain = audioContext['createGain'](),
        wetGain = audioContext['createGain'](),
        postConvolverGain = audioContext['createGain'](),
        dryGain = audioContext['createGain'](),
        postDryConvolverGain = audioContext['createGain'](),
        masterEndGain = audioContext['createGain']();
      headsetAudioChain['masterFirst'] = masterFirstGain, headsetAudioChain['masterEnd'] = masterEndGain, sourceNode['connect'](masterFirstGain), dryGain['gain']['value'] = 0.4, wetGain['gain']['value'] = 0.4, masterFirstGain['connect'](wetGain), buildHeadsetPathWithMonoConvolver(wetGain, postConvolverGain), postConvolverGain['connect'](masterEndGain), masterFirstGain['connect'](dryGain), buildHeadsetPathWithStereoConvolver(dryGain, postDryConvolverGain), postDryConvolverGain['connect'](masterEndGain), masterEndGain['connect'](audioContext['destination']);
    } catch (e) {
      console['log'](e);
    }
  };

  // 构建耳机音频路径（立体声卷积混响）
  function buildHeadsetPathWithStereoConvolver(inputNode, outputNode) {
    var leftGain = audioContext['createGain'](),
      rightGain = audioContext['createGain'](),
      gainNode = audioContext['createGain'](),
      convolver = audioContext['createConvolver']();
    inputNode['connect'](gainNode);
    var splitter = audioContext['createChannelSplitter'](0x2),
      merger = audioContext['createChannelMerger'](0x2);
    inputNode['connect'](splitter), splitter['connect'](leftGain, 0x0), splitter['connect'](rightGain, 0x1), leftGain['connect'](merger, 0x0, 0x1), rightGain['connect'](merger, 0x0, 0x0), merger['connect'](outputNode);
    try {
      var audioData = getDecryptedAudioBuffer();
      audioContext['decodeAudioData'](audioData, function (buffer) {
        convolver['buffer'] = buffer;
        var leftChannel = buffer['getChannelData'](0x0),
          rightChannel = buffer['getChannelData'](0x1);
        for (var i = 0x0; i < leftChannel['length']; i++) {
          leftChannel[i] = rightChannel[i];
        }
        convolver['loop'] = ![], convolver['normalize'] = !![], gainNode['gain']['value'] = gainSettings['headSetGain'], gainNode['connect'](convolver), convolver['connect'](outputNode);
      }, function (err) {
        console.warn('解码音频数据时出错', err['err']);
      });
    } catch (e) {
      console['log'](e);
    }
  }

  // 构建耳机音频路径（单声道卷积混响）
  function buildHeadsetPathWithMonoConvolver(inputNode, outputNode) {
    var dryGain = audioContext['createGain'](),
      wetGain = audioContext['createGain'](),
      convolver = audioContext['createConvolver']();
    inputNode['connect'](wetGain), inputNode['connect'](dryGain), dryGain['connect'](outputNode);
    try {
      var audioData = getDecryptedAudioBuffer();
      audioContext['decodeAudioData'](audioData, function (buffer) {
        convolver['buffer'] = buffer;
        var leftChannel = buffer['getChannelData'](0x0),
          rightChannel = buffer['getChannelData'](0x1);
        for (var i = 0x0; i < leftChannel['length']; i++) {
          rightChannel[i] = leftChannel[i];
        }
        convolver['loop'] = ![], convolver['normalize'] = !![], wetGain['gain']['value'] = gainSettings['headSetGain'], wetGain['connect'](convolver), convolver['connect'](outputNode);
      }, function (err) {
        console.warn('解码音频数据时出错', err['err']);
      });
    } catch (e) {
      console['log'](e);
    }
  }

  // 构建扬声器音频路径（带卷积混响）
  function buildLoudspeakerPath(inputNode, outputNode) {
    var gainNode = audioContext['createGain'](),
      convolver = audioContext['createConvolver']();
    inputNode['connect'](gainNode);
    try {
      var audioData = getDecryptedAudioBuffer();
      audioContext['decodeAudioData'](audioData, function (buffer) {
        convolver['buffer'] = buffer, convolver['loop'] = ![], convolver['normalize'] = !![], gainNode['gain']['value'] = gainSettings['louderSpeakerGain'], gainNode['connect'](convolver), convolver['connect'](outputNode);
      }, function (err) {
        console.warn('解码音频数据时出错', err['err']);
      });
    } catch (e) {
      console['log'](e);
    }
  }

  // 构建扬声器音频路径（左右声道互换）
  function buildLoudspeakerPathWithSwappedChannels(inputNode, outputNode) {
    var gainNode = audioContext['createGain'](),
      convolver = audioContext['createConvolver']();
    inputNode['connect'](gainNode);
    try {
      var audioData = getDecryptedAudioBuffer();
      audioContext['decodeAudioData'](audioData, function (buffer) {
        leftChannel = buffer['getChannelData'](0x0),
          rightChannel = buffer['getChannelData'](0x1),
          temp;
        for (var i = 0x0; i < leftChannel['length']; i++) {
          temp = leftChannel[i], leftChannel[i] = rightChannel[i], rightChannel[i] = temp;
        }
        convolver['buffer'] = buffer, convolver['loop'] = ![], convolver['normalize'] = !![], gainNode['gain']['value'] = gainSettings['louderSpeakerGain'], gainNode['connect'](convolver), convolver['connect'](outputNode);
      }, function (err) {
        console.warn('解码音频数据时出错', err['err']);
      });
    } catch (e) {
      console['log'](e);
    }
  }

  // 从 WASM 模块获取解密后的音频缓冲区
  function getDecryptedAudioBuffer() {
    var bufSize = 0x249f0,
      bufPtr, decryptedSize;
    try {
      bufPtr = CNTVH5PlayerModule['_jsmalloc'](bufSize + 0x80), decryptedSize = CNTVH5PlayerModule['_GetDecryptAudio'](bufPtr, bufSize);
      let byteArray = new Uint8Array(decryptedSize);
      for (let i = 0x0; i < decryptedSize; i++) {
        byteArray[i] = CNTVH5PlayerModule['HEAP8'][bufPtr + i];
      }
      let arrayBuffer = byteArray['buffer'];
      return CNTVH5PlayerModule['_jsfree'](arrayBuffer), arrayBuffer;
    } catch (e) {
      console['log']('ee:', e);
    }
    return CNTVH5PlayerModule['_jsfree'](bufPtr), null;
  }
  var reconnect = function () {
    if (!sourceNode) return;
    sourceNode['disconnect'](), /* 注意：connectDest1() 未定义，此处为原始代码预存 bug */ connectDest1();
  };

  // 断开扬声器音频链
  function disconnectLoudspeaker() {
    sourceNode['disconnect'](), headsetAudioChain && headsetAudioChain['masterEnd'] && headsetAudioChain['masterEnd']['disconnect']();
  }

  // 断开耳机音频链
  function disconnectHeadset() {
    sourceNode['disconnect'](), loudspeakerAudioChain && loudspeakerAudioChain['masterEnd'] && loudspeakerAudioChain['masterEnd']['disconnect']();
  }

  // 将源节点直接连接到 AudioContext 目标（扬声器输出）
  function connectToDestination() {
    sourceNode['connect'](audioContext['destination']);
  }
  this['dislinkerDest'] = function () {
    if (!sourceNode) return;
    disconnectLoudspeaker(), disconnectHeadset(), sourceNode['connect'](audioContext['destination']);
  }, initAudioContext(audioElement), this['isCrossAudio'] = isCrossAudio, this['getBrowser'] = function () {
    return getBrowserInfo();
  };
  return;
}; /*2022-12-12 16:21:23 399895fca906b0ccd3b7fb6d20e791bf*/ ;
console.debug('Woker_BTime:', '2022-12-12 16:21:23');