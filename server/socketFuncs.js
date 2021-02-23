const path = require('path');
const fs = require('fs');
const config = require('../config')
const _ = require('lodash');
var qs = require('qs');


var pump = require('pump');
const { SolutionOutlined } = require('@ant-design/icons');


const readFile = (params, ws) => {
    var { dcmDir, level, key, path: url, pid } = params;
    //res.setHeader('Transfer-Encoding', 'chunked');
    var rawPath;
    console.log(level)
    if (level == 0) {//如果是病人
        // console.log('病人')
        // rawPath = path.resolve(dcmDir , '../dcmRaw/data_dcm.raw');  
        rawPath = dcmDir;
    } else if (level == 2) {//如果是cbct"
        //获取cbct下面的raw文件
        // const files = _.without(fs.readdirSync(url), '.DS_Store');
        // console.log('====rawFile====', files);
        // rawPath = path.join(url, '/', files[1]);
        rawPath = url;
        console.log(rawPath)
    }

    var slat = fs.lstatSync(rawPath); //判断文件是不是文件夹
    console.log(slat.isDirectory())
    if (slat.isDirectory()) {
        let files = fs.readdirSync(rawPath);
        let reg = /\.dcm$/
        files = files.filter(file => reg.test(file)); // reg.test(file)
        // let count = files.length;
        // let i = 0;
        files.forEach((file, index) => {
            var buffers = fs.readFileSync(rawPath + '/' + file);
            var type = index === (files.length - 1) ? 'end' : '';
            var obj = { buffers, level, key, type }
            ws.send(JSON.stringify(obj));
            // var readStream = fs.createReadStream(rawPath + '/' + file);

            // readStream.on('data', function (chunk) {
            //     // console.log('===new buffer:===',chunk);
            //     //res.write(chunk);
            //     i++;
            //     //ws.send('chunk', chunk);
            //     ws.send(chunk)
            // });
            // readStream.on('end', function () {
            //     console.log('i:', i)
            //     // ws.send('chunk end', {i,level,key,pid});
            //     var obj = { type: 'end', i, level, key, pid, count, index: index }

            //     ws.send(JSON.stringify(obj));
            //     console.log('读取结束');
            //     i = 0;
            // })
        })
        return;
    } else {
        var buffers = fs.readFileSync(rawPath);
        var type ='end';
        var obj = { buffers, level, key, type, pid }
        ws.send(JSON.stringify(obj));
        return;
    }

    var readStream = fs.createReadStream(rawPath);

    var i = 0;
    readStream.on('data', function (chunk) {
        // console.log('===new buffer:===',chunk);
        //res.write(chunk);
        i++;
        //ws.send('chunk', chunk);
        ws.send(chunk)
    });
    readStream.on('end', function () {
        console.log('i:', i)
        // ws.send('chunk end', {i,level,key,pid});
        var obj = { type: 'end', i, level, key, pid }

        var buff = new TextEncoder().encode(JSON.stringify(obj));
        ws.send(JSON.stringify(obj));
        console.log('读取结束');
        i = 0;
    })
}


module.exports = function (ws, req) {
    let list = [];
    // const url = require('url');
    // const pathname = url.parse(req.url).pathname;
    list.push(ws);
    console.log('=====当前连接人数=====:', list.length);
    if (list.length > 1) {
        //ws.close()
    }
    let url = req.url;
    // console.log('====url====:', url);
    // ws.onmessage = function (evt) 
    // { 
    //    var received_msg = evt.data;
    //    console.log('===========data=====',received_msg);
    // };
    /*客户端开始拿raw 数据*/
    ws.on('message', function (params) {
        console.log('接收到了客户端的参数:', params, url)
        var data = JSON.parse(params)
        switch (data.type) {
            case 'chunk':
                readFile(data, ws)
                break
            case 'aquire':
                ws.send(JSON.stringify({ msg: 'server received' + params }))
                break;
            case 'autoRegisteration':
                ws.send(JSON.stringify({ msg: 'server received' + params }))
        }
    });

    ws.on('error', function (error) {
        console.log('错误' + error);
    });

    ws.on('open', function (e) {
        ws.send('open');
    });

    ws.on('close', function (e) {
        //_.pull(list, ws);
        // ws.close()
        console.log('在线人数' + list.length);
    })
    //require('../utils/watchFile')(ws)
}
