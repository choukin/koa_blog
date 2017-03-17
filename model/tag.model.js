/**
 * 标签表
 * Created by dipper on 2017/3/15.
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let TagSchema = new Schema({
    name:{
        type:String,
        unique:true
    },
    cid:{
        type:Schema.Types.ObjectId,
        ref:'TagCategory'
    },
    is_index:{
        type:Boolean,
        default:false
    },
    sort:{
        type:Number,
        default:1
    }
})

module.exports = mongoose.model('Tag',TagSchema);

