set -uvx
set -e
rm -rf package.json package-lock.json node_modules
npm -y init
# npm install --save-dev @babel/core @babel/cli @babel/preset-env
# Babelifyの導入
npm install --save-dev browserify babelify @babel/preset-env
