import { exec, run } from "./omljs.mjs";
exec(`
(console.log "str")
(console.log "ハロー©")
(define xyz 777)
(console.log xyz)
(console.log 123)
(console.log (+ 11 22]

(define x 123)
(begin
  (set! x (+ 1 x))
  (set! x (+ 2 x))
  (console.log x .

(define ary (list 11 22 33]

(console.log ary#2)

(define idx 1)

(console.log ary#idx .

(print {:a 1 :b 2})
(print (struct :a 1 :b 2).
(print (list :a 1 :b 2).

(define person
 (struct
  "name" "john"
  "age"  23
  "hobbies" (list "tennis" "baseball").

@person.name@
@person["age"]@
person.name
person.hobbies#1

[dotimes (i 3) (console.log i]
[dotimes (i 3) (dotimes (j 2) (console.log (list i j]
(define x 11)
(define y 22)
(console.log (+ x y]
[let ((a 33) (b 44)) (console.log (+ a b]
[let* ((a 55) (b (+ 1 a))) (console.log (list a b]
[let* [(a 55) (b (+ 1 a] (console.log (list a b]
(define (fact n)
  (let ((factorial 1.0))
    (if (< n 0)
        -1
      (begin
        [dotimes (i n)
          (set! factorial (* factorial (+ 1 i]
        factorial).
(console.log (fact 4))

zzz

(Deno.exit 0)
(define (fact2 x)
  (do ((n 2 (+ 1 n)) (result 1))
      ((< x n) result)
      (set! result (* result n))))
(console.log (fact2 4))
(console.log (&& (< 2 4) (< 3 4]
(console.log (&& (< 2 4) (> 3 4]
  (try (throw 123)
  (catch ex (console.log ex]
`); // glob.runAll()
