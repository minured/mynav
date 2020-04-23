// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $(".siteList");
var $lastLi = $(".lastLi");
var siteStr = localStorage.getItem("site");
var siteObj = JSON.parse(siteStr); //要多学习||后面是保底值

var hashMap = siteObj || [{
  logo: 'A',
  logType: 'text',
  url: 'https://www.acfun.cn'
}, {
  logo: 'B',
  logoType: 'image',
  url: 'https://www.bilibili.com'
}];
console.log(hashMap); // 有了哈希表之后 ,就没有必要直接把内容写在html上, 可以用哈希表生成html

var inputFocus = false;

var simplifyUrl = function simplifyUrl(url) {
  var simple_url = url.replace("https://", "").replace("http://").replace("www.", "").replace(/\/.+/, "/...");

  if (simple_url[simple_url.length - 1] === "/") {
    simple_url = simple_url.replace("/", "");
  }

  return simple_url;
};

var saveHash = function saveHash(hashMap) {
  var siteStr = JSON.stringify(hashMap);
  localStorage.setItem("site", siteStr);
  console.log("hashMap已保存到localStorage");
};

var render = function render() {
  $siteList.find("li:not(.lastLi)").remove();
  hashMap.forEach(function (site, index) {
    // console.log(index)
    var simpleUrl = simplifyUrl(site.url);
    var $li = $("<li>\n            <div class=\"site\">\n                <div class=\"logo\">".concat(simpleUrl[0].toUpperCase(), "</div>\n                <div class=\"link\">").concat(simpleUrl, "</div>\n                <div class=\"delete\">\n                    <svg class=\"icon\">\n                        <use xlink:href=\"#icon-deleteX\"></use>\n                    </svg>\n                </div>\n            </div>\n        </li>")).insertBefore($lastLi);
    $li.on("click", function () {
      window.open(site.url, "_self");
    });
    $li.on("click", ".delete", function (e) {
      //阻止冒泡
      e.stopPropagation(); //删除

      hashMap.splice(index, 1);
      render();
      saveHash();
    });
  });
};

render();
$(".addButton").on("click", function () {
  var url = window.prompt("输入你要添加的网址:");

  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }

  hashMap.push({
    'logo': simplifyUrl(url)[0],
    'logoType': 'text',
    'url': url
  }); // console.log(hashMap)  

  render(); //每次添加url，哈希表保存到localStorage

  saveHash(hashMap);
}); //用户关闭页面之前保存localStorage    

window.onbeforeunload = function () {
  saveHash(hashMap);
}; //监听用户的键盘事件


$(document).on("keypress", function (e) {
  //e.key就是按下的按键 小写a b c ...
  //当变量名与对象的属性名相同的时候，let key = e.key可以简写如下，
  if (inputFocus === false) {
    console.log("input为false");
    var key = e.key;
    console.log(key);
    hashMap.forEach(function (site) {
      if (site.logo.toLocaleLowerCase() === key) {
        window.open(site.url, "_self");
      }
    });
  }
}); //判断input获取焦点

$("input[name=wd]").focus(function () {
  console.log("获取焦点");
  inputFocus = true;
}).blur(function () {
  console.log("失去焦点");
  inputFocus = false;
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.9960b46c.js.map