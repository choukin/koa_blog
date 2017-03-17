/**
 * Created by dipper on 2017/3/15.
 */
'use strict'

const _ = require('lodash')

//生成随机字符串

exports.randomString = function (len) {
    len = len || 12;
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let $chart = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let maxPos = $chart.length;
    let pwd = '';
    for(let i =0 ;i <len ;i++){
        pwd += $charts.charAt(Math.floor(Math.random()*maxPos));
    }
    return pwd;

}
//从Markdown 中提取图片
exports.extractImage  = function (content) {
    let results = [];
    let images = content.match(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g);
    if(_.isArray(images) && images.length >0 ){
        for(let i =0,j=images.length ;i < j;i++){
            let url = images[i].replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/,function ($1,m1,m2,m3,m4) {
                return m4 || '';
            });
            if(url !== ''){
                results.push({url:url})
            }
        }
    }
    return results;
}