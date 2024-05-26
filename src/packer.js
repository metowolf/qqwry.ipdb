const net = require('net')
const EventEmitter = require('events')

class Packer extends EventEmitter {
  constructor(options = {}) {
    super()
    this.node = [[null, null]]
    this.data = []
    this.data_hash = {}
    this.data_size = 0
    this.options = options
    this.meta = {
      build: Math.floor(new Date() / 1000),
      ip_version: options.ipv6 ? 0x03 : 0x01,
      languages: {
        'CN': 0,
      }
    }
  }

  insert(cidr, data) {
    let [node, idx] = this._getNode(cidr)
    let offset = this._getOffset(data)
    this.node[node][idx] = -offset
    return this.node.length
  }

  output(fields) {

    this.emit('start')
    let process_current = 0
    let process_total = 1 + 1 + this.node.length + 1 + 1 + this.node.length + 1

    // meta fields
    this.meta.fields = fields
    this.emit('process', ++process_current, process_total)

    // meta node_count
    let node_count = this.node.length
    this.meta.node_count = node_count
    this.emit('process', ++process_current, process_total)

    // fix null node
    let null_count = 0
    let null_offset = this._getOffset(new Array(fields.length).fill(''))
    for (let i = 0; i < this.node.length; i += 1) {
      this.emit('process', ++process_current, process_total)
      for (let j = 0; j < 2; j += 1) {
        if (this.node[i][j] === null) {
          null_count += 1
          this.node[i][j] = null_offset
        }
      }
    }

    // make data chunk
    this.data = Buffer.concat(this.data)
    this.emit('process', ++process_current, process_total)

    // v4 node offset
    let v4node = this._getNode('0.0.0.0/1')[0]
    this.meta.v4node = v4node
    this.emit('process', ++process_current, process_total)

    // node chunk
    let node_chunk = Buffer.alloc(this.node.length << 3)
    for (let i = 0; i < this.node.length; i += 1) {
      this.emit('process', ++process_current, process_total)
      for (let j = 0; j < 2; j += 1) {
        if (this.node[i][j] <= 0) {
          this.node[i][j] = node_count - this.node[i][j]
        }
        let buf = this._toNodeBuffer(this.node[i][0], this.node[i][1])
        buf.copy(node_chunk, i << 3)
      }
    }

    // loopback chunk
    let loopback_chunk = Buffer.alloc(1 << 3)
    let buf = this._toNodeBuffer(node_count, node_count)
    buf.copy(loopback_chunk, 0)

    // header chunk
    this.meta.total_size = node_chunk.length + loopback_chunk.length + this.data.length
    let header = Buffer.from(JSON.stringify(this.meta))
    let header_len = header.length
    let header_chunk = Buffer.alloc(4)
    header_chunk.writeUInt32BE(header_len)
    header_chunk = Buffer.concat([header_chunk, header])
    this.emit('process', ++process_current, process_total)

    // final
    this.emit('end')
    return Buffer.concat([header_chunk, node_chunk, loopback_chunk, this.data])
  }

  _toNodeBuffer(left, right) {
    return Buffer.from([
      (left >> 24) & 0xff,
      (left >> 16) & 0xff,
      (left >> 8) & 0xff,
      (left) & 0xff,
      (right >> 24) & 0xff,
      (right >> 16) & 0xff,
      (right >> 8) & 0xff,
      (right) & 0xff,
    ])
  }

  _getNode(cidr) {
    let [ip, mask] = this._toBin(cidr)
    let node = 0
    for (let i = 0; i < mask - 1; i += 1) {
      if (this.node[node][ip[i]] === null) {
        this.node.push([null, null])
        this.node[node][ip[i]] = this.node.length - 1
      }
      node = this.node[node][ip[i]]
    }
    return [node, ip[mask - 1]]
  }

  _getOffset(data) {
    data = data.join('\t')
    if (!this.data_hash[data]) {
      let buf = Buffer.from(data)
      let len = Buffer.alloc(2)
      len.writeUInt16BE(buf.length)
      this.data_hash[data] = this.data_size + 8
      this.data.push(Buffer.concat([len, buf]))
      this.data_size += len.length + buf.length
    }
    return this.data_hash[data]
  }

  _toBin(cidr) {
    let [ip, mask] = cidr.split('/')
    mask = parseInt(mask, 10)

    let bin = net.isIP(ip) === 4 ? this._toBin4(ip) : this._toBin6(ip)
    if (bin.length === 32) {
      bin = [...(new Array(80).fill(0)), ...(new Array(16).fill(1)), ...bin]
      mask += 96
    }
    return [bin, mask]
  }

  _toBin4(ip) {
    const result = []
    const items = ip.split('.')
    for (const item of items) {
      const num = parseInt(item, 10)
      for (let i = 7; i >= 0; i -= 1) {
        result.push((num >> i) & 1)
      }
    }
    return result
  }

  _toBin6(ip) {
    const result = [[], []]
    const parts = ip.split('::', 2)
    for (let index = 0; index < 2; index += 1) {
      if (parts[index]) {
        const items = parts[index].split(':')
        for (const item of items) {
          const num = parseInt(item, 16)
          for (let i = 15; i >= 0; i -= 1) {
            result[index].push((num >> i) & 1)
          }
        }
      }
    }
    const pad = 128 - result[0].length - result[1].length
    return [...result[0], ...(new Array(pad).fill(0)), ...result[1]]
  }
}

module.exports = Packer