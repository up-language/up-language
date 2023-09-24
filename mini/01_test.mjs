// テスト - Deno 日本語マニュアル
// https://yoshixmk.github.io/deno-manual-ja/testing.html

import * as path from "https://deno.land/std/path/mod.ts";
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);
import * as asst from "https://deno.land/std/testing/asserts.ts";


import { optiMAL } from "./optiMAL.mjs";

//let code = Deno.readTextFileSync(__dirname+"/code.txt");
//console.log(code);

let m = optiMAL(globalThis);

Deno.test("01_test #0", () => {
    let result = m.DEMO(`
    (print (+ 11 22]`);
    m.print(result);
    asst.assertEquals(result, undefined);
});

Deno.test("01_test #1", () => {
    let result = m.DEMO(`
    (+ 11 /*comment*/ 22]`);
    m.print(result);
    asst.assertEquals(result, 33);
});

Deno.test("01_test #2", () => {
    let result = m.DEMO(`
    (list 11 22]`);
    result = m.data2code(result);
    asst.assertEquals(result, `(list 11 22)`);
    //asst.assertEquals(result, `[11,22]`);
});

Deno.test("01_test #3", () => {
    let result = m.DEMO(`
    (struct :x 123]`);
    result = m.data2code(result);
    asst.assertEquals(result, `(struct "x" 123)`);
    //asst.assertEquals(result, `{"x":123}`);
});

m.DEMO(`
(define person
    (struct
     "name" "john"
     "age"  23
     "hobbies" (list "tennis" "baseball")?
(print person)?`);

Deno.test("01_test #5", () => {
    let result = m.DEMO(`
        (.- person :name]`);
    result = m.data2code(result);
    asst.assertEquals(result, `"john"`);
});

Deno.test("01_test #6", () => {
    let result = m.DEMO(`
        (.- person :age]`);
    result = m.data2code(result);
    asst.assertEquals(result, `23`);
});

Deno.test("01_test #8", () => {
    let result = m.DEMO(`
        (.- (.- person :hobbies) 1)`);
    result = m.data2code(result);
    asst.assertEquals(result, `"baseball"`);
});

Deno.test("01_test #9", () => {
    let result = m.DEMO(`@
        (.- (.- person :hobbies) 1)@`);
    //result = data2code(result);
    asst.assertEquals(result, "\n        (.- (.- person :hobbies) 1)");
});

Deno.test("01_test #10", () => {
    let result = m.DEMO(
`(define (inc2 x) (+ x 2)?
 (map inc2 (list 2 3 4)?`);
    result = m.data2code(result);
    asst.assertEquals(result, `(list 4 5 6)`);
});

Deno.test("01_test #11", () => {
    let result = m.DEMO(`
    (+ 11 22 33]`);
    m.print(result);
    asst.assertEquals(result, 66);
});

Deno.test("01_test #12", () => {
    let result = m.DEMO(
`'(+ 11 22)`);
    result = m.ast2code(result);
    asst.assertEquals(result, `(+ 11 22)`);
});

Deno.test("01_test #13", () => {
    let result = m.DEMO(
`''(+ 11 22)`);
    result = m.ast2code(result);
    asst.assertEquals(result, `'(+ 11 22)`);
});

Deno.test("01_test #14", () => {
    let result = m.DEMO(
`(list @11@ @22@)`);
    result = m.ast2code(result);
    asst.assertEquals(result, `("11" "22")`);
});
