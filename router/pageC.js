const {response} = require('../utils/utils');
const express = require('express');
const router = express.Router();
var Model = require('../model/PageC');
var jwt = require('express-jwt');

/*新增分类*/
router.post('/add', function (req, res) {
    const {title,content,username} = req.body;
    Model.findOne({title},function (err,model) {
        if (err) throw err;
        if(model){
            res.json(response.err('当前item已存在'))
        }else{
            var data = new Model(req.body).save();
            data ? res.json(response.succ()) : res.json(response.err())
        }
    })
});

/*更新分类*/
router.post('/update/:id',function (req,res) {
    const {title,content,username} = req.body;
    var data = Model.findByIdAndUpdate(req.params.id,req.body).exec();
    res.json(response.succ())
});

/*删除分类*/
router.post('/delete/:id',function (req,res) {
    const {title,content,username} = req.body;
    var data = Model.findByIdAndRemove(req.params.id).exec();
    res.json(response.succ(data))
});

/*查询所有的分类*/
router.get('/index',function (req,res) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaa');
    Model.find().exec().then(d=>{
        res.json(response.succ(d))
    });
    //res.json(response.succ());
});

/*查询分类*/
router.get('/:id',async function (req,res) {
    var data = await Model.findById(req.params.id).exec();
    res.json(response.succ(data));
});


module.exports = router;