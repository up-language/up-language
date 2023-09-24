import { code2ary } from "https://deno.land/x/up_lang/mini/code2ary.mjs";
import { miniMAL } from "https://deno.land/x/up_lang/mini/miniMAL.mjs";

let code = Deno.readTextFileSync("code.txt");

console.log(code);

let ast = code2ary(code);

console.log(JSON.stringify(ast, null, 2));

let m = miniMAL(globalThis);
console.log(m.eval(ast[0][1]));
