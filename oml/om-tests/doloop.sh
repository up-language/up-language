#!/bin/bash
shopt -s dotglob
for file in *.om
do
  echo "$file"
  deno run --allow-all ./load.mjs "$file" | tee "${file}.tmp"
  if [ ! -e "${file}.txt" ]; then
    echo "File does not exist"
    cp -rp "${file}.tmp" "${file}.txt"
  else 
    echo "File exists"
    #unix2dos "${file}.tmp" "${file}.txt"
    diff -w "${file}.txt" "${file}.tmp"
  fi
done
