const Crawler = require('crawler'),
    cheerio = require('cheerio');

let books = {},
    crawler = new Crawler();

// 分析章节
let handleChapters = function(error, res, done) {
    if (error) {
        console.error(error);
    } else {
        let $ = res.$;
        let titles = $('article h2');
        books.title = $('.page-title span').text();
        books.author = $('article h3').text().replace('鬼吹灯作者：', '');

        books.list = [];

        titles.each((index, value) => {
            let tmpObj = {
                chapters_name: $(value).text(),
                chapters_num: index + 1,
                chapters: []
            }
            $(value).next().find('a').each((i, v) => {
                let url = $(v).attr('href');
                let title = $(v).text();
                tmpObj.chapters.push({
                    url: url,
                    title: title,
                    num: `${index+1}${i+1}`
                })
            })
            books.list.push(tmpObj);
        });
        console.log(books);
    }
}

let handleOnePage = function(error, res, done) {
    if (error) {
        console.error(error);
    } else {
        let $ = res.$;

        $('article center').remove();
        $('article script').remove();
        $('.entry-content div').remove();
        console.log($('.entry-content').html());
    }
}

let oneCrawler = function(chapter) {
    console.log(chapter);

    crawler.queue({
        uri: chapter.url,
        maxConnections: 100,
        callback: handleOnePage
    })
}

let ChaptersCrawler = function(url = 'http://www.guichuideng.org/') {
    crawler.queue({
        uri: url,
        maxConnections: 100,
        callback: handleChapters
    })
}
ChaptersCrawler();
// var chapter1 = {
//     url: 'http://www.guichuideng.org/hou-ji-nuo-shen.html',
//     title: '后记—傩神',
//     num: '111'
// };
// crawler.queue({
//     uri: 'http://www.guichuideng.org/',
//     maxConnections: 100,
//     callback: handleChapters
// })

// oneCrawler(chapter1);
