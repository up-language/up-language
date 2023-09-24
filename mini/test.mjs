import * as path from "https://deno.land/std/path/mod.ts";
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);


//import { code2ary } from "./code2ary.mjs";
//import { miniMAL } from "./miniMAL.mjs";

import { optiMAL } from "./optiMAL.mjs";

let code = Deno.readTextFileSync(__dirname+"/code.txt");

console.log(code);

//let ast = code2ary(code);

//console.log(JSON.stringify(ast, null, 2));

//let m = miniMAL(globalThis);
//console.log(m.eval(ast[0][1]));

let m = optiMAL(globalThis);
m.DEMO(code);

/*
Deno.test("01_test #1", () => {
    let result = exec(`
    (+ 11 22]
    `);
    //print(result);
    asst.assertEquals(result, 33);
});
*/