
# node-mime代码解读成果展示
## 一、代码仓库展示

#### 名称：node-mime

#### 功能：使用第三方mime模块设置某种扩展名的文件的响应程序类型,既方便又统一

#### 地址：[https://zhangna3moli.github.io/node-mime](https://zhangna3moli.github.io/node-mime)

#### 仓库包含文件及作用

> index.js

项目主文件，也是项目的入口文件，其中暴露的函数作为第三方模块引用

> README.md 

对项目作描述和说明

> .gitignore

用来排除不必要的项目文件或敏感信息文件，在此文件中写入的文件不会被提交到远程仓库

> LICENSE

文件统一用的MIT共享协议

> package.json

存储工程的元数据，描述项目的依赖项，类似配置文件。

项目依赖项：

chalk: 命令行彩色输出（终端字符串样式正确）

eslint: 一个基于AST的模式检查器的JavaScript。

github-release-notes: Github发行说明和更新日志生成器.从标签创建发行版,并使用问题或提交来创建发行说明.也可以                       根据发行说明生成一个CHANGELOG.md文件（或者生成一个全新的）。

mime-db: 媒体类型数据库.它是所有MIME类型的数据库。它由一个单一的公共JSON文件组成，不包含任何逻辑，允许它尽可          能保持与API无关。它汇总了以下来源的数据：

>- [http://www.iana.org/assignments/media-types/media-types.xhtml(http://www.iana.org/assignments/media-types/media-types.xhtml)
>- [http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types](http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types)
>- [http://hg.nginx.org/nginx/raw-file/default/conf/mime.types](http://hg.nginx.org/nginx/raw-file/default/conf/mime.types)

mime-types:最终的JavaScript内容类型的实用工具。和mime类似，除了以下几点不一样，否则和API是兼容的。
 
>- 不支持回退。并不是本机返回第一个可用的类型， mime-types只返回false，所以可以var type = mime.lookup('unrecognized') || 'application/octet-stream'。
>- 没有new Mime()，所以可以var lookup = require('mime-types').lookup。
>- 没有.define()功能
>- 错误修复 .lookup(path)

runmd:可运行的README文件,在markdown中运行代码块并用输出注释它们。
      使用runmd,,您的读者可以相信您的代码块是可运行的，代码输出将被声明。

mocha：自动化测试工具

> .travis.yml 

travis-ci持续集成工具的配置文件

> test文件夹

包含test.js文件，对Mime.js进行mocha自动化测试


> docs文件夹

存放项目文档


## 二、代码解读
### 1.README.md文件解读
项目分类：第三方模块
### 2.index cli lite Mime build文件解读

#### 数据结构种类：

字符串：类型判断，值判断，截取赋值等

对象：作为函数返回值，作为对象的属性，类型判断等

#### 算法种类：

算法可大致分为基本算法、数据结构的算法、数论与代数算法、计算几何的算法、图论的算法、动态规划以及数值分析、加密算法、排序算法、检索算法、随机化算法、并行算法，厄米变形模型，随机森林算法。

if语句：判断，函数执行的分支

for循环语句：fastparse函数中检查字符串

switch语句：分类，对url进行解析

三目运算符：替代if else语句进行赋值

#### 设计模式种类：





代码分块


代码模块 | 是否为暴露模块|描述
---|---|---
var,require | |全局变量定义和引入第三方模块
exports | |暴露模块
parseurl(req)|是|对req.url判断，用缓存的方法解析url
originalurl(req)|是|对req.originalUrl判断，用缓存的方法解析
fastparse(str)|否|用url.parse(url)解析url
fresh(req,parsed)|否|判断此次解析的地址有没有进行过缓存

执行过程

![image](../images/parseurl.jpg)

![image](../images/originalUrl.jpg)
### 3.parseurl-test.js文件和originalUrl-test.js文件

![image](../images/parseurl-test.jpg)

![image](../images/originalUrl-test.jpg)
## 三、mocha自动化测试展示

![image](../images/mocha-test.jpg)


## 四、travis-ci展示


3. 调试运行项目

将项目作为第三方库来安装引入进行调试

4. 拆分代码，单独研究

对fastparse函数进行Chrome调试，通过传入不同参数来查看函数执行过程，了解了url具体的解析过程



