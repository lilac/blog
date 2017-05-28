---
title: 備份或遷移git倉庫
date: "2017-05-28T20:16:37.121Z"
layout: post
category: "技術 網絡 git"
description: 總結備份和遷移git代碼倉庫的方法。
---

前天Github提示我之前的優惠券過期，導致我的私有倉庫被鎖定。Github給我的選擇是續費，或者降級帳號並推動私有倉庫的訪問權。考慮到我的私有倉庫主要保存在Gitlab，我選擇降級遷移。

在網站上聯繫Github，要求備份我被鎖定的私有倉庫。大半天過後，收到其客服的郵件，說我的帳戶已暫時解鎖，我能在48小時內訪問我的私有倉庫。因此我要在這兩天內將我托管在Github上的私有倉庫備份並遷移到Gitlab。

研究一陣後得知備份方法。
1. 創建一個原代碼倉庫的鏡像
```
git clone --mirror https://github.com/exampleuser/old-repository.git
```
如果只是備份到本地，則完成。否則繼續第二步。
2. 在遷移的終托管站創建一個新倉庫，並獲得新倉庫的地址。
3. 在複製的本地鏡像中推送倉庫至要遷移的遠端
```
cd old-repository.git
git push --mirror https://gitlab.com/exampleuser/new-repository.git
```

總之過程不複雜。完成後，新的倉庫包括了源倉庫的所有對象，如分支和標簽。

### 參考文獻
[Github Help](https://help.github.com/articles/duplicating-a-repository/)
