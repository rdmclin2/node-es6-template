node-es6-template
======
# Usage
```
$ git clone git@github.com:rdmclin2/node-es6-template.git <your package name> && cd $_
$ rm -rf .git
$ echo "<your package name>" > README.md
```
Then modify the informations in package.json and create your repo in github, then
```
$ git init
$ git remote add origin <your repo origin>
$ git add .
$ git commit -m "first commit"
$ git push -u origin master
$ npm publish
```




# Blog
本文主要记录基于ES6的Nodejs模块项目初始化的过程,主要参考[ES2015 & babel 实战：开发 NPM 模块](http://morning.work/page/2015-11/es6-es7-develop-npm-module-using-babel.html)一文，原文比我写的详细的多，这里简略记录一下自己的配置过程，方便其他项目复制配置。项目文件详见[node-es6-template](https://github.com/rdmclin2/node-es6-template)
<!-- more --> 

本文主要配置项为:
- 使用Babel为项目提供使用ES6的能力
- 接入babel-preset-stage-3 以支持使用async/await
- 加入Eslint以控制代码风格和质量
- 加入mocha配置单元测试的es6环境

# 初始化项目
```
$ mkdir node-es6-module-template && cd node-es6-module-template && git init && npm init
```

# 安装babel
为了能使用es2015以及async和await,新建文件`.babelrc`:
```
{
  "presets": ["es2015", "stage-3"]
}
```
安装babel插件:
```
$ npm i babel-preset-es2015 babel-preset-stage-3 --save-dev
```
安装polyfill:
```
$ npm i babel-polyfill --save-dev
```
要让babel正确编译需要在入口文件顶部添加`require('babel-polyfill');`

# 配置Eslint
```
$ npm install --save-dev eslint
```
然后配置
```
$ eslint --init
```
选择airbnb,json即可,为了让eslint能够识别es6的特性我们安装`babel-eslint`模块:
```
$ npm install babel-eslint@6 --save-dev
```
修改.eslintrc
```
{
    "extends": "airbnb",
    "parser": "babel-eslint",
    "parserOptions": {
         "sourceType": "module"
    },
    "env": {
        "mocha": true,
        "node": true
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "strict": 0,
        "semi": [2, "never"],
        "arrow-body-style": ["off", "always"],
        "no-console": 0,
        "eol-last": "off",
        "quotes": [2, "single", {"avoidEscape": true, "allowTemplateLiterals": true}]
        }
}
```

# 基本文件结构
新建`src`和`test`文件夹
```
$ mkdir src test
```
在`src`中新建`index.js`文件
导出一个示例函数
```
export default function foo() {
  return 'foo'
}
```
可以用`babel-node index.js`进行测试

# 单元测试
为了让nodejs的require可以载入es6模块，需要`babel-core`
```
$ npm i babel-core mocha --save-dev
```
修改package.json的test命令
```
{
  "scripts": {
    "test": "mocha --compilers js:babel-core/register"
  }
}
```
在test文件夹中新建`test.js`文件,写入如下：
```
import foo from '../src'
import assert from 'assert'

describe('node-es6-template', () => {
  it('should return foo', done => {
    const output = foo()
    assert(output, 'foo')
    done()
  })
})
```
使用`npm test`进行测试

# 编译
在`package.json`中增加compile命令
```
{
  "scripts": {
    "compile": "babel -d lib/ src/"
  }
}
```
新建入口文件index.js
```
require('babel-polyfill');
module.exports = require('./lib').default;
```
为了让我们能够测试转换后的lib中的模块, 修改test.js
```
import foo from '../src'
```
为
```
import foo from '../'
```
编辑package.json文件，将test命令改为先执行compile编译代码后再执行mocha测试
```
{
  "scripts": {
    "test": "npm run compile && mocha --compilers js:babel-core/register"
  }
}
```
可以用`$ npm test`测试

# 发布
添加.gitignore文件
```
node_modules
lib
logs
*.log
npm-debug.log*
coverage
.DS_Store
```
添加.npmignore取消源文件
```
src
```
在package.json设置中设置prepublish让其在发布前自动执行编译
```
{
  "scripts": {
    "prepublish": "npm run compile"
  }
}
```

# 善后
为了开发环境一致在本地安装mocha和babel
```
$ npm i babel-cli mocha --save-dev
```
更改package.json中的compile和test命令
```
{
  "scripts": {
    "compile": "./node_modules/.bin/babel -d lib/ src/",
    "test": "npm run compile && ./node_modules/.bin/mocha --compilers js:babel-core/register"
  }
}
```
可以用`npm test`进行测试,使用`npm publish`进行发布

# 参考资料
- [ES2015 & babel 实战：开发 NPM 模块](http://morning.work/page/2015-11/es6-es7-develop-npm-module-using-babel.html)
- [ESLint官网](http://eslint.org/)
- [babel-eslint](https://github.com/babel/babel-eslint)