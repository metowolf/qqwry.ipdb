import Decoder from '@ipdb/czdb'
import Packer from '@ipdb/packer'
import { range2cidrs } from './network.js'
import fs from 'node:fs'
import { formatCountryCode } from './format.js'

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

const noCountryCodeSet = new Set()
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
  console.log(`Total ${Object.keys(hash).length} records in ${file.file}`)

  for (const [info, cidrs] of Object.entries(hash)) {
    // console.log([cidrs[0], info].join('\t'))
    const t = info.split('\t', 2)
    // 信息
    let country = '', region = '', city = '', district = '' , isp = '', owner = ''
    if (t[0].includes('–')) {
      const tt = t[0].split('–')
      country = tt[0]
      region = tt[1]
      city = tt[2] || ''
      district = tt[3] || ''
    } else {
      country = t[0]
    }

    if (t[1] && t[1].includes('/')) {
      const tt = t[1].split('/')
      isp = tt[0]
      owner = tt[1] || ''
    } else {
      isp = t[1]
    }

    const country_code = formatCountryCode(country, region)
    if (country_code === '') {
      noCountryCodeSet.add(country)
    }

    for (const cidr of cidrs) {
      packer.insert(cidr, [
        country, region, city, district, owner, isp, country_code
      ])
    }
  }
}

console.log('存在以下未正确识别 CountryCode', noCountryCodeSet)

const chunk = packer.output([
  'country_name', 'region_name', 'city_name', 'district_name', 'owner_domain', 'isp_domain', 'country_code'
])

fs.writeFileSync('./build/stand/qqwry.ipdb', chunk)