/**
 * Created by 田倩 on 2017/7/27.
 */
var mongoose=require('mongoose');
var Schema = mongoose.Schema;      //定义表模型

var produtSchema=new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "checked":String,
  "productNum":Number,
  "productImage":String,
});

module.exports = mongoose.model('Good',produtSchema);
