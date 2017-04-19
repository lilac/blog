---
title: 使用Gatsby創建博客網站
date: "2017-04-18T23:46:37.121Z"
layout: post
path: "/first-post/"
category: "Life"
description: "從零開始使用Gatsby搭建一個博客系統，並部署到Github Pages。"
---

多年以前曾經在Google App Engine搭建一個[博客](http://lilacblog.appspot.com)。但由於後來谷歌升級GAE环境，而我沒有及時更新代碼導致項目被刪除。而且我幾年來寫的文章都隨著項目被刪丟失了，讓我心痛不已。後來我創建了[熱聞榜](http://rewen.co)，在那兒寫文章。可惜它的活躍度低，我近期將其關停。

今天想搭建一個博客系統以記錄平時的心得體會。支持靜態html部署的博客系統是目前的流行做法。於是我搜索了下，找到了[比較網站](https://www.staticgen.com/)。它列出了幾乎所有的可用選項。Jekyll无疑最流行，我的[同樂](http://www.samemoment.com)也使用它来搭建产品頁。JS的拥趸可以選择Hexo，它有良好的生态。排前面几個工具都是使用传统的服务器端模板語言来构造网頁。这些模板語言我也不陌生，因为之前使用过Django和Flask写后端程序。

然而我認為支持前後端同構的網頁框架是趨勢，因此想嘗試這種技術來搭建博客系統。而支持同構並且排名第一的是[gatsby](https://github.com/gatsbyjs/gatsby)。它的渲染庫是React.js，剛好也是最火的前端庫。最終我選擇了它，並部署在Github Pages上。

1. 先安裝gatsby工具
```
yarn global add gatsby
# 如果使用npm，用以下命令
npm install -g gatsby
```

2. 基於一個博客模板創建新項目。這裡我使用了一個個人覺得設計還可以的模板。
```
gatsby new lumen-blog https://github.com/wpioneer/gatsby-starter-lumen
```

3. 進入新項目，本地運行預覽博客效果。
```
cd lumen-blog
yarn install
yarn develop
```

4. 打開config.toml文件配置博客元信息，如博客標題，描述和作者等。
5. 初始化git，和配置git遠程節點。
```
git init
# 更改下面的地址
git remote add origin git:user@github.com/blog
```

6. 部署至Github Pages。
```
yarn deploy
```

至此，大功告成。進入Github的倉庫設置頁，查看Github Pages的地址（url）即可查閱部署好的博客。

### 附額外福利和提示
如果部署到Github個人頁面，即倉庫名和地址均為`username.github.io`之類，那麼需要額外兩步.
1. 配置文件config.toml需要配置
```
linkPrefix = ""
```
2. 需要將靜態文件部署到master分支。可修改package.json文件中的script命令為
```
"deploy": "gatsby build --prefix-links && gh-pages -d public -b master"
```
，亦即給`gh-pages`添加了一個參數指定遠程推送分支。

反之如果部署到一個普通的倉庫（項目），只需要將`linkPrefix`設置為倉庫名，如`linkPrefix = "/blog"`。
