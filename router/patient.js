const { response } = require('../utils/utils');
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
var Model = require('../model/Patient');
var ModelFilePath = require('../model/FilePath');
const fs = require('fs');
const config = require('../config')
const _ = require('lodash');


/*获取病人列表 并获取cbct路径*/  
router.get('/list', async function (req, res) {
    var patients = await Model.find().exec();
    var a = patients.map(async item => {
        var obj = {}
        const _id = item._id;
        var dcmFile = await ModelFilePath
            .find({ patientId: _id, type: "CT" })
            .select('patientName patientId age sex idPatients level path')
            .exec();
        if (dcmFile.length > 0) {
            const { patientName, patientId, age, sex, idPatients, level, path} = dcmFile[0];
            obj.title = patientName;
            obj.key = patientId;
            obj.age = age;
            obj.sex = sex;
            obj.idPatients = idPatients;
            obj.level = level;
            obj.dcmPath = path;
            obj.detail = {};
        }
        obj['children'] = await ModelFilePath
            .find({ patientId: _id, type: "cbct" })
            .select('_id patientId pid name type path')
            .exec();
        obj['children'] = obj['children'].map(item1 => {
            var obj1 = {};
            const { _id, name, type, path: url } = item1;
            obj1['pid'] = obj['key'];
            obj1['path'] = url;
            // obj['dcmPath'] = path.resolve(url,'../dcm');
            // obj['path'] = path.resolve(url,'../../');
            // obj['type'] = 'cname';
            obj1['title'] = name;
            obj1['key'] = _id;
            obj1['type'] = type;
            obj1['level'] = 2;
            obj1['detail'] = {};
            return obj1;
        });
        // console.log("obj===>", obj)
        return obj;
    });
    Promise.all(a).then(res1 => {
        res.json(response.succ(res1));
    })
});

//点击病人 获取路径 读取dcm平级的dcmRaw/data_dcm.raw 文件
router.post('/rawFile', function (req, res) {
    var { dcmDir, level, key, path: url, pid } = req.body;
    console.log("dcmDir=====>", dcmDir)
    res.setHeader('Transfer-Encoding', 'chunked');
    var rawPath;
    if (level == 0) {//如果是病人
        rawPath = path.resolve(dcmDir, 'dcmRaw/data_dcm.raw');
    } else if (level == 2) {//如果是cbct
        //const {path:url} = req.body;
        //获取cbct下面的raw文件
        const files = _.without(fs.readdirSync(url), '.DS_Store');
        console.log('====rawFile====', files);
        rawPath = path.join(url, '/', files[0]);
    }
    //console.log( path.resolve(dcmDir , '../dcmRaw/data_dcm.raw') );

    var readStream = fs.createReadStream(rawPath);
    var i = 0;
    readStream.on('data', function (chunk) {
        console.log('===new buffer:===',chunk);
        //res.write(chunk);
        i++;
        // socket.emit('chunk', chunk.toString('base64'));///////////////////////不需要base64，直接二进制
        socket.emit('chunk', chunk);///////////////////////不需要base64，直接二进制
    });
    readStream.on('end', function () {
        socket.emit('chunk end', { i, level, key, pid });
        console.log('读取结束');
        i = 0;
        res.end('读取结束');
    })

});
router.post('/update/:id', function (req, res) {
    const { shifts } = req.body;
    var data = Model.findByIdAndUpdate(req.params.id, { $set: { 'detail.shift': shifts } }, function (err, ressult) {
        if (err) {
            res.json(response.err(err))
        } else {
            res.json(response.succ(ressult))
        }
    });

});

module.exports = router;
