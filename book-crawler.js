const ProgressBar = require('progress'),
    Crawler = require('crawler'),
    cheerio = require('cheerio'),
    utils = require('./utils'),
    fs = require('fs');


let books = {},
    defaultUrl = 'http://www.guichuideng.org/',
    defaultPath = 'dist/book/',
    bar;

let crawler = new Crawler();

exports.getBookInfo = function() {
    console.log('start get book info');
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
                        chaptersName: $(value).text(),
                        chaptersNum: index,
                        post: []
                    }
                    $(value).next().find('a').each((i, v) => {
                        let url = $(v).attr('href');
                        let title = $(v).text();
                        tmpObj.post.push({
                            url: url,
                            title: title,
                            postNum: i
                        })
                        totalLength += tmpObj.post.length;
                    })
                    books.chapters.push(tmpObj);
                    books.totalLength = totalLength;
                    books.currentLength = 0;
                    utils.mkdir(defaultPath, index);
                });
                utils.writeConfigJson(books, defaultPath);
            }
        }
    })
};

exports.getOnePost = function(chapterInex, postIndex, postInfo) {
    console.log(postInfo);

    if (fs.existsSync(`${defaultPath}/${chapterInex}/${postIndex}.html`)) {
        console.log(`${postIndex}.html is exit`);

    } else {
        crawler.queue({
            uri: postInfo.url,
            maxConnections: 100,
            callback: function(error, res, done) {
                if (error) {
                    console.error(error);
                } else {
                    let $ = res.$;

                    $('article center').remove();
                    $('article script').remove();
                    $('.entry-content div').remove();

                    utils.writerPost(chapterInex, postIndex, $('.entry-content').html(), defaultPath);
                }
            }
        })
    }
};
