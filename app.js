const serve = require('koa-static'),
    Koa = require('koa'),
    favicon = require('koa-favicon'),
    compress = require('koa-compress'),
    conditional = require('koa-conditional-get'),
    etag = require('koa-etag');

const app = new Koa();
