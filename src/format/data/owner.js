const list = [
  // 通用
  ['cloudflare.com', 'cloudflare', '*'],
  ['microsoft.com', ['microsoft', '微软'], '*'],
  ['akamai.com', 'akamai', '*'],
  ['amazon.com', 'amazon', '*'],
  ['amazon.com', 'cloudfront', '*'],
  ['digitalocean.com', 'digitalocean', '*'],
  ['choopa.com', 'choopa', '*'],
  ['ntt.com', ['ntt网络', 'ntt通信'], '*'],
  ['he.net', 'hurricane electric', '*'],
  ['level3.com', ['level3', 'level 3'], '*'],
  ['zenlayer.com', 'zenlayer', '*'],
  ['facebook.com', 'facebook', '*'],
  ['cogentco.com', 'cogent通信', '*'],
  ['godaddy.com', 'godaddy', '*'],
  ['starhub.com', 'starhub', '*'],
  ['ovh.com', 'ovh', '*'],
  ['fiber.google.com', 'google fiber', '*'],
  ['cloud.google.com', 'google云计算', '*'],
  ['sita.aero', '国际航空电讯集团公司(sita)', '*'],
  ['aliyun.com', '阿里云', '*'],
  ['cloud.tencent.com', '腾讯云', '*'],
  ['huawei.com', '华为', '*'],
  ['cloudinnovation.org', 'cloudinnovation', '*'],
  ['att.com', ['ATT用户', 'AT&T'], '*'],
  ['edgecast.com', 'EdgeCast', '*'],
  ['cdnetworks.com', 'CDNetworks', '*'],
  ['hp.com', '惠普HP', '*'],
  ['apple.com', 'apple', '*'],
  ['fastly.com', 'Fastly', '*'],
  // 混合
  ['rixcloud.com', 'rixcloud', ['中国-香港', '美国', '日本', '英国', '俄罗斯', '巴西', '荷兰', '新加坡']],
  ['linode.com', 'linode', ['德国', '日本', '美国', '英国', '新加坡', '德国', '加拿大']],
  ['yandex.ru', 'yandex', ['俄罗斯', '荷兰', '美国', '乌克兰']],
  ['apnic.net', ['APNIC', '亚太互联网络信息中心'], ['澳大利亚', '马来西亚', '德国', '日本', '美国']],
  // 中国
  ['qingcloud.com', ['青云数据中心', '青云电信节点'], '中国'],
  ['ksyun.com', '金山云', '中国'],
  ['netease.com', '网易', ['中国', '中国-香港']],
  ['shuim.net', 'shuiM Data Exchange Center', '中国'],
  // 中国-台湾
  ['cht.com.tw', '中华电信', '中国-台湾'],
  ['so-net.net.tw', 'So-net', '中国-台湾'],
  ['tinp.net.tw', '台基科', '中国-台湾'],
  // 中国-香港
  ['pccw.com', '电讯盈科', ['中国-香港', '美国']],
  // 美国
  ['macstadium.com', 'macstadium', '美国'],
  ['riven.ee', 'rivencloud', ['美国', '中国-香港', '法国', '德国']],
  ['github.com', 'github', ['美国', '荷兰']],
  ['it7.net', 'it7', ['美国', '俄罗斯']],
  ['defense.gov', '国防部', '美国'],
  ['dod.com', 'DoD网络信息中心', '美国'],
  ['ibm.com', 'IBM公司', '美国'],
  ['comcast.com', 'Comcast通信公司', '美国'],
  ['rackspace.com', 'Rackspace Hosting公司', '美国'],
  // 新西兰
  ['vocus.co.nz', 'vocus', '新西兰'],
  // 越南
  ['hanelcom.vn', 'hanelcom', '越南'],
  ['vnpt.vn', 'VNPT', '越南'],
  // 韩国
  ['kt.com', 'kt电信', '韩国'],
  // 日本
  ['idcf.jp', 'idcf', '日本'],
  ['jcom.co.jp', 'j:com电信', '日本'],
  ['megaegg.jp', 'Energia通讯', '日本'],
  // 英国
  ['gov.uk', '社会保险安全部', '英国'],
  // 加拿大
  ['bell.ca', 'Bell', '加拿大'],
]

module.exports.init = () => {
  const result = {}
  for (const item of list) {
    let name = item[0]
    let keyword = item[1]
    if (!Array.isArray(keyword)) keyword = [keyword]
    let country = item[2]
    if (!Array.isArray(country)) country = [country]
    for (let t_keyword of keyword) {
      for (let t_country of country) {
        if (result[t_country] == undefined) result[t_country] = {}
        result[t_country][t_keyword.toLowerCase()] = name.toLowerCase()
      }
    }
  }
  return result
}