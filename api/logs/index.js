/**
 * Created by dipper on 2017/3/16.
 */
'use strict'
const router = require('koa-router')();
const controller = require('./logs.controller');
const auth = require('../../auth/auth.service')

router.get('/getLogsList',auth.hasRole('admin'),controller.getLogsList);

module.exports = router;