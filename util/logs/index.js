/**
 * Created by dipper on 2017/3/15.
 */
'use strict'
const path = require('path');
const bunyan = require('bunyan');
const config = require('../../config/env');

const logger = bunyan.createLogger({
    name:'choukinlog',
    serializers:{
        req:bunyan.stdSerializers.req,
        res:bunyan.stdSerializers.res,
        err:bunyan.stdSerializers.err
    },
    streams:[
        {
            level:'info',
            stream:process.stdout
        },{
            level:'trace',
            stream:process.stdout
        },{
            level:'debug',
            stream:process.stderr
        },{
            type:'rotating-file',
            level:'error',
            path:path.join(__dirname,'logs/'+config.env+'-'+'error.log'),
            period:'1d',
            count:7
        }
    ]
});

function createLoggerMiddle() {
    return function *(next) {
        this.logger = logger;
        yield next;
    }
}

module.exports = createLoggerMiddle;
module.exports.logger = logger;