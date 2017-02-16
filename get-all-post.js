// require('./book-crawler').getAllPost();


function getAllPost() {
    let data = fs.readFileSync(`${defaultPath}/book.json`).toString('utf-8');

    data = JSON.parse(data);
    let chapters = data.chapters;
    let i = 0,
        j = 0;

    function step() {
        if (i >= 2) {
            console.log('all done');
            return;
        } else {
            if (j >= chapters[chapter].post.length - 1) {
                console.log(`chapter ${i} is all done!`);
                i++;
                j = 0;
                step();
            } else {
                let postInfo = chapters[i].post[j];
                if (fs.existsSync(`${defaultPath}/${i}/${j}.html`)) {
                    console.log(`${j}.html is exit`);
                    j++;
                    step();
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
                                fs.writeFileSync(`${defaultPath}${i}/${j}.html`);
                                j++;
                                step();
                            }
                        }
                    })
                }
            }
        }
        step();
    }
};

getAllPost();
