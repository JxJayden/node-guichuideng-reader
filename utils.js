const fs = require('fs'),
    mkdirp = require('mkdirp');

exports.mkdir = function(downloadPath = 'dist/book/', folder) {
    mkdirp(`${downloadPath}/${folder}`, (err) => {
        if (err) throw TypeError(`mkdir dist/${folder} error: ${err}`);
        else console.log(`mkdir ${downloadPath}/${folder} done!`);
    })
};

exports.writerPost = function(chaptersNum, postNum, content, downloadPath = 'dist/book/') {
    fs.writeFile(`${downloadPath}/${chaptersNum}/${postNum}.html`, content, (err) => {
        if (err) console.error(`write ${downloadPath}/${chaptersNum}/${postNum}.html err : ${err}`);
        else console.log(`write ${downloadPath}/${chaptersNum}/${postNum}.html done!`)
    })
};

exports.writeConfigJson = function(book, downloadPath = 'dist/book/') {
    let content = JSON.stringify(book, null, 4);
    fs.writeFile(`${downloadPath}/book.json`, content, (err) => {
        if (err) throw TypeError(`write book.json error: ${err}`);
        else return content;
    })
};
