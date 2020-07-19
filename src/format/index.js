const iso3166 = require('./data/iso3166').init()
const china_keyword = Object.keys(iso3166['中国'])
const countryfix_list = require('./data/countryfix').init()
const areafix_list = require('./data/areafix').init()
const isp_list = require('./data/isp')
const owner_list = require('./data/owner').init()
const specialfix = require('./data/special')
const preformat = require('./data/preformat').init()

/**
 * 进行市级粒度匹配
 */
const city_match = (result, country, area, citys) => {
  if (citys.length) {
    for (const city of citys) {
      if (area.includes(city)) {
        result.city_name = city
        return result
      }
    }
  } else {
    const regions = iso3166[country]
    for (let [region, value] of Object.entries(regions)) {
      for (let city of value) {
        if (area.includes(city)) {
          result.region_name = region
          result.city_name = city
          return result
        }
      }
    }
  }
}


module.exports = (country, area) => {

  const result = {
    country,
    area,
    country_name: '',
    region_name: '',
    city_name: '',
    owner_domain: '',
    isp_domain: ''
  }

  /**
   * 数据库预匹配
   */
  if (preformat.has(`${country}|${area}`)) {
    const info = preformat.get(`${country}|${area}`)
    result.country_name = info.country_name
    result.region_name = info.region_name
    result.city_name = info.city_name
    result.owner_domain = info.owner_domain
    result.isp_domain = info.isp_domain
    return result
  }

  /**
   * 去除数据中存在的空格字符，避免干扰判断
   *
   * { country: '马来西亚', area: ' CZ88.NET' } ->
   * { country: '马来西亚', area: 'CZ88.NET' } ->
   */
  country = country.trim()
  area = area.trim()

  /**
   * 根据关键词修正中国地区标注
   *
   * { country: '内蒙古通辽市开鲁县', area: '联通' } ->
   * { country: '中国', area: '内蒙古通辽市开鲁县 联通' }
   */
  if (!iso3166[country]) {
    for (const keyword of china_keyword) {
      if (country.includes(keyword)) {
        area = country + ' ' + area
        country = '中国'
        break
      }
    }
  }

  /**
   * 修正国家字段命名不规范的数据
   *
   * { country: '华中科技大学韵苑公寓15栋', area: '623' } ->
   * { country: '中国', area: '湖北省武汉市 华中科技大学韵苑公寓15栋 623' }
   */
  if (countryfix_list[country]) {
    let info = countryfix_list[country]
    country = info[0]
    if (info.length === 2) area = info[1] + ' ' + area
  }

  /**
   * 处理高校教育网教育网
   *
   * { country: '中国', area: '湖北省宜昌市 三峡大学电子阅览室' } ->
   * { country: '中国', area: '湖北省宜昌市 三峡大学电子阅览室(教育网)' } ->
   */
  if (country === '中国' && area.includes('大学') && !area.includes('网吧')) {
    area += '(教育网)'
  }

  /**
   * 修正区域字段存在混淆的数据
   *
   * { country: '江苏省宿迁市沭阳县', area: '上海南路(农机校对面)凌云网吧' } ->
   * { country: '江苏省宿迁市沭阳县', area: '凌云网吧' }
   */
  if (areafix_list[area]) {
    area = areafix_list[area]
  }

  /**
   * 进行国家粒度匹配
   */
  if (iso3166[country]) {
    result.country_name = country
    result.region_name = country
  }

  /**
   * 进行省级粒度匹配
   */
  let citys = []
  if (iso3166[country]) {
    const regions = iso3166[country]
    for (const [region, value] of Object.entries(regions)) {
      if (region !== country && area.includes(region)) {
        result.region_name = region
        citys = value
        break
      }
    }
  }

  /**
   * 进行市级粒度匹配，深度匹配
   */
  if (iso3166[country]) {
    city_match(result, country, area, citys)
  }

  /**
   * 进行特殊修正
   */
  specialfix(result)

  /**
   * 进行运营商匹配
   */
  const isps = isp_list[`${result.country_name}-${result.region_name}`]
    || isp_list[result.country_name]
    || []
  for (const isp of isps) {
    if (area.includes(isp)) {
      result.isp_domain = isp
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
  for (const [owner, value] of Object.entries(owners)) {
    if (area.toLowerCase().includes(owner)) {
      result.owner_domain = value
      break
    }
  }

  /**
   * 数据兜底
   */
  if (result.country_name === '') {
    result.country_name = country
    result.region_name = area
  }

  return result
}
