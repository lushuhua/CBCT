/** * 用户信息 */
var mongoose = require('../db.js'), Schema = mongoose.Schema;

var Sch = new Schema({
    /*username : { type: String }, //用户账号
    password: {type: String}, //密码
    clinic:{type:String},
    role:{type:String},
    memo:{type:String},
    logindate : { type: Date} //最近登录时间*/
});
module.exports = mongoose.model('User',Sch);
