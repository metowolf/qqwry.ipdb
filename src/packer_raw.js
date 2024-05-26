const fs = require('fs')
const range2cidrs = require('./range2cidrs')

const libqqwry = require('lib-qqwry')
const qqwry = libqqwry(true, './build/qqwry.dat')

const Packer = require('./packer')
const packer = new Packer({ipv6: false})

let ip = '0.0.0.0'
while (true) {
  let data = qqwry.searchIPScope(ip, ip)[0]
  let cidrs = range2cidrs(data.begInt, data.endInt)

  for (let cidr of cidrs) {
    packer.insert(cidr, [data.Country, data.Area, '', '', ''])
  }

  if (data.endIP === '255.255.255.255') break
  ip = libqqwry.intToIP(data.endInt + 1)
}

let chunk = packer.output([
  'country', 'area', 'pad1', 'pad2', 'pad3'
])

fs.writeFileSync('./build/raw/qqwry.ipdb', chunk)
