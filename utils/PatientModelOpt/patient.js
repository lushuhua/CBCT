/**
 * Created by miyaye on 2020/4/7.
 */
const {response} = require('../utils');
var Model = require('../../model/Patient');
const assert = require('assert');
const Patient = {};

/*新增*/
Patient.add = function (data) {
    const {patientName} = data;
    return new Promise((resolve,reject)=>{
        Model.findOne({patientName},async  (err,model)=>{
            if (err) throw err;
            if(model){
                //console.log('新增失败,病人已存在:'+patientName);
                reject('新增失败,病人已存在'+patientName);
            }else{
                var data = await new Model({patientName}).save(function (error) {
                    if(error){
                        assert.equal(error.errors['patientName'].message,
                            'Path `patientName` is required.')
                        reject('Path `patientName` is required');
                    }
                });
                console.log('新增病人:'+patientName);
                resolve(data);
            }
        }).catch(err=>{
            //console.log('err111:',err)
        })
    }).catch(err=>{
        //console.log('err222',err)
    })
};

/*更新*/
Patient.update = function (id,body) {
    var data = Model.findByIdAndUpdate(id,body).exec();
    return response.succ(data);
};

/*删除*/
Patient.remove = function (id) {
    var data = Model.findByIdAndRemove(id).exec();
    return response.succ(data);
};

Patient.removeAll = function () {
    Model.remove('Patient')
};

/*查询列表*/
Patient.queryList = async function () {
    var data = await Model.find().exec();
    return response.succ(data);
};

/*查询单个*/
Patient.find = async function (id) {
    return await Model.findById(id).exec();
};

Patient.findOne = async function (obj,cb) {
    return  await Model.findOne(obj).exec(cb);
};

module.exports = Patient;
