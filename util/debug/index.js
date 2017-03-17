/**
 * Created by dipper on 2017/3/15.
 */
'use strict'
const pkg = require('../../package.json')
module.exports = function (debugLevel) {
    return require('debug')(pkg.name +':'+debugLevel)
}