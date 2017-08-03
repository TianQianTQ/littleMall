var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接到MongoDB数据库
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/demo',{useMongoClient:true});
mongoose.connection.on("connectted",function(){
  console.log("MongoDB connected success")
});
mongoose.connection.on("error",function(){
  console.log("MongoDB connected fail")
});
mongoose.connection.on("disconnected",function(){
  console.log("MongoDB connected disconnected")
});

//查询商品列表数据
router.get("/list",function(req,res,next){
  //let page = parseInt(req.param("page"));   //从前端获取页码参数
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);  //获取页码数据大小
  let priceLevel = req.query.priceLevel;    //获取价格区间

  let sort = req.query.sort;    //获取前端传过来的参数

  console.log(page+"   "+pageSize+"    "+sort);

  let skip = (page-1)*pageSize;     //索引值
  var priceGt = '',priceLte='';
  let params={};
  if(priceLevel!='all'){
    switch(priceLevel){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=500;break;
      case '2':priceGt=500;priceLte=1000;break;
      case '3':priceGt=1000;priceLte=5000;break;
    }
    params={
       salePrice:{
          $gt:priceGt,
         $lte:priceLte
       }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);  //返回一个模型，skip是默认跳过几条数据，limit是一页显示多少条
  goodsModel.sort({'salePrice':sort});       //必须是一个对象，对什么进行排序，确定是升序还是降序
  goodsModel.exec(function(err,doc){         //执行
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
});

//加入到购物车
router.post("/addCart",function(req,res,next){
  var userId = '100000077',
    productId=req.body.productId;  //获取用户编号，商品编号（由前端传递过来）
  var User = require('../models/user');

  User.findOne({userId:userId},function(err,userDoc){     //找到用户信息
    if(err){
      res.json({
        status:"1",
        msg:err.message+"找不到该用户"
      })
    }else{         //如果找到该用户，先检查找到的信息
      console.log('用户信息找到'+'\n');
      if(userDoc){                   //如果存在
        let goodsItem = '';     //查询当前购物车是否有这个商品
        userDoc.cartList.forEach(function(item){
          if(item.productId == productId){   //如果该商品存在，直接添加+1
            console.log('查找成功'+'\n');
            goodsItem = item;
            item.productNum++;
          }
        });
        if(goodsItem){            //如果之前添加过该商品，直接添加到数据库
          userDoc.save(function(err2,doc2){
            if(err2){
              console.log('重复添加购物车失败');
              res.json({
                status:"1",
                msg:err2.message+"重复添加购物车失败"
              })
            }else{
              console.log("重复添加购物车成功");
              res.json({
                status:0,
                msg:'',
                result:'suc'
              })
            }
          })
        }else{          //如果不存在，则查找用户添加的商品并修改数据库
          Goods.findOne({productId:productId},function(err1,doc1){
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              if(doc1){               //如果查找成功
                doc1.productNum = 1;
                doc1.checked = 1;       //选中状态
                userDoc.cartList.push(doc1);
                userDoc.save(function(err3,doc3){
                  if(err3){
                    res.json({
                      status:"1",
                      msg:err3.message+"保存失败"
                    })
                  }else{
                    res.json({
                      status:"0",
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }
            }
          });
        }

      }
    }
  })
});



module.exports = router;
