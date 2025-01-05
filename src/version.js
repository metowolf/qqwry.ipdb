import fs from 'fs'
import IPDB from 'ipdb'

const ipdb = new IPDB('./build/raw/qqwry.ipdb')

let result = ipdb.find('255.255.255.255')
let version = result.data.region_name.match(/(\d+)/gi).map(x => parseInt(x)).join('.')

console.log(version)

let json = {
  name: 'qqwry.ipdb',
  version: '',
  description: '兼容 IPIP.net(ipdb) 格式的纯真离线数据库',
  main: 'index.js',
  repository: 'git@github.com:metowolf/qqwry.ipdb.git',
  author: 'metowolf <i@i-meto.com>',
  license: 'MIT',
}

let index = `
const { join } = require('path')
module.exports = join(__dirname, 'qqwry.ipdb')
`

json.version = version
json.name = 'qqwry.raw.ipdb'
fs.writeFileSync('./build/raw/index.js', index.trim())
fs.writeFileSync('./build/raw/package.json', JSON.stringify(json, null, '  '))

json.name = 'qqwry.ipdb'
fs.writeFileSync('./build/stand/index.js', index.trim())
fs.writeFileSync('./build/stand/package.json', JSON.stringify(json, null, '  '))