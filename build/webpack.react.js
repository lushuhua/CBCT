const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode:'production',
    entry:{
        //test:resolve('src') + '/test.js'
        react:['react','react-dom','moment','lodash']
    },
    output:{
        filename:'js/_dll_[name].js',
        path:path.resolve(__dirname,'../dist'),
        library:'_dll_[name]',
        //libraryTarget:'commentjs' //commonjs ,var
    }, 
    plugins:[
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            name:'_dll_[name]',
            path: path.resolve(__dirname,'../','manifest.json')
        })
    ]
}