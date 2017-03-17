/**
 * Created by dipper on 2017/3/15.
 */
//文章表
'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema

let ArticleSchema = new Schema({
    author_id:{
        type:Schema.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        unique:true,
    },
    content:String,
    images:{
        type:Array
    },
    tags:[{
        type:Schema.ObjectId,
        ref:'Tag'
    }],
    visit_count:{
        type:Number,
        default:0
    },
    comment_count:{
        type:Number,
        default:0
    },
    like_count:{
        type:Number,
        default:0
    },
    top:{
        type:Boolean,
        default:false,
    },
    status:{
        type:Number,
        default:0
    },
    created:{
        type:Date,
        default:Date.now
    },
    publish_time:{
        type:Date,
        default:Date.now
    },
    updated:{
        type:Date,
        default:Date.now
    }
});

ArticleSchema
    .virtual('info')
    .get(function () {
        return {
            '_id':this._id,
            'title':this.title,
            'content':this.content,
            'images':this.images,
            'visit_count':this.visit_count,
            'comment_count':this.comment_count,
            'like_count':this.like_count,
            'public_time':this.public_time
        };
    });

module.exports = mongoose.model('Article',ArticleSchema);