var isthinkpad=true
module.exports = {
    'network' : {'port':8080},
    'jwtsecret': 'myjwttest',
    'database': '你的mongo库链接或者其他',
    port:3003,
    codeexpire:180,//秒
    jwtExpire:60*60*24,
    md5secret:"jkkks934(EIURLOE(W)WF<{fs;f{{",
    mongolink:isthinkpad?'mongodb://test:123456@192.168.99.100:27017/test':'mongodb://test:123456@localhost:27017/test',
    redislink:isthinkpad?'192.168.99.100':'localhost',
};