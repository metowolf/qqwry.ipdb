#!/bin/sh

set -e

mkdir -p build/raw

wget "https://www.cz88.net/api/communityIpAuthorization/communityIpDbFile?fn=czdb&key=${CZDB_DOWNLOAD_TOKEN}" -O build/czdb.zip
unzip build/czdb.zip -d build/

node src/packer_raw.js
ls -alh build/raw

LATEST_VERSION=`node src/version.js`
CURRENT_VERSION=`curl https://registry.npmjs.org/qqwry.raw.ipdb | jq -r '."dist-tags".latest'`

if [ $CURRENT_VERSION != $LATEST_VERSION ]; then
  cp README.md build/raw/README.md
  cd build/raw
  npm publish
fi
