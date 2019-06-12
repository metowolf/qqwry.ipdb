const countryfix_list = require('./countryfix')
const country_list = require('./country')
const china_keyword = ['中国', '省', '市', ...Object.keys(country_list['中国'])]
const school_list = require('./school')
const isp_list = require('./isp')
const owner_list = require('./owner')

const cache = {}

module.exports = (country, area, ip) => {

  country = country.trim()
  area = area.trim()

  // china_keyword
  for (let keyword of china_keyword) {
    if (country.includes(keyword)) {
      area = country + area
      country = '中国'
      break
    }
  }

  // error country
  if (countryfix_list[country]) {
    country = countryfix_list[country]
  }

  let result = {
    country,
    area,
    ip,
    country_name: '',
    region_name: '',
    city_name: '',
    owner_domain: '',
    isp_domain: '',
    format: 0,
  }

  // school match
  if (school_list[country]) {
    let info = school_list[country]
    result.country_name = info[0]
    result.region_name = info[1]
    result.city_name = info[2]
    result.format = 3
    if (!area.includes('网吧')) {
      result.owner_domain = info[3]
      result.format = 5
    }
  }

  // country match
  if (country_list[country]) {
    result.country_name = country
    result.region_name = country
    result.format = 1
    if (area === 'CZ88.NET') {
      result.format = 2
    }

    let regions = country_list[country], citys = []
    for (let [region, value] of Object.entries(regions)) {
      if (region !== country && area.includes(region)) {
        result.region_name = region
        result.format = 2
        citys = value
        break
      }
    }

    for (let city of citys) {
      if (area.includes(city)) {
        result.city_name = city
        result.format = 3
        break
      }
    }
  }

  // isp match
  if (isp_list[result.country_name]) {
    for (let isp of isp_list[result.country_name]) {
      if (area.includes(isp)) {
        result.isp_domain = isp
        result.format = 4
        break
      }
    }
  }

  // owner match
  for (let [owner, value] of Object.entries(owner_list)) {
    if (area.includes(owner)) {
      result.owner_domain = value
      result.format = 5
      break
    }
  }

  if (result.country_name === '') {
    result.country_name = country
    result.region_name = area
    result.format = 0
  }

  return result
}
