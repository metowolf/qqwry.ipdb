const libqqwry = require('lib-qqwry')

const range2cidrs = (begin, end) => {
  begin = BigInt(begin)
  end = BigInt(end)
  let cidrs = []
  for (let current = begin; current <= end; ) {
    let bits = 32n
    let reseau = current
    while ((current & (1n << (32n - bits))) === 0n && (reseau | (1n << (32n - bits))) <= end) {
      reseau |= (1n << (32n - bits))
      bits -= 1n
    }
    cidrs.push(`${libqqwry.intToIP(Number.parseInt(current))}/${bits}`)
    current = reseau + 1n
  }
  return cidrs
}

module.exports = range2cidrs
