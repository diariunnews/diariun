"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "utils_creditos_ts";
exports.ids = ["utils_creditos_ts"];
exports.modules = {

/***/ "./lib/supabaseClient.ts":
/*!*******************************!*\
  !*** ./lib/supabaseClient.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n// lib/supabaseClient.ts\n\nconst supabaseUrl = \"https://uwwlcvfjbipgndhkjjkm.supabase.co\"; // 👉 cámbialo\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3d2xjdmZqYmlwZ25kaGtqamttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjczNTYsImV4cCI6MjA2NzU0MzM1Nn0.72O8AGkeEmta29L1PcQO-sXTyaFNfQiIEicXMVYa_Lc\"; // 👉 cámbialo\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvc3VwYWJhc2VDbGllbnQudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0JBQXdCO0FBQzZCO0FBRXJELE1BQU1DLGNBQWMsNENBQTRDLGNBQWM7QUFDOUUsTUFBTUMsa0JBQWtCLG9OQUFvTixjQUFjO0FBRW5QLE1BQU1DLFdBQVdILG1FQUFZQSxDQUFDQyxhQUFhQyxpQkFBaUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kaWFyaXVuLy4vbGliL3N1cGFiYXNlQ2xpZW50LnRzPzNhN2QiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL3N1cGFiYXNlQ2xpZW50LnRzXHJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJAc3VwYWJhc2Uvc3VwYWJhc2UtanNcIjtcclxuXHJcbmNvbnN0IHN1cGFiYXNlVXJsID0gXCJodHRwczovL3V3d2xjdmZqYmlwZ25kaGtqamttLnN1cGFiYXNlLmNvXCI7IC8vIPCfkYkgY8OhbWJpYWxvXHJcbmNvbnN0IHN1cGFiYXNlQW5vbktleSA9IFwiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5WM2QyeGpkbVpxWW1sd1oyNWthR3RxYW10dElpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTlRFNU5qY3pOVFlzSW1WNGNDSTZNakEyTnpVME16TTFObjAuNzJPOEFHa2VFbXRhMjlMMVBjUU8tc1hUeWFGTmZRaUlFaWNYTVZZYV9MY1wiOyAvLyDwn5GJIGPDoW1iaWFsb1xyXG5cclxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZUFub25LZXkpO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50Iiwic3VwYWJhc2VVcmwiLCJzdXBhYmFzZUFub25LZXkiLCJzdXBhYmFzZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/supabaseClient.ts\n");

/***/ }),

/***/ "./utils/creditos.ts":
/*!***************************!*\
  !*** ./utils/creditos.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getCreditosUsuario: () => (/* binding */ getCreditosUsuario),\n/* harmony export */   restarCredito: () => (/* binding */ restarCredito)\n/* harmony export */ });\n/* harmony import */ var _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/supabaseClient */ \"./lib/supabaseClient.ts\");\n\n// Consulta el saldo actual de créditos\nasync function getCreditosUsuario(user_id) {\n    const { data, error } = await _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_0__.supabase.from(\"creditos_usuario\").select(\"creditos\").eq(\"user_id\", user_id).single();\n    if (error || !data) return 0;\n    return data.creditos;\n}\n// Descuenta un crédito usando la función SQL creada\nasync function restarCredito(user_id) {\n    const { error } = await _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_0__.supabase.rpc(\"restar_credito\", {\n        p_user_id: user_id\n    });\n    return !error;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi91dGlscy9jcmVkaXRvcy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBaUQ7QUFFakQsdUNBQXVDO0FBQ2hDLGVBQWVDLG1CQUFtQkMsT0FBZTtJQUN0RCxNQUFNLEVBQUVDLElBQUksRUFBRUMsS0FBSyxFQUFFLEdBQUcsTUFBTUoseURBQVFBLENBQ25DSyxJQUFJLENBQUMsb0JBQ0xDLE1BQU0sQ0FBQyxZQUNQQyxFQUFFLENBQUMsV0FBV0wsU0FDZE0sTUFBTTtJQUNULElBQUlKLFNBQVMsQ0FBQ0QsTUFBTSxPQUFPO0lBQzNCLE9BQU9BLEtBQUtNLFFBQVE7QUFDdEI7QUFFQSxvREFBb0Q7QUFDN0MsZUFBZUMsY0FBY1IsT0FBZTtJQUNqRCxNQUFNLEVBQUVFLEtBQUssRUFBRSxHQUFHLE1BQU1KLHlEQUFRQSxDQUFDVyxHQUFHLENBQUMsa0JBQWtCO1FBQUVDLFdBQVdWO0lBQVE7SUFDNUUsT0FBTyxDQUFDRTtBQUNWIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGlhcml1bi8uL3V0aWxzL2NyZWRpdG9zLnRzPzI4YmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tIFwiLi4vbGliL3N1cGFiYXNlQ2xpZW50XCI7XHJcblxyXG4vLyBDb25zdWx0YSBlbCBzYWxkbyBhY3R1YWwgZGUgY3LDqWRpdG9zXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDcmVkaXRvc1VzdWFyaW8odXNlcl9pZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oJ2NyZWRpdG9zX3VzdWFyaW8nKVxyXG4gICAgLnNlbGVjdCgnY3JlZGl0b3MnKVxyXG4gICAgLmVxKCd1c2VyX2lkJywgdXNlcl9pZClcclxuICAgIC5zaW5nbGUoKTtcclxuICBpZiAoZXJyb3IgfHwgIWRhdGEpIHJldHVybiAwO1xyXG4gIHJldHVybiBkYXRhLmNyZWRpdG9zO1xyXG59XHJcblxyXG4vLyBEZXNjdWVudGEgdW4gY3LDqWRpdG8gdXNhbmRvIGxhIGZ1bmNpw7NuIFNRTCBjcmVhZGFcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc3RhckNyZWRpdG8odXNlcl9pZDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UucnBjKCdyZXN0YXJfY3JlZGl0bycsIHsgcF91c2VyX2lkOiB1c2VyX2lkIH0pO1xyXG4gIHJldHVybiAhZXJyb3I7XHJcbn1cclxuIl0sIm5hbWVzIjpbInN1cGFiYXNlIiwiZ2V0Q3JlZGl0b3NVc3VhcmlvIiwidXNlcl9pZCIsImRhdGEiLCJlcnJvciIsImZyb20iLCJzZWxlY3QiLCJlcSIsInNpbmdsZSIsImNyZWRpdG9zIiwicmVzdGFyQ3JlZGl0byIsInJwYyIsInBfdXNlcl9pZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./utils/creditos.ts\n");

/***/ })

};
;