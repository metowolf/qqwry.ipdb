const fs = require('fs')
const format = require('./format')
const range2cidrs = require('./range2cidrs')

const libqqwry = require('lib-qqwry')
const qqwry = libqqwry(true, './build/qqwry.dat')

const Packer = require('@ipdb/packer')
const packer = new Packer({ipv6: false})

const cidrTools = require('cidr-tools')

let ip = '0.0.0.0'
let hash = {}
while (true) {
  let data = qqwry.searchIPScope(ip, ip)[0]

  let info = format(data.Country, data.Area, ip)
  let cidrs = range2cidrs(data.begInt, data.endInt)
  let info_string = [info.country_name, info.region_name, info.city_name, info.owner_domain, info.isp_domain].join('\t')
  if (!hash[info_string]) hash[info_string] = []
  hash[info_string].push(...cidrs)

  if (data.endIP === '255.255.255.255') break
  ip = libqqwry.intToIP(data.endInt + 1)
}

for (let [info, cidrs] of Object.entries(hash)) {
  console.log([cidrs[0], info].join('\t'))
  let t = info.split('\t')
  cidrs = cidrTools.merge(cidrs)
  for (let cidr of cidrs) {
    packer.insert(cidr, t)
  }
}

let chunk = packer.output([
  'country_name', 'region_name', 'city_name', 'owner_domain', 'isp_domain',
])

fs.writeFileSync('./build/stand/qqwry.ipdb', chunk)
