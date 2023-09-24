import * as path from "https://deno.land/std/path/mod.ts";
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);

//let code = Deno.readTextFileSync(__dirname + "/optiMAL.js");
let code = Deno.readTextFileSync(__dirname + "/js/index.js");
console.log(code);
(0, eval)(code);

console.log(add2(11, 22));
