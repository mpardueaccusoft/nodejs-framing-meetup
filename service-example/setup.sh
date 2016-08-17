#!/bin/bash

set -e
set -x

export NVM_DIR="/usr/local/opt/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

nvm install 6

(cd client && npm install && npm link)
(cd server && npm install && npm link)
(cd chat && npm install && npm link)
(cd real-time-comm && npm install && npm link)
(cd server && npm install && npm link)

rm -Rf service/node_modules

(cd service && npm install)
(cd service && npm link client)
(cd service && npm link server)
(cd service && npm link chat)
(cd service && npm link real-time-comm)