import { bigint2ip, merge, ip2bigint } from 'fast-cidr-tools'

export function ip2long(ip) {
  return ip2bigint(ip)
}

export function long2ip(longValue) {
  return bigint2ip(longValue)
}

export function cidr2range(cidr) {
  let [ip, bits] = cidr.split('/')
  let start = ip2long(ip)
  let end = start + (2 ** (32 - bits)) - 1
  return [start, end]
}

export function range2cidrs(startIp, endIp, versionIp = 4) {
  const start = typeof startIp === 'bigint' ? startIp : ip2bigint(startIp)
  const end = typeof endIp === 'bigint' ? endIp : ip2bigint(endIp)
  const version = ((end < (1n << 32n)) && versionIp === 4) ? 4 : 6
  const maskbits = version === 4 ? 32n : 128n

  let cidrs = []
  for (let current = start; current <= end; ) {
    let bits = maskbits
    let reseau = current
    while ((current & (1n << (maskbits - bits))) === 0n && (reseau | (1n << (maskbits - bits))) <= end) {
      reseau |= (1n << (maskbits - bits))
      bits -= 1n
    }
    cidrs.push(`${bigint2ip(current, version)}/${bits}`)
    current = reseau + 1n
  }
  return cidrs
}

export function mergecidrs(cidrs) {
  return merge(cidrs)
}