/** * 用户信息 */
var path = require("path");
const fileName = path.basename(__filename).split('.')[0];

var mongoose = require('../db.js'), Schema = mongoose.Schema;
//一个病人 对应多个目录
var Sch = new Schema({
    name:{type:String},
    pid:{type:String},
    level:{type:Number},
    children:{type:Array},
    type:{type:String,required:true},//ct , dcm , cbct-1  cbct-2,reg 最后一层目录名字
    path:{type:String,required:true},
    patientName:{type:String},
    patientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',   // 关联的模型
        required:true
    },
    createTime:{
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model(fileName,Sch);
