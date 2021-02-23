const {smart} = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
module.exports = smart(base,{
    mode:'production',
    devtool:false,
    stats: {
        logging: 'info',
        // chunks:false,
         modules:false,
        // chunkModules:false,
        // timings: false,
        // moduleTrace: false, // 显示警告/错误的依赖和来源
        // chunkOrigins: false,
        // chunkGroups:false,
        children:false
    },
    // watch:true,//监控代码 只要有代码改动就打包 npm run build
    // watchOptions:{
    //     poll:1000, //每秒问我 1000次
    //     aggregateTimeout: 500, //500ms内只打包一次 防抖
    //     ignored:/node_modules/
    // },
    //用于生产的
    optimization: {
        splitChunks:{
            cacheGroups:{
                //公共的模块
                common:{
                    chunks:'initial',
                    name:'common',
                    minSize:0,
                    minChunks:2,
                },
                //抽离第三方模块
                vendor:{
                    priority:1,
                    name:'vendor',
                    test:/node_modules/,
                    chunks:'initial',
                    minSize:30000,
                    reuseExistingChunk: true // 可设置是否重用该chunk
                },
            }
        },
        //用了optimize-css-assets-webpack-plugin这个插件就必须用js压缩插件,否则js不会被压缩
        minimizer: [
            new TerserJSPlugin({
                cache:true,
                parallel:true,//是否是并发打包的
                sourceMap:true,//源码映射
                exclude:/\/node_modules/,
                terserOptions: {
                    warnings: false,
                    output: {
                        comments: false,
                    },
                    extractComments: false,
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({})],
    },
    plugins:[
        new CleanWebpackPlugin(),
        //环境定义
        new Webpack.DefinePlugin({
            DEV:"'production'" //在全局都可以使用DEV这个环境变量了
        }),
        new FriendlyErrorsPlugin({

        }) ,
        new HtmlWebpackPlugin({
            title: 'Output Management',
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            hash: true,
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
            chunks: ['app','common','vendor'] // 引入的代码块
        }),
    ]
})
