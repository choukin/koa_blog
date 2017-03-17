/**
 * Created by dipper on 2017/3/16.
 */
'use strict'
const _ = require('lodash');
const mongoose = require('mongoose')
const Comment  = mongoose.model('Comment')
const Blog = mongoose.model('Article')
//添加评论
exports.addNewComment = function *() {
    const aid = this.request.body.aid;
    const content = this.request.body.content;
    const userId = this.req.user._id;
    
    let error_msg ;
    if(!aid){
        error_msg = "缺少必须参数"
    }else if(!content){
        error_msg = "评论内容不能为空"
    }

    if(error_msg){
        this.status = 422;
        return this.body = {error_msg:error_msg}
    }

    try{
        let result = yield Comment.create({aid:aid,content:content,user_id:userId});
        let comment = result.toObject();
        comment.user_id = {
            _id:this.req.user._id,
            nickname:this.req.user.nickname,
            avatar:this.req.user.avatar

        }

        yield Blog.findByIdAndUpdate(aid,{$inc:{comment_count:1}}).exec();
        this.status = 200;
        this.body = {data:comment,success:true};
    }catch(err){
        this.throw(err)
    }
}

//获取评论列表
//语法：
// Query.populate(path, [select], [model], [match], [options])
// 参数：
// path
// 类型：String或Object。
// String类型的时， 指定要填充的关联字段，要填充多个关联字段可以以空格分隔。
// Object类型的时，就是把 populate 的参数封装到一个对象里。当然也可以是个数组。下面的例子中将会实现。
// select
// 类型：Object或String，可选，指定填充 document 中的哪些字段。
// Object类型的时，格式如:{name: 1, _id: 0},为0表示不填充，为1时表示填充。
// String类型的时，格式如:"name -_id"，用空格分隔字段，在字段名前加上-表示不填充。详细语法介绍query-select
// model
// 类型：Model，可选，指定关联字段的 model，如果没有指定就会使用Schema的ref。
// match
// 类型：Object，可选，指定附加的查询条件。
// options
// 类型：Object，可选，指定附加的其他查询选项，如排序以及条数限制等等。

exports.getFrontCommentList = function *() {
    const aid = this.params.id;
    try{
        const commentList = yield Comment.find({aid:aid,status:{$eq:1}})
            .sort('created')
            .populate({
                path: 'user_id',
                select: 'nickname avatar'
            })
            .exec();
        this.status = 200;
        this.body = {data:commentList};
    }catch(err){
        this.throw(err);
    }
}

//添加评论
exports.addNewReply = function *() {
    const cid = this.params.id;
    if(!this.request.body.content){
        this.status = 422;
        return this.body = {message_msg:"回复内容不能为空"}
    }
    let reply = this.request.body;
    reply.user_info = {
        id:this.req.user._id,
        nickname:this.req.user.nickname
    }
    reply.created = new Date();
    try{
        const result = yield Comment.findByIdAndUpDate(cid,{"$push":{"replys":reply}},{new:true});
        this.status = 200;
        this.body = {success:true,data:result.replys}
    }catch(err){
        this.throw(err)
    }
}
//删除评论
exports.delComment = function *() {
    const cid = this.params.id;

    try{
        const result = yield Comment.findByIdAndUpdate(cid)
        Blog.findByIdAndUpdate(result.aid,{$inc:{comment_count:-1}}).exec();
        this.status = 200;
        this.body = {success:true}

    }catch (err){
        this.throw(err)
    }
}
//删除回复
exports.delReply = function *() {
    const cid = this.params.id;
    const rid = this.request.body.rid;
    if(!rid){
        this.status = 422;
        return this.body = {error_msg:'缺少回复ID'}
    }
    try{
        const result = yield Comment.findByIdAndUpdate(cid,{$pull:{replys:{_id:mongoose.Typs.ObjectId(rid)}}},{new:true})
        this.status = 200;
        this.body = {success:true,data:result}

    }catch (err){
        this.throw(err)
    }
}