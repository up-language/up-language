// miniMAL
// Copyright (C) 2017 Joel Martin
// Licensed under MPL 2.0

import { code2ast, ast2code, data2code } from "./code2data.mjs";
import { om$typeis } from "./code2data.mjs";

export function miniMAL(E) {

  function new_env(ast, env, exprs) {
    // Return new Env with symbols in ast bound to
    // corresponding values in exprs
    env = Object.create(env)
    ast.some((a, i) => a["?"] == "&" ? env[ast[i + 1]["?"]] = exprs.slice(i)
      : (env[a["?"]] = exprs[i], 0))
    return env
  }

  function EVAL(ast, env, seq, f, el) {
    while (true) {
      if (seq) {
        // Evaluate the list or object (i.e. eval_ast)
        return Object.keys(ast).reduce((a, k) => (a[k] = EVAL(ast[k], env), a), seq)
      } else if (!Array.isArray(ast)) {
        // eval
        /*
        if (typeof ast == "string") {
          return ast in env                // symbol in env?
            ? env[ast]                     // lookup symbol
            : E.throw(ast + " not found")  // undefined symbol
        }
        */
        if (om$typeis(ast, "id")) {
          return ast["?"] in env                // symbol in env?
            ? env[ast["?"]]                     // lookup symbol
            : E.throw(ast["?"] + " not found")  // undefined symbol
        }
        else {
          return (om$typeis(ast, "object"))
            ? ast
              ? EVAL(ast, env, {})         // eval object values
              : ast                        // return ast unchanged
            : ast
        }
      } else {
        // apply
        if (ast[0]["?"] == "def") {        // update current environment
          return env[ast[1]["?"]] = EVAL(ast[2], env)
        } else if (ast[0]["?"] == "~") {  // mark as macro
          return Object.assign(EVAL(ast[1], env), { M: 1 }) // mark as macro
        } else if (ast[0] == "`") {   // quote (unevaluated)
          return ast[1]
        } else if (ast[0]["?"] == ".-") {  // get or set attribute
          el = EVAL(ast.slice(1), env, [])
          let x = el[0][el[1]]
          return 2 in el ? el[0][el[1]] = el[2] : x
        } else if (ast[0]["?"] == ".") {   // call object method
          el = EVAL(ast.slice(1), env, [])
          let x = el[0][el[1]]
          return x.apply(el[0], el.slice(2))
        } else if (ast[0]["?"] == "try") { // try/catch
          try {
            return EVAL(ast[1], env)
          } catch (e) {
            return EVAL(ast[2][2], new_env([ast[2][1]], env, [e]))
          }
        } else if (ast[0]["?"] == "fn") {  // define new function (lambda)
          return Object.assign(function (...a) {
            return EVAL(ast[2], new_env(ast[1], env, a))
          }, { A: [ast[2], env, ast[1]] })

          // TCO cases
        } else if (ast[0]["?"] == "let") {        // new environment with bindings
          env = Object.create(env)
          ast[1].map((e, i) => i % 2 ? env[ast[1][i - 1]] = EVAL(ast[1][i], env) : 0)
          ast = ast[2]
        } else if (ast[0]["?"] == "do") {  // multiple forms (for side-effects)
          EVAL(ast.slice(1, -1), env, [])
          ast = ast[ast.length - 1]
        } else if (ast[0]["?"] == "if") {  // branching conditional
          ast = EVAL(ast[1], env) ? ast[2] : ast[3]
        } else {                      // invoke list form
          f = EVAL(ast[0], env)
          if (f.M) {
            ast = f(...ast.slice(1))
          } else {
            el = EVAL(ast.slice(1), env, [])
            if (f.A) {
              ast = f.A[0]
              env = new_env(f.A[2], f.A[1], el)
            } else {
              return f(...el)
            }
          }
        }
      }
    }
  }

  E = Object.assign(Object.create(E || this), {
    "js": eval,
    "eval": (...a) => EVAL(a[0], E),

    // These could all also be interop
    "=": (...a) => a[0] === a[1],
    "<": (...a) => a[0] < a[1],
    //"+": (...a) => a[0] + a[1],
    "+": (...a) => { let result = 0; for (let n of a) result += n; return result; },
    "-": (...a) => a[0] - a[1],
    "*": (...a) => a[0] * a[1],
    "/": (...a) => a[0] / a[1],
    "isa": (...a) => a[0] instanceof a[1],
    "type": (...a) => typeof a[0],
    "new": (...a) => new (a[0].bind(...a)),
    "del": (...a) => delete a[0][a[1]],
    //"map":   (...a) => a[1].map(x => a[0](x)),
    "throw": (...a) => { throw (a[0]) },

    "read": (...a) => JSON.parse(a[0]),
    //"slurp": (...a) => require("fs").readFileSync(a[0],"utf8"),
    //"load":  (...a) => EVAL(JSON.parse(require("fs").readFileSync(a[0],"utf8")),E),
    "load": (...a) => EVAL(JSON.parse(Deno.readTextFileSync(a[0])), E),
    "list": (...a) => a,
    "struct": (...a) => {
      let len = a.length;
      if (len % 2 === 1) len -= 1;
      let result = {};
      for (let i = 0; i < len; i += 2) {
        result[a[i]] = a[i + 1];
      }
      return result;
    },
    
    "print": (...a) => { globalThis.console.log(data2code(a[0])); },

    "rep": (...a) => JSON.stringify(EVAL(JSON.parse(a[0]), E))
  })

  // Lib specific
  return E
}
