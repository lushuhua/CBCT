/**
 * Created by miyaye on 2020/4/7.
 */
const mongoose = require('../db')
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
const rDicom = require('./rDicom');
const Patient = require('./PatientModelOpt/patient');
const FilePath = require('./PatientModelOpt/filePath');
const _ = require('lodash');
var patientNames = [];
var split = '/';
/*新增path*/
 function addFilePath(patientName,fullpath ,pid , children ) {
     Patient.findOne({patientName}).then(async(patientRow)=>{
        if(patientRow){
            const {_id} = patientRow;//病人id
            var name = path.basename(fullpath);
            var type=null,level=null;
            if(name.startsWith('ct')){
                type = 'ct';
                level = 1;
            }else if(name.startsWith('cb') || name.startsWith('reg') ){
                type = 'cbct';
                level = 2;
                //console.log('cbct fullpath:', fullpath)
                const pump = require('pump');
                const compressing = require('compressing');

                var files = fs.Sync(fullpath);
                files = _.without(files,'.DS_Store');
                var source = path.resolve(fullpath,files[0]);
                const target = path.resolve(fullpath,'data_dcm.raw.zip');
                compressing.zip.compressFile(source, target)
                    .then(() => {
                        console.log('compress success:'+fullpath);
                    })
                    .catch(err => {
                        console.error(err);
                    });

            }else if(name == 'dcm'){
                type = 'dcm';
                level = 2;
            } else if(name !='dcmRaw'){
                type = 'cname';
                level = 0
            }
            await FilePath.add({
                patientName,
                name,
                level,
                patientId:_id,
                type,
                path:fullpath,
                pid,
                children: type == 'cname' || type == 'ct' ? children : []
            });
            // console.log('已经添加完这一条');
            if(name == 'dcm'){
                //await rDicom.readDicom(fullpath);
                await rDicom.fnWriteFile(fullpath);
            }
        }else{
            console.log('路径插入失败:未找到patient')
        }
    });
}

function readFileList(dir,filesList=[], watchDir) {
    var dirPath = path.resolve(__dirname,'../../patients');
    patientNames = _.without(fs.readdirSync(dirPath),'.DS_Store');
    var files = fs.readdirSync(dir);
    if(watchDir){
        files = watchDir
    }
    console.log(files);
    // const curDirName = path.basename(dir);
    files.forEach(async (item, index) => {
        var fullPath = path.join(dir, item);
        if(fullPath.indexOf('\\')>0){
            split = '\\'
        }
        var patientName = (_.intersection(patientNames,fullPath.split(split)))[0];
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            //如果是目录 则路径入库
            var children = _.without(fs.readdirSync(fullPath),'dcm');
            addFilePath(patientName,fullPath , path.basename(dir) , children);
            readFileList(path.join(dir, item),filesList); //递归读取文件
        }
    });
    return filesList;
}
/************************start reading folders***********************************************************/

var dirPath = path.resolve(__dirname,'../../patients');

const startRead = (dirPath)=>{
    //读取第一层目录 将病人入库
    const files = fs.readdirSync(dirPath);
    patientNames = _.without(files,'.DS_Store');

    //循环病人 添加病人mongodb
    var filesList = [];
    const allP = [];

    //初始化 或者检测目录有修改的时候 重新读 drop patients, filepaths
    const {collections} = mongoose.connection.collections;

    if(collections){
        for(var col in collections){
            if(col=='patiens' || col == 'filepaths'){
                col.drop()
            }
        }
    }

    patientNames.forEach(pName=>{
        const res = Patient.add({patientName:pName});
        allP.push(res);
    });

    //当一级病人目录读完之后才读下面的文件目录
    Promise.all(allP).then(res=>{
        //病人都入库后 循环病人下的目录 依次将目录添加到mongodb
        readFileList(dirPath,filesList);
    }).catch(e=>{
        console.log('allp:',e);
        readFileList(dirPath,filesList);
    });
};

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

//开始读病人目录
//startRead(dirPath);
module.exports={
    startRead,
    rDicom,
    readFileList
};





