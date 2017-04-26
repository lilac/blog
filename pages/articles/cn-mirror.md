---
title: 網站打開很慢？你需要加速！牆外網站如何加速
date: "2017-04-26T13:46:37.121Z"
layout: post
category: "生活 網絡"
description: 如何讓你網站的中國訪客也能迅馳順暢地瀏覽網頁呢？最佳的方案是使用內容分發網絡（CDN），即在多個地理區域部署鏡像，並將用戶導流至最近的鏡像。CDN服務一般是付費使用的。知名的CDN服務商有：cloudfare，七牛等。本文教你如何使用免費服務搭建中國鏡像，實現內容分發。
---

在那遙遠的大天朝，有個特別的互聯網。因為大防火牆的存在，境內訪問境外網站會比正常慢許多。如何讓你網站的中國訪客也能迅馳順暢地瀏覽網頁呢？最佳的方案是使用內容分發網絡（CDN），即在多個地理區域部署鏡像，並將用戶導流至最近的鏡像。CDN服務一般是付費使用的。知名的CDN服務商有：cloudfare，七牛等。本文教你如何使用免費服務搭建中國鏡像，實現內容分發。

隨著靜態網站生成器（static site generator）的流行，許多獨立博主選擇將博客部署在文件托管服務商中，如Amazon S3, Dropbox, Github Pages等。這樣的好處是便宜，維護簡單。本博客也是部署在Github Pages（簡寫成GH）上。GH也使用了內容分發網絡，因此在全球訪問的速度都很不錯，除了一些特例。對，天朝是一個特例。由於大天朝對網絡的嚴格監管，所有網站必須備案。而且，備案時必須域名，主機IP，和服務商三位一體綁定。其中任何一個修改，都要重新備案。因此，CDN服務商要想在天朝境內合法運營，需要增加許多運營成本。你想想，內容分發網絡的原理是：

*一個域名對應多個地理區域的鏡像（IP地址），當訪客請求一個資源時，根據請求的IP來判斷其地理位置，返回一個距離其最近的鏡像的IP地址。然後訪客去最近的鏡像那裡獲取文件資源。而且當一個鏡像失效後，能動態重定向訪客到另一個鏡像。*

如果需要符合備案規定，所有的域名必須靜態地指向一批固定的IP地址，而且不能變換。一旦變換後又要重新備案一次。對於CDN這種動態調整的服務，無疑增加了運營成本和時間成本。而對於網站管理者，每更改一次CDN服務商或者服務器托管方也需要重新備案。

有些朋友也許使用過百度雲加速CDN，我也曾經以為它可以輕易解決牆內訪問延遲問題。試用一下後發現，原來如果域名未備案，使用百度雲加速實際上CDN服務商是Cloudfare。也許它們之間有合作協議。Cloudfare在牆內沒有鏡像，當然無法加速。牆內的請求通過Cloudfare在牆外的CDN節點再訪問原始站點，還是沒有繞開牆。有人會說，那你把域名備案再用百度雲加速不就好了？其實又繞回來了。前面說過備案的規則，域名需要與牆內的服務商和IP地址綁定。如果域名能備案，說明服務器已經在牆內，流量不通過牆，那還要繞牆加速個毛線？

回歸正題，部署在GH的靜態網站如何加速呢？最近發現了一個類似Github Pages的服務，來自coding.net。這家網站是一個代碼倉庫服務商，也提供類似於GH的服務。而且使用方法大同小異。首先在[Coding](https://coding.net/)上創建一個項目，然後添加一個git遠端`git remote add mirror <remote url>`。添加後顯示有兩個遠端。

```
$git remote
mirror
origin
```
之後修改博客項目的配置文件package.json，添加部署命令：

```
"deploy": "gatsby build --prefix-links && rm -rf node_modules/gh-pages/.cache && gh-pages -d public -b master",
"deploy-mirror": "rm -rf node_modules/gh-pages/.cache && gh-pages -d public -b master -o mirror"
```
這裡其實是使用了`gh-pages`這個工具來部署。通過`-o`這個參數指定遠端。它默認是origin，指定mirror遠端後它就將文件推到那個倉庫。之後每次更新時運行

```
yarn deploy
yarn deploy-mirror
```
就能部署到兩個服務商了。

有了鏡像之後，如何實現按地理位置分發呢？該域名系統（DNS）登場了。你需要使用一個支持按地理解析IP的域名解析服務商，如Dnspod，Amazon Route 53。登錄你的域名服務商的後台管理系統，管理域名記錄（DNS record）。添加兩條記錄，類似下面

```
blog.samemoment.com.	600	IN	CNAME	pages.coding.me. China
blog.samemoment.com.	600	IN	CNAME	lilac.github.io. Outside China
```

亦即如果請求來自中國IP，則將域名重定向到中國的鏡像，否則轉到Github Pages。

### 附
檢查coding.net的IP地址發現額外信息。
```
$ dig blog.samemoment.com
blog.samemoment.com.	600	IN	CNAME	pages.coding.me.
pages.coding.me.	221	IN	CNAME	pages.coding.net.
pages.coding.net.	8	IN	A	23.91.101.50
pages.coding.net.	8	IN	A	23.91.98.182
pages.coding.net.	8	IN	A	23.91.96.71
pages.coding.net.	8	IN	A	23.248.162.196
pages.coding.net.	8	IN	A	23.91.96.142
pages.coding.net.	8	IN	A	23.91.100.254
pages.coding.net.	8	IN	A	23.91.100.78
pages.coding.net.	8	IN	A	23.248.162.138
pages.coding.net.	8	IN	A	23.248.162.91
pages.coding.net.	8	IN	A	23.248.162.83
pages.coding.net.	8	IN	A	23.91.100.83
pages.coding.net.	8	IN	A	23.91.101.48
pages.coding.net.	8	IN	A	23.91.97.251
pages.coding.net.	8	IN	A	110.79.20.235
pages.coding.net.	8	IN	A	23.248.162.81
```
這些IP有些是在美國加州，有些是在香港，如110.79.20.235。說明了它也是部署在牆外，難怪不需要備案就能發布內容。因此，此加速方案沒有繞開牆。但是，也許這家中國公司特意選擇了一些中國訪問速度還不錯的服務商，自己測試發現比直連github要快。