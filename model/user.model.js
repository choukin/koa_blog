/**
 * Created by dipper on 2017/3/15.
 */
//用户表
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const crypto = require('crypto');

let UserSchema = new Schema({
    nickname:String,
    email:{
        type:String,
        lowercase:true
    },
    provider:{
        type:String,
        default:'local'
    },
    facebook:{
        id:String,
        token:String,
        email:String,
        name:String
    },
    github:{
        id:String,
        token:String,
        email:String,
        name:String
    },    
    qq:{
        id:String,
        token:String,
        email:String,
        name:String
    },
    likeList:[{
        type:Schema.Types.ObjectId,
        ref:'Article'
    }],
    hashedPassword:String,
    salt:String,
    role:{
        type:String,
        default:'user'
    },
    avatar:String,
    status:{
        type:Number,
        default:0
    },
    created:{
        type:Date,
        default:Date.now
    },
    updated:{
        type:Date,
        default:Date.now
    }
    
})

UserSchema.
    virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema
    .virtual('userInfo')
    .get(function () {
        return {
            'nickname':this.nickname,
            'role':this.role,
            'email':this.email,
            'avatar':this.avatar,
            'like':this.likeList,
            'provider':this.provider
        }
    });

UserSchema
    .virtual('providerInfo')
    .get(function () {
        return {
            'qq':this.qq,
            'github':this.github
        };
    });

UserSchema 
    .virtual('token')
    .get(function () {
        return {
            '_id':this._id,
            'role':this.role
        }
    });

UserSchema
    .path('nickname')
    .validate(function (value,respond) {
        let _this = this;
        _this.constructor.findOne({
            nickname:value
        },function (err,user) {
            if (err) throw err;
            if (user) {
                if (_this.id == user.id) {
                    return respond(true);
                }
                return respond(false);
            }
            respond(true)
        })
    },'这个昵称已经被使用');

/**
 * methods
 * @type {{}}
 */
UserSchema.methods = {
    //检查用户权限
    hasRole:function (role) {
        var selfRoles = this.role;
        return (selfRoles.indexOf('admin') !==-1 || selfRoles.indexOf(role) !==-1 )
    },
    //验证用户密码
    authenticate:function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    //生成盐
    makeSalt:function () {
        return crypto.randomBytes(16).toString('base64');
    },
    //生成密码
    encryptPassword: function (password) {
        if(!password || !this.salt)return '';

        let salt = new Buffer(this.salt,'base64');

        return crypto.pbkdf2Sync(password,salt,1000,64,'sha1').toString('base64');
    }
}

UserSchema.set('toObject',{virtuals:true});

module.exports = mongoose.model('User',UserSchema);

