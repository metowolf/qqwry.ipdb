#!/bin/sh

set -ex

mkdir -p build/stand
mkdir -p build/raw

wget http://update.cz88.net/ip/copywrite.rar -O build/copywrite.rar
wget http://update.cz88.net/ip/qqwry.rar -O build/qqwry.rar

node src/decode.js
node src/packer.js
node src/packer_raw.js

LATEST_VERSION=`node src/version.js`
CURRENT_VERSION=`grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g'`

if [ $CURRENT_VERSION != $LATEST_VERSION ]; then
  cd build/raw
  npm publish
  cd ../..

  cd build/stand
  npm publish
  cd ../..

  npm version $LATEST_VERSION
  git push origin master
fi
