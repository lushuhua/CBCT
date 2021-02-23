/**
 * Created by miyaye on 2020/4/4.
 */
/**
 * Created by miyaye on 2020/4/4.
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const publicAssetPath ='./static'
// 抽离style为link的css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const Webpack = require('webpack');
const config = require('../config/index')
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
        filename: `${publicAssetPath}/css/[name]-[hash:8].css`
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true,
        comments: false,
        chunksSortMode: 'dependency',
        chunks: ['app','bootstrap','common','vendor'] // 引入的代码块
    }),
    new Webpack.IgnorePlugin(/\.\/locale/,/moment/),
    new CopyWebpackPlugin(['index.html']),
    new CopyWebpackPlugin([
        { from: resolve('static'), to: resolve('dist/static') ,ignore: ['*.raw','*.dicom'] }
    ])
];

//查看打包 分析报告 npm run build --report
if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
     plugins.push(new BundleAnalyzerPlugin({
        //  可以是`server`，`static`或`disabled`。
        //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
        //  在“静态”模式下，会生成带有报告的单个HTML文件。
        //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
        analyzerMode: 'server',
        //  将在“服务器”模式下使用的主机启动HTTP服务器。
        analyzerHost: '127.0.0.1',
        //  将在“服务器”模式下使用的端口启动HTTP服务器。
        analyzerPort: 8888,
        //  路径捆绑，将在`static`模式下生成的报告文件。
        //  相对于捆绑输出目录。
        reportFilename: 'report.html',
        //  模块大小默认显示在报告中。
        //  应该是`stat`，`parsed`或者`gzip`中的一个。
        //  有关更多信息，请参见“定义”一节。
        defaultSizes: 'parsed',
        //  在默认浏览器中自动打开报告
        openAnalyzer: true,
        //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
        generateStatsFile: false,
        //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
        //  相对于捆绑输出目录。
        statsFilename: 'stats.json',
        //  stats.toJson（）方法的选项。
        //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
        //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null,
        logLevel: 'info' // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
    }))
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js',
    },

    output: {
            filename: `${publicAssetPath}/js/[name]-[hash:8].bundle.js`,
            path: path.resolve(__dirname, '../dist'),//路径必须是一个绝对路径
    },
    resolve:{//解析第三方模块
        /*modules:[path.resolve('node_modules')],
         extensions:['.js','.css','.scss','.less','.json','.jsx'],*/
        alias:{
            '@': path.resolve(__dirname, '../src')
        }
    },
    // mode: "development",
    // devtool: 'cheap-module-eval-source-map',
    //devtool: 'cheap-module-eval-source-map',
    devtool:false,
    mode:"development" ,
    module:{
      rules:[
          {
              test:/\.js|\.jsx$/,
              include:[path.resolve(__dirname,'../')],
              exclude:/node_modules/,
              use:{
                  loader:'babel-loader?cacheDirectory=true',
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
          /*{
              test: /\.scss/,
              exclude:/node_modules/,
              use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'postcss-loader',//解析css之前就加上前缀
                  'sass-loader'
              ]
          },*/
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
    plugins
};
