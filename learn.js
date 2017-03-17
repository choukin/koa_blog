/**
 * Created by dipper on 2017/3/14.
 */
const Koa = require('koa');


const  app = new Koa();

// app.use(function *(){
//     this.body = 'Hello world';
// })

app.use(ctx => {
    ctx.body = 'hello world';
})

app.listen(3000);