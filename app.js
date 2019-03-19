const Koa = require('koa');
const json = require('koa-json');
const KoaRouter = require('koa-router');
const RateLimit = require('koa2-ratelimit').RateLimit;

const app = new Koa();
const router = new KoaRouter();
const koaBody = require('koa-body');


app
    .use(json())
    .use(router.routes()).use(router.allowedMethods())
    .use(koaBody());


let tokens = [];


const limiter = RateLimit.middleware({
    interval: {sec: 20},
    max: 50,
    message: 'Too many accounts created from this IP, please try again after an hour'
});


router.get('/test', limiter, ctx => {
    ctx.body = {
        msg: 'Hello World'
    };
});

router.get('/', limiter, ctx => {
    ctx.body = {
        tokens: tokens
    };
});

router.post('/add', limiter, koaBody(), ctx => {
    console.log(ctx.request.body);
    let token = ctx.request.body.token.e.token;

    if (tokens.indexOf(token) === -1) {
        tokens.push(token);
    }

    ctx.body = {
        status: 'ok',
        token: token
    }
});


app.listen(process.env.PORT || 3001, () => {
    console.log('server started');
});
