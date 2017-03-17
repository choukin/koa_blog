/**
 * 标签分类表
 * Created by dipper on 2017/3/15.
 */

'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TagCategorySchema = new Schema({
    name:{
        type:String,
        unique:true
    },
    desc:String

})
module.exports = mongoose.model('TagCategory',TagCategorySchema);