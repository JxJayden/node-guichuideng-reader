const ProgressBar = require('progress'),
    Crawler = require('crawler'),
    cheerio = require('cheerio'),
    utils = require('./utils'),
    fs = require('fs');


let books = {},
    defaultUrl = 'http://www.guichuideng.org/',
    defaultPath = __dirname + '/dist/book/',
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
}

exports.getAllPost = function() {
    let data = fs.readFileSync(`${defaultPath}/book.json`).toString('utf-8');

    data = JSON.parse(data);
    let chapters = data.chapters,
        i = 0,
        urlArr = [],
        numObj = {},
        k = 0,
        c, j, bar;

    function step() {

        if (i >= chapters.length) {
            console.log('all done');
        } else {
            console.log(`开始爬第 ${i} 章`);
            urlArr = [];
            j = 0;

            chapters[i].post.forEach((value, index) => {
                if (fs.existsSync(`${defaultPath}${i}/${index}.html`)) {
                    console.log(`${defaultPath}${i}/${index}.html is exist`);

                    if (index === chapters[i].post.length - 1) {
                        i++;
                        step();
                    }

                } else {
                    urlArr.push(value.url);
                    numObj[value.url] = `${i}/${index}`;
                }
            })

            bar = new ProgressBar('  downloading :title [:bar] :percent :elapseds', {
                complete: '=',
                incomplete: ' ',
                width: 40,
                total: (urlArr.length)
            })

            c = new Crawler({
                maxConnections: urlArr.length,
                callback: function(error, res, done) {
                    if (error) {
                        console.error(error);
                    } else {
                        bar.tick({ title: j + '/' + (urlArr.length - 1) })

                        let $ = res.$;
                        let key = res.request.uri.href;
                        let filePath = `${defaultPath}${numObj[key]}.html`;

                        $('article center').remove();
                        $('article script').remove();
                        $('.entry-content div').remove();

                        fs.writeFileSync(filePath, $('.entry-content').html());

                        if (j === urlArr.length - 1) {
                            console.log(`第 ${i} 章已爬完`);
                            i++;
                            step();
                        } else {
                            j++;
                        }
                    }
                }
            })
            c.queue(urlArr);
        }
    }
    step();
};
