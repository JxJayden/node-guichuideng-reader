var data = JSON.parse(require('fs').readFileSync(`dist/book/book.json`).toString('utf-8'));
var total = 0;
data.chapters.forEach((value,index) => {
    total+= data.chapters[index].post.length
})

console.log(total);
