import { omljs } from "./omljs.mjs";
import { omlcpp } from "./omlcpp.mjs";

let code = Deno.readTextFileSync("code.txt");

var om = omljs();
var v1 = om.compile(code, true);
console.log(v1);
Deno.writeTextFileSync("tmp.js", v1);

var om2 = omlcpp();
var v2 = om2.compile(code, true);
console.log(v2);
Deno.writeTextFileSync("tmp.cpp", v2);
