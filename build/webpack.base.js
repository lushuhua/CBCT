//require("@babel/polyfill"); 或者在下面的配置中使用 useBuiltIns：'usage'

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const publicAssetPath ='./static'
// 抽离style为link的css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Webpack = require('webpack');
const  CopyPlugin = require('copy-webpack-plugin');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js',
       // print: './src/js/print.js'
    },
    devtool: 'cheap-module-eval-source-map',//前台报错可以直接查看到哪个文件报错
    output: {
        filename: `${publicAssetPath}/js/[name]-[hash:8].bundle.js`,
        path: path.resolve(__dirname, '../dist'),//路径必须是一个绝对路径
    },
    resolve:{//解析第三方模块
        modules:[path.resolve('node_modules')],
        extensions:['.js','.css','.scss','.less','.json','.jsx'],
        alias:{
            '@': resolve('src')
        }
    },
    module: {
        noParse:/jquery/, //不去解析jquery的依赖库
        rules: [
            //eslint 可以打开
            /*{
                test:/\.js$/,
                include:path.resolve(__dirname,'src'),
                use:{
                    loader:'eslint-loader',
                    options:{
                        enforce:'pre'//在js babel-loader前面执行
                    }
                }
            },*/
            /*内联loader全局暴露*/
            /*{
               test:require.resolve('jquery'),
                use:'expose-loader?$'
            },*/
            {
                test:/\.js|\.jsx$/,
                include:[path.resolve(__dirname,'../src'),path.resolve(__dirname,'../server'),path.resolve(__dirname,'../router')],
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{//es6 转化为es5
                        presets:[ ['@babel/preset-env',{
                            corejs: '2.0',
                            useBuiltIns:'usage'
                        }],'@babel/preset-react'],
                        plugins:["@babel/plugin-transform-runtime",
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                            ["import", {"libraryName": "antd", "libraryDirectory": "es"},'ant'],
                            ["import", {"libraryName": "lodash", "libraryDirectory": "", "camel2DashComponentName":false},'lodash'],
                            ["import", {"libraryName": "jquery", "libraryDirectory": "", "camel2DashComponentName":false},'jquery'],
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                //exclude:/node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less/,
                exclude:/node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',//解析css之前就加上前缀
                    'less-loader'
                ]
            },
            {
                test: /\.scss/,
                exclude:/node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',//解析css之前就加上前缀
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: {
                    loader:'url-loader',
                    options:{
                        limit:200*1024,// 超过这个用　file-loader 生成真正的图片,否则用url-loader
                        outputPath:'img/',
                        //publicPath:"http://xxx" //单独给图片加publicPath
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader:'url-loader',
                    options:{
                        limit:1,// 超过这个用　file-loader 生成真正的图片,否则用url-loader
                        outputPath:'fonts/'
                    }
                }
            },
            {
                test: /\.(csv|tsv)$/,
                use: ['csv-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            }
        ]
    },
    externals:{
        //jquery:'$' //忽略 不打包这个 , 在外面cdn引入的情况
    },
    plugins: [
        new CleanWebpackPlugin(),
        //环境定义
        new Webpack.DefinePlugin({
            DEV:"'dev'" //在全局都可以使用DEV这个环境变量了
        }),
        new MiniCssExtractPlugin({
            filename: `${publicAssetPath}/css/[name]-[hash:8].css`
        }),
        new Webpack.ProvidePlugin({
            $:'jquery', //在每个模块中都注入 $,
            jQuery: "jquery",
            'window.jQuery': 'jquery',
            _:'lodash'

        }),
        // new Webpack.DllReferencePlugin({
        //    manifest:path.resolve(__dirname,'../','manifest.json')
        // }),
        //忽略moment包中的.locale目录,优化打包大小
        new Webpack.IgnorePlugin(/\.\/locale/,/moment/),
        new CopyPlugin([
            { from: resolve('static'), to: resolve('dist/static') }
        ]),
        //版权声明 webpack内置插件
        new Webpack.BannerPlugin('make 2020 by polyna'),
    ]
};

