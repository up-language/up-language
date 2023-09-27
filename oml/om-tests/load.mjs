// テスト - Deno 日本語マニュアル
// https://yoshixmk.github.io/deno-manual-ja/testing.html

import * as path from "https://deno.land/std/path/mod.ts";
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);
import * as asst from "https://deno.land/std/testing/asserts.ts";


console.log(Deno.args);

import { exec, run } from "../omljs.mjs";

import { oml2ast } from "../oml2ast.mjs";

let dat = Deno.readTextFileSync(Deno.args[0]);
//console.log(dat);

//let ast = oml2ast(dat);
//console.log(ast);

let result = exec(dat);
//console.log(result);
