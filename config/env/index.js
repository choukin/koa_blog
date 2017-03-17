/**
 * Created by dipper on 2017/3/15.
 */
'use strict'
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

const all = {
    env:process.env.NODE_ENV,
    root:path.normalize(__dirname + '/../../..'),
    port:process.env.PORT || 9000,

    mongo:{
        options:{
            user:process.env.MONGO_USERNAME || '',
            pass:process.env.MONGO_PASSWORD || ''
        }
    },
    redis:{
        host:process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1',
        port:process.env.REDIS_PORT_6379_TCP_PORT || 6379,
        password:process.env.REDIS_PASSWORD
    },
    seedDB:process.env.INITDATA || false,
    session:{
        secrets:'choukin_blog'
    },
    userRoles:['user','admin'],
    qiniu:{
        app_key:process.env.QINIU_APP_KEY || '',
        app_secret:process.env.QINIU_APP_SECRET || '',
        domain:process.env.QINIU_APP_DOMAIN || '',
        bucket:process.env.QINIU_APP_BUCKET || ''
    },
    defaultIndexImage:'ttps://upload.jackhu.top/blog/index/default.jpg-600x1500q80',
    github:{
        clientId:process.env.GITHUB_CLIENT_ID || 'clientId',
        clientSecret:process.env.GITHUB_CLIENT_SECRET || 'secret',
        callbackUrl:process.env.GITHUB_CALLBACK_URL ||'',
    },
    snsLogins:['github']

};
var config = _.merge(all,require('./'+ process.env.NODE_ENV +'.js') || {});
module.exports = config;