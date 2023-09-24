// テスト - Deno 日本語マニュアル
// https://yoshixmk.github.io/deno-manual-ja/testing.html

import * as path from "https://deno.land/std/path/mod.ts";
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);
import * as asst from "https://deno.land/std/testing/asserts.ts";


import { exec, run } from "../omljs.mjs";

Deno.test("01_test #1", () => {
    let result = exec(`
    (+ 11 22]
    `);
    //print(result);
    asst.assertEquals(result, 33);
});

Deno.test("01_test #2", () => {
    let result = exec(`
    (list 11 22]
    `);
    result = ast2oml(result);
    asst.assertEquals(result, `(list 11 22)`);
});

Deno.test("01_test #3", () => {
    let result = exec(`
    (struct :x 123]
    `);
    result = ast2oml(result);
    asst.assertEquals(result, `(struct "x" 123)`);
});

Deno.test("01_test #4", () => {
    let result = exec(`
    {:x 123}
    `);
    result = ast2oml(result);
    asst.assertEquals(result, `(struct "x" 123)`);
});

exec(`
(define person
    (struct
     "name" "john"
     "age"  23
     "hobbies" (list "tennis" "baseball").`
);

Deno.test("01_test #5", () => {
    let result = exec(`
        @person.name@
        `);
    result = ast2oml(result);
    asst.assertEquals(result, `"john"`);
});

Deno.test("01_test #6", () => {
    let result = exec(`
        @person["age"]@
        `);
    result = ast2oml(result);
    asst.assertEquals(result, `23`);
});

Deno.test("01_test #7", () => {
    let result = exec(`
        person.name
        `);
    result = ast2oml(result);
    asst.assertEquals(result, `"john"`);
});

Deno.test("01_test #8", () => {
    let result = exec(`
        person.hobbies#1
        `);
    result = ast2oml(result);
    asst.assertEquals(result, `"baseball"`);
});
