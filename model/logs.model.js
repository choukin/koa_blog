/**
 * Created by dipper on 2017/3/15.
 */
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LogsSchema = new Schema({
     uid:{
         type:Schema.Types.ObjectId,
         ref:'Uer'
     },
    content:{
        type:String,
        trim:true
    },
    type:String,
    created:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Logs',LogsSchema);
