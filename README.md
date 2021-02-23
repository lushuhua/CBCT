## webpack功能：
- 代码转换：scss,less,转为 ts 转为js
- 文件优化: 压缩合并js css,图片合并优化
- 代码分割:（公共文件抽离，路由懒加载）
- 自动刷新
- 自动发布

1. 初始化项目
```
npm init -y
npm i -D webpack webpack-cli
```

webpack 默认支持js模块化,```module.exports,require(xx)``` 

2. 处理样式

- css : style-loader,css-loader

```$xslt
 {
                test:/\.css$/,
                use:[{
                    loader:'style-loader',
                    options:{
                        insertAt:'top' //插入到header最顶部
                    }
                },'css-loader']
            },
```

- less: less less-loader
```$xslt
{
                test:/\.less/,
                use:[
                        {
                            loader:'style-loader',
                            options:{
                                insertAt:'top' //插入到header最顶部
                            }
                        },
                        'css-loader',
                        'less-loader'
                    ]
            },
```

- scss: node-sass sass-loader

```$xslt
{
                test:/\.scss/,
                use:[
                    {
                        loader:'style-loader',
                        options:{
                            insertAt:'top' //插入到header最顶部
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
```
>> style-loader 处理的样式默认以style的形式插入到了head中,如何使用link的形式呢
```$xslt
//引入mini-css-extract-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//可以定义多个

//plugins中：
new MiniCssExtractPlugin({
            filename: 'main.css'
        }),
        
//修改style-loader为以下：less,sass同理
{
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader,'post-css',  'css-loader']
},
```

autoprefixer:postcss-loader

# babel
```$xslt
npm i -D babel-loader @babel/core @babel/preset-env
```

# 暴露变量 windows下可以访问

- 内联loader

```$xslt
import $ from 'expose-loader?$!jquery'
```
这样`window.$`就可以访问了

或者觉着这样引入太麻烦了，可以在wepack中配置
modules:
```$xslt
{
    test:require.resolve('jquery'),
    use:'expose-loader?$'
}
```
再引入的时候 用`import $ from jquery`即可

或者觉得这样还麻烦,直接使用模块注入的方式配置更方便:
```$xslt
new Webpack.ProvidePlugin({
            'jquery':'$'
        }),
```

## 修改菜单
1. routes/config-bak.js 中添加路由
2. dLayout中引用路由
3. components/sideMenu.js中侧边栏显示菜单