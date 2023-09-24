import { parse } from 'npm:@babel/parser';
import { optimize } from './optimize.mjs';

let x = parse(`
console.log(11+22);
`);

x = optimize(x);

console.log(JSON.stringify(x, null, 2));

