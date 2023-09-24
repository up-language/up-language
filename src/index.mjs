import { add2 } from "./add2.mjs";
import { optiMAL } from "../mini/optiMAL.mjs"

let testFunc = () => {
  console.log("Hello World");
}
 
testFunc();

console.log(add2(11, 22));

globalThis.add2 = add2;

//let m = optiMAL(globalThis);
let m = optiMAL({});
m.DEMO(`
(print(+ 22 33]
`);
let r = m.DEMO(`
(print(+ 33 44]
`);
m.print(r);
