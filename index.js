const ProgressBar = require('progress'),
    Crawler = require('crawler'),
    cheerio = require('cheerio'),
    utils = require('./utils'),
    fs = require('fs');


let books = {},
    defaultUrl = 'http://www.guichuideng.org/',
    bar;

let crawler = new Crawler();

function getAllChapters() {
    books.chapters.forEach((value, index) => {
        value.post.forEach((v, i) => {
            getOnePost(v, index + 1);
        })
    });
};

function getOnePost(postInfo, chapterNum) {
    console.log(postInfo);

    if (fs.existsSync(`dist/${chapterNum}/${postInfo.postNum}.html`)) {
        console.log(`${postInfo.postNum}.html is exit`);
        if (books.currentLength === books.totalLength) {
            console.log('complete fetch!');
            setTimeout(function() {
                process.exit()
            }, 1000)
        } else {
            books.currentLength++;
        }
    } else {
        crawler.queue({
            uri: postInfo.url,
            maxConnections: 100,
            callback: function(error, res, done) {
                if (error) {
                    console.error(error);
                } else {
                    let $ = res.$;

                    bar.tick({ title: books.currentLength + '/' + books.totalLength})

                    $('article center').remove();
                    $('article script').remove();
                    $('.entry-content div').remove();

                    utils.writerPost(chapterNum, postInfo.postNum, $('.entry-content').html());
                    if (books.currentLength === books.totalLength) {
                        console.log('complete fetch!');
                        setTimeout(function() {
                            process.exit()
                        }, 1000)
                    } else {
                        books.currentLength++;
                    }
                }
            }
        })
    }
};

module.exports = function start(chapterNum, postNum, downloadPath = 'dist') {
    crawler.queue({
        uri: 'http://www.guichuideng.org/',
        maxConnections: 100,
        callback: function(error, res, done) {
            if (error) {
                console.error(error);
            } else {

                let $ = res.$;
                let titles = $('article h2');
                let totalLength = 0;
                books.title = $('.page-title span').text();
                books.author = $('article h3').text().replace('鬼吹灯作者：', '');

                books.chapters = [];

                titles.each((index, value) => {
                    let tmpObj = {
                        chapters_name: $(value).text(),
                        chapters_num: index + 1,
                        post: []
                    }
                    $(value).next().find('a').each((i, v) => {
                        let url = $(v).attr('href');
                        let title = $(v).text();
                        tmpObj.post.push({
                            url: url,
                            title: title,
                            postNum: `${index+1}${i+1}`
                        })
                        totalLength += tmpObj.post.length;
                    })
                    books.chapters.push(tmpObj);
                    books.totalLength = totalLength;
                    books.currentLength = 0;
                    utils.mkdir('dist', index + 1);
                });
                utils.writeConfigJson(books);

                bar = new ProgressBar(' downloading :title [:bar] :percent :elapseds', {
                    width: 40,
                    total: books.totalLength
                });
                console.log(books);
                getAllChapters();
            }
        }
    })
};
