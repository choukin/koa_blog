/**
 * Created by dipper on 2017/3/15.
 */
'use strict'
const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy;
const co = require('co');
const logger = require('../../util/logs').logger

exports.setup = function (User,config) {
    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordfield:'password'
    },function (email,password,done) {
        co(function *() {
            const user = yield User.findOne({email:email.toLowerCase()});
            if(!user){
                logger.error('登陆用户名错误',{'username':email})
                return done(null,false,{error_msg:'用户吗或密码错误'})
            }
            if(!user.authenticate(password)){
                logger.error('登陆密码错误',{'username':email})
                return done(null,false,{error_msg:'用户吗或密码错误'})
            }
            if(user.status === 2){
                logger.error('登陆被阻止',{'username':email})
                return done(null,false,{error_msg:'用户登陆被阻止'})
            }
            if(user.status== 0){
                logger.error('未验证用户登陆',{'username':email})
                return done(null,false,{error_msg:'用户未验证'})
            }

            return done(null,user);

        }).catch(function (err) {
            logger.debug('LoalStrategy err');
            return done(err);
        })
    }))
}