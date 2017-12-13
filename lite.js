'use strict';
//严格模式下

const Mime = require('./Mime');//引入同级目录下的Mime.js文件
module.exports = new Mime(require('./types/standard'));
//实例化引入同级目录types文件夹下的standard.json文件的Mime对象并暴露出来
