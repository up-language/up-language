// テスト - Deno 日本語マニュアル
// https://yoshixmk.github.io/deno-manual-ja/testing.html

import * as path from "https://deno.land/std/path/mod.ts";
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);
import * as asst from "https://deno.land/std/testing/asserts.ts";


import { om$typeof, om$typeis, code2ast, ast2code, data2code } from "./code2data.mjs";

Deno.test("ast_test #01", () => {
    asst.assertEquals(om$typeof(undefined), "undefined");
});

Deno.test("ast_test #02", () => {
    asst.assertEquals(om$typeof(null), "null");
});

Deno.test("ast_test #03", () => {
    asst.assertEquals(om$typeof(123), "number");
});

Deno.test("ast_test #04", () => {
    asst.assertEquals(om$typeof("abc"), "string");
});

Deno.test("ast_test #05", () => {
    asst.assert(om$typeis({"!": "id", "?": "abc"}, "id"));
});

Deno.test("ast_test #06", () => {
    asst.assert(om$typeis(undefined, "undefined"));
});

Deno.test("ast_test #07", () => {
    asst.assert(om$typeis(null, "null"));
});

Deno.test("ast_test #08", () => {
    asst.assert(om$typeis(123, "number"));
});

Deno.test("ast_test #09", () => {
    asst.assert(om$typeis("abc", "string"));
});

Deno.test("ast_test #10", () => {
    asst.assert(om$typeis({"!": "id", "?": "abc"}, "id"));
});
