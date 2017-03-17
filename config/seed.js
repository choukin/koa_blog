/**
 * 初始化数据
 *
 */
'use strict'
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Article = mongoose.model('Article');
const TagCategory = mongoose.model('TagCategory');
const Tag = mongoose.model('Tag');
const co  = require('co');
const logger = require('../util/logs').logger;

//初始化标签文章 用户
module.exports = function () {
    co(function *() {
        const userCount = yield User.count();
        if(userCount === 0){
            yield User.create({
                nickname:'admin',
                email:'admin@admin.com',
                role:'admin',
                password:'admin',
                status:1
            },{
                nickname:'test001',
                email:'test@admin.com',
                role:'admin',
                password:'admin',
                status:1
            });
        }

        const tagCount = yield TagCategory.count();
        if(tagCount == 0){
            if(tagCount === 0){
                yield Tag.remove()
                const languageCat = yield TagCategory.create({
                    name:'language',
                    desc:'按编程语言分'
                });
                yield Tag.create({
                    name:'nodejs',
                    cid:languageCat._id,
                    is_show:true
                });

                const systemCat = yield TagCategory.create({
                    name:'system',
                    desc:'按操作系统分类'
                });

                yield Tag.create({
                    name:'linux',
                    cid:systemCat._id,
                    is_show:true
                });

                const otherCat = yield TagCategory.create({
                    name:'other',
                    desc:'其他分类'
                })
                yield Tag.create({
                    name:'git',
                    cid:otherCat._id,
                    is_show:true
                });

                const tags = yield Tag.find({});
                yield Article.remove();
                yield tags.map(function (tag,index) {
                    var indexOne = parseInt(index) + 1;
                    var indexTwo = parseInt(index) + 2;
                    Article.create({
                        title:'第'+ (index + indexOne) +'篇文章',
                        content:'<p>测试内容，</p>',
                        tags:[tag._id],
                        status:1
                    },{
                        title:'第'+ (index + indexTwo) +'篇文章',
                        content:'<p>测试内容，</p>',
                        tags:[tag._id],
                        status:1
                    });
                });

            }
        }

    }).catch(function (err) {
        logger.debug('init data error'+err);
    })
}

