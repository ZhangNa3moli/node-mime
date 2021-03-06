'use strict';
//严格模式下

/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
//typeMap: 定义mime类型->扩展名的映射  typeMap:对象  Array[扩展名]
//ES6中引入Class（类）作为对象的模板,会默认添加constructor方法
class Mime {
  constructor() {
    //创建一个原型为null的空对象
    this._types = Object.create(null);
    //Object.create()是内部定义一个对象，并且让XX.prototype对象赋值为引进的空对象。
    //null用来表示尚未存在的对象,null的数据类型是Object对象
    this._extensions = Object.create(null);
   
    //在函数代码中，使用特殊对象 arguments，开发者无需明确指出参数名，就能访问它们
    //用 arguments对象检测函数的参数个数，引用属性 arguments.length
    for (var i = 0; i < arguments.length; i++) {
      //虽然arguments对象并不是一个数组，但是访问单个参数的方式与访问数组元素的方式相同
      //mime.define（typeMap）,定义对象中每个元素的mime类型->拓展名的映射
      this.define(arguments[i]);
    }
  }
  
   /*例：const mime = new Mime(     
          {'text/a': ['a', 'a1']},
          {'text/b': ['b', 'b1']}
        );
        assert.deepEqual(mime._types, {       
          a: 'text/a',
          a1: 'text/a',
          b: 'text/b',
          b1: 'text/b',
        });
        //extensions：扩展,测试类型与扩展是否相等
        assert.deepEqual(mime._extensions, {
          'text/a': 'a',
          'text/b': 'b',
        });
      */

  /**
   * Define mimetype -> xtension mappings.  Each key is a mime-type that maps
   * to an array of extensions associated with the type.  The first extension is
   * used as the default extension for the type.
   *
   * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
   *
   * @param map (Object) type definitions 
   */
  //定义mime类型->扩展的映射。每个键是一个映射到与类型相联系的扩展的数组。第一个扩展被用作类型的默认扩展名。
  //例如：mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});  'audio/ogg'是类型 
  //['oga', 'ogg', 'spx']是扩展名
  //定义类型映射  map:对象
  
  
  /*举例： 定义mime类型 -> 扩展 的映射
     const typeMap = {
       'text/abc': ['abc', 'alpha', 'bet'],
        类型：[扩展]
        'text/def': ['leppard']
      };
     创建并使用mime实例
     const myMime = new Mime(typeMap);
     myMime.getType('abc');            // ⇨ 'text/abc'
     myMime.getExtension('text/def');  // ⇨ 'leppard'  得到拓展名
  */
  define(typeMap, force) {
  //mime.define(typeMap [,force = false])
    for (let type in typeMap) {
    //遍历typeMap对象中的type类型
      var extensions = typeMap[type];
      //通过键定义对应的值
      for (let i = 0; i < extensions.length; i++) {
        //遍历并定义扩展(数组)中的每个元素
        var ext = extensions[i];
        if (!force && (ext in this._types)) {
          throw new Error(`Attempt to change mapping for "${ext}" extension from "${this._types[ext]}" to "${type}". Pass \`force=true\` to allow this, otherwise remove "${ext}" from the list of extensions for "${type}".`);
        }
        //默认情况下，如果尝试改变将类型映射到已分配给其他类型的扩展，则此方法将引发错误。
        //传递true的force参数将抑制这种行为（可以覆盖任何以前的映射）。否则就从扩展列表中移除该已分配类型映射的扩展
        this._types[ext] = type;
      }
      
   //const mime = new Mime({'text/a': ['a']}, {'text/b': ['b']});
  /*assert.throws(function() {
            mime.define({'text/c': ['b']});
        });
        //断言函数不会抛出错误
        assert.doesNotThrow(function() {
            mime.define({'text/c': ['b']}, true);
        });
  */
     

      // Use first extension as default
      //用数组元素中的第一个扩展作为默认值
      if (force || !this._extensions[type]) {
        this._extensions[type] = extensions[0];
      }
    }
  }

  /**
   * Lookup a mime type based on extension查找一个基于扩展的类型
   */
  // mime.getType（pathOrExtension）获取给定路径或扩展的MIME类型
  getType(path) {
    path = String(path);
    //将路径转化成字符串
    //正则：^匹配输入字行首 .代表一个除了回车和换行符之外的所有字符,等效于[^\r\n] *匹配前面的子表达式出现0次或多次 []代表字符类。匹配所包含的任意一个字符
    //调用字符串与正则相关的原型方法String.prototype.replace()来匹配
    var last = path.replace(/^.*[/\\]/, '').toLowerCase();
    var ext = last.replace(/^.*\./, '').toLowerCase();

    var hasPath = last.length < path.length;
    var hasDot = ext.length < last.length - 1;

    return (hasDot || !hasPath) && this._types[ext] || null;
    //有匹配的的路径或扩展名返回对应的类型，未检测到或识别到匹配的路径或扩展名的情况下返回null
  }

  /**
   * Return file extension associated with a mime type
   */
  //返回mime类型对应的文件扩展名
  getExtension(type) {
    // \s 匹配任何不可见字符，包括空格、制表符、换页符等等。等价于[ \f\n\r\t\v]
    // () 将( )之间的表达式定义为“组”（group），并且将匹配这个表达式的字符保存到一个临时区域（一个正则表达式中最多可以保存9个），它们可以用 \1 到\9 的符号来引用。
    // 正则表达式RegExp原型方法(test) 检测/^\s*([^;\s]*)/中是否含有type所包含的内容
    // $1 $2 ……表示正则表达式里面第一个、第二个、……括号里面的匹配内容。
    type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
    return type && this._extensions[type.toLowerCase()] || null;
    //有匹配的的类型返回对应的扩展名，未检测到或识别到匹配的类型的情况下返回null
  }
}

module.exports = Mime;//暴露Mime对象
