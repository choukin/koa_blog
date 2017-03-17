/**
 * Created by dipper on 2017/3/16.
 */
'use strict'
const router = require('koa-router')()
const controller = require('./mobile.controller')

router.get('/getApps',controller.getApps)

module.exports = router
