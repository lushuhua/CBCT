/**
 * Created by miyaye on 2020/4/7.
 */
const {response} = require('../utils');
var Model = require('../../model/FilePath');
const assert = require('assert');
const FilePath = {};

/*新增*/
FilePath.add = function (data) {
    const {path} = data;
    return new Promise((resolve,reject)=>{
        Model.findOne({path},'path',(err,model)=>{
            if (err) throw err;
            if(model){
                console.log('新增路径已存在:'+path);
                reject('新增路径已存在:'+path)
            }else{
               //console.log('req add FilePath:',data);
               new Model(data).save(function (error) {
                    if(error){
                        assert.equal(error.errors['patientId'].message, 'Path `patientId` is required.');
                        assert.equal(error.errors['type'].message, 'Path `type` is required.');
                        assert.equal(error.errors['path'].message, 'Path `path` is required.');
                    }
                });
                console.log('新增路径:'+path);
                resolve(path)
            }
        })
    })
};

/*更新*/
FilePath.update = function (id,body) {
    var data = Model.findByIdAndUpdate(id,body).exec();
    return response.succ(data);
};
FilePath.updateByName = function (obj,body) {
    var data = Model.fineOne(obj).exec();
    return response.succ(data);
};

/*删除*/
FilePath.remove = function (id) {
    var data = Model.findByIdAndRemove(id).exec();
    return response.succ(data);
};

FilePath.removeAll = function () {
    Model.remove('FilePath')
};

/*查询列表*/
FilePath.queryList = async function () {
    var data = await Model.find().exec();
    return response.succ(data);
};

/*查询单个*/
FilePath.find = async function (id) {
    return await Model.findById(id).exec();
};

FilePath.findOne = async function (obj,cb) {
    return  await Model.findOne(obj).exec(cb);
};

module.exports = FilePath;
