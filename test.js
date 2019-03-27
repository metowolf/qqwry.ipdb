const randip = Math.ceil(Math.random() * 254) + '.' +
  Math.ceil(Math.random() * 254) + '.' +
  Math.ceil(Math.random() * 254) + '.' +
  Math.ceil(Math.random() * 254)

{
  const IPDB = require('ipdb')
  const ipdb = new IPDB('./public/qqwry.ipdb')
  let data = ipdb.find(randip)
  console.log(data)
}

{
  const IPDB = require('ipdb')
  const ipdb = new IPDB('./public/qqwry_raw.ipdb')
  let data = ipdb.find(randip)
  console.log(data)
}
