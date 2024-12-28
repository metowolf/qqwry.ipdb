import Decoder from '@ipdb/czdb'
import Packer from '@ipdb/packer'
import { range2cidrs } from './network.js'
import fs from 'node:fs'

const files = [
  {
    version: 4,
    file: './build/cz88_public_v4.czdb',
  },
  {
    version: 6,
    file: './build/cz88_public_v6.czdb',
  }
]

const packer = new Packer({ipv6: true})
for (const file of files) {
  const hash = {}
  const decoder = new Decoder(file.file, process.env.CZDB_TOKEN)
  decoder.dump(info => {
    if (!hash[info.regionInfo]) {
      hash[info.regionInfo] = []
    }
    const cidrs = range2cidrs(info.startIp, info.endIp, file.version)
    hash[info.regionInfo].push(...cidrs)
  })

  for (const [info, cidrs] of Object.entries(hash)) {
    console.log([cidrs[0], info].join('\t'))
    const t = info.split('\t', 2)
    for (const cidr of cidrs) {
      packer.insert(cidr, [
        t[0], t[1], '', '', ''
      ])
    }
  }
}

const chunk = packer.output([
  'country_name', 'region_name', 'city_name', 'owner_domain', 'isp_domain',
])

fs.writeFileSync('./build/raw/qqwry.ipdb', chunk)