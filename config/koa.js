/**
 * Created by dipper on 2017/3/14.
 */
'use strict'

const path = require('path')
const session = require('koa-generic-session')
const RedisStore = require('koa-redis');
var MongoStore = require('koa-generic-session-mongo');
const responseTime = require('koa-response-time');
const logger = require('koa-logger');
const json = require('koa-json');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const passport = require('koa-passport');
const config = require('./env');

module.exports = function (app) {
    if(app.env === 'development'){
        app.use(responseTime());
        app.use(logger())
    }

    app.use(cors({
        origin:true,
        credentails:true
    }));

    app.use(bodyParser());
    app.use(json());
    app.keys = [config.session.secrets];
    app.use(session({
        store:new MongoStore({
            url:config.mongo.url

        }),
         cookie:config.session.cookie
    }));
    app.use(passport.initialize());
    app.use(compress());
}
