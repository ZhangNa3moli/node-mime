#!/usr/bin/env node
//运行node.js脚本文件是省略节点操作，在js脚本文件前加#!/usr/bin/env node，并对脚本文件增加可执行权限
//node运行文件的绝对路径/usr/local/bin/

'use strict';
//严格模式下

const fs = require('fs');
const path = require('path');//引入path对象 
const mimeScore = require('mime-score');

let db = require('mime-db');
let chalk = require('chalk');
//引入以上模块

const STANDARD_FACET_SCORE = 900;

const byExtension = {};
//定义byExtension对象

// Clear out any conflict extensions in mime-db
//mime-db是从IANA，Apache，NGINX和由Node.js社区提交的自定义映射中抽取的MIME类型定义的规范化数据集,
//是媒体类型数据库.它是所有MIME类型的数据库。它由一个单一的公共JSON文件组成.
//函数作用：去掉在mime-db中冲突的扩展
for (let type in db) {
  //遍历db对象中的type
  let entry = db[type];
  entry.type = type;
  if (!entry.extensions) continue;
  //如果某类型没有对应的扩展，则继续

  entry.extensions.forEach(ext => {
    //遍历扩展数组中的元素
    if (ext in byExtension) {
      const e0 = entry;//db中的扩展
      const e1 = byExtension[ext];//byExtension对象中的某个扩展
      //.source - 定义了MIME类型。如果未设置，则可能是自定义媒体类型
      e0.pri = mimeScore(e0.type, e0.source);
      e1.pri = mimeScore(e1.type, e1.source);
      //mimescore:为了解决扩展冲突的目的，给MIME类型分配一个分数

      let drop = e0.pri < e1.pri ? e0 : e1;// 如果去除,e0.pri < e1.pri返回e0
      let keep = e0.pri >= e1.pri ? e0 : e1;//如果不去除，e0.pri >= e1.pri返回e0
      drop.extensions = drop.extensions.filter(e => e !== ext);
      //filter() 方法创建一个新数组, 其包含e !== ext的所有元素
      console.log(`${ext}: Keeping ${chalk.green(keep.type)} (${keep.pri}), dropping ${chalk.red(drop.type)} (${drop.pri})`);
      //保留下的扩展用绿色标记，去掉的冲突的扩展用红色标记
    }
    byExtension[ext] = entry;
  });
    
  //maps[map][key] = extensions;
}

//函数作用：创建类型的文件  参数：types类型  path：路径 
function writeTypesFile(types, path) {
  fs.writeFileSync(path, JSON.stringify(types));
  //文件名称：path   types:将要写入的内容，用字符串形式  
}

// Segregate into standard and non-standard types based on facet per
// https://tools.ietf.org/html/rfc6838#section-3.1
//函数作用：根据json构面划分为标准类型和非标准类型
//媒体类型和子类型名称facet
const standard = {};
const other = {};

Object.keys(db).sort().forEach(k => {
  const entry = db[k];
  if (entry.extensions) {
    // STANDARD_FACET_SCORE = 900;
    if (mimeScore(entry.type, entry.source) >= STANDARD_FACET_SCORE) {
      standard[entry.type] = entry.extensions;//标准
    } else {
      other[entry.type] = entry.extensions;//非标准
    }
  }
});
//调用writeTypesFile（）函数：创建文件
//path模块的join方法：路径联合 将多个参数组合成一个 path 
//标准类型的文件    _dirname:全局路径变量 当前脚本所在路径：放在上一级目录下的types文件夹下
writeTypesFile(standard, path.join(__dirname, '../types', 'standard.json'));
//非标准类型的文件   放在上一级目录下的types文件夹下
writeTypesFile(other, path.join(__dirname, '../types', 'other.json'));

//JSON.stringify(value[, replacer [, space]])
//maps:将要序列化成 一个JSON 字符串的值 null:对象所有的属性都会被序列化
//2:指定缩进用的空白字符串，用于美化输出,2代表有2个空格；
//输出字符串
//console.log(JSON.stringify(maps, null, 2));
