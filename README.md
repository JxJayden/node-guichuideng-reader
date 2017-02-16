# 一个 node.js 写的爬虫阅读器 for 鬼吹灯

## 前言
有次无意中看到狼叔（i5ting）的 [大主宰小说阅读器](https://github.com/i5ting/simplereader) ，正好那个时候在重新看自己高中时代最喜欢的小说——《鬼吹灯》，本着学习的目的，就有了这个东西。

## 简介
小说是用 [node-crawler](https://github.com/bda-research/node-crawler) 和 [cheerio](https://github.com/cheeriojs/cheerio) 从 http://www.guichuideng.org/ 上面爬下来的。

阅读的网站是用 koa 写的。
此项目只为本人学习 node 爬虫以及 koa 所用，网站不一定什么时候会停。该项目正好为毕设做了一些准备。接下来就应该准备做好自己的毕业设计了。

## demo
点此查看[鬼吹灯小说阅读](http://reader.jxdjayden.cn/book.html)
## 开发 

fork 该项目 或者使用 `git clone`。
 
```bash
git clone git@github.com:JxJayden/node-guichuideng-reader.git

cd node-guichuideng-reader

# 我使用了 yarn 来做包管理，如果你不想用 yarn 可以跳过下一步直接 npm install

npm install -g yarn

yarn install # 或者 npm install

# 使用爬虫
npm run getbook
npm run getall
```

## 部署
在这一步之前你需要先了解一下如何使用 pm2 来 deploy 
可参考我的博文：[使用 pm2 部署 node 服务](http://blog.jxdjayden.cn/2017/02/03/JavaScript/%E4%BD%BF%E7%94%A8github%E5%92%8Cpm2%E9%83%A8%E7%BD%B2node%E6%9C%8D%E5%8A%A1/)
注意要修改一下 ecosystem.config.js 的配置，这部份不再多说。

```bash
pm2 deploy ecosystem.config.js production setup
```

或者你可以直接在服务器上用 `git clone` 命令来克隆项目。

## 项目结构

```
.
├── routes
│   └── index.js    路由 js
├── views           前端模板
│   └── book.html
│   └── post.html
├── dist
│   └── book
│   └── public
│   	└── javascript
│   	└── css
│   	└── img
│
├── app.js 主入口
├── utils.js
├── book-crawler.js 爬虫代码
├── get-all-post.js 获取所有章节的 js
├── get-bookinfo.js 获取书籍信息的 js
├── ecosystem.config.js pm2 deploy 配置
├── processes.json
├── package.json
└── README.md
```

## 备注
未做移动端优化。