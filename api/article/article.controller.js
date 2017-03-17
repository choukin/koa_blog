/**
 * Created by dipper on 2017/3/17.
 */
'use strict'

const _ = require('lodash')
const mongoose = require('mongoose')
const Article = mongoose.model('Article')

const User = mongoose.model('User')
const Comment = mongoose.model('Comment')
const path = require('path')
const URL = require('url')
const MarkdownIt = require('markdown-it')
const config = require('../../config/env')
const tools = require('../../util/tools')

//添加博客
exports.addArticle = function *() {
    const content = this.request.body.content;
    const title = this.request.body.title;
    let error_msg;
    if(!title){
        error_msg = "标题不能为空"

    }else if(!content){
        error_msg = "内容不能为空"
    }

    if(error_msg){
        this.status = 422
        return this.body = {error_msg:error_msg}
    }

    this.request.body.images = tools.extractImag(content);
    try{
        const result = yield Article.create(this.request.body)
        this.status = 200;
        this.body = {success:true,article_id:result._id}
    }catch(error){
        this.throw(err);
    }


}

//后台获取博客列表
exports.getArticleList = function *() {
    let currentPage = (parseInt(this.query.currentPage) > 0)?parseInt(this.query.currentPage):1;
    let itemsPerPage = (parseInt(this.query.itemsPerPage) > 0)?parseInt(this.query.itemsPerPage):10;
    let startRow = (currentPage - 1) * itemsPerPage;

    let sortName = String(this.query.sortName) || "publish_time";
    let sortOrder = this.query.sortOrder;
    if(sortOrder === 'false'){
        sortName = "-" + sortName;
    }
    try{
        const ArticleList = yield Article.find()
            .skip(startRow)
            .limit(itemsPerPage)
            .sort(sortName)
            .exec();
        const count = yield Article.count();
        this.status = 200;
        this.body = { data: ArticleList, count:count };
    }catch(err){
        this.throw(err);
    }
}
//删除博客
exports.destory = function *() {
    const id = this.params.id;
    try{
        yield Article.findByIdAndRemove(id)
        yield Comment.remove({addid:id})
        this.status = 200;
        this.body = {success:true}
    }catch (error){
        this.throw(error);
    }
}

exports.updateArticle = function *() {
    const id = this.params.id;
    if(this.request.body._id){
        delete this.request.body._id;
    }
    const content = this.request.body.content;
    const title = this.request.body.title;
    let error_msg ;
    if(!title){
        error_msg = '标题不能为空'
    }else if(!content){
        error_msg = '内容不能为空'
    }
    if(error_msg){
        this.status = 422;
        return this.body = {error_msg:error_msg}
    }

    this.request.body.images = tools.extractImage(content);
    this.request.body.updated = new Date();
    if(this.request.body.isRePub){
        this.request.body.public_time = new Date();
    }
    try{
        const article = yield Article.findByIdAndUpdate(id,this.request.body,{new:true})
        this.status = 200;
        this.body = {success:true,article_id:article._id};
    }catch(err){
        this.throw(err)
    }

}

exports.getArticle = function *() {
    const id = this.params.id;
    try{
        const article = yield Article.findOne({_id:id}).populate('tags').exec();
        this.status = 200;
        this.body = {sucess:true,data:article};
    }catch(error){
        this.throw(error)
    }

}

exports.getFrontArticleCount = function *(next) {
    let condition = {status:{$gt:0}}
    if(this.query.tagId){
        const tagId = String(this.query.tagId);
        condition = _.defaults(condition,{tags:{$elemMatch:{$eq:tagId}}})
    }
    try{
        const count = yield Article.count(condition);
        this.status = 200;
        this.body = {success:true,count:count};
    }catch(err){
        this.throw(err)
    }
}

exports.getFrontArticleList = function *(next) {

    let currentPage = (parseInt(this.query.currentPage) > 0)?parseInt(this.query.currentPage):1;
    let itemsPerPage = (parseInt(this.query.itemsPerPage) > 0)?parseInt(this.query.itemsPerPage):10;
    let startRow = (currentPage - 1) * itemsPerPage;
    let sort = String(this.query.sortName) || "publish_time";
    sort = "-" + sort;
    let condition = {status:{$gt:0}};
    if(this.query.tagId){
        //tagId = new mongoose.Types.ObjectId(tagId);
        const tagId = String(this.query.tagId);
        condition = _.defaults(condition,{ tags: { $elemMatch: { $eq:tagId } } });
    }
    try{
        const list = yield Article.find(condition)
            .select('title images visit_count comment_count like_count publish_time')
            .skip(startRow)
            .limit(itemsPerPage)
            .sort(sort)
            .exec();
        this.status = 200;
        this.body = {data:list};
    }catch(err){
        this.throw(err);
    }
}

exports.getFrontArticle = function *(next) {
     const id = this.params.id;
    const md = newMarkdownIt({
        html:true
    })

    try{
        let result = yield Article.findById(id,'-images');
        result.countent = md.render(result.content);
        result.visit_count ++;
        yield Arcticle.findByIdAndUpdate(id,{$inc:{visit_count:1}})
        this.status = 200;
        this.body = {data:reslullt.info};
    }catch(err){
        this.throw(err)
    }
}

exports.getPrenext = function *(next) {
    const id = this.params.id;
    const sort = String(this.query.sortName)|| "publish_time"
    let preCondition,nextCondition;
    preCondition = {status:{$gt:0}};
    nextCondition = {status:{$gt:0}}

    if(this.query.tagId){
        const tagId = String(this.query.tagId);
        //$eleMatch 对内嵌文档进行多条件查询
        preCondition = _.defaults(preCondition,{tags:{$elemMatch:{$eq:tagId}}});
        nextCondition = _.defaults(nextCondition,{tags:{$elemMatch:{$eq:tagId}}})
    }

    try{
        const article = yield Article.findById(id)
        if(sort === 'visit_count'){
            preCondition = _.defaults(preCondition,{'_id':{$ne:id},'visit_count':{'$lte':article.visit_count}});
            nextCondition = _.defaults(nextCondition,{'_id':{$ne:id},'visit_count':{'$gte':article.visit_count}})
        }else{
            preCondition = _.defaults(preCondition,{'_id':{$ne:id},'publish_time':{'$lte':article.publish_time}});
            nextCondition = _.defaults(nextCondition,{'_id':{$ne:id},'publish_time':{'$gte':article.publish_time}})

        }
        //
        const preResult = yield Article.find(preCondition).select('title').limit(1).sort('-'+sort);
        const nextResult = yield Article.find(preCondition).select('title').limit(1).sort(sort);

        const prev = preResult[0] ||{}
        const next = nextResult[0]||{}

        this.status = 200;
        this.body = {data:{next:next,'prev':prev}};

    }catch(err){
        this.throw(err)
    }
}


exports.getIndexImage = function *(){
    //todo const imagesCount = yield redis.llen('indexImages')
    this.status = 200;
    this.body = {success:true,img:config.defaultIndexImage};

}

exports.toggleLike = function *() {
    const _this = this;
    const aid = new mongoose.Typs.ObjectId(_this.params.id)
    const userId = _this.req.user._id;

    const isList = _.findIndex(_this.req.user.likeList,function(item){
        return item.toString() == _this.params.id;
    });

    let conditionOne,conditionTwo,liked;

    if(isLike !=-1){
        conditionOne = {'$pull':{'likeList':aid}};
        conditionTwo = {'$inc':{'like_count':-1}};
        liked = false
    }else{
        conditionOne = {'$pull':{'likeList':aid}};
        conditionTwo = {'$inc':{'like_count':1}};
        liked = true;
    }

    try{
        const user = yield User.findByIdAndUpdate(userId,conditionOne);
        const article = yield Article.findByIdAndUpdate(aid,conditionTwo,{new:true})
        _this.status = 200;
        _this.body = {success:true,'count':article.lick_count,'isLike':liked};
    }catch(error){
        _this.throw(err)
    }

}