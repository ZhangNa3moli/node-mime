#!/usr/bin/env node
//Node安装可能会在 /usr/local/bin/ 而不是 /usr/bin/ 就需要 env 命令在前边

'use strict';
//严格模式下

var mime = require('.');//引入同级目录下的所有文件模块
var file = process.argv[2];//获取命令行参数:获得文件的文件名/路径
var type = mime.getType(file);//获取给定路径或扩展的MIME类型

process.stdout.write(type + '\n');//把Mime类型+换行打印出来显示在屏幕上
