#!/bin/sh

set -e

mkdir -p build/stand
mkdir -p build/raw

wget http://update.cz88.net/ip/copywrite.rar -4 -O build/copywrite.rar --user-agent="Mozilla/3.0 (compatible; Indy Library)"
wget http://update.cz88.net/ip/qqwry.rar -4 -O build/qqwry.rar --user-agent="Mozilla/3.0 (compatible; Indy Library)"

node src/decode.js
node src/packer.js
node src/packer_raw.js

