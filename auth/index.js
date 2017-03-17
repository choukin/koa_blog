/**
 * Created by dipper on 2017/3/15.
 */
'use strict'
const router = require('koa-router')();
const passport = require('koa-passport');
const config = require('../config/env');
const mongoose = require('mongoose')
const User = mongoose.model('User')
const auth = require('./auth.service')

require('./local/passport').setup(User,config)
require('./github/passport').setup(User,config);

router.use('/local',require('./local').routes())
router.use('/github',require('./github').routes())

module.exports = router;