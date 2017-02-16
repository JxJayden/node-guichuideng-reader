const fs = require('fs'),
    router = require('koa-router')(),
    defaultPath = __dirname + '/../dist/book/';

let data = fs.readFileSync(`${defaultPath}/book.json`);
data = JSON.parse(data.toString('utf-8'));

router.redirect('/', '/book.html');

router.get('/book.html', function*(next) {
    try {
        this.body = this.render('book', data);
    } catch (err) {
        console.error(err);
        this.body = this.render('book', {
            err: true,
            title: '错误',
            message: err
        })
    }
});

router.get('/post.html', function*(next) {
    let chapterIndex = this.query.chapter,
        postIndex = this.query.post,
        postInfo = data.chapters[chapterIndex].post[postIndex];

    if (data.chapters[chapterIndex] && data.chapters[chapterIndex].post[postIndex]) {
        this.body = this.render('post', {
            title: data.title,
            author: data.author,
            chapter: {
                name: data.chapters[chapterIndex].chaptersName,
                length: data.chapters.length,
            },
            post: {
                title: postInfo.title,
            }
        })
    } else {
        this.body = this.render('post', {
            title: data.title,
            author: data.author,
            err: true,
            message: '该章节不存在！'
        })
    }
})

router.get('/api/getpostinfo', function*(next) {
    let chapter = this.query.chapter >= 0 ? +this.query.chapter : 0;
    if (chapter === 0) {
        this.body = {
            preChapterPostLength: data.chapters[0].post.length,
            currentChapterPostLength: data.chapters[0].post.length
        }
    } else {
        this.body = {
            preChapterPostLength: data.chapters[chapter - 1].post.length,
            currentChapterPostLength: data.chapters[chapter].post.length
        }
    }
})
module.exports = router;
