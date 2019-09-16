const rules = [
  [
    ['country_name', '美国', 'region_name', '乔治亚州'],
    ['region_name', '佐治亚州'],
  ],
  [
    ['country_name', '美国', 'region_name', '得克萨斯州'],
    ['region_name', '德克萨斯州'],
  ],
  [
    ['country_name', '美国', 'region_name', '罗得岛州'],
    ['region_name', '罗德岛州'],
  ],
]

module.exports = (result) => {
  for (let [rule, change] of rules) {
    let flag = true
    for (let i = 0; i < rule.length; i += 2) {
      if (result[rule[i]] !== rule[i + 1]) {
        flag = false
        break
      }
    }
    if (flag) {
      for (let i = 0; i < change.length; i += 2) {
        result[change[i]] = change[i + 1]
      }
      return
    }
  }
}
