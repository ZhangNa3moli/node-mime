#!/usr/bin/env node

'use strict';
//严格模式下

const fs = require('fs');
const path = require('path');
const mimeScore = require('mime-score');

let db = require('mime-db');
let chalk = require('chalk');
//引入以上模块

const STANDARD_FACET_SCORE = 900;

const byExtension = {};
//定义byExtension对象

// Clear out any conflict extensions in mime-db
//去掉在mime-db中冲突的扩展
for (let type in db) {
  let entry = db[type];
  entry.type = type;

  if (!entry.extensions) continue;

  entry.extensions.forEach(ext => {
    if (ext in byExtension) {
      const e0 = entry;
      const e1 = byExtension[ext];
      e0.pri = mimeScore(e0.type, e0.source);
      e1.pri = mimeScore(e1.type, e1.source);

      let drop = e0.pri < e1.pri ? e0 : e1;
      let keep = e0.pri >= e1.pri ? e0 : e1;
      drop.extensions = drop.extensions.filter(e => e !== ext);

      console.log(`${ext}: Keeping ${chalk.green(keep.type)} (${keep.pri}), dropping ${chalk.red(drop.type)} (${drop.pri})`);
    }
    byExtension[ext] = entry;
  });

  //maps[map][key] = extensions;
}

function writeTypesFile(types, path) {
  fs.writeFileSync(path, JSON.stringify(types));
}

// Segregate into standard and non-standard types based on facet per
// https://tools.ietf.org/html/rfc6838#section-3.1
const standard = {};
const other = {};

Object.keys(db).sort().forEach(k => {
  const entry = db[k];

  if (entry.extensions) {
    if (mimeScore(entry.type, entry.source) >= STANDARD_FACET_SCORE) {
      standard[entry.type] = entry.extensions;
    } else {
      other[entry.type] = entry.extensions;
    }
  }
});

writeTypesFile(standard, path.join(__dirname, '../types', 'standard.json'));
writeTypesFile(other, path.join(__dirname, '../types', 'other.json'));

//console.log(JSON.stringify(maps, null, 2));
