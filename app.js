'use strict';
//设置默认环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Koa  = require('koa');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const config = require('./config/env');
const loggerMiddle = require('./util/logs');
const errorHandleMiddle = require('./util/error');

const app = new Koa();
//链接数据库
mongoose.connect(config.mongo.url,config.mongo.options);
const modelsPath = path.join(__dirname,'model');
fs.readdirSync(modelsPath).forEach(function (file) {
    if(/(.*)\.(js$)/.test(file)){
        require(modelsPath +'/'+file);
    }
})

//mongoose promise 风格
mongoose.Promise = require('bluebird');

//初始化数据
if(config.seedDB){
    const initData = require('./config/seed');
    initData();
}


//log 记录
app.use(loggerMiddle());
//处理错误的中间件
app.use(errorHandleMiddle());

require('./config/koa')(app);

require('./routes')(app);

app.on('error',(err,ctx)=>{
    if(process.env.NODE_ENV != 'test'){
    console.log('error',err);
}
});





app.listen(config.port,()=> console.log(`server started on ${config.port}`));

module.exports  = app;