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
    var _noop = noopFn,
      currentScriptSrc = typeof document !== 'undefined' && document['currentScript'] ? document['currentScript']['src'] : undefined;
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
        quit = function (_0x3a96a3, _0x2e80db) {
          throw _0x2e80db;
        },
        isWindow = ![],
        isWorker = ![],
        isNode = ![],
        isNodeProcess = ![],
        isShell = ![];
      isWindow = typeof window === 'object', isWorker = typeof importScripts === 'function', isNodeProcess = typeof process === 'object' && typeof process['versions'] === 'object' && typeof process['versions']['node'] === 'string', isNode = isNodeProcess && !isWindow && !isWorker, isShell = !isWindow && !isNode && !isWorker;
      var scriptDirectory = '';

      // 定位文件路径：优先使用 module.locateFile，否则拼接 scriptDirectory
      function locateFile(_0x129729) {
        if (module['locateFile']) return module['locateFile'](_0x129729, scriptDirectory);
        return scriptDirectory + _0x129729;
      }
      var readFile, readFileAsync, readBinary, setWindowTitle;
      if (isNode) {
        scriptDirectory = __dirname + '/';
        var fsModule, pathModule;
        readFile = function _0x5af7fc(_0x1d9af9, _0x2400a1) {
          var _0x160f7a;
          if (!fsModule) fsModule = require('fs');
          if (!pathModule) pathModule = require('path');
          return _0x1d9af9 = pathModule['normalize'](_0x1d9af9), _0x160f7a = fsModule['readFileSync'](_0x1d9af9), _0x2400a1 ? _0x160f7a : _0x160f7a['toString']();
        }, readBinary = function _0x210d0e(_0x25e963) {
          var _0x2be87b = readFile(_0x25e963, !![]);
          return !_0x2be87b['buffer'] && (_0x2be87b = new Uint8Array(_0x2be87b)), assert(_0x2be87b['buffer']), _0x2be87b;
        }, process['argv']['length'] > 0x1 && (thisProgram = process['argv'][0x1]['replace'](/\\/g, '/')), argv = process['argv']['slice'](0x2), process['on']('uncaughtException', function (_0x59d10c) {
          if (!(_0x59d10c instanceof ExitStatus)) throw _0x59d10c;
        }), process['on']('unhandledRejection', abort), quit = function (_0x534e24) {
          process['exit'](_0x534e24);
        }, module['inspect'] = function () {
          return '[Emscripten 模块对象]';
        };
      } else {
        if (isShell) {
          typeof read != 'undefined' && (readFile = function _0x19436f(_0x592ec5) {
            return read(_0x592ec5);
          });
          readBinary = function _0x41773d(_0x27bebd) {
            var _0x31b508;
            if (typeof readbuffer === 'function') return new Uint8Array(readbuffer(_0x27bebd));
            return _0x31b508 = read(_0x27bebd, 'binary'), assert(typeof _0x31b508 === 'object'), _0x31b508;
          };
          if (typeof scriptArgs != 'undefined') argv = scriptArgs;
          else typeof arguments != 'undefined' && (argv = arguments);
          typeof quit === 'function' && (quit = function (_0x919921) {
            quit(_0x919921);
          });
          if (typeof print !== 'undefined') {
            if (typeof console === 'undefined') console = {};
            console['log'] = print, console['warn'] = console['error'] = typeof printErr !== 'undefined' ? printErr : print;
          }
        } else {
          if (isWindow || isWorker) {
            if (isWorker) scriptDirectory = self['location']['href'];
            else document['currentScript'] && (scriptDirectory = document['currentScript']['src']);
            currentScriptSrc && (scriptDirectory = currentScriptSrc), scriptDirectory['indexOf']('blob:') !== 0x0 ? scriptDirectory = scriptDirectory['substr'](0x0, scriptDirectory['lastIndexOf']('/') + 0x1) : scriptDirectory = '', readFile = function _0x37f3c6(_0x36112d) {
              var _0x4f8753 = new XMLHttpRequest();
              return _0x4f8753['open']('GET', _0x36112d, ![]), _0x4f8753['send'](null), _0x4f8753['responseText'];
            }, isWorker && (readBinary = function _0x4928a9(_0xa661bf) {
              var _0x1bcdbf = new XMLHttpRequest();
              return _0x1bcdbf['open']('GET', _0xa661bf, ![]), _0x1bcdbf['responseType'] = 'arraybuffer', _0x1bcdbf['send'](null), new Uint8Array(_0x1bcdbf['response']);
            }), readFileAsync = function _0x5d2ed2(_0x29b105, _0x15c914, _0x40e73d) {
              var _0x165a32 = new XMLHttpRequest();
              _0x165a32['open']('GET', _0x29b105, !![]), _0x165a32['responseType'] = 'arraybuffer', _0x165a32['onload'] = function _0x31fddd() {
                var _0x49c92f = _0x5344b7;
                if (_0x165a32['status'] == 0xc8 || _0x165a32['status'] == 0x0 && _0x165a32['response']) {
                  _0x15c914(_0x165a32['response']);
                  return;
                }
                _0x40e73d();
              }, _0x165a32['onerror'] = _0x40e73d, _0x165a32['send'](null);
            }, setWindowTitle = function (_0x1ad244) {
              document['title'] = _0x1ad244;
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
      function dynamicAlloc(_0x4a147d) {
        var _0x5ec9b3 = HEAP32[DYNAMICTOP_PTR >> 0x2],
          _0x122b80 = _0x5ec9b3 + _0x4a147d + 0xf & -0x10;
        return _0x122b80 > getHeapSize() && abort(), HEAP32[DYNAMICTOP_PTR >> 0x2] = _0x122b80, _0x5ec9b3;
      }

      function getNativeTypeSize(_0x4ea24b) {
        switch (_0x4ea24b) {
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
          if (_0x4ea24b[_0x4ea24b['length'] - 0x1] === '*') return 0x4;
          else {
            if (_0x4ea24b[0x0] === 'i') {
              var _0x181dfd = parseInt(_0x4ea24b['substr'](0x1));
              return assert(_0x181dfd % 0x8 === 0x0, 'getNativeTypeSize 无效的位数 ' + _0x181dfd + ', type ' + _0x4ea24b), _0x181dfd / 0x8;
            } else return 0x0;
          }
        }
        }
      }

      function warnOnce(_0x239ed4) {
        if (!warnOnce['shown']) warnOnce['shown'] = {};
        !warnOnce['shown'][_0x239ed4] && (warnOnce['shown'][_0x239ed4] = 0x1, printError(_0x239ed4));
      }
      var asm2wasmImports = {
          'f64-rem': function (_0x5f1019, _0x427d14) {
            return _0x5f1019 % _0x427d14;
          },
          'debugger': function () {}
        },
        RESERVED_FUNCTION_POINTERS_START = 0x1,
        FUNCTION_TABLE = new Array(0xe);

      // 创建动态函数调用包装器
      function makeDynCall(_0x2abfa7, _0x2d534e) {
        var _0x2c2f75 = [0x1, 0x0, 0x1, 0x60],
          _0x2d3486 = _0x2d534e['slice'](0x0, 0x1),
          _0x57e4e4 = _0x2d534e['slice'](0x1),
          _0xeb2ba7 = {
            'i': 0x7f,
            'j': 0x7e,
            'f': 0x7d,
            'd': 0x7c
          };
        _0x2c2f75['push'](_0x57e4e4['length']);
        for (var _0x130d98 = 0x0; _0x130d98 < _0x57e4e4['length']; ++_0x130d98) {
          _0x2c2f75['push'](_0xeb2ba7[_0x57e4e4[_0x130d98]]);
        }
        _0x2d3486 == 'v' ? _0x2c2f75['push'](0x0) : _0x2c2f75 = _0x2c2f75['concat']([0x1, _0xeb2ba7[_0x2d3486]]);
        _0x2c2f75[0x1] = _0x2c2f75['length'] - 0x2;
        var _0x4b9675 = new Uint8Array([0x0, 0x61, 0x73, 0x6d, 0x1, 0x0, 0x0, 0x0]['concat'](_0x2c2f75, [0x2, 0x7, 0x1, 0x1, 0x65, 0x1, 0x66, 0x0, 0x0, 0x7, 0x5, 0x1, 0x1, 0x66, 0x0, 0x0])),
          _0xc43240 = new WebAssembly['Module'](_0x4b9675),
          _0x21b4e3 = new WebAssembly[('Instance')](_0xc43240, {
            'e': {
              'f': _0x2abfa7
            }
          }),
          _0x1fcf11 = _0x21b4e3['exports']['f'];
        return _0x1fcf11;
      }

      // 向函数表添加函数并返回其索引
      function addFunction(_0x48677a, _0x4e48ce) {
        var _0x449238 = 0x0;
        for (var _0x349b50 = _0x449238; _0x349b50 < _0x449238 + 0xe; _0x349b50++) {
          if (!FUNCTION_TABLE[_0x349b50]) return FUNCTION_TABLE[_0x349b50] = _0x48677a, RESERVED_FUNCTION_POINTERS_START + _0x349b50;
        }
        throw '已用尽所有保留函数指针，请增大 RESERVED_FUNCTION_POINTERS 的值。';
      }
      var resolvedFunctions = {};

      function dynCall(_0x3cc89e, _0x45dc1e, _0xd2789c) {
        return _0xd2789c && _0xd2789c['length'] ? module['dynCall_' + _0x3cc89e]['apply'](null, [_0x45dc1e]['concat'](_0xd2789c)) : module['dynCall_' + _0x3cc89e]['call'](null, _0x45dc1e);
      }
      var tempRet0 = 0x0,
        setTempRet0 = function (_0x5c84ed) {
          tempRet0 = _0x5c84ed;
        },
        getTempRet0 = function () {
          return tempRet0;
        },
        wasmBinary;
      if (module['wasmBinary']) wasmBinary = module['wasmBinary'];
      typeof WebAssembly !== 'object' && printError('未检测到原生 WebAssembly 支持');

      function setValue(_0x9711f3, _0x813c9f, _0x1a3522, _0x4794ba) {
        _0x1a3522 = _0x1a3522 || 'i8';
        if (_0x1a3522['charAt'](_0x1a3522['length'] - 0x1) === '*') _0x1a3522 = 'i32';
        switch (_0x1a3522) {
        case 'i1':
          HEAP8[_0x9711f3 >> 0x0] = _0x813c9f;
          break;
        case 'i8':
          HEAP8[_0x9711f3 >> 0x0] = _0x813c9f;
          break;
        case 'i16':
          HEAP16[_0x9711f3 >> 0x1] = _0x813c9f;
          break;
        case 'i32':
          HEAP32[_0x9711f3 >> 0x2] = _0x813c9f;
          break;
        case 'i64':
          tempI64 = [_0x813c9f >>> 0x0, (_0x2f9712 = _0x813c9f, +Math_abs(_0x2f9712) >= 0x1 ? _0x2f9712 > 0x0 ? (Math_min(+Math_floor(_0x2f9712 / 0x100000000), 0xffffffff) | 0x0) >>> 0x0 : ~~+Math_ceil((_0x2f9712 - +(~~_0x2f9712 >>> 0x0)) / 0x100000000) >>> 0x0 : 0x0)], HEAP32[_0x9711f3 >> 0x2] = tempI64[0x0], HEAP32[_0x9711f3 + 0x4 >> 0x2] = tempI64[0x1];
          break;
        case 'float':
          HEAPF32[_0x9711f3 >> 0x2] = _0x813c9f;
          break;
        case 'double':
          HEAPF64[_0x9711f3 >> 0x3] = _0x813c9f;
          break;
        default:
          abort('invalid\x20type\x20for\x20setValue:\x20' + _0x1a3522);
        }
      }
      var wasmMemory, wasmTable, calledAbort = ![],
        exitCode = 0x0;

      // 断言工具：条件为假时抛出错误
      function assert(_0x40f1a2, _0x2ca63a) {
        !_0x40f1a2 && abort('断言失败：' + _0x2ca63a);
      }

      function getCFunc(_0x2b7bc3) {
        var _0x3899b0 = module['_' + _0x2b7bc3];
        return assert(_0x3899b0, 'Cannot\x20call\x20unknown\x20function\x20' + _0x2b7bc3 + ', make sure it is exported'), _0x3899b0;
      }

      function ccall(_0x59dcf6, _0x3d39e3, _0x475a79, _0x148a0a, _0x1dd0f4) {
        var _0x5da9b5 = {
          'string': function (_0x28a5b9) {
            var _0x1942e7 = 0x0;
            if (_0x28a5b9 !== null && _0x28a5b9 !== undefined && _0x28a5b9 !== 0x0) {
              var _0x25999d = (_0x28a5b9['length'] << 0x2) + 0x1;
              _0x1942e7 = stackAlloc(_0x25999d), stringToUTF8(_0x28a5b9, _0x1942e7, _0x25999d);
            }
            return _0x1942e7;
          },
          'array': function (_0xdd9b99) {
            var _0xca6a4b = stackAlloc(_0xdd9b99['length']);
            return writeArrayToMemory(_0xdd9b99, _0xca6a4b), _0xca6a4b;
          }
        };

        function _0x4a7d8c(_0x1c7d52) {
          if (_0x3d39e3 === 'string') return UTF8ToString(_0x1c7d52);
          if (_0x3d39e3 === 'boolean') return Boolean(_0x1c7d52);
          return _0x1c7d52;
        }
        var _0x3bccbe = getCFunc(_0x59dcf6),
          _0x12d6e9 = [],
          _0x1422e3 = 0x0;
        if (_0x148a0a)
          for (var _0x19f624 = 0x0; _0x19f624 < _0x148a0a['length']; _0x19f624++) {
            var _0x12f5bd = _0x5da9b5[_0x475a79[_0x19f624]];
            if (_0x12f5bd) {
              if (_0x1422e3 === 0x0) _0x1422e3 = stackSave();
              _0x12d6e9[_0x19f624] = _0x12f5bd(_0x148a0a[_0x19f624]);
            } else _0x12d6e9[_0x19f624] = _0x148a0a[_0x19f624];
          }
        var _0x37b5b2 = _0x3bccbe['apply'](null, _0x12d6e9);
        _0x37b5b2 = _0x4a7d8c(_0x37b5b2);
        if (_0x1422e3 !== 0x0) stackRestore(_0x1422e3);
        return _0x37b5b2;
      }
      var UTF8_DECODER_THRESHOLD = 0x3,
        UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

      // 将 Uint8Array 转换为 UTF-8 字符串
      function UTF8ArrayToString(_0x22d30f, _0xd2b46e, _0x1382bd) {
        var _0x346b2a = _0xd2b46e + _0x1382bd,
          _0x31dca8 = _0xd2b46e;
        while (_0x22d30f[_0x31dca8] && !(_0x31dca8 >= _0x346b2a)) ++_0x31dca8;
        if (_0x31dca8 - _0xd2b46e > 0x10 && _0x22d30f['subarray'] && UTF8Decoder) return UTF8Decoder['decode'](_0x22d30f['subarray'](_0xd2b46e, _0x31dca8));
        else {
          var _0x18f0f4 = '';
          while (_0xd2b46e < _0x31dca8) {
            var _0x5a82af = _0x22d30f[_0xd2b46e++];
            if (!(_0x5a82af & 0x80)) {
              _0x18f0f4 += String['fromCharCode'](_0x5a82af);
              continue;
            }
            var _0x27d2b6 = _0x22d30f[_0xd2b46e++] & 0x3f;
            if ((_0x5a82af & 0xe0) == 0xc0) {
              _0x18f0f4 += String['fromCharCode']((_0x5a82af & 0x1f) << 0x6 | _0x27d2b6);
              continue;
            }
            var _0x4769dd = _0x22d30f[_0xd2b46e++] & 0x3f;
            (_0x5a82af & 0xf0) == 0xe0 ? _0x5a82af = (_0x5a82af & 0xf) << 0xc | _0x27d2b6 << 0x6 | _0x4769dd : _0x5a82af = (_0x5a82af & 0x7) << 0x12 | _0x27d2b6 << 0xc | _0x4769dd << 0x6 | _0x22d30f[_0xd2b46e++] & 0x3f;
            if (_0x5a82af < 0x10000) _0x18f0f4 += String['fromCharCode'](_0x5a82af);
            else {
              var _0xc4b60c = _0x5a82af - 0x10000;
              _0x18f0f4 += String['fromCharCode'](0xd800 | _0xc4b60c >> 0xa, 0xdc00 | _0xc4b60c & 0x3ff);
            }
          }
        }
        return _0x18f0f4;
      }

      // 将 WASM 内存中的 UTF-8 C 字符串转换为 JS 字符串
      function UTF8ToString(_0x1d64c0, _0x2b4778) {
        return _0x1d64c0 ? UTF8ArrayToString(HEAPU8, _0x1d64c0, _0x2b4778) : '';
      }

      // 将 JS 字符串编码为 UTF-8 并写入字节数组
      function stringToUTF8Array(_0xe54df2, _0x5404c7, _0x31281e, _0xdccb90) {
        if (!(_0xdccb90 > 0x0)) return 0x0;
        var _0x584cc7 = _0x31281e,
          _0xc55b17 = _0x31281e + _0xdccb90 - 0x1;
        for (var _0xac2339 = 0x0; _0xac2339 < _0xe54df2['length']; ++_0xac2339) {
          var _0x2d15b5 = _0xe54df2['charCodeAt'](_0xac2339);
          if (_0x2d15b5 >= 0xd800 && _0x2d15b5 <= 0xdfff) {
            var _0x52c354 = _0xe54df2['charCodeAt'](++_0xac2339);
            _0x2d15b5 = 0x10000 + ((_0x2d15b5 & 0x3ff) << 0xa) | _0x52c354 & 0x3ff;
          }
          if (_0x2d15b5 <= 0x7f) {
            if (_0x31281e >= _0xc55b17) break;
            _0x5404c7[_0x31281e++] = _0x2d15b5;
          } else {
            if (_0x2d15b5 <= 0x7ff) {
              if (_0x31281e + 0x1 >= _0xc55b17) break;
              _0x5404c7[_0x31281e++] = 0xc0 | _0x2d15b5 >> 0x6, _0x5404c7[_0x31281e++] = 0x80 | _0x2d15b5 & 0x3f;
            } else {
              if (_0x2d15b5 <= 0xffff) {
                if (_0x31281e + 0x2 >= _0xc55b17) break;
                _0x5404c7[_0x31281e++] = 0xe0 | _0x2d15b5 >> 0xc, _0x5404c7[_0x31281e++] = 0x80 | _0x2d15b5 >> 0x6 & 0x3f, _0x5404c7[_0x31281e++] = 0x80 | _0x2d15b5 & 0x3f;
              } else {
                if (_0x31281e + 0x3 >= _0xc55b17) break;
                _0x5404c7[_0x31281e++] = 0xf0 | _0x2d15b5 >> 0x12, _0x5404c7[_0x31281e++] = 0x80 | _0x2d15b5 >> 0xc & 0x3f, _0x5404c7[_0x31281e++] = 0x80 | _0x2d15b5 >> 0x6 & 0x3f, _0x5404c7[_0x31281e++] = 0x80 | _0x2d15b5 & 0x3f;
              }
            }
          }
        }
        return _0x5404c7[_0x31281e] = 0x0, _0x31281e - _0x584cc7;
      }

      function stringToUTF8(_0x3f04ff, _0x139cee, _0x48706e) {
        return stringToUTF8Array(_0x3f04ff, HEAPU8, _0x139cee, _0x48706e);
      }

      function lengthBytesUTF8(_0x22a7c7) {
        var _0x2aec48 = 0x0;
        for (var _0x1e9db5 = 0x0; _0x1e9db5 < _0x22a7c7['length']; ++_0x1e9db5) {
          var _0x1906a8 = _0x22a7c7['charCodeAt'](_0x1e9db5);
          if (_0x1906a8 >= 0xd800 && _0x1906a8 <= 0xdfff) _0x1906a8 = 0x10000 + ((_0x1906a8 & 0x3ff) << 0xa) | _0x22a7c7['charCodeAt'](++_0x1e9db5) & 0x3ff;
          if (_0x1906a8 <= 0x7f) ++_0x2aec48;
          else {
            if (_0x1906a8 <= 0x7ff) _0x2aec48 += 0x2;
            else {
              if (_0x1906a8 <= 0xffff) _0x2aec48 += 0x3;
              else _0x2aec48 += 0x4;
            }
          }
        }
        return _0x2aec48;
      }
      var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

      function writeArrayToMemory(_0x3a94c7, _0x21d71d) {
        HEAP8['set'](_0x3a94c7, _0x21d71d);
      }

      function writeAsciiToMemory(_0x24d2ef, _0x34121b, _0x22250b) {
        for (var _0x327697 = 0x0; _0x327697 < _0x24d2ef['length']; ++_0x327697) {
          HEAP8[_0x34121b++ >> 0x0] = _0x24d2ef['charCodeAt'](_0x327697);
        }
        if (!_0x22250b) HEAP8[_0x34121b >> 0x0] = 0x0;
      }
      var PAGE_SIZE = 0x10000;

      function alignUp(_0x5510c0, _0x286fe1) {
        return _0x5510c0 % _0x286fe1 > 0x0 && (_0x5510c0 += _0x286fe1 - _0x5510c0 % _0x286fe1), _0x5510c0;
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
      function callRuntimeCallbacks(_0x11951f) {
        while (_0x11951f['length'] > 0x0) {
          var _0x49d678 = _0x11951f['shift']();
          if (typeof _0x49d678 == 'function') {
            _0x49d678();
            continue;
          }
          var _0x52e09c = _0x49d678['func'];
          typeof _0x52e09c === 'number' ? _0x49d678['arg'] === undefined ? module['dynCall_v'](_0x52e09c) : module['dynCall_vi'](_0x52e09c, _0x49d678['arg']) : _0x52e09c(_0x49d678['arg'] === undefined ? null : _0x49d678['arg']);
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

      function addOnPreRun(_0xb7465f) {
        __ATPRERUN__['unshift'](_0xb7465f);
      }

      function addOnPostRun(_0x4e407b) {
        __ATPOSTRUN__['unshift'](_0x4e407b);
      }
      var Math_abs = Math['abs'],
        Math_ceil = Math['ceil'],
        Math_floor = Math['floor'],
        Math_min = Math['min'],
        runDependencies = 0x0,
        runDependencyWatcher = null,
        dependenciesFulfilled = null;

      // 增加运行依赖计数，防止在依赖加载完成前启动
      function addRunDependency(_0x3c33e1) {
        runDependencies++, module['monitorRunDependencies'] && module['monitorRunDependencies'](runDependencies);
      }

      // 减少运行依赖计数，计数归零后触发启动
      function removeRunDependency(_0x27f158) {
        runDependencies--;
        module['monitorRunDependencies'] && module['monitorRunDependencies'](runDependencies);
        if (runDependencies == 0x0) {
          runDependencyWatcher !== null && (clearInterval(runDependencyWatcher), runDependencyWatcher = null);
          if (dependenciesFulfilled) {
            var _0x156024 = dependenciesFulfilled;
            dependenciesFulfilled = null, _0x156024();
          }
        }
      }
      module['preloadedImages'] = {}, module['preloadedAudios'] = {};
      var DATA_URI_PREFIX = 'data:application/octet-stream;base64,';

      function isDataURI(_0x34f53) {
        return String['prototype']['startsWith'] ? _0x34f53['startsWith'](DATA_URI_PREFIX) : _0x34f53['indexOf'](DATA_URI_PREFIX) === 0x0;
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
        } catch (_0x4a4762) {
          abort(_0x4a4762);
        }
      }

      // 获取 WASM 二进制数据（优先使用预加载的 ArrayBuffer）
      function getBinaryPromise() {
        if (!wasmBinary && typeof fetch === 'function') return fetch(wasmBinaryFile, {
          'credentials': 'same-origin'
        })['then'](function (_0x1eb6a7) {
          var _0x5dbbf1 = _0xb12534;
          if (!_0x1eb6a7['ok']) throw '加载 WASM 二进制文件失败：' + wasmBinaryFile + '\x27';
          return _0x1eb6a7['arrayBuffer']();
        })['catch'](function () {
          return getBinary();
        });
        return new Promise(function (_0x48a039, _0x52d33a) {
          _0x48a039(getBinary());
        });
      }

      // 创建并初始化 WASM 实例
      function createWasm(_0x5945cb) {
        var _0x44feaa = {
          'env': _0x5945cb,
          'global': {
            'NaN': NaN,
            'Infinity': Infinity
          },
          'global.Math': Math,
          'asm2wasm': asm2wasmImports
        };

        function _0x3f28f3(_0x4b266f, _0x496503) {
          var _0x374461 = _0x4b266f['exports'];
          module['asm'] = _0x374461, removeRunDependency('wasm-instantiate');
        }
        addRunDependency('wasm-instantiate');

        function _0x37b1c3(_0x1d6272) {
          _0x3f28f3(_0x1d6272['instance']);
        }

        function _0x4be897(_0x531108) {
          var _0x180bb0 = _0x9ad89f;
          return getBinaryPromise()['then'](function (_0x6dd834) {
            var _0x75c75c = _0x180bb0;
            return WebAssembly['instantiate'](_0x6dd834, _0x44feaa);
          })['then'](_0x531108, function (_0x3b107d) {
            var _0x5f499f = _0x180bb0;
            printError('异步准备 WASM 失败：' + _0x3b107d), abort(_0x3b107d);
          });
        }

        function _0xff2caf() {
          var _0x204db7 = _0x9ad89f;
          if (!wasmBinary && typeof WebAssembly['instantiateStreaming'] === 'function' && !isDataURI(wasmBinaryFile) && typeof fetch === 'function') fetch(wasmBinaryFile, {
            'credentials': 'same-origin'
          })['then'](function (_0x160acb) {
            var _0x501653 = _0x204db7,
              _0x16962e = WebAssembly['instantiateStreaming'](_0x160acb, _0x44feaa);
            return _0x16962e['then'](_0x37b1c3, function (_0x34a2e1) {
              var _0x5e91f0 = _0x501653;
              printError('wasm\x20streaming\x20compile\x20failed:\x20' + _0x34a2e1), printError('回退到 ArrayBuffer 实例化方式'), _0x4be897(_0x37b1c3);
            });
          });
          else return _0x4be897(_0x37b1c3);
        }
        if (module['instantiateWasm']) try {
          var _0x517361 = module['instantiateWasm'](_0x44feaa, _0x3f28f3);
          return _0x517361;
        } catch (_0x550693) {
          return printError('Module.instantiateWasm 回调失败，错误：' + _0x550693), ![];
        }
        return _0xff2caf(), {};
      }
      module['asm'] = function (_0x13acf7, _0x4d7ea9, _0x49f75f) {
        _0x4d7ea9['memory'] = wasmMemory, _0x4d7ea9['table'] = wasmTable = new WebAssembly[('Table')]({
          'initial': 0xa0,
          'maximum': 0xa0,
          'element': 'anyfunc'
        }), _0x4d7ea9['__memory_base'] = 0x400, _0x4d7ea9['__table_base'] = 0x0;
        var _0xb26733 = createWasm(_0x4d7ea9);
        return _0xb26733;
      };
      var _0x2f9712, tempI64, ASM_CONSTS = [function (_0x3c9375) {
        const _0xa233aa = UTF8ToString(_0x3c9375);
        var _0x476a2c = new XMLHttpRequest();
        _0x476a2c['timeout'] = 0x0, _0x476a2c['responseType'] = '', _0x476a2c['open']('GET', _0xa233aa, ![]), _0x476a2c['onload'] = function (_0x31bebe) {
          var _0x24c94f = _0x3fe88f;
          this['status'] == 0xc8 && (tmpstr = this['responseText']);
        }, _0x476a2c['send']();
        const _0x533209 = lengthBytesUTF8(tmpstr) + 0x1,
          _0x1ccbd6 = _malloc(_0x533209);
        return stringToUTF8(tmpstr, _0x1ccbd6, _0x533209), _0x1ccbd6;
      }, function (_0x266af1) {
        var _0x4a9ac3 = UTF8ToString(_0x266af1),
          _0x577392 = eval(_0x4a9ac3),
          _0x11790f = lengthBytesUTF8(_0x577392) + 0x1,
          _0x138323 = _malloc(_0x11790f);
        return stringToUTF8(_0x577392, _0x138323, _0x11790f), _0x138323;
      }, function (_0x50cd0c) {
        const _0x32fd82 = UTF8ToString(_0x50cd0c),
          _0x52b6c2 = eval(_0x32fd82),
          _0x3f2e6f = lengthBytesUTF8(_0x52b6c2) + 0x1,
          _0x28dd99 = _malloc(_0x3f2e6f);
        return stringToUTF8(_0x52b6c2, _0x28dd99, _0x3f2e6f), _0x28dd99;
      }];

      function emscripten_asm_const_ii(_0xe05fb2, _0x2e85d5) {
        return ASM_CONSTS[_0xe05fb2](_0x2e85d5);
      }
      var tempDoublePtr = 0x6e00;

      function demangle(_0x5426db) {
        return _0x5426db;
      }

      function demangleAll(_0x4e69a4) {
        var _0x29100e = /\b__Z[\w\d_]+/g;
        return _0x4e69a4['replace'](_0x29100e, function (_0x284caa) {
          var _0x280523 = demangle(_0x284caa);
          return _0x284caa === _0x280523 ? _0x284caa : _0x280523 + '\x20[' + _0x284caa + ']';
        });
      }

      function jsStackTrace() {
        var _0x4d5c88 = new Error();
        if (!_0x4d5c88['stack']) {
          try {
            throw new Error(0x0);
          } catch (_0x18a02b) {
            _0x4d5c88 = _0x18a02b;
          }
          if (!_0x4d5c88['stack']) return '(no stack trace available)';
        }
        return _0x4d5c88['stack']['toString']();
      }

      function stackTrace() {
        var _0x20d0c4 = jsStackTrace();
        if (module['extraStackTrace']) _0x20d0c4 += '\x0a' + module['extraStackTrace']();
        return demangleAll(_0x20d0c4);
      }

      function ___gxx_personality_v0() {}
      var PATH = {
          'splitPath': function (_0x43bed7) {
            var _0x171b15 = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return _0x171b15['exec'](_0x43bed7)['slice'](0x1);
          },
          'normalizeArray': function (_0x4e3279, _0x1dc551) {
            var _0x36c8db = 0x0;
            for (var _0x4d1653 = _0x4e3279['length'] - 0x1; _0x4d1653 >= 0x0; _0x4d1653--) {
              var _0xb30ef2 = _0x4e3279[_0x4d1653];
              if (_0xb30ef2 === '.') _0x4e3279['splice'](_0x4d1653, 0x1);
              else {
                if (_0xb30ef2 === '..') _0x4e3279['splice'](_0x4d1653, 0x1), _0x36c8db++;
                else _0x36c8db && (_0x4e3279['splice'](_0x4d1653, 0x1), _0x36c8db--);
              }
            }
            if (_0x1dc551)
              for (; _0x36c8db; _0x36c8db--) {
                _0x4e3279['unshift']('..');
              }
            return _0x4e3279;
          },
          'normalize': function (_0x288b47) {
            var _0x22400b = _0x288b47['charAt'](0x0) === '/',
              _0x5458a8 = _0x288b47['substr'](-0x1) === '/';
            return _0x288b47 = PATH['normalizeArray'](_0x288b47['split']('/')['filter'](function (_0x19c5f3) {
              return !!_0x19c5f3;
            }), !_0x22400b)['join']('/'), !_0x288b47 && !_0x22400b && (_0x288b47 = '.'), _0x288b47 && _0x5458a8 && (_0x288b47 += '/'), (_0x22400b ? '/' : '') + _0x288b47;
          },
          'dirname': function (_0x146328) {
            var _0x3f4192 = PATH['splitPath'](_0x146328),
              _0x9b2750 = _0x3f4192[0x0],
              _0x449902 = _0x3f4192[0x1];
            if (!_0x9b2750 && !_0x449902) return '.';
            return _0x449902 && (_0x449902 = _0x449902['substr'](0x0, _0x449902['length'] - 0x1)), _0x9b2750 + _0x449902;
          },
          'basename': function (_0x37e053) {
            if (_0x37e053 === '/') return '/';
            var _0x4e24ef = _0x37e053['lastIndexOf']('/');
            if (_0x4e24ef === -0x1) return _0x37e053;
            return _0x37e053['substr'](_0x4e24ef + 0x1);
          },
          'extname': function (_0x276e7c) {
            return PATH['splitPath'](_0x276e7c)[0x3];
          },
          'join': function () {
            var _0x466508 = Array['prototype']['slice']['call'](arguments, 0x0);
            return PATH['normalize'](_0x466508['join']('/'));
          },
          'join2': function (_0xacbc4d, _0x558580) {
            return PATH['normalize'](_0xacbc4d + '/' + _0x558580);
          }
        },
        SYSCALLS = {
          'buffers': [null, [],
            []
          ],
          'printChar': function (_0x5517d6, _0x14202b) {
            var _0x63e071 = SYSCALLS['buffers'][_0x5517d6];
            _0x14202b === 0x0 || _0x14202b === 0xa ? ((_0x5517d6 === 0x1 ? printOutput : printError)(UTF8ArrayToString(_0x63e071, 0x0)), _0x63e071['length'] = 0x0) : _0x63e071['push'](_0x14202b);
          },
          'varargs': 0x0,
          'get': function (_0x42a150) {
            SYSCALLS['varargs'] += 0x4;
            var _0x4989f8 = HEAP32[SYSCALLS['varargs'] - 0x4 >> 0x2];
            return _0x4989f8;
          },
          'getStr': function () {
            var _0x2bfaae = UTF8ToString(SYSCALLS['get']());
            return _0x2bfaae;
          },
          'get64': function () {
            var _0x301a27 = SYSCALLS['get'](),
              _0x220d75 = SYSCALLS['get']();
            return _0x301a27;
          },
          'getZero': function () {
            SYSCALLS['get']();
          }
        };

      function ___syscall140(_0x135460, _0x331b68) {
        SYSCALLS['varargs'] = _0x331b68;
        try {
          var _0x2f6ece = SYSCALLS['getStreamFromFD'](),
            _0xb2b953 = SYSCALLS['get'](),
            _0x31c872 = SYSCALLS['get'](),
            _0xe3722e = SYSCALLS['get'](),
            _0x3e0e28 = SYSCALLS['get']();
          return 0x0;
        } catch (_0x2fd779) {
          if (typeof FS === 'undefined' || !(_0x2fd779 instanceof FS['ErrnoError'])) abort(_0x2fd779);
          return -_0x2fd779['errno'];
        }
      }

      function flush_NO_FILESYSTEM() {
        var _0x5ad6a7 = module['_fflush'];
        if (_0x5ad6a7) _0x5ad6a7(0x0);
        var _0x4780e5 = SYSCALLS['buffers'];
        if (_0x4780e5[0x1]['length']) SYSCALLS['printChar'](0x1, 0xa);
        if (_0x4780e5[0x2]['length']) SYSCALLS['printChar'](0x2, 0xa);
      }

      function ___syscall146(_0x27bcdb, _0x2fbf9e) {
        SYSCALLS['varargs'] = _0x2fbf9e;
        try {
          var _0x44fcf9 = SYSCALLS['get'](),
            _0x2023ae = SYSCALLS['get'](),
            _0x33711e = SYSCALLS['get'](),
            _0x4fbd85 = 0x0;
          for (var _0x33149d = 0x0; _0x33149d < _0x33711e; _0x33149d++) {
            var _0x2a65c9 = HEAP32[_0x2023ae + _0x33149d * 0x8 >> 0x2],
              _0x3feeac = HEAP32[_0x2023ae + (_0x33149d * 0x8 + 0x4) >> 0x2];
            for (var _0x5ef0de = 0x0; _0x5ef0de < _0x3feeac; _0x5ef0de++) {
              SYSCALLS['printChar'](_0x44fcf9, HEAPU8[_0x2a65c9 + _0x5ef0de]);
            }
            _0x4fbd85 += _0x3feeac;
          }
          return _0x4fbd85;
        } catch (_0x4c4116) {
          if (typeof FS === 'undefined' || !(_0x4c4116 instanceof FS['ErrnoError'])) abort(_0x4c4116);
          return -_0x4c4116['errno'];
        }
      }

      function ___syscall54(_0x12af6b, _0x46d840) {
        SYSCALLS['varargs'] = _0x46d840;
        try {
          return 0x0;
        } catch (_0x5e9ef4) {
          if (typeof FS === 'undefined' || !(_0x5e9ef4 instanceof FS['ErrnoError'])) abort(_0x5e9ef4);
          return -_0x5e9ef4['errno'];
        }
      }

      function ___syscall6(_0x264bd2, _0x2edc91) {
        SYSCALLS['varargs'] = _0x2edc91;
        try {
          var _0x50735f = SYSCALLS['getStreamFromFD']();
          return 0x0;
        } catch (_0x478609) {
          if (typeof FS === 'undefined' || !(_0x478609 instanceof FS['ErrnoError'])) abort(_0x478609);
          return -_0x478609['errno'];
        }
      }

      function __emscripten_fetch_free(_0x21d522) {
        delete Fetch['xhrs'][_0x21d522 - 0x1];
      }

      function getHeapSize() {
        return HEAP8['length'];
      }

      function _emscripten_is_main_browser_thread() {
        return !isWorker;
      }
      var Fetch = {
        'xhrs': [],
        'setu64': function (_0x546c03, _0x48a811) {
          HEAPU32[_0x546c03 >> 0x2] = _0x48a811, HEAPU32[_0x546c03 + 0x4 >> 0x2] = _0x48a811 / 0x100000000 | 0x0;
        },
        'openDatabase': function (_0x3dfe2f, _0xd90619, _0x5f05bf, _0x110076) {
          try {
            var _0x21d534 = indexedDB['open'](_0x3dfe2f, _0xd90619);
          } catch (_0x4eaa9e) {
            return _0x110076(_0x4eaa9e);
          }
          _0x21d534['onupgradeneeded'] = function (_0x391cf2) {
            var _0x41cc26 = _0x53de7b,
              _0x565f66 = _0x391cf2['target']['result'];
            _0x565f66['objectStoreNames']['contains']('FILES') && _0x565f66['deleteObjectStore']('FILES'), _0x565f66['createObjectStore']('FILES');
          }, _0x21d534['onsuccess'] = function (_0x4277cd) {
            var _0x109c8d = _0x53de7b;
            _0x5f05bf(_0x4277cd['target']['result']);
          }, _0x21d534['onerror'] = function (_0x2f77c6) {
            _0x110076(_0x2f77c6);
          };
        },
        'staticInit': function () {
          var _0x66e418 = typeof ENVIRONMENT_IS_FETCH_WORKER === 'undefined',
            _0x175a7b = function (_0x235974) {
              var _0x1fd337 = _0x1b8c7b;
              Fetch['dbInstance'] = _0x235974, _0x66e418 && removeRunDependency('library_fetch_init');
            },
            _0x482248 = function () {
              var _0x3996bc = _0x1b8c7b;
              Fetch['dbInstance'] = ![], _0x66e418 && removeRunDependency('library_fetch_init');
            };
          Fetch['openDatabase']('emscripten_filesystem', 0x1, _0x175a7b, _0x482248);
          if (typeof ENVIRONMENT_IS_FETCH_WORKER === 'undefined' || !ENVIRONMENT_IS_FETCH_WORKER) addRunDependency('library_fetch_init');
        }
      };

      // 通过 XMLHttpRequest 执行 Emscripten fetch 请求
      function __emscripten_fetch_xhr(_0x5b5625, _0x5ef437, _0x2b4538, _0x4b587d, _0x1760d0) {
        var _0x410352 = HEAPU32[_0x5b5625 + 0x8 >> 0x2];
        if (!_0x410352) {
          _0x2b4538(_0x5b5625, 0x0, '未指定 URL！');
          return;
        }
        var _0x1a5164 = UTF8ToString(_0x410352),
          _0x326ba2 = _0x5b5625 + 0x70,
          _0x44a52d = UTF8ToString(_0x326ba2);
        if (!_0x44a52d) _0x44a52d = 'GET';
        var _0x21c435 = HEAPU32[_0x326ba2 + 0x20 >> 0x2],
          _0x7c127f = HEAPU32[_0x326ba2 + 0x34 >> 0x2],
          _0xf3d568 = HEAPU32[_0x326ba2 + 0x38 >> 0x2],
          _0xc68bdb = !!HEAPU32[_0x326ba2 + 0x3c >> 0x2],
          _0x178e1f = HEAPU32[_0x326ba2 + 0x40 >> 0x2],
          _0x3a9e73 = HEAPU32[_0x326ba2 + 0x44 >> 0x2],
          _0x56c829 = HEAPU32[_0x326ba2 + 0x48 >> 0x2],
          _0x4160e8 = HEAPU32[_0x326ba2 + 0x4c >> 0x2],
          _0x15211c = HEAPU32[_0x326ba2 + 0x50 >> 0x2],
          _0x54b916 = HEAPU32[_0x326ba2 + 0x54 >> 0x2],
          _0x5ee975 = HEAPU32[_0x326ba2 + 0x58 >> 0x2],
          _0x4040f5 = !!(_0x7c127f & 0x1),
          _0x354d40 = !!(_0x7c127f & 0x2),
          _0x21b3f6 = !!(_0x7c127f & 0x4),
          _0x49113a = !!(_0x7c127f & 0x8),
          _0x408bdc = !!(_0x7c127f & 0x10),
          _0x1c4644 = !!(_0x7c127f & 0x40),
          _0x395d8e = !!(_0x7c127f & 0x80),
          _0x12f62a = _0x3a9e73 ? UTF8ToString(_0x3a9e73) : undefined,
          _0x234ca0 = _0x56c829 ? UTF8ToString(_0x56c829) : undefined,
          _0x331919 = _0x15211c ? UTF8ToString(_0x15211c) : undefined,
          _0x503fcf = new XMLHttpRequest();
        _0x503fcf['withCredentials'] = _0xc68bdb, _0x503fcf['open'](_0x44a52d, _0x1a5164, !_0x1c4644, _0x12f62a, _0x234ca0);
        if (!_0x1c4644) _0x503fcf['timeout'] = _0xf3d568;
        _0x503fcf['url_'] = _0x1a5164, assert(!_0x354d40, '流式传输使用了不再支持的 moz-chunked-arraybuffer；待办：使用 fetch() 重写'), _0x503fcf['responseType'] = 'arraybuffer';
        _0x15211c && _0x503fcf['overrideMimeType'](_0x331919);
        if (_0x4160e8)
          for (;;) {
            var _0x23225e = HEAPU32[_0x4160e8 >> 0x2];
            if (!_0x23225e) break;
            var _0x445114 = HEAPU32[_0x4160e8 + 0x4 >> 0x2];
            if (!_0x445114) break;
            _0x4160e8 += 0x8;
            var _0x168f7e = UTF8ToString(_0x23225e),
              _0x3411b7 = UTF8ToString(_0x445114);
            _0x503fcf['setRequestHeader'](_0x168f7e, _0x3411b7);
          }
        Fetch['xhrs']['push'](_0x503fcf);
        var _0x398835 = Fetch['xhrs']['length'];
        HEAPU32[_0x5b5625 + 0x0 >> 0x2] = _0x398835;
        var _0x5eb7c2 = _0x54b916 && _0x5ee975 ? HEAPU8['slice'](_0x54b916, _0x54b916 + _0x5ee975) : null;
        _0x503fcf['onload'] = function (_0x4cd24e) {
          var _0x4b0728 = _0x22f0bb,
            _0xf402c7 = _0x503fcf['response'] ? _0x503fcf['response']['byteLength'] : 0x0,
            _0x2488bd = 0x0,
            _0x1efbc2 = 0x0;
          _0x4040f5 && !_0x354d40 && (_0x1efbc2 = _0xf402c7, _0x2488bd = _malloc(_0x1efbc2), HEAPU8['set'](new Uint8Array(_0x503fcf['response']), _0x2488bd));
          HEAPU32[_0x5b5625 + 0xc >> 0x2] = _0x2488bd, Fetch['setu64'](_0x5b5625 + 0x10, _0x1efbc2), Fetch['setu64'](_0x5b5625 + 0x18, 0x0);
          _0xf402c7 && Fetch['setu64'](_0x5b5625 + 0x20, _0xf402c7);
          HEAPU16[_0x5b5625 + 0x28 >> 0x1] = _0x503fcf['readyState'];
          if (_0x503fcf['readyState'] === 0x4 && _0x503fcf['status'] === 0x0) {
            if (_0xf402c7 > 0x0) _0x503fcf['status'] = 0xc8;
            else _0x503fcf['status'] = 0x194;
          }
          HEAPU16[_0x5b5625 + 0x2a >> 0x1] = _0x503fcf['status'];
          if (_0x503fcf['statusText']) stringToUTF8(_0x503fcf['statusText'], _0x5b5625 + 0x2c, 0x40);
          if (_0x503fcf['status'] >= 0xc8 && _0x503fcf['status'] < 0x12c) {
            if (_0x5ef437) _0x5ef437(_0x5b5625, _0x503fcf, _0x4cd24e);
          } else {
            if (_0x2b4538) _0x2b4538(_0x5b5625, _0x503fcf, _0x4cd24e);
          }
        }, _0x503fcf['onerror'] = function (_0x16f270) {
          var _0x4b1fab = _0x22f0bb,
            _0x50a8c8 = _0x503fcf['status'];
          if (_0x503fcf['readyState'] === 0x4 && _0x50a8c8 === 0x0) _0x50a8c8 = 0x194;
          HEAPU32[_0x5b5625 + 0xc >> 0x2] = 0x0, Fetch['setu64'](_0x5b5625 + 0x10, 0x0), Fetch['setu64'](_0x5b5625 + 0x18, 0x0), Fetch['setu64'](_0x5b5625 + 0x20, 0x0), HEAPU16[_0x5b5625 + 0x28 >> 0x1] = _0x503fcf['readyState'], HEAPU16[_0x5b5625 + 0x2a >> 0x1] = _0x50a8c8;
          if (_0x2b4538) _0x2b4538(_0x5b5625, _0x503fcf, _0x16f270);
        }, _0x503fcf['ontimeout'] = function (_0x3d1545) {
          if (_0x2b4538) _0x2b4538(_0x5b5625, _0x503fcf, _0x3d1545);
        }, _0x503fcf['onprogress'] = function (_0xf56419) {
          var _0x191cfa = _0x22f0bb,
            _0x28e2fb = _0x4040f5 && _0x354d40 && _0x503fcf['response'] ? _0x503fcf['response']['byteLength'] : 0x0,
            _0x742638 = 0x0;
          _0x4040f5 && _0x354d40 && (_0x742638 = _malloc(_0x28e2fb), HEAPU8['set'](new Uint8Array(_0x503fcf['response']), _0x742638));
          HEAPU32[_0x5b5625 + 0xc >> 0x2] = _0x742638, Fetch['setu64'](_0x5b5625 + 0x10, _0x28e2fb), Fetch['setu64'](_0x5b5625 + 0x18, _0xf56419['loaded'] - _0x28e2fb), Fetch['setu64'](_0x5b5625 + 0x20, _0xf56419['total']), HEAPU16[_0x5b5625 + 0x28 >> 0x1] = _0x503fcf['readyState'];
          if (_0x503fcf['readyState'] >= 0x3 && _0x503fcf['status'] === 0x0 && _0xf56419['loaded'] > 0x0) _0x503fcf['status'] = 0xc8;
          HEAPU16[_0x5b5625 + 0x2a >> 0x1] = _0x503fcf['status'];
          if (_0x503fcf['statusText']) stringToUTF8(_0x503fcf['statusText'], _0x5b5625 + 0x2c, 0x40);
          if (_0x4b587d) _0x4b587d(_0x5b5625, _0x503fcf, _0xf56419);
        }, _0x503fcf['onreadystatechange'] = function (_0x5eafe3) {
          var _0xa10428 = _0x22f0bb;
          HEAPU16[_0x5b5625 + 0x28 >> 0x1] = _0x503fcf['readyState'];
          _0x503fcf['readyState'] >= 0x2 && (HEAPU16[_0x5b5625 + 0x2a >> 0x1] = _0x503fcf['status']);
          if (_0x1760d0) _0x1760d0(_0x5b5625, _0x503fcf, _0x5eafe3);
        };
        try {
          _0x503fcf['send'](_0x5eb7c2);
        } catch (_0x575571) {
          if (_0x2b4538) _0x2b4538(_0x5b5625, _0x503fcf, _0x575571);
        }
      }

      function __emscripten_fetch_cache_data(_0x5eeb8f, _0x5ec101, _0x3b54b3, _0x25124e, _0x426cb5) {
        if (!_0x5eeb8f) {
          _0x426cb5(_0x5ec101, 0x0, 'IndexedDB 不可用！');
          return;
        }
        var _0x243274 = _0x5ec101 + 0x70,
          _0x2f9d20 = HEAPU32[_0x243274 + 0x40 >> 0x2];
        if (!_0x2f9d20) _0x2f9d20 = HEAPU32[_0x5ec101 + 0x8 >> 0x2];
        var _0x466778 = UTF8ToString(_0x2f9d20);
        try {
          var _0x4abd3d = _0x5eeb8f['transaction'](['FILES'], 'readwrite'),
            _0x1888cf = _0x4abd3d['objectStore']('FILES'),
            _0x2035db = _0x1888cf['put'](_0x3b54b3, _0x466778);
          _0x2035db['onsuccess'] = function (_0x371c75) {
            HEAPU16[_0x5ec101 + 0x28 >> 0x1] = 0x4, HEAPU16[_0x5ec101 + 0x2a >> 0x1] = 0xc8, stringToUTF8('OK', _0x5ec101 + 0x2c, 0x40), _0x25124e(_0x5ec101, 0x0, _0x466778);
          }, _0x2035db['onerror'] = function (_0x5165ae) {
            var _0x10ec95 = _0x2c7a8c;
            HEAPU16[_0x5ec101 + 0x28 >> 0x1] = 0x4, HEAPU16[_0x5ec101 + 0x2a >> 0x1] = 0x19d, stringToUTF8('负载过大', _0x5ec101 + 0x2c, 0x40), _0x426cb5(_0x5ec101, 0x0, _0x5165ae);
          };
        } catch (_0x5a687c) {
          _0x426cb5(_0x5ec101, 0x0, _0x5a687c);
        }
      }

      function __emscripten_fetch_load_cached_data(_0x159376, _0x504f6d, _0x54374d, _0x25326c) {
        if (!_0x159376) {
          _0x25326c(_0x504f6d, 0x0, 'IndexedDB 不可用！');
          return;
        }
        var _0x320ab6 = _0x504f6d + 0x70,
          _0x222397 = HEAPU32[_0x320ab6 + 0x40 >> 0x2];
        if (!_0x222397) _0x222397 = HEAPU32[_0x504f6d + 0x8 >> 0x2];
        var _0xe97da6 = UTF8ToString(_0x222397);
        try {
          var _0x14ebc4 = _0x159376['transaction'](['FILES'], 'readonly'),
            _0x36b1ab = _0x14ebc4['objectStore']('FILES'),
            _0x15f463 = _0x36b1ab['get'](_0xe97da6);
          _0x15f463['onsuccess'] = function (_0x1c1571) {
            var _0x562666 = _0x3c6aa5;
            if (_0x1c1571['target']['result']) {
              var _0x5d591e = _0x1c1571['target']['result'],
                _0x27ac8b = _0x5d591e['byteLength'] || _0x5d591e['length'],
                _0xd37c27 = _malloc(_0x27ac8b);
              HEAPU8['set'](new Uint8Array(_0x5d591e), _0xd37c27), HEAPU32[_0x504f6d + 0xc >> 0x2] = _0xd37c27, Fetch['setu64'](_0x504f6d + 0x10, _0x27ac8b), Fetch['setu64'](_0x504f6d + 0x18, 0x0), Fetch['setu64'](_0x504f6d + 0x20, _0x27ac8b), HEAPU16[_0x504f6d + 0x28 >> 0x1] = 0x4, HEAPU16[_0x504f6d + 0x2a >> 0x1] = 0xc8, stringToUTF8('OK', _0x504f6d + 0x2c, 0x40), _0x54374d(_0x504f6d, 0x0, _0x5d591e);
            } else HEAPU16[_0x504f6d + 0x28 >> 0x1] = 0x4, HEAPU16[_0x504f6d + 0x2a >> 0x1] = 0x194, stringToUTF8('未找到', _0x504f6d + 0x2c, 0x40), _0x25326c(_0x504f6d, 0x0, 'no data');
          }, _0x15f463['onerror'] = function (_0x4d0e9d) {
            HEAPU16[_0x504f6d + 0x28 >> 0x1] = 0x4, HEAPU16[_0x504f6d + 0x2a >> 0x1] = 0x194, stringToUTF8('未找到', _0x504f6d + 0x2c, 0x40), _0x25326c(_0x504f6d, 0x0, _0x4d0e9d);
          };
        } catch (_0x582a51) {
          _0x25326c(_0x504f6d, 0x0, _0x582a51);
        }
      }

      function __emscripten_fetch_delete_cached_data(_0xa33238, _0x2b3c1b, _0x36bd55, _0x48efc4) {
        if (!_0xa33238) {
          _0x48efc4(_0x2b3c1b, 0x0, 'IndexedDB 不可用！');
          return;
        }
        var _0x307c54 = _0x2b3c1b + 0x70,
          _0x490400 = HEAPU32[_0x307c54 + 0x40 >> 0x2];
        if (!_0x490400) _0x490400 = HEAPU32[_0x2b3c1b + 0x8 >> 0x2];
        var _0xa4e2fc = UTF8ToString(_0x490400);
        try {
          var _0x91dbeb = _0xa33238['transaction'](['FILES'], 'readwrite'),
            _0x100ebd = _0x91dbeb['objectStore']('FILES'),
            _0x2dcc72 = _0x100ebd['delete'](_0xa4e2fc);
          _0x2dcc72['onsuccess'] = function (_0x3d1745) {
            var _0x2e4bcb = _0x16a3ce,
              _0x5151dc = _0x3d1745['target']['result'];
            HEAPU32[_0x2b3c1b + 0xc >> 0x2] = 0x0, Fetch['setu64'](_0x2b3c1b + 0x10, 0x0), Fetch['setu64'](_0x2b3c1b + 0x18, 0x0), Fetch['setu64'](_0x2b3c1b + 0x20, 0x0), HEAPU16[_0x2b3c1b + 0x28 >> 0x1] = 0x4, HEAPU16[_0x2b3c1b + 0x2a >> 0x1] = 0xc8, stringToUTF8('OK', _0x2b3c1b + 0x2c, 0x40), _0x36bd55(_0x2b3c1b, 0x0, _0x5151dc);
          }, _0x2dcc72['onerror'] = function (_0x579b62) {
            HEAPU16[_0x2b3c1b + 0x28 >> 0x1] = 0x4, HEAPU16[_0x2b3c1b + 0x2a >> 0x1] = 0x194, stringToUTF8('未找到', _0x2b3c1b + 0x2c, 0x40), _0x48efc4(_0x2b3c1b, 0x0, _0x579b62);
          };
        } catch (_0x48c446) {
          _0x48efc4(_0x2b3c1b, 0x0, _0x48c446);
        }
      }
      var FETCH_WORKER_QUEUE_PTR = 0x6de0;

      function __emscripten_get_fetch_work_queue() {
        return FETCH_WORKER_QUEUE_PTR;
      }

      function _emscripten_is_main_runtime_thread() {
        printError('缺少函数：emscripten_is_main_runtime_thread'), abort(-0x1);
      }

      function _emscripten_start_fetch(_0x7f9c1d, _0x541a0d, _0x3753ab, _0x16ac34, _0x1dfe9f) {
        if (typeof module !== 'undefined') module['noExitRuntime'] = !![];
        var _0x5003f2 = _0x7f9c1d + 0x70,
          _0x419057 = UTF8ToString(_0x5003f2),
          _0x101a87 = HEAPU32[_0x5003f2 + 0x24 >> 0x2],
          _0x2cbff1 = HEAPU32[_0x5003f2 + 0x28 >> 0x2],
          _0x2486f0 = HEAPU32[_0x5003f2 + 0x2c >> 0x2],
          _0x593614 = HEAPU32[_0x5003f2 + 0x30 >> 0x2],
          _0x11e44a = HEAPU32[_0x5003f2 + 0x34 >> 0x2],
          _0x54876f = !!(_0x11e44a & 0x1),
          _0x54fa32 = !!(_0x11e44a & 0x2),
          _0x3b4e53 = !!(_0x11e44a & 0x4),
          _0x4262f0 = !!(_0x11e44a & 0x20),
          _0x9ff132 = !!(_0x11e44a & 0x8),
          _0x4c4d65 = !!(_0x11e44a & 0x10),
          _0x4256e2 = function (_0x5a7990, _0x24cf88, _0x5497cb) {
            if (_0x101a87) dynCall_vi(_0x101a87, _0x5a7990);
            else {
              if (_0x541a0d) _0x541a0d(_0x5a7990);
            }
          },
          _0x4fb094 = function (_0x50f7ae, _0x19b024, _0x1e1c59) {
            if (_0x2486f0) dynCall_vi(_0x2486f0, _0x50f7ae);
            else {
              if (_0x16ac34) _0x16ac34(_0x50f7ae);
            }
          },
          _0x390e7f = function (_0x5e79fc, _0x75bee5, _0x3781e9) {
            if (_0x2cbff1) dynCall_vi(_0x2cbff1, _0x5e79fc);
            else {
              if (_0x3753ab) _0x3753ab(_0x5e79fc);
            }
          },
          _0x3105 = function (_0x2c6399, _0x83de2b, _0x36f5bc) {
            if (_0x593614) dynCall_vi(_0x593614, _0x2c6399);
            else {
              if (_0x1dfe9f) _0x1dfe9f(_0x2c6399);
            }
          },
          _0x1df72b = function (_0x224ff9, _0x4f631c, _0x414d14) {
            __emscripten_fetch_xhr(_0x224ff9, _0x4256e2, _0x390e7f, _0x4fb094, _0x3105);
          },
          _0xa354cc = function (_0x10de8c, _0x4c69a9, _0x4c3fac) {
            var _0x471e6e = _0x2e1743,
              _0x5f2fcb = function (_0x8a7243, _0x557e2b, _0x4319a5) {
                if (_0x101a87) dynCall_vi(_0x101a87, _0x8a7243);
                else {
                  if (_0x541a0d) _0x541a0d(_0x8a7243);
                }
              },
              _0x248851 = function (_0x173b2c, _0x15d256, _0x5c225d) {
                if (_0x101a87) dynCall_vi(_0x101a87, _0x173b2c);
                else {
                  if (_0x541a0d) _0x541a0d(_0x173b2c);
                }
              };
            __emscripten_fetch_cache_data(Fetch['dbInstance'], _0x10de8c, _0x4c69a9['response'], _0x5f2fcb, _0x248851);
          },
          _0x2708a5 = function (_0x11021e, _0x572caf, _0x1de392) {
            __emscripten_fetch_xhr(_0x11021e, _0xa354cc, _0x390e7f, _0x4fb094, _0x3105);
          },
          _0x52f590 = !_0x4c4d65 || _0x419057 === 'EM_IDB_STORE' || _0x419057 === 'EM_IDB_DELETE';
        if (_0x52f590 && !Fetch['dbInstance']) return _0x390e7f(_0x7f9c1d, 0x0, 'IndexedDB 未打开'), 0x0;
        if (_0x419057 === 'EM_IDB_STORE') {
          var _0xade042 = HEAPU32[_0x5003f2 + 0x54 >> 0x2];
          __emscripten_fetch_cache_data(Fetch['dbInstance'], _0x7f9c1d, HEAPU8['slice'](_0xade042, _0xade042 + HEAPU32[_0x5003f2 + 0x58 >> 0x2]), _0x4256e2, _0x390e7f);
        } else {
          if (_0x419057 === 'EM_IDB_DELETE') __emscripten_fetch_delete_cached_data(Fetch['dbInstance'], _0x7f9c1d, _0x4256e2, _0x390e7f);
          else {
            if (!_0x4c4d65) __emscripten_fetch_load_cached_data(Fetch['dbInstance'], _0x7f9c1d, _0x4256e2, _0x4262f0 ? _0x390e7f : _0x3b4e53 ? _0x2708a5 : _0x1df72b);
            else {
              if (!_0x4262f0) __emscripten_fetch_xhr(_0x7f9c1d, _0x3b4e53 ? _0xa354cc : _0x4256e2, _0x390e7f, _0x4fb094, _0x3105);
              else return 0x0;
            }
          }
        }
        return _0x7f9c1d;
      }

      function _emscripten_memcpy_big(_0x911016, _0x406a3d, _0x21c654) {
        HEAPU8['set'](HEAPU8['subarray'](_0x406a3d, _0x406a3d + _0x21c654), _0x911016);
      }

      function ___setErrNo(_0x43ee1a) {
        if (module['___errno_location']) HEAP32[module['___errno_location']() >> 0x2] = _0x43ee1a;
        return _0x43ee1a;
      }

      // 内存无法增长时终止程序
      function abortOnCannotGrowMemory(_0x21c2a1) {
        abort('内存不足');
      }

      function emscripten_realloc_buffer(_0x26defa) {
        var _0x4106d7 = 0x10000;
        _0x26defa = alignUp(_0x26defa, _0x4106d7);
        var _0x8d6e7a = wasmBuffer['byteLength'];
        try {
          var _0x26efdc = wasmMemory['grow']((_0x26defa - _0x8d6e7a) / 0x10000);
          return _0x26efdc !== (-0x1 | 0x0) ? (wasmBuffer = wasmMemory['buffer'], !![]) : ![];
        } catch (_0x9bf678) {
          return ![];
        }
      }

      // 调整 WASM 堆内存大小
      function _emscripten_resize_heap(_0x289cb7) {
        var _0x30fc75 = getHeapSize(),
          _0x215952 = 0x10000,
          _0x166ac1 = 0x80000000 - _0x215952;
        if (_0x289cb7 > _0x166ac1) return ![];
        var _0x5360ea = 0x1000000,
          _0x17d2ff = Math['max'](_0x30fc75, _0x5360ea);
        while (_0x17d2ff < _0x289cb7) {
          _0x17d2ff <= 0x20000000 ? _0x17d2ff = alignUp(0x2 * _0x17d2ff, _0x215952) : _0x17d2ff = Math['min'](alignUp((0x3 * _0x17d2ff + 0x80000000) / 0x4, _0x215952), _0x166ac1);
        }
        if (!emscripten_realloc_buffer(_0x17d2ff)) return ![];
        return updateHeapViews(), !![];
      }
      Fetch['staticInit']();
      var noExitRuntime = ![];

      function jsCall_ii(_0x1ee12f, _0x586c77) {
        return FUNCTION_TABLE[_0x1ee12f](_0x586c77);
      }

      function jsCall_iidiiii(_0x57a431, _0xe84509, _0x15b691, _0x4d2477, _0x5e5e81, _0x4ef7ae, _0x1c9d64) {
        return FUNCTION_TABLE[_0x57a431](_0xe84509, _0x15b691, _0x4d2477, _0x5e5e81, _0x4ef7ae, _0x1c9d64);
      }

      function jsCall_iiii(_0x4e0fd0, _0x3e885a, _0xe16a89, _0x22e6a4) {
        return FUNCTION_TABLE[_0x4e0fd0](_0x3e885a, _0xe16a89, _0x22e6a4);
      }

      function jsCall_jiji(_0x505346, _0x30e45d, _0x254257, _0xcbba3) {
        return FUNCTION_TABLE[_0x505346](_0x30e45d, _0x254257, _0xcbba3);
      }

      function jsCall_v(_0x3f1d85) {
        FUNCTION_TABLE[_0x3f1d85]();
      }

      function jsCall_vi(_0x2018dc, _0x1033c7) {
        FUNCTION_TABLE[_0x2018dc](_0x1033c7);
      }

      function jsCall_vii(_0x127d33, _0x242d2e, _0x15f55b) {
        FUNCTION_TABLE[_0x127d33](_0x242d2e, _0x15f55b);
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
      module['then'] = function (_0x5023e0) {
        if (wasmReady) _0x5023e0(module);
        else {
          var _0x4a35fa = module['onRuntimeInitialized'];
          module['onRuntimeInitialized'] = function () {
            if (_0x4a35fa) _0x4a35fa();
            _0x5023e0(module);
          };
        }
        return module;
      };

      function ExitStatus(_0x2c9269) {
        this['name'] = 'ExitStatus', this['message'] = 'Program terminated with exit(' + _0x2c9269 + ')', this['status'] = _0x2c9269;
      }
      dependenciesFulfilled = function _0x495fbe() {
        if (!wasmReady) run();
        if (!wasmReady) dependenciesFulfilled = _0x495fbe;
      };

      // 主入口：执行预运行钩子，然后启动 WASM 程序
      function run(_0x47141e) {
        _0x47141e = _0x47141e || argv;
        if (runDependencies > 0x0) return;
        preRun();
        if (runDependencies > 0x0) return;

        function _0x3a994a() {
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
          }, 0x1), _0x3a994a();
        }, 0x1)) : _0x3a994a();
      }
      module['run'] = run;

      // 终止运行：输出错误信息并抛出异常
      function abort(_0x2a65c0) {
        module['onAbort'] && module['onAbort'](_0x2a65c0);
        _0x2a65c0 += '', printOutput(_0x2a65c0), printError(_0x2a65c0), calledAbort = !![], exitCode = 0x1;
        throw 'abort(' + _0x2a65c0 + '). Build with -s ASSERTIONS=1 for more info.';
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
  var _noop = noopFn;
  'use strict';
  var loudspeakerAudioChainUnused = {},
    headsetAudioChain = {},
    loudspeakerAudioChain = {},
    gainSettings = {},
    isCrossAudio = !![],
    audioContext, sourceNode, getBrowserInfo = function () {
      var _0x4261a4 = new Object();
      return _0x4261a4['isMozilla'] = typeof document['implementation'] != 'undefined' && typeof document['implementation']['createDocument'] != 'undefined' && typeof HTMLDocument != 'undefined', _0x4261a4['isIE'] = window['ActiveXObject'] ? !![] : ![], _0x4261a4['isFirefox'] = navigator['userAgent']['toLowerCase']()['indexOf']('firefox') != -0x1, _0x4261a4['isSafari'] = navigator['userAgent']['toLowerCase']()['indexOf']('safari') != -0x1 && navigator['userAgent']['toLowerCase']()['indexOf']('chrome') == -0x1, _0x4261a4['isOpera'] = navigator['userAgent']['toLowerCase']()['indexOf']('opera') != -0x1, _0x4261a4['isMicromessenger'] = navigator['userAgent']['toLowerCase']()['indexOf']('micromessenger') != -0x1, _0x4261a4['isChrome'] = navigator['userAgent']['toLowerCase']()['indexOf']('chrome') != -0x1, console['log'](navigator['userAgent']), _0x4261a4;
    },
    initAudioContext = function (_0x4f499e) {
      if (audioContext) return;
      try {
        var browserInfo = getBrowserInfo();
        browserInfo['isFirefox'] ? (console['log']('是 Firefox 浏览器'), gainSettings['louderSpeakerGain'] = 0x1, gainSettings['headSetGain'] = 1.5) : (gainSettings['louderSpeakerGain'] = 1.8, gainSettings['headSetGain'] = 0x2), audioContext = new(window[('AudioContext')] || window[('webkitAudioContext')])(), sourceNode = audioContext['createMediaElementSource'](_0x4f499e), sourceNode['connect'](audioContext['destination']);
      } catch (_0x301639) {
        console['log'](_0x301639);
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
    } catch (_0x2c7b6a) {
      console['log'](_0x2c7b6a);
    }
  }, this['connectDestHeadset'] = function () {
    try {
      disconnectHeadset();
      if (headsetAudioChain['masterFirst'] && headsetAudioChain['masterEnd']) {
        sourceNode['connect'](headsetAudioChain['masterFirst']), headsetAudioChain['masterEnd']['connect'](audioContext['destination']);
        return;
      }
      var _0x1f57ed = audioContext['createGain'](),
        _0x208fcf = audioContext['createGain'](),
        _0x4a2426 = audioContext['createGain'](),
        _0x1df5bf = audioContext['createGain'](),
        _0xc20c3 = audioContext['createGain'](),
        _0x4e3fa5 = audioContext['createGain']();
      headsetAudioChain['masterFirst'] = _0x1f57ed, headsetAudioChain['masterEnd'] = _0x4e3fa5, sourceNode['connect'](_0x1f57ed), _0x1df5bf['gain']['value'] = 0.4, _0x208fcf['gain']['value'] = 0.4, _0x1f57ed['connect'](_0x208fcf), buildHeadsetPathWithMonoConvolver(_0x208fcf, _0x4a2426), _0x4a2426['connect'](_0x4e3fa5), _0x1f57ed['connect'](_0x1df5bf), buildHeadsetPathWithStereoConvolver(_0x1df5bf, _0xc20c3), _0xc20c3['connect'](_0x4e3fa5), _0x4e3fa5['connect'](audioContext['destination']);
    } catch (_0x3fce1b) {
      console['log'](_0x3fce1b);
    }
  };

  // 构建耳机音频路径（立体声卷积混响）
  function buildHeadsetPathWithStereoConvolver(_0x118793, _0x2c83bb) {
    var _0x4d19e3 = audioContext['createGain'](),
      _0x194cb9 = audioContext['createGain'](),
      _0x7f1141 = audioContext['createGain'](),
      _0x5f1724 = audioContext['createConvolver']();
    _0x118793['connect'](_0x7f1141);
    var _0x15d8de = audioContext['createChannelSplitter'](0x2),
      _0x1d20d2 = audioContext['createChannelMerger'](0x2);
    _0x118793['connect'](_0x15d8de), _0x15d8de['connect'](_0x4d19e3, 0x0), _0x15d8de['connect'](_0x194cb9, 0x1), _0x4d19e3['connect'](_0x1d20d2, 0x0, 0x1), _0x194cb9['connect'](_0x1d20d2, 0x0, 0x0), _0x1d20d2['connect'](_0x2c83bb);
    try {
      var _0x5a4997 = getDecryptedAudioBuffer();
      audioContext['decodeAudioData'](_0x5a4997, function (_0x598d54) {
        var _0x2629ac = _0x57cc1d;
        _0x5f1724['buffer'] = _0x598d54;
        var _0x28a77e = _0x598d54['getChannelData'](0x0),
          _0x56c688 = _0x598d54['getChannelData'](0x1);
        for (var _0x7964ee = 0x0; _0x7964ee < _0x28a77e['length']; _0x7964ee++) {
          _0x28a77e[_0x7964ee] = _0x56c688[_0x7964ee];
        }
        _0x5f1724['loop'] = ![], _0x5f1724['normalize'] = !![], _0x7f1141['gain']['value'] = gainSettings['headSetGain'], _0x7f1141['connect'](_0x5f1724), _0x5f1724['connect'](_0x2c83bb);
      }, function (_0x1924bf) {
        var _0x57a02f = _0x57cc1d;
        '解码音频数据时出错' + _0x1924bf['err'];
      });
    } catch (_0x3d345a) {
      console['log'](_0x3d345a);
    }
  }

  // 构建耳机音频路径（单声道卷积混响）
  function buildHeadsetPathWithMonoConvolver(_0x3f93d5, _0x8fa9ef) {
    var _0x3e15fb = audioContext['createGain'](),
      _0x17b3a9 = audioContext['createGain'](),
      _0x13d916 = audioContext['createConvolver']();
    _0x3f93d5['connect'](_0x17b3a9), _0x3f93d5['connect'](_0x3e15fb), _0x3e15fb['connect'](_0x8fa9ef);
    try {
      var _0x2ab47d = getDecryptedAudioBuffer();
      audioContext['decodeAudioData'](_0x2ab47d, function (_0x33c095) {
        var _0xe4fa5e = _0x4c6424;
        _0x13d916['buffer'] = _0x33c095;
        var _0x1f59e2 = _0x33c095['getChannelData'](0x0),
          _0x160a03 = _0x33c095['getChannelData'](0x1);
        for (var _0x2b7048 = 0x0; _0x2b7048 < _0x1f59e2['length']; _0x2b7048++) {
          _0x160a03[_0x2b7048] = _0x1f59e2[_0x2b7048];
        }
        _0x13d916['loop'] = ![], _0x13d916['normalize'] = !![], _0x17b3a9['gain']['value'] = gainSettings['headSetGain'], _0x17b3a9['connect'](_0x13d916), _0x13d916['connect'](_0x8fa9ef);
      }, function (_0x56b88a) {
        var _0x5e6953 = _0x4c6424;
        '解码音频数据时出错' + _0x56b88a['err'];
      });
    } catch (_0x259996) {
      console['log'](_0x259996);
    }
  }

  // 构建扬声器音频路径（带卷积混响）
  function buildLoudspeakerPath(_0x5b05e7, _0x59f0dc) {
    var _0x21c94f = audioContext['createGain'](),
      _0x329936 = audioContext['createConvolver']();
    _0x5b05e7['connect'](_0x21c94f);
    try {
      var _0x952e68 = getDecryptedAudioBuffer();
      audioContext['decodeAudioData'](_0x952e68, function (_0x3e7cd3) {
        var _0x216d77 = _0x3f6094;
        _0x329936['buffer'] = _0x3e7cd3, _0x329936['loop'] = ![], _0x329936['normalize'] = !![], _0x21c94f['gain']['value'] = gainSettings['louderSpeakerGain'], _0x21c94f['connect'](_0x329936), _0x329936['connect'](_0x59f0dc);
      }, function (_0x142c61) {
        var _0xedfb30 = _0x3f6094;
        '解码音频数据时出错' + _0x142c61['err'];
      });
    } catch (_0x5458e4) {
      console['log'](_0x5458e4);
    }
  }

  // 构建扬声器音频路径（左右声道互换）
  function buildLoudspeakerPathWithSwappedChannels(_0x357acd, _0x33192c) {
    var _0x19eadc = audioContext['createGain'](),
      _0x31f8cf = audioContext['createConvolver']();
    _0x357acd['connect'](_0x19eadc);
    try {
      var _0x521c38 = getDecryptedAudioBuffer();
      audioContext['decodeAudioData'](_0x521c38, function (_0x3952f7) {
        var _0x5c886c = _0xdb95f3,
          _0xbfc5f3 = _0x3952f7['getChannelData'](0x0),
          _0x5ecd81 = _0x3952f7['getChannelData'](0x1),
          _0x22e034;
        for (var _0x484dc5 = 0x0; _0x484dc5 < _0xbfc5f3['length']; _0x484dc5++) {
          _0x22e034 = _0xbfc5f3[_0x484dc5], _0xbfc5f3[_0x484dc5] = _0x5ecd81[_0x484dc5], _0x5ecd81[_0x484dc5] = _0x22e034;
        }
        _0x31f8cf['buffer'] = _0x3952f7, _0x31f8cf['loop'] = ![], _0x31f8cf['normalize'] = !![], _0x19eadc['gain']['value'] = gainSettings['louderSpeakerGain'], _0x19eadc['connect'](_0x31f8cf), _0x31f8cf['connect'](_0x33192c);
      }, function (_0x3e22d9) {
        var _0x192174 = _0xdb95f3;
        '解码音频数据时出错' + _0x3e22d9['err'];
      });
    } catch (_0xaa1ce4) {
      console['log'](_0xaa1ce4);
    }
  }

  // 从 WASM 模块获取解密后的音频缓冲区
  function getDecryptedAudioBuffer() {
    var _0x427fba = 0x249f0,
      _0x1f97b5, _0x89ecb3;
    try {
      _0x1f97b5 = CNTVH5PlayerModule['_jsmalloc'](_0x427fba + 0x80), _0x89ecb3 = CNTVH5PlayerModule['_GetDecryptAudio'](_0x1f97b5, _0x427fba);
      let _0x5dba33 = new Uint8Array(_0x89ecb3);
      for (let _0x55b115 = 0x0; _0x55b115 < _0x89ecb3; _0x55b115++) {
        _0x5dba33[_0x55b115] = CNTVH5PlayerModule['HEAP8'][_0x1f97b5 + _0x55b115];
      }
      let _0x2cbb96 = _0x5dba33['buffer'];
      return CNTVH5PlayerModule['_jsfree'](_0x2cbb96), _0x2cbb96;
    } catch (_0x150e71) {
      console['log']('ee:', _0x150e71);
    }
    return CNTVH5PlayerModule['_jsfree'](_0x1f97b5), null;
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