set -uvx
set -e
#./node_modules/.bin/babel src --out-dir js
# Babelifyを用いたコンパイル
#./node_modules/.bin/browserify --transform babelify --outfile js/index.js src/index.mjs
./node_modules/.bin/browserify --transform babelify --outfile om-java/index.js src/index.mjs
