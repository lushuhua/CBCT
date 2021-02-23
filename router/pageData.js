const {response} = require('../utils/utils');
const express = require('express');
const router = express.Router();
var Model = require('../model/PageData');
var jwt = require('express-jwt');

/*新增*/
router.post('/add', function (req, res) {
    const {title,content,username} = req.body;
    Model.findOne({title},function (err,model) {
        if (err) throw err;
        if(model){
            res.json(response.err('当前item已存在'))
        }else{
            var data = new Model({
                title,content
            }).save();
            data ? res.json(response.succ()) : res.json(response.err())
        }
    })
});

/*更新*/
router.post('/update/:id',function (req,res) {
    const {title,content,username} = req.body;
    var data = Model.findByIdAndUpdate(req.params.id,{title,content}).exec();
    res.json(response.succ())
});

/*删除*/
router.post('/delete/:id',function (req,res) {
    const {title,content,username} = req.body;
    var data = Model.findByIdAndRemove(req.params.id).exec();
    res.json(response.succ(data))
});

/*查询列表*/
router.get('/index',function (req,res) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaa');
    Model.find().exec().then(d=>{
        res.json(response.succ(d))
    });
    //res.json(response.succ());
});

//这个是假的初始化数据接口
router.get('/test',function (req,res) {
    var data = {
        custName:'张三',
        age:12,
        gender:'female'
    };
    res.json(response.succ(data));
});

/*查询详情*/
router.get('/:id',function (req,res) {
    var data = Model.findById(req.params.id).exec();
    res.json(response.succ(data));
});




module.exports = router;