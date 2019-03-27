const fs = require('fs')
const zlib = require('zlib')

const getkey = () => {
  let data = fs.readFileSync('./build/copywrite.rar')
  return data.readUIntLE(0x14, 4)
}

const decode = (key) => {
  let data = fs.readFileSync('./build/qqwry.rar')
  for (let i = 0; i < 0x200; i += 1) {
    key = ((key * 0x805) + 0x01) & 0xFF
    data[i] ^= key
  }
  data = zlib.inflateSync(data)
  return data
}

let key = getkey()
console.log(`key: ${key}`)

let chunk = decode(key)
console.log(`chunk length: ${chunk.length}`)

fs.writeFileSync('./build/qqwry.dat', chunk)
