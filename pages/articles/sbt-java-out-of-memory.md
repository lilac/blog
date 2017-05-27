---
title: 如何解決sbt任務執行中出現的OutOfMemoryError（內存不夠）錯誤
date: "2017-05-25T21:00:37.121Z"
layout: post
category: "技術 sbt java"
description: 運行Java程序時出現的內存不夠錯誤（OutOfMemoryError）應該算是Java中最臭名昭著的一個問題了。幾乎每個Java程序員都會遇到這個問題。一臉不爽或者爆一句粗口後，還是要解決問題對不對。程序員撓一撓頭，修改Java啓動參數以增加內存上限，然後祈禱這次運行不會爆內存。我敢說，這絕對是Java程序員最深勿痛絕的一個Java虛擬機設計缺陷。
---

運行Java程序時出現的內存不夠錯誤（OutOfMemoryError）應該算是Java中最臭名昭著的一個問題了。幾乎每個Java程序員都會遇到這個問題。一臉不爽或者爆一句粗口後，還是要解決問題對不對。程序員撓一撓頭，修改Java啓動參數以增加內存上限，然後祈禱這次運行不會爆內存。我敢說，這絕對是Java程序員最深勿痛絕的一個Java虛擬機設計缺陷。

好啦，背景描述完後，作為攻城師，這鍋最後還是得我們背（我們還是要解決實際問題）。通常的解決方案是在增加一個java啓動參數，如`java -Mx2G`表示將java虛擬機的內存上限設為2G。增加內存上限直到不再出上述錯誤為止。

可是，如果是在sbt中執行一個任務時出這個錯誤呢？比如運行`sbt reStart`。由於並不是直接運行java，因此上述解決方案可能無效。下面是我在實際項目中總結出來的解決方案。首先在項目根目錄執行`sbt`進入sbt的shell。然後執行下面的命令。

```
set fork in reStart := true
set javaOptions in reStart += "-XMx4G"
```
第一條命令設置在執行"reStart"任務時fork出一個進程來運行java虛擬機。第二條命令設置執行"reStart"命令時設置java虛擬機的啓動參數，在這裡我們設置內存上限為4G。如果你的sbt任務為其它，如“run”，請相應修改語句中的"reStart"為正確的任務名。當然，為圖省事，你也可以略去"in reStart"部分，如`set fork := true`。如此則參數對所有任務生效。

稍微解釋下為何要執行第一條命令。sbt默認使用當前進程來執行任務。換言之，執行任務的java虛擬機正是啓動sbt所用的java虛擬機。因此，java虛擬機的參數已經固定了，無法修改。而通過設置fork參數為真，在fork出新進程來運行java虛擬機時便能應用新的啓動參數。

如上配置好後，正常執行sbt任務如`~reStart`便不再拋出內存錯誤了。

## 附
另一種解決方案是設置sbt的啓動參數，如創建.sbtopts文件。但這種方案更加複雜，而且沒有上述方案靈活。

## 參考
[StackOverflow](https://stackoverflow.com/a/4054152/783696)
