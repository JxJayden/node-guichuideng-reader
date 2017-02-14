const fs = require('fs'),
    mkdirp = require('mkdirp');

exports.mkdir = function(downloadPath, folder) {
    mkdirp(`${downloadPath}/${folder}`, (err) => {
        if (err) throw TypeError(`mkdir dist/${folder} error: ${err}`);
        else  console.log(`mkdir dist/${folder} done!`);
    })
};

exports.writerPost = function(chaptersNum, postNum, content) {
    fs.writeFileSync(`dist/${chaptersNum}/${postNum}.html`, content)
};

exports.writeConfigJson = function(book) {
    let content = JSON.stringify(book, null, 4);

    fs.writeFile(`dist/book.json`, content, (err) => {
        if (err) throw TypeError(`write book.json error: ${err}`);
        else console.log(`write book.json done!`);
    })
};
