/**
 * 级联代码
 * Created by dipper on 2017/3/14.
 */

const koa = require('koa');

const app = new koa();
// x-response-time
app.use((ctx, next) => {
    //1. 进入路由
    var start = new Date;
    //捕获到 logger 中间件 控制权传递到 logger
    return  next().then(()=>{
    // 5 再次进入 x-response-time 中间件，记录两次通过此中间件的 穿越时间
    var ms = new Date -start;
    ctx.set('X-Response-Time',ms + 'ms');
    // 返回 this.body
});
})

//logger
app.use((ctx,next) => {
    //2 进入logger 中间件
    var start = new Date;
    // 捕获到 response 中间件 控制权传递到 response downstream
   return next().then(()=>{


    //4. 再次进入 logg2次通过此中间件的时间er 中间件，记录
    var ms = new Date - start;
    console.log('%s %s - %s',this.method,this.url,ms);
})
})

//response
app.use(function(ctx) {
    // 3 进入reponse 中间件 没有捕获到下一个符合条件的中间件 控制权传递到 upstream
    ctx.body = 'hello world';
});

app.listen(3000);
