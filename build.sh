#!/bin/sh

set -e

mkdir -p build/stand
mkdir -p build/raw

VERSION=`curl https://raw.githubusercontent.com/metowolf/qqwry.dat/main/version.json | jq -r .latest`
wget https://github.com/metowolf/qqwry.dat/releases/download/$VERSION/qqwry.dat -4 -O build/qqwry.dat
# node src/decode.js
node src/packer.js
node src/packer_raw.js

LATEST_VERSION=`node src/version.js`
CURRENT_VERSION=`curl https://registry.npmjs.org/qqwry.ipdb | jq -r '."dist-tags".latest'`

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
