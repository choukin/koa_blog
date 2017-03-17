/**
 * Created by dipper on 2017/3/15.
 */
'use strict'
const mongoose = require('mongoose')
const router = require('koa-router')()
const passport = require('koa-passport')
const User = mongoose.model('User');
const auth = require('../auth.service')

function checkCaptcha() {
    console.log('---000')
    return function *(next) {
        let error_msg;
        console.log(this.request.body.captcha +"session "+this.session.captcha)
        console.log(this.session)
        if(process.env.NODE_ENV !== 'test' && !this.req.headers.choukinblog){
            if(!this.request.body.captcha){
                error_msg = '验证码不能为空'
            }else if(this.session.captcha !== this.request.body.captcha.toUpperCase()){
                error_msg = '验证码错误'
            }else if (this.request.body.email === '' || this.request.body.password ===''){
                error_msg = '用户名和密码不能为空'
            }
        }

        if(error_msg){
            this.status = 422;
            return this.body  = {error_msg:error_msg}
        }
        console.log('1234');
        yield next;
    }
}

router.post('/',checkCaptcha(),function *(next) {
    console.log("------")
    const ctx = this
    yield passport.authenticate('local',function *(err,user,info) {
        if(err){
            ctx.throw(err);
        }
        if(info){
            ctx.status = 403
            return ctx.body = info;
        }
        const token = auth.signToken(user._id);
        ctx.body = {token:token};
    }).call(this,next);
})

module.exports = router;