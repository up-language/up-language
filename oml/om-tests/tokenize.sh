#!/bin/bash
shopt -s dotglob
for file in *.om
do
  echo "$file"
  #deno run --allow-all ./load.mjs "$file" | tee "${file}.tmp"
  (deno run --allow-all ./tokenize.mjs "$file" > "${file}.json") >& /dev/null
  (deno run --allow-all ./tokenize2.mjs "$file" > "${file}.tmp") >& /dev/null
  diff -w "${file}.json" "${file}.tmp"
done
