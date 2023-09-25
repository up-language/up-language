// テスト - Deno 日本語マニュアル
// https://yoshixmk.github.io/deno-manual-ja/testing.html

import * as path from "https://deno.land/std/path/mod.ts";
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);
import * as asst from "https://deno.land/std/testing/asserts.ts";


import { exec, run } from "./omljs.mjs";

import { oml2ast } from "./oml2ast.mjs";

let dat = Deno.readTextFileSync("./test.dat");
console.log(dat);

let ast = oml2ast(dat);
console.log(ast);

let result = run(dat);
console.log(result);
