/**
 * Created by dipper on 2017/3/15.
 */
'use strict'
const passport = require('koa-passport');
const GithubStrategy = require('passport-github').Strategy
const tools = require('../../util/tools')
const co = require('co')
const debug = require('../../util/debug')('auth:github')

exports.setup = function (User,config) {
    passport.use(new GithubStrategy({
        clientID:config.github.clientId,
        clientSecret:config.github.clientSecret,
        callbackURL:config.github.callbackUrl,
        passReqToCallback:true
    },
    function (req,accessToken,refreshToken,profile,done) {
        debug('GithubStrategy start');
        var userId = req.session.passport.userId || null;
        profile._json.token = accessToken;
        //如果用户不存在就新建用户，否则更新用户
        if(userId) return done(new Error('您已经是登陆状态了'))
        co(function *() {
            const checkUserId = yield User.findOne({'github.id':profile.id});
            if(checkUserId) return done(null,checkUserId)
            let newUser = {
                nickname:profile.displayName || profile.username,
                avatar:profile._json.avatar_url || '',
                provider:'github',
                github:profile._json,
                status:1
            }
            const checkUsername = yield User.findOne({nickname:newUser.nickname});
            if(checkUsername){
                newUser.nickname = tools.randomString();
            }
            const user = yield new User(newUser).save();
            return done(null,user);

        }).catch(function (err) {
            debug('GithubStrategy err')
            return done(err);
        })


    }
    ))
}