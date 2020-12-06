const fs = require('fs')

module.exports.init = () => {
  const map = new Map()
  try {
    const file = fs.readFileSync(__dirname + '/preformat.db', 'utf8')
    const data = file.trim().split('\n').map(x => x.split('|'))
    for (const item of data) {
      map.set([item[0], item[1]].join('|'), {
        country_name: item[2],
        region_name: item[3],
        city_name: item[4],
        owner_domain: item[5],
        isp_domain: item[6]
      })
    }
  } catch (ignore) {}

  return map
}
