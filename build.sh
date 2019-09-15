#!/bin/sh

set -e

mkdir -p build/stand
mkdir -p build/raw

wget http://update.cz88.net/ip/copywrite.rar -4 -O build/copywrite.rar
wget http://update.cz88.net/ip/qqwry.rar -4 -O build/qqwry.rar

node src/decode.js
node src/packer.js
node src/packer_raw.js

LATEST_VERSION=`node src/version.js`
CURRENT_VERSION=`curl http://registry.npmjs.org/qqwry.ipdb | jq -r '."dist-tags".latest'`

if [ $CURRENT_VERSION != $LATEST_VERSION ]; then
  cp README.md build/raw/README.md
  cd build/raw
  npm publish
  cd ../..

  cp README.md build/stand/README.md
  cd build/stand
  npm publish
  cd ../..
fi
