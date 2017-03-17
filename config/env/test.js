'use strict'
//测试环境配置

module.exports = {
    //开发环境mongod配置
    mongo:{
        url:'mongodb://localhost/jackblog-test'
    },
    redis:{
        db:2
    },
    seedDB:true,
    port:process.env.PROT||8000,
    session:{
        cookie:{maxAge:6000*5}
    }
}