(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ast2code = ast2code;
exports.code2ast = code2ast;
exports.data2code = data2code;
exports.om$typeis = om$typeis;
exports.om$typeof = om$typeof;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function om$tokenize(str) {
  var re = /[\s,]*([()\[\]'`]|"(?:\\.|[^\\"])*"|@(?:@@|[^@])*@|;.*|#.*|[^\s,()\[\]'"`;@]*)/g;
  var result = [];
  var token;
  while ((token = re.exec(str)[1]) !== "") {
    if (token[0] === ";") continue;
    if (token[0] === "#") continue;
    //if (token.match(/^-?[0-9][0-9.]*$/)) token = parseFloat(token, 10);
    if (isFinite(token)) token = parseFloat(token, 10);
    result.push(token);
  }
  return result;
}
function om$typeof(x) {
  if (x === undefined) return "undefined";
  if (x === null) return "null";
  if (_typeof(x) !== "object") {
    return _typeof(x);
  }
  if (!x.hasOwnProperty("!")) return _typeof(x);
  return x["!"];
}
function om$typeis(x, t) {
  return om$typeof(x) === t;
}
function read_token(code, exp) {
  if (code.length === 0) return undefined;
  var token = code.shift();
  exp.push(token);
  return token;
}
function read_list(code, exp, ch) {
  var result = [];
  var ast;
  while ((ast = read_sexp(code, exp)) !== undefined) {
    if (ast === "?") {
      code.unshift("?");
      break;
    } else if (ast === "]") {
      if (ch !== "[") code.unshift("]");
      break;
    } else if (ast === ")") {
      break;
    }
    result.push(ast);
  }
  return result;
}
function read_sexp(code, exp) {
  var token = read_token(code, exp);
  if (token === undefined) return undefined;
  switch (token) {
    case "false":
      return false;
    case "true":
      return true;
    case "null":
      return null;
    case "undefined":
      return {
        "!": "undefined"
      };
  }
  var ch = token[0];
  switch (ch) {
    case "(":
    case "[":
      var lst = read_list(code, exp, ch);
      return lst;
    case ")":
    case "]":
    case "?":
      return ch;
    case "'":
      var ast = read_sexp(code, exp);
      return ["`", ast];
    case '"':
      token = JSON.parse(token);
      //return ["`", token];
      return token;
    case "@":
      token = token.replace(/(^@|@$)/g, "");
      token = token.replace(/(@@)/g, "@");
      return ["`", token];
    case ":":
      return ["`", token.substring(1)];
    default:
      if (typeof token === "string" /*&& token !== '&'*/) return {
        "!": "id",
        "?": token
      };
      return token;
  }
}
function code2ast(text) {
  var code = om$tokenize(text);
  var result = [];
  while (true) {
    var exp = [];
    var ast = read_sexp(code, exp);
    if (ast === undefined) break;
    if (ast === ")") continue;
    if (ast === "]") continue;
    if (ast === "?") continue;
    result.push(ast);
  }
  return result;
}

/*
export function code2do(text) {
  var ary = code2ast(text);
  var do_ = ["do"];
  for (var x of ary) {
    do_.push(x[1]);
  }
  return do_;
}
*/

function ast2code(ast) {
  if (ast === null) return "null";
  if (ast === undefined) return "undefined";
  if (typeof ast === "number") return JSON.stringify(ast);
  if (typeof ast === "string") return JSON.stringify(ast);
  if (typeof ast === "boolean") return JSON.stringify(ast);
  if (om$typeis(ast, "id")) return ast["?"];
  if (ast instanceof Array) {
    if (ast[0] === "`") {
      if (typeof ast[1] === "string") return JSON.stringify(ast[1]);
      return "'" + ast2code(ast[1]);
    }
    var result = "(";
    for (var i = 0; i < ast.length; i++) {
      if (i > 0) result += " ";
      result += ast2code(ast[i]);
    }
    result += ")";
    return result;
  } else {
    var _result = "(struct";
    var keys = Object.keys(ast);
    keys.sort();
    for (var _i = 0; _i < keys.length; _i++) {
      _result += " ";
      _result += JSON.stringify(keys[_i]);
      _result += " ";
      _result += ast2code(ast[keys[_i]]);
    }
    _result += ")";
    return _result;
  }
}
function data2code(ast) {
  if (ast === null) return "null";
  if (ast === undefined) return "undefined";
  if (typeof ast === "number") return JSON.stringify(ast);
  if (typeof ast === "string") return JSON.stringify(ast);
  if (typeof ast === "boolean") return JSON.stringify(ast);
  if (ast instanceof Array) {
    var result = "(list";
    for (var i = 0; i < ast.length; i++) {
      result += " ";
      result += data2code(ast[i]);
    }
    result += ")";
    return result;
  } else {
    var _result2 = "(struct";
    var keys = Object.keys(ast);
    keys.sort();
    for (var _i2 = 0; _i2 < keys.length; _i2++) {
      _result2 += " ";
      _result2 += JSON.stringify(keys[_i2]);
      _result2 += " ";
      _result2 += data2code(ast[keys[_i2]]);
    }
    _result2 += ")";
    return _result2;
  }
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.miniMAL = miniMAL;
var _code2data = require("./code2data.mjs");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; } // miniMAL
// Copyright (C) 2017 Joel Martin
// Licensed under MPL 2.0
function miniMAL(E) {
  function new_env(ast, env, exprs) {
    // Return new Env with symbols in ast bound to
    // corresponding values in exprs
    env = Object.create(env);
    ast.some(function (a, i) {
      return a["?"] == "&" ? env[ast[i + 1]["?"]] = exprs.slice(i) : (env[a["?"]] = exprs[i], 0);
    });
    return env;
  }
  function EVAL(ast, env, seq, f, el) {
    while (true) {
      if (seq) {
        // Evaluate the list or object (i.e. eval_ast)
        return Object.keys(ast).reduce(function (a, k) {
          return a[k] = EVAL(ast[k], env), a;
        }, seq);
      } else if (!Array.isArray(ast)) {
        // eval
        /*
        if (typeof ast == "string") {
          return ast in env                // symbol in env?
            ? env[ast]                     // lookup symbol
            : E.throw(ast + " not found")  // undefined symbol
        }
        */
        if ((0, _code2data.om$typeis)(ast, "id")) {
          return ast["?"] in env // symbol in env?
          ? env[ast["?"]] // lookup symbol
          : E["throw"](ast["?"] + " not found"); // undefined symbol
        } else {
          return (0, _code2data.om$typeis)(ast, "object") ? ast ? EVAL(ast, env, {}) // eval object values
          : ast // return ast unchanged
          : ast;
        }
      } else {
        // apply
        if (ast[0]["?"] == "def") {
          // update current environment
          return env[ast[1]["?"]] = EVAL(ast[2], env);
        } else if (ast[0]["?"] == "~") {
          // mark as macro
          return Object.assign(EVAL(ast[1], env), {
            M: 1
          }); // mark as macro
        } else if (ast[0] == "`") {
          // quote (unevaluated)
          return ast[1];
        } else if (ast[0]["?"] == ".-") {
          // get or set attribute
          el = EVAL(ast.slice(1), env, []);
          var x = el[0][el[1]];
          return 2 in el ? el[0][el[1]] = el[2] : x;
        } else if (ast[0]["?"] == ".") {
          // call object method
          el = EVAL(ast.slice(1), env, []);
          var _x = el[0][el[1]];
          return _x.apply(el[0], el.slice(2));
        } else if (ast[0]["?"] == "try") {
          // try/catch
          try {
            return EVAL(ast[1], env);
          } catch (e) {
            return EVAL(ast[2][2], new_env([ast[2][1]], env, [e]));
          }
        } else if (ast[0]["?"] == "fn") {
          // define new function (lambda)
          return Object.assign(function () {
            for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
              a[_key] = arguments[_key];
            }
            return EVAL(ast[2], new_env(ast[1], env, a));
          }, {
            A: [ast[2], env, ast[1]]
          });

          // TCO cases
        } else if (ast[0]["?"] == "let") {
          // new environment with bindings
          env = Object.create(env);
          ast[1].map(function (e, i) {
            return i % 2 ? env[ast[1][i - 1]] = EVAL(ast[1][i], env) : 0;
          });
          ast = ast[2];
        } else if (ast[0]["?"] == "do") {
          // multiple forms (for side-effects)
          EVAL(ast.slice(1, -1), env, []);
          ast = ast[ast.length - 1];
        } else if (ast[0]["?"] == "if") {
          // branching conditional
          ast = EVAL(ast[1], env) ? ast[2] : ast[3];
        } else {
          // invoke list form
          f = EVAL(ast[0], env);
          if (f.M) {
            ast = f.apply(void 0, _toConsumableArray(ast.slice(1)));
          } else {
            el = EVAL(ast.slice(1), env, []);
            if (f.A) {
              ast = f.A[0];
              env = new_env(f.A[2], f.A[1], el);
            } else {
              return f.apply(void 0, _toConsumableArray(el));
            }
          }
        }
      }
    }
  }
  E = Object.assign(Object.create(E || this), {
    "js": eval,
    "eval": function _eval() {
      return EVAL(arguments.length <= 0 ? undefined : arguments[0], E);
    },
    // These could all also be interop
    "=": function _() {
      return (arguments.length <= 0 ? undefined : arguments[0]) === (arguments.length <= 1 ? undefined : arguments[1]);
    },
    "<": function _() {
      return (arguments.length <= 0 ? undefined : arguments[0]) < (arguments.length <= 1 ? undefined : arguments[1]);
    },
    //"+": (...a) => a[0] + a[1],
    "+": function _() {
      var result = 0;
      for (var _len2 = arguments.length, a = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        a[_key2] = arguments[_key2];
      }
      for (var _i = 0, _a = a; _i < _a.length; _i++) {
        var n = _a[_i];
        result += n;
      }
      return result;
    },
    "-": function _() {
      return (arguments.length <= 0 ? undefined : arguments[0]) - (arguments.length <= 1 ? undefined : arguments[1]);
    },
    "*": function _() {
      return (arguments.length <= 0 ? undefined : arguments[0]) * (arguments.length <= 1 ? undefined : arguments[1]);
    },
    "/": function _() {
      return (arguments.length <= 0 ? undefined : arguments[0]) / (arguments.length <= 1 ? undefined : arguments[1]);
    },
    "isa": function isa() {
      return (arguments.length <= 0 ? undefined : arguments[0]) instanceof (arguments.length <= 1 ? undefined : arguments[1]);
    },
    "type": function type() {
      return _typeof(arguments.length <= 0 ? undefined : arguments[0]);
    },
    "new": function _new() {
      var _a$;
      for (var _len3 = arguments.length, a = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        a[_key3] = arguments[_key3];
      }
      return new ((_a$ = a[0]).bind.apply(_a$, a))();
    },
    "del": function del() {
      for (var _len4 = arguments.length, a = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        a[_key4] = arguments[_key4];
      }
      return delete a[0][a[1]];
    },
    //"map":   (...a) => a[1].map(x => a[0](x)),
    "throw": function _throw() {
      throw arguments.length <= 0 ? undefined : arguments[0];
    },
    "read": function read() {
      return JSON.parse(arguments.length <= 0 ? undefined : arguments[0]);
    },
    //"slurp": (...a) => require("fs").readFileSync(a[0],"utf8"),
    //"load":  (...a) => EVAL(JSON.parse(require("fs").readFileSync(a[0],"utf8")),E),
    "load": function load() {
      return EVAL(JSON.parse(Deno.readTextFileSync(arguments.length <= 0 ? undefined : arguments[0])), E);
    },
    "list": function list() {
      for (var _len5 = arguments.length, a = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        a[_key5] = arguments[_key5];
      }
      return a;
    },
    "struct": function struct() {
      for (var _len6 = arguments.length, a = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        a[_key6] = arguments[_key6];
      }
      var len = a.length;
      if (len % 2 === 1) len -= 1;
      var result = {};
      for (var i = 0; i < len; i += 2) {
        result[a[i]] = a[i + 1];
      }
      return result;
    },
    "print": function print() {
      globalThis.console.log((0, _code2data.data2code)(arguments.length <= 0 ? undefined : arguments[0]));
    },
    "rep": function rep() {
      return JSON.stringify(EVAL(JSON.parse(arguments.length <= 0 ? undefined : arguments[0]), E));
    }
  });

  // Lib specific
  return E;
}

},{"./code2data.mjs":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optiMAL = optiMAL;
var _code2data = require("./code2data.mjs");
var _miniMAL = require("./miniMAL.mjs");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
//import * as path from "https://deno.land/std/path/mod.ts";
//const __filename = path.fromFileUrl(import.meta.url);
//const __dirname = path.dirname(__filename);

function optiMAL(E) {
  var m = (0, _miniMAL.miniMAL)(E);
  m.ast2code = _code2data.ast2code;
  m.data2code = _code2data.data2code;
  m.DEMO = function (exp) {
    return m.EVAL(exp, true);
  };
  m.EVAL = function (exp, debug) {
    var src = exp;
    var steps = (0, _code2data.code2ast)(src);
    var last;
    var _iterator = _createForOfIteratorHelper(steps),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var step = _step.value;
        var ast = step;
        var code = (0, _code2data.ast2code)(ast);
        try {
          if (debug) {
            globalThis.console.log('[CODE] ' + code);
            globalThis.console.log(' [AST] ' + JSON.stringify(ast));
          }
          var val = m.eval(ast);
          last = val;
          if (typeof val === 'function') {
            if (debug) globalThis.console.log('==> ' + 'function');
          } else if (!(val instanceof Array) && val instanceof Object && Object.prototype.toString.call(val) !== '[object Object]') {
            if (debug) globalThis.console.log('==> ' + Object.prototype.toString.call(val) + ' ' + JSON.stringify(val));
          } else {
            if (debug) globalThis.console.log('==> ' + (0, _code2data.data2code)(val));
          }
        } catch (e) {
          if (!debug) {
            globalThis.console.log('[CODE] ' + code);
            globalThis.console.log(' [AST] ' + JSON.stringify(ast));
          }
          globalThis.console.log(' [EXCEPTION]');
          if (e.stack) globalThis.console.log(e.stack);else globalThis.console.log(e);
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return last;
  };
  m.LOAD = function (path, debug) {
    var src = require("fs").readFileSync(path);
    return m.EVAL(src, debug);
  };
  //m.load(__dirname + "/core.json");
  m.EVAL("\n        (def new (fn (a & b) (. Reflect \"construct\" a b)))\n        (def del (fn (a b) (. Reflect \"deleteProperty\" a b)))\n        #(def print (fn (a) (do (. console \"log\" a) null)))\n        (def pr* (fn (a) (. JSON \"stringify\" a)))\n        (def map (fn (a b) (. b \"map\" (fn (x) (a x)))))\n        (def list (fn (& a) a))\n        (def >= (fn (a b) (if (< a b) false true)))\n        (def > (fn (a b) (if (>= a b) (if (= a b) false true) false)))\n        (def <= (fn (a b) (if (> a b) false true)))\n        (def classOf (fn (a) (. (.- (.- Object \"prototype\") \"toString\") \"call\" a)))\n        (def not (fn (a) (if a false true)))\n        (def null? (fn (a) (= null a)))\n        (def true? (fn (a) (= true a)))\n        (def false? (fn (a) (= false a)))\n        (def string? (fn (a) (if (= a null) false (= \"String\" (.- (.- a \"constructor\") \"name\")))))\n        (def pr-list* (fn (a b c) (let (lst (map (fn (x) (if c (pr* x) (if (string? x) x (pr* x)))) a)) (. lst \"join\" b))))\n        (def pr-str (fn (& a) (pr-list* a \" \" true)))\n        (def str (fn (& a) (pr-list* a \"\" false)))\n        (def prn (fn (& a) (print (pr-list* a \" \" true))))\n        (def println (fn (& a) (print (pr-list* a \" \" false))))\n        (def list? (fn (a) (. Array \"isArray\" a)))\n        (def contains? (fn (a b) (. a \"hasOwnProperty\" b)))\n        (def get (fn (a b) (if (contains? a b) (.- a b) null)))\n        (def set (fn (a b c) (do (.- a b c) a)))\n        (def keys (fn (a) (. Object \"keys\" a)))\n        (def vals (fn (a) (. Object \"values\" a)))\n        (def cons (fn (a b) (. '() \"concat\" (list a) b)))\n        (def concat (fn (& a) (. (.- (list) \"concat\") \"apply\" (list) a)))\n        (def nth get)\n        (def count (fn (a) (.- a \"length\")))\n        (def first (fn (a) (if (> (count a) 0) (nth a 0) null)))\n        (def last (fn (a) (nth a (- (count a) 1))))\n        (def empty? (fn (a) (if (list? a) (= 0 (count a)) (= a null))))\n        (def slice (fn (a b & end) (. a \"slice\" b (if (> (count end) 0) (get end 0) (count a)))))\n        (def rest (fn (a) (slice a 1)))\n        (def apply (fn (f & b) (. f \"apply\" f (concat (slice b 0 -1) (last b)))))\n        (def and (~ (fn (& xs) (if (empty? xs) true (if (= 1 (count xs)) (first xs) (list \"let\" (list \"__and\" (first xs)) (list \"if\" \"__and\" (concat '(and) (rest xs)) \"__and\")))))))\n        (def or (~ (fn (& xs) (if (empty? xs) null (if (= 1 (count xs)) (first xs) (list \"let\" (list \"or_FIXME\" (first xs)) (list \"if\" \"or_FIXME\" \"or_FIXME\" (concat '(or) (rest xs)))))))))\n        ");
  m.EVAL("(def define (~ (fn ($first & $rest)\n          (let ($exp)\n            (if (list? $first)\n                (concat (list 'def (first $first) (concat (list 'fn (rest $first)) $rest)))\n              (concat (list 'def $first) $rest))))))\n        (def cond:builder (fn ($list)\n          (if (empty? $list)\n              #nil\n            (let ($top (. $list \"shift\"))\n              (if (= (nth $top 0) 'else)\n                  (nth $top 1)\n                (list 'if (nth $top 0)\n                    (nth $top 1)\n                  (cond:builder $list)))))))\n        (def cond (~ (fn (& $rest)\n          (cond:builder $rest))))");
  return m;
}

},{"./code2data.mjs":1,"./miniMAL.mjs":2,"fs":4}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add2 = add2;
function add2(a, b) {
  return a + b;
}

},{}],6:[function(require,module,exports){
"use strict";

var _add = require("./add2.mjs");
var _optiMAL = require("../mini/optiMAL.mjs");
var testFunc = function testFunc() {
  console.log("Hello World");
};
testFunc();
console.log((0, _add.add2)(11, 22));
globalThis.add2 = _add.add2;

//let m = optiMAL(globalThis);
var m = (0, _optiMAL.optiMAL)({});
m.DEMO("\n(print(+ 22 33]\n");
var r = m.DEMO("\n(print(+ 33 44]\n");
m.print(r);

},{"../mini/optiMAL.mjs":3,"./add2.mjs":5}]},{},[6]);
