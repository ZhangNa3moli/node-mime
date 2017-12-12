# node-mime

A comprehensive, compact MIME type module.

   >`一个全面的，压缩的MIME 类型模块.`

## Version 2 Notes 版本 2 说明 

Version 2 is a breaking change from 1.x, as the semver implies.  Specifically:

   >`版本2是源自版本1.x的重大改变，正如语义化版本控制规范里蕴含的.特别是以下几点:`


* **ES6 support required (node@>=6)**
* `lookup()` renamed to `getType()`
* `extension()` renamed to `getExtension()`
* `charset()` and `load()` methods have been removed

  
- `需要ES6支持（node @> = 6）`
- `lookup() 改名为 getType()`
- `extension() 改名为 getExtension()`
- `charset()和load()方法已被删除`


If you prefer the legacy version of this module please `npm install mime@^1`.  Version 1 docs may be found [here](https://github.com/broofa/node-mime/tree/v1.x).

  
  >`如果你喜欢这个模块的旧版本，请npm install mime@^1.版本1文档可以在这里找到.`


## Install - NPM
```
 
安装 - NPM
    
npm install mime
```
## Quick Start快速开始

For the full version (800+ MIME types, 1,000+ extensions):

   >`对于完整版本（800多种MIME类型，1,000多个扩展名）：`

```javascript
const mime = require('mime');

mime.getType('txt');                    // ⇨ 'text/plain'
mime.getExtension('text/plain');        // ⇨ 'txt'

```

See [Mime API](#mime-api) below for API details.

   >`有关API详细信息，请参阅下面的Mime API`

## Lite Version精简版

There is also a "lite" version of this module that omits vendor-specific
(`*/vnd.*`) and experimental (`*/x-*`) types.  It weighs in at ~2.5KB, compared
to 8KB for the full version.  To load the lite version:


   >`这个模块还有一个“精简”版本，省略了vendor-specific（*/vnd.*）和experimental（*/x-*）类型.它的重量约为2.5KB，而完整版则为8KB。加载精简版本：`

```javascript
const mime = require('mime/lite');
```

## Browser-ready Versions适用于浏览器的版本

To use this module in the browser, you would typlically use
[webpack](https://webpack.github.io/) or [browserify](http://browserify.org/) to
package your code.  However, browser-ready versions are available via wzrd.in.
E.g. For the full version:

   >`在浏览器中使用mime模块，你一般会使用webpack或browserify来包装你的代码。但是，浏览器就绪版本可以通过wzrd.in获得.
例如对于完整版本：`

    <script src="https://wzrd.in/standalone/mime@latest"></script>
    <script>
    mime.getType(...); // etc.
    <script>

Or, for the `mime/lite` version:

   >`或者，对于精简版本：`
   

    <script src="https://wzrd.in/standalone/mime%2flite@latest"></script>
    <script>
    mimelite.getType(...); // (Note `mimelite` here)
    <script>

## Mime .vs. mime-types .vs. mime-db modules

For those of you wondering about the difference between these [popular] NPM modules,
here's a brief rundown ...

   >`对于那些想知道这些流行的NPM模块之间的区别的人，这里是一个简短的概要...`
   

[`mime-db`](https://github.com/jshttp/mime-db) is "the source of
truth" for MIME type information.  It is not an API.  Rather, it is a canonical
dataset of mime type definitions pulled from IANA, Apache, NGINX, and custom mappings
submitted by the Node.js community.

   >`mime-db是MIME类型信息的“真相之源”.这不是一个API.相反,它是从IANA，Apache,NGINX和由Node.js社区提交的自定义映射中抽取的MIME类型定义的规范化数据集.`
   

[`mime-types`](https://github.com/jshttp/mime-types) is a thin
wrapper around mime-db that provides an API drop-in compatible(ish) with `mime @ < v1.3.6` API.

   >`mime-types是mime-db的一个简单的包装器,它提供了一个与mime @ < v1.3.6API  兼容（ish）的API.`

`mime` is, as of v2, a self-contained module bundled with a pre-optimized version
of the `mime-db` dataset.  It provides a simplified API with the following characteristics:

   >`从v2起，mime是一个与mime-db数据集的预优化版本捆绑在一起的独立模块。它提供了一个简化的API，具有以下特征：`

* Internally consistent type &hArr; extension mapping. I.e.
`mime.getType(mime.getExtension(type)) == type` will always be true
* Method naming consistent with industry best-practices
* Compact footprint.  E.g. The minified+compressed sizes of the various modules:

- `内部一致类型⇔扩展映射.即 mime.getType(mime.getExtension(type)) == type总是为真`
- `方法命名符合行业最佳实践`
- `设计紧凑`
- `例如各种模块的缩小+压缩尺寸：`

Module | Size
--- | ---
`mime-db`  | 18 KB
`mime-types` | same as mime-db
`mime` | 8 KB
`mime/lite` | 2 KB

## Mime API

Both `require('mime')` and `require('mime/lite')` return instances of the MIME
class, documented below.

   >`这两个require('mime')和require('mime/lite')返回MIME类的实例，下面介绍。`

### new Mime(typeMap, ... more maps)

Most users of this module will not need to create Mime instances directly.
However if you would like to create custom mappings, you may do so as follows
...

   >`这个模块的大多数用户不需要直接创建Mime实例。但是，如果你想创建自定义映射，你可以这样做，如下所示...`

```javascript
// Require Mime 请求Mime类
const Mime = require('mime/Mime');

// Define mime type -> extensions map 定义mime类型 -> 扩展映射
const typeMap = {
  'text/abc': ['abc', 'alpha', 'bet'],
  'text/def': ['leppard']
  //类型：[扩展映射]
};

// Create and use Mime instance创建并使用mime实例
const myMime = new Mime(typeMap);
myMime.getType('abc');            // ⇨ 'text/abc'
myMime.getExtension('text/def');  // ⇨ 'leppard'

```

If more than one map argument is provided, each map is `define()`ed (see below), in order.

   >`如果提供了多个映射参数，则每个映射按顺序被定义（见下文）`
   

### mime.getType(pathOrExtension)

Get mime type for the given path or extension.  E.g.

   >`获取给定路径或扩展的MIME类型.例如`
   

```javascript
mime.getType('js');             // ⇨ 'application/javascript'
mime.getType('json');           // ⇨ 'application/json'

mime.getType('txt');            // ⇨ 'text/plain'
mime.getType('dir/text.txt');   // ⇨ 'text/plain'
mime.getType('dir\\text.txt');  // ⇨ 'text/plain'
mime.getType('.text.txt');      // ⇨ 'text/plain'
mime.getType('.txt');           // ⇨ 'text/plain'

```

`null` is returned in cases where an extension is not detected or recognized

   >`在未检测到或识别到扩展名的情况下返回null`

```javascript
mime.getType('foo/txt');        // ⇨ null
mime.getType('bogus_type');     // ⇨ null

```

### mime.getExtension(type)
Get extension for the given mime type.  Charset options (often included in
Content-Type headers) are ignored.

   >`获得给定的MIME类型的扩展名。字符集选项（通常包含在Content-Type标头中）将被忽略。`

```javascript
mime.getExtension('text/plain');               // ⇨ 'txt'
mime.getExtension('application/json');         // ⇨ 'json'
mime.getExtension('text/html; charset=utf8');  // ⇨ 'html'

```

### mime.define(typeMap[, force = false])

Define [more] type mappings.

   >`定义更多类型映射`
   

`typeMap` is a map of type -> extensions, as documented in `new Mime`, above.

   >`typeMap是类型 - >扩展的映射,正如上文所说的new Mime.`
   

By default this method will throw an error if you try to map a type to an
extension that is already assigned to another type.  Passing `true` for the
`force` argument will suppress this behavior (overriding any previous mapping).

   >`默认情况下，如果您尝试将类型映射到已分配给其他类型的扩展，则此方法将引发错误。传递true的force参数将抑制这种行为（可以覆盖任何以前的映射）.`

```javascript
mime.define({'text/x-abc': ['abc', 'abcd']});

mime.getType('abcd');            // ⇨ 'text/x-abc'
mime.getExtension('text/x-abc')  // ⇨ 'abc'

```

## Command Line命令行

    mime [path_or_extension]

例如：

    > mime scripts/jquery.js
    application/javascript

----
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)

   >`markdown由src / README_js.md生成RunMD徽标`
