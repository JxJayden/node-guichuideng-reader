const fs = require('fs'),
    router = require('koa-router')(),
    crawler = require('../book-crawler'),
    defaultPath = 'dist/book/';

router.get('/book.html', function*(next) {
    try {
        let data = fs.readFileSync(__dirname + `/../${defaultPath}/book.json`);
        this.body = this.render('book', JSON.parse(data.toString('utf-8')));
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
    let chapterIndex = this.query.chapter;
    let postIndex = this.query.post;
    let data = fs.readFileSync(__dirname + `/../${defaultPath}/book.json`).toString('utf-8');

    data = JSON.parse(data);

    let postInfo = data.chapters[chapterIndex].post[postIndex];
    if (data.chapters[chapterIndex] && data.chapters[chapterIndex].post[postIndex]) {
        crawler.getOnePost(chapterIndex, postIndex, postInfo);
        this.body = this.render('post', {
            title: data.title,
            author: data.author,
            chapter: {
                name: data.chapters[chapterIndex].chaptersName,
                length: data.chapters.length,
            },
            post: {
                title: postInfo.title,
                preChapterLength: data.chapters[chapterIndex > 0 ? chapterIndex - 1 : chapterIndex].post.length,
                length: data.chapters[chapterIndex].post.length,
            }
        })
    } else {
        this.body = this.render('post', {
            title: data.title,
            err: true,
            message: '该章节不存在！'
        })
    }
})

module.exports = router;
