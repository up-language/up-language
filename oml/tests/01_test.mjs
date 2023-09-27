// テスト - Deno 日本語マニュアル
// https://yoshixmk.github.io/deno-manual-ja/testing.html

import * as path from "https://deno.land/std/path/mod.ts";
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);
import * as asst from "https://deno.land/std/testing/asserts.ts";


import { exec, run } from "../omljs.mjs";

Deno.test("01_test #1", () => {
    let result = exec(`
    (+ 11 { this is comment } 22]
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
    (struct :x 123)
    `);
    result = ast2oml(result);
    asst.assertEquals(result, `(struct "x" 123)`);
});

exec(`
(define person
    (struct
     "name" "john"
     "age"  23
     "hobbies" (list "tennis" "baseball")\\`
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

/*
Deno.test("01_test #8", () => {
    let result = exec(`
        person.hobbies#1
        `);
    result = ast2oml(result);
    asst.assertEquals(result, `"baseball"`);
});
*/

Deno.test("01_test #9", () => {
    let result = exec(`
        (define count 0)
        (dolist (x person.hobbies)
          (print x)
          [set! count (+ 1 count]
        ]
        count
        `);
    //result = ast2oml(result);
    asst.assertEquals(result, 2);
});

Deno.test("01_test #10", () => {
    let result = exec(`
        (define count 0)
        (dotimes (x 3)
          (print x)
          [set! count (+ 1 count]
        ]
        count
        `);
    //result = ast2oml(result);
    asst.assertEquals(result, 3);
});

Deno.test("01_test #11", () => {
    let result = exec(`
        @person.hobbies[1]@
        `);
    result = ast2oml(result);
    asst.assertEquals(result, `"baseball"`);
});

Deno.test("01_test #12", () => {
    let result = exec(`
        (set! @person.hobbies[1]@ "golf"}
        @person.hobbies[1]@
        `);
    result = ast2oml(result);
    asst.assertEquals(result, `"golf"`);
});

Deno.test("01_test #13", () => {
    let result = exec("`abc``def`");
    asst.assertEquals(result, "abc`def");
});

Deno.test("01_test #14", () => {
    let result = exec("(define a `abc`)(define b `xyz`)`${a}-${b}`");
    asst.assertEquals(result, "abc-xyz");
});

Deno.test("01_test #15", () => {
    let result = exec(
        "(do [(x 1 (+ x 1))" + "\n" +
        "     (result 0]" + "\n" +
        "    [(> x 3) result]" + "\n" +
        "    (print `x=${x}`)" + "\n" +
        "    [set! result (+ result x]" + "\n" +
        "    (print `result=${result}`)" + "\n"
        );
    //result = ast2oml(result);
    asst.assertEquals(result, 6);
});

Deno.test("01_test #16", () => {
    let result = exec(
        "(do* [(x 1 (+ x 1))" + "\n" +
        "      (result 0]" + "\n" +
        "     [(> x 3) result]" + "\n" +
        "     (print `x=${x}`)" + "\n" +
        "     [set! result (+ result x]" + "\n" +
        "     (print `result=${result}`)" + "\n"
        );
    //result = ast2oml(result);
    asst.assertEquals(result, 6);
});

Deno.test("01_test #17", () => {
    let result = exec(`
        (define x 10)
        (define y 20)
        (do
            [(count 0 @count+1@)
             (x y)
             (y x)]
            [(= count 0) (list x y)]
        `);
    result = ast2oml(result);
    asst.assertEquals(result, `(list 20 10)`);
});

Deno.test("01_test #18", () => {
    let result = exec(`
        (define x 10)
        (define y 20)
        (do*
            [(count 0 @count+1@)
             (x globalThis.y)
             (y x)]
            [(= count 0) (list x y)]
        `);
    result = ast2oml(result);
    asst.assertEquals(result, `(list 20 20)`);
});
