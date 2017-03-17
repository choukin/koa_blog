/**
 * Created by dipper on 2017/3/15.
 */
'use strict'
//开发环境配置

module.exports = {
    //开发环境mongod配置
    mongo:{
        url:'mongodb://localhost/choukinlog'
    },
    redis:{
        db:0
    },
    seedDB:true,
    session:{
        cookie:{
    path: '/',
        httpOnly: false,
        maxAge: 21000, //one day in ms,
    rewrite: true,
        signed: true
    }}
}