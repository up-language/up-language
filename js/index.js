(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add2 = add2;
function add2(a, b) {
  return a + b;
}

},{}],2:[function(require,module,exports){
"use strict";

var _add = require("./add2.mjs");
var testFunc = function testFunc() {
  console.log("Hello World");
};
testFunc();
console.log((0, _add.add2)(11, 22));
globalThis.add2 = _add.add2;

},{"./add2.mjs":1}]},{},[2]);
