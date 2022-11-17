# qqwry.ipdb

纯真数据库 IPIP.net 格式版，精简并匹配为国家、省、市、运营商。  
版本随上游 [metowolf/qqwry.dat](https://github.com/metowolf/qqwry.dat) 每周同步更新。

## 标准版

![](https://img.shields.io/npm/v/qqwry.ipdb.svg?style=for-the-badge&label=VERSION)
![](https://img.shields.io/npm/dm/qqwry.ipdb.svg?style=for-the-badge)


|CDN|URL|
|:---:|---|
|[jsdelivr](https://cdn.jsdelivr.net/npm/qqwry.ipdb/)|https://cdn.jsdelivr.net/npm/qqwry.ipdb/qqwry.ipdb|
|[unpkg](https://unpkg.com/browse/qqwry.ipdb/)|https://unpkg.com/qqwry.ipdb/qqwry.ipdb|


标准版兼容所有[官方 IPDB 格式解析代码](https://www.ipip.net/product/client.html)，提供与[官方每周高级版](https://www.ipip.net/product/ip.html#ipv4city)相同的五个解析字段。

|name|info|
|:---:|---|
|`country_name`|国家名称|
|`region_name`|区域名称，中国为省份|
|`city_name`|城市名称，中国为市级|
|`owner_domain`|拥有者域名|
|`isp_domain`|运营商名称|


## 原版

![](https://img.shields.io/npm/v/qqwry.raw.ipdb.svg?style=for-the-badge&label=VERSION)
![](https://img.shields.io/npm/dm/qqwry.raw.ipdb.svg?style=for-the-badge)


|CDN|URL|
|:---:|---|
|[jsdelivr](https://cdn.jsdelivr.net/npm/qqwry.raw.ipdb/)|https://cdn.jsdelivr.net/npm/qqwry.raw.ipdb/qqwry.ipdb|
|[unpkg](https://unpkg.com/browse/qqwry.raw.ipdb/)|https://unpkg.com/qqwry.raw.ipdb/qqwry.ipdb|


原版兼容所有[官方 IPDB 格式解析代码](https://www.ipip.net/product/client.html)，只提供和纯真格式相似的两个解析字段，后面三个字段为兼容占位使用。

|name|info|
|:---:|---|
|`country`|国家名称|
|`area`|区域名称|
|`pad1`|兼容占位|
|`pad2`|兼容占位|
|`pad3`|兼容占位|

## 实例

以 [metowolf/ipdb](https://github.com/metowolf/ipdb) 解析库为例，首先安装依赖并下载标准版数据库

```
$ yarn add ipdb
$ yarn add qqwry.ipdb
```

新建文件 `index.js`

```
const IPDB = require('ipdb');
const qqwry_ipdb = require('qqwry.ipdb');
const ipdb = new IPDB(qqwry_ipdb);

ipdb.find('183.62.57.1');
/*
{
  data: {
    country_name: '中国',
    region_name: '广东',
    city_name: '广州',
    owner_domain: '',
    isp_domain: '电信',
    ip: '183.62.57.1',
    bitmask: 24
  },
  code: 0
}
*/
```

## 感谢

 - 感谢由 [ipdb](https://github.com/metowolf/ipdb) 提供的 IPDB 格式解析解决方案
 - 感谢由 [@ipdb/packer](https://github.com/metowolf/ipdb-packer) 提供的 IPDB 格式打包解决方案
 - 感谢文章 [IPIP.net 地址库格式分析](https://i-meto.com/ipdb-database/) 提供的格式逆向分析
 - 感谢苏卡卡的 [qqwry-mirror](https://github.com/SukkaW/qqwry-mirror) 项目提供的灵感
 - 感谢纯真网络提供的[免费离线数据库](http://www.cz88bbs.com/)，以及纯真论坛的热心网友们

