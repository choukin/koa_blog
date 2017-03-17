/**
 * Created by dipper on 2017/3/17.
 */
'use strict'
const router = require('koa-router')();
const auth = require('../../auth/auth.service')
const controller = require('./comment.controller')

router.delete('/:id',auth.hasRole('admin'),controller.delComment)
router.put('/:id/delReply',auth.hasRole('admin'),controller.delReply)

router.post('/addNewComment',auth.isAuthenticated(),controller.addNewComment)
router.get('/:id/getFrontCommentList',controller.getFrontCommentList);
router.post('/:id/addNewReply',auth.isAuthenticated(),controller.addNewReply)

module.exports = router;