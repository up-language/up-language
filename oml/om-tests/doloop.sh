#!/bin/bash
TERM=dumb
shopt -s dotglob
for file in *.om
do
  echo "$file"
  #deno run --allow-all ./load.mjs "$file" | tee "${file}.tmp"
  (deno run --allow-all ./load.mjs "$file" >& "${file}.tmp") >& /dev/null
  if [ ! -e "${file}.txt" ]; then
    #echo "File does not exist"
    cp -rp "${file}.tmp" "${file}.txt"
  else 
    #echo "File exists"
    diff -w "${file}.txt" "${file}.tmp"
  fi
done
