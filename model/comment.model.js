/**
 * 评论
 */
'use strict'

const mongose = require('mongoose')
const Schema = mongose.Schema;

let CommentSchema = new Schema({
    aid:{
        type:Schema.Types.ObjectId,
        ref:'Article'
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    content:String,
    //针对评论的回复
    replys:[{
        content:String,
        user_info:Object,
        created:Date
    }],
    status:{
        type:Number,
        default:1
    },
    created:{
        type:Date,
        default:Date.now
    },
    updated:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongose.model('Comment',CommentSchema);
 