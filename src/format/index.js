const Iso3166 = require('./data/iso3166')
const iso3166 = Iso3166.init()

const countryfix_list = require('./data/countryfix')
const isp_list = require('./data/isp')

const Owner = require('./data/owner')
const owner_list = Owner.init()

const specialFix = require('./data/special')

const china_keyword = [
  '中国',
  ...Object.keys(iso3166['中国']),
]

/**
 * 进行市级粒度深度匹配
 */
const cityDeepMatch = (result, country, area) => {
  let regions = iso3166[country]
  for (let [region, value] of Object.entries(regions)) {
    for (let city of value) {
      if (area.includes(city)) {
        result.region_name = region
        result.city_name = city
        result.format += '[city deep]'
        return result
      }
    }
  }
}

module.exports = (country, area, ip) => {

  let result = {
    country,
    area,
    ip,
    country_name: '',
    region_name: '',
    city_name: '',
    owner_domain: '',
    isp_domain: '',
    format: '',
  }

  country = country.trim()
  area = area.trim()

  /**
   * 修正纯真数据库中国地区标注
   *
   * 默认中国地区 IP 标注格式为 `xx省xx市 xx运营商`，修改为 `中国 xx省xx市xx运营商`
   */
  for (let keyword of china_keyword) {
    if (country.includes(keyword)) {
      area = country + area
      country = '中国'
      break
    }
  }

  /**
   * 修正纯真数据库中无法识别的国家
   *
   * 通常因命名不规范导致
   */
  if (countryfix_list[country]) {
    let info = countryfix_list[country].split('/')
    country = info[0]
    if (info.length === 2) area = info[1] + area
  }

  /**
   * 预处理中国教育网
   */
  if (country === '中国' && area.includes('大学') && !area.includes('网吧')) {
    area += '(教育网)'
  }

  /**
   * 进行国家粒度匹配
   */
  if (iso3166[country]) {
    result.country_name = country
    result.region_name = country
    result.format += '[country]'

    /**
     * 进行省级粒度匹配
     */
    let regions = iso3166[country], citys = []
    for (let [region, value] of Object.entries(regions)) {
      if (region !== country && area.includes(region)) {
        result.region_name = region
        result.format += '[region]'
        citys = value
        break
      }
    }

    /**
     * 进行市级粒度匹配
     */
    if (citys.length) {
      for (let city of citys) {
        if (area.includes(city)) {
          result.city_name = city
          result.format += '[city]'
          break
        }
      }
    } else {
      cityDeepMatch(result, country, area)
    }

  }

  /**
   * 进行特殊修正
   */
  specialFix(result)

  /**
   * 进行运营商匹配
   */
  let isps = isp_list[`${result.country_name}-${result.region_name}`]
    || isp_list[result.country_name]
    || []
  for (let isp of isps) {
    if (area.includes(isp)) {
      result.isp_domain = isp
      result.format += '[isp]'
      break
    }
  }

  /**
   * 进行服务持有方匹配
   */
  let owners = owner_list[`${result.country_name}-${result.region_name}`]
    || owner_list[result.country_name]
    || []
  owners = {...owners, ...owner_list['*']}
  for (let [owner, value] of Object.entries(owners)) {
    if (area.toLowerCase().includes(owner)) {
      result.owner_domain = value
      result.format += '[owner]'
      break
    }
  }

  /**
   * 数据兜底
   */
  if (result.country_name === '') {
    result.country_name = country
    result.region_name = area
    result.format += '[failed]'
  }

  return result
}
