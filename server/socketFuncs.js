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
    if (level == 0) {//如果是病人
        // 读取目录下的所有dcm文件
        rawPath = dcmDir;
    } else if (level == 2) {//如果是cbct"
        //获取cbct下面的raw文件
        rawPath = url;
    }

    var slat = fs.lstatSync(rawPath); //判断文件是不是文件夹
    if (slat.isDirectory()) {
        let files = fs.readdirSync(rawPath);
        let reg = /\.dcm$/
        files = files.filter(file => reg.test(file));
        files.forEach((file, index) => {
            var buffers = fs.readFileSync(rawPath + '/' + file);
            ws.send(buffers);
            if (index == files.length - 1) {
                var obj = { type: 'end', level, key, pid }
                ws.send(JSON.stringify(obj));
                console.log('读取结束')
            }
        })
        return;
    } else {
        var buffers = fs.readFileSync(rawPath);
        ws.send(buffers);
        var obj = { type: 'end', level, key, pid }
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

let list =[];
module.exports = function (ws, req) {
    let url = req.url;
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
    };
    
    /*客户端开始拿raw 数据*/
    ws.on('message', function (params) {
        console.log('接收到了客户端的参数:', params, url);
        // ws.send("curie");
        var data = JSON.parse(params)
        switch (data.type) {
            case 'chunk':
                readFile(data, ws)
                break;
            case 'handshake':
                list.push(ws);
                console.log("handshake successful.");
                ws.send("handshake");
                break;
            case 'aquire':
                console.log('aquire');
                console.log("patientInfo===>", data.patientsInfo)
                ws = list[0];
                ws.send(JSON.stringify({ type: "aquire", patientsInfo: data.patientsInfo }))
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
        console.log('关闭连接');
        console.log('在线人数' + list.length);
    })
    //require('../utils/watchFile')(ws)
}
