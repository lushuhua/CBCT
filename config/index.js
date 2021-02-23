var isthinkpad=true
module.exports = {
    'network' : {'port':8080},
    'jwtsecret': 'myjwttest',
    'database': '你的mongo库链接或者其他11',
    codeexpire:180,//秒
    jwtExpireDefault:'24h',//默认一天过期
    jwtExpire:60*60*24*1,// 一天过期
    md5secret:"jkkks934(EIURLOE(W)WF<{fs;f{{",
    host:'localhost:3003',
    prdHost:'curie.astystore.com',
    port:3003,
    //mongolink:isthinkpad?'mongodb://test:123456@192.168.99.100:27017/test':'mongodb://test:123456@localhost:27017/test',
    //redislink:isthinkpad?'192.168.99.100':'localhost',
    build:{
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
        isProd:process.env.npm_config_prod
    }
};
