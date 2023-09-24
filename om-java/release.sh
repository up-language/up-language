#! /usr/bin/env bash
set -uvx
set -e
cwd=`pwd`
script_dir=$(cd $(dirname $0); pwd)
script_dir_name=$(basename "$script_dir")
echo "Script directory name: $script_dir_name"
#rm -rf build
gradle shadowJar
cd $cwd/build/libs
exewrap64.exe -o ${script_dir_name}.exe -l JAVAHOME ${script_dir_name}-all.jar
cp -rp ${script_dir_name}.exe $HOME/cmd/java/
