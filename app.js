const serve = require('koa-static'),
    Koa = require('koa'),
    favicon = require('koa-favicon'),
    compress = require('koa-compress'),
    conditional = require('koa-conditional-get'),
    etag = require('koa-etag'),
    router = require('./routes/index'),
    template = require('art-template');

const app = new Koa();

template.config('base', __dirname + '/views');
template.config('encoding', 'utf-8');
template.config('extname', '.html');

app.context.render = template;

app.use(compress({
    filter: function(content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(conditional());
app.use(etag());

app.use(serve(__dirname + '/dist'));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080);

console.log('listening on port 8080');
