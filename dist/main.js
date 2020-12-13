/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkteacher_cli"] = self["webpackChunkteacher_cli"] || []).push([["main"],{

/***/ "./babel/a.js":
/*!********************!*
  !*** ./babel/a.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./b */ \"./babel/b.js\");\n\nvar arr = [1, 2, 3];\nvar h = arr.includes(function (v) {\n  return v === 3;\n});\nconsole.log(h);\nconsole.log((0,_b__WEBPACK_IMPORTED_MODULE_0__.a)());\n\n//# sourceURL=webpack://teacher-cli/./babel/a.js?");

/***/ }),

/***/ "./babel/b.js":
/*!********************!*
  !*** ./babel/b.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"./node_modules/@babel/runtime/regenerator/index.js\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"./node_modules/@babel/runtime/helpers/asyncToGenerator.js\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nvar a = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.next = 2;\n            return console.log(2);\n\n          case 2:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function a() {\n    return _ref.apply(this, arguments);\n  };\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  a: a\n});\n\n//# sourceURL=webpack://teacher-cli/./babel/b.js?");

/***/ }),

/***/ "./babel/test.js":
/*!***********************!*
  !*** ./babel/test.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"./node_modules/@babel/runtime/helpers/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! regenerator-runtime/runtime */ \"./node_modules/regenerator-runtime/runtime.js\");\n/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./b */ \"./babel/b.js\");\n/* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./a */ \"./babel/a.js\");\n\n\n// require('core-js/stable')\n// require('regenerator-runtime/runtime')\n// class Person {}\n// const arr = [1, 2, 3]\n// const h = arr.includes((v) => v === 3)\n// console.log(h)\n// const p = new Promise((resolve, reject) => {\n//   resolve(1)\n// })\n// p.then((value) => console.log(value))\n// function* foo() {}\n// console.log(new Person())\n\n\nvar arr = [1, 2, 3];\nvar h = arr.includes(function (v) {\n  return v === 3;\n});\nconsole.log(h);\nconsole.log((0,_b__WEBPACK_IMPORTED_MODULE_2__.a)());\n\nvar Person = function Person() {\n  _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Person);\n};\n\nconsole.log(new Person());\n\n//# sourceURL=webpack://teacher-cli/./babel/test.js?");

/***/ })

},
0,[["./babel/test.js","runtime-main","vendors-node_modules_babel_runtime_helpers_asyncToGenerator_js-node_modules_babel_runtime_hel-d57339"]]]);