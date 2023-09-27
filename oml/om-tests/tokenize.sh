#!/bin/bash
shopt -s dotglob
for file in *.om
do
  echo "$file"
  (deno run --allow-all ./run-tokenize.mjs "$file" >& "${file}.json") >& /dev/null
  (deno run --allow-all ./run-tokenize2.mjs "$file" >& "${file}.tmp") >& /dev/null
  diff -w "${file}.json" "${file}.tmp"
done
