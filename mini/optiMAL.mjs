import { code2ast, ast2code, data2code } from "./code2data.mjs";
import { miniMAL } from "./miniMAL.mjs";

//import * as path from "https://deno.land/std/path/mod.ts";
//const __filename = path.fromFileUrl(import.meta.url);
//const __dirname = path.dirname(__filename);

export function optiMAL(E) {
    let m = miniMAL(E);
    m.ast2code = ast2code;
    m.data2code = data2code;
    m.DEMO = (exp) => m.EVAL(exp, true);
    m.EVAL = (exp, debug) => {
        let src = exp;
        let steps = code2ast(src);
        let last;
        for (let step of steps) {
            let ast = step;
            let code = ast2code(ast);
            try {
                if (debug) {
                    globalThis.console.log('[CODE] ' + code);
                    globalThis.console.log(' [AST] ' + JSON.stringify(ast));
                }
                let val = m.eval(ast);
                last = val;
                if (typeof val === 'function') { if (debug) globalThis.console.log('==> ' + 'function'); }
                else if (!(val instanceof Array) && val instanceof Object && Object.prototype.toString.call(val) !== '[object Object]') {
                    if (debug) globalThis.console.log('==> ' + Object.prototype.toString.call(val) + ' ' + JSON.stringify(val));
                }
                else {
                    if (debug) globalThis.console.log('==> ' + data2code(val));
                }
            } catch (e) {
                if (!debug) {
                    globalThis.console.log('[CODE] ' + code);
                    globalThis.console.log(' [AST] ' + JSON.stringify(ast));
                }
                globalThis.console.log(' [EXCEPTION]');
                if (e.stack) globalThis.console.log(e.stack);
                else globalThis.console.log(e);
                break;
            }
        }
        return last;
    }
    m.LOAD = (path, debug) => {
        let src = require("fs").readFileSync(path);
        return m.EVAL(src, debug);
    }
    //m.load(__dirname + "/core.json");
    m.EVAL(
        `
        (def new (fn (a & b) (. Reflect "construct" a b)))
        (def del (fn (a b) (. Reflect "deleteProperty" a b)))
        #(def print (fn (a) (do (. console "log" a) null)))
        (def pr* (fn (a) (. JSON "stringify" a)))
        (def map (fn (a b) (. b "map" (fn (x) (a x)))))
        (def list (fn (& a) a))
        (def >= (fn (a b) (if (< a b) false true)))
        (def > (fn (a b) (if (>= a b) (if (= a b) false true) false)))
        (def <= (fn (a b) (if (> a b) false true)))
        (def classOf (fn (a) (. (.- (.- Object "prototype") "toString") "call" a)))
        (def not (fn (a) (if a false true)))
        (def null? (fn (a) (= null a)))
        (def true? (fn (a) (= true a)))
        (def false? (fn (a) (= false a)))
        (def string? (fn (a) (if (= a null) false (= "String" (.- (.- a "constructor") "name")))))
        (def pr-list* (fn (a b c) (let (lst (map (fn (x) (if c (pr* x) (if (string? x) x (pr* x)))) a)) (. lst "join" b))))
        (def pr-str (fn (& a) (pr-list* a " " true)))
        (def str (fn (& a) (pr-list* a "" false)))
        (def prn (fn (& a) (print (pr-list* a " " true))))
        (def println (fn (& a) (print (pr-list* a " " false))))
        (def list? (fn (a) (. Array "isArray" a)))
        (def contains? (fn (a b) (. a "hasOwnProperty" b)))
        (def get (fn (a b) (if (contains? a b) (.- a b) null)))
        (def set (fn (a b c) (do (.- a b c) a)))
        (def keys (fn (a) (. Object "keys" a)))
        (def vals (fn (a) (. Object "values" a)))
        (def cons (fn (a b) (. '() "concat" (list a) b)))
        (def concat (fn (& a) (. (.- (list) "concat") "apply" (list) a)))
        (def nth get)
        (def count (fn (a) (.- a "length")))
        (def first (fn (a) (if (> (count a) 0) (nth a 0) null)))
        (def last (fn (a) (nth a (- (count a) 1))))
        (def empty? (fn (a) (if (list? a) (= 0 (count a)) (= a null))))
        (def slice (fn (a b & end) (. a "slice" b (if (> (count end) 0) (get end 0) (count a)))))
        (def rest (fn (a) (slice a 1)))
        (def apply (fn (f & b) (. f "apply" f (concat (slice b 0 -1) (last b)))))
        (def and (~ (fn (& xs) (if (empty? xs) true (if (= 1 (count xs)) (first xs) (list "let" (list "__and" (first xs)) (list "if" "__and" (concat '(and) (rest xs)) "__and")))))))
        (def or (~ (fn (& xs) (if (empty? xs) null (if (= 1 (count xs)) (first xs) (list "let" (list "or_FIXME" (first xs)) (list "if" "or_FIXME" "or_FIXME" (concat '(or) (rest xs)))))))))
        `
    );
    m.EVAL(
        `(def define (~ (fn ($first & $rest)
          (let ($exp)
            (if (list? $first)
                (concat (list 'def (first $first) (concat (list 'fn (rest $first)) $rest)))
              (concat (list 'def $first) $rest))))))
        (def cond:builder (fn ($list)
          (if (empty? $list)
              #nil
            (let ($top (. $list "shift"))
              (if (= (nth $top 0) 'else)
                  (nth $top 1)
                (list 'if (nth $top 0)
                    (nth $top 1)
                  (cond:builder $list)))))))
        (def cond (~ (fn (& $rest)
          (cond:builder $rest))))`)

    return m;
}
