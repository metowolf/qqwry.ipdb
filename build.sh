#!/bin/sh

set -e

chunzhen_url=http://update.cz88.net/soft/setup.zip
#temp_dir=/tmp/qqwry
#current_dir=$(pwd)
innoextract_path=$(pwd)/exe_tool/innoextract

# prepare
#rm -rfv $temp_dir
#mkdir $temp_dir
#cd $temp_dir
#apt install innoextract -y

# down
wget $chunzhen_url

# unzip
unzip setup.zip
chmod +x "$innoextract_path"
ls -al "$innoextract_path"
$innoextract_path setup.exe
# copy
#qqwry_file=app/qqwry.dat

#cd "$current_dir" || exit
mkdir -p build/stand
mkdir -p build/raw
cp ./app/qqwry.dat ./build/.



node src/packer.js
node src/packer_raw.js

tar czf ./build/stand/qqwry.tar.gz ./build/stand/qqwry.ipdb