'use strict'
//生产环境配置
var MONGO_ADDR = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost'
module.exports = {

    //开发环境mongod配置
    mongo:{
        url:'mongodb://'+ MONGO_ADDR +'/jackblog-test'
    },
    redis:{
        db:1,
        dropBufferSupport:true

    },
    seedDB:true,
    port:process.env.PROT||8000,
    session:{
        cookie:{domain:'',maxAge:6000*5}
    }
}