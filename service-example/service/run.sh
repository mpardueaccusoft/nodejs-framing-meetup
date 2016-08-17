#!/bin/bash

set -e
set -x

export NVM_DIR="/usr/local/opt/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

nvm install 6

(cd ../client && node node_modules/gulp/bin/gulp.js build-dev) &

npm install -g nodemon
nodemon --watch ../client --watch ../server --watch ../real-time-comm --watch ../chat lib/index.js