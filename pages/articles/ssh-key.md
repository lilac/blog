---
title: 恢復MacOS Sierra的ssh密鑰自動加載行為
date: "2017-05-02T21:46:37.121Z"
layout: post
category: "技術 網絡 ssh Mac OS X"
description: 蘋果公司在Mac Sierra版本中更改了ssh的行為，它不再自動加載存儲在鑰匙串（Keychain）中的密鑰。這使得ssh連接時將要手工輸入私鑰密碼。本文教你如何恢復之前的便利設計。
---

作為Git使用者，經常需要與遠程服務器打交道。我一般使用git＋ssh協議傳輸更新。這種方式相比於https的好處是不用輸入密碼。因為在服務端上傳了我的公鑰，而本地端ssh也配置了對應的私鑰。我之前執行過一個命令`ssh-add -K <private key file>`，`-K`這個參數告訴它可以在Keychains中保存密鑰的密碼，這樣每次使用密鑰時都不用手工再輸入密碼了。如此配置好後，每次在git倉庫推送更新給遠端只需要執行`git push origin`，相當方便。

可是一次更新Mac系統後，這個方法不再有效了。執行前面的命令會返回一個錯誤，說明無訪問權限。這暗示ssh沒有配置相應的私鑰。網絡上搜索解決方案後，才得知原來蘋果公司在Mac Sierra版本中更改了ssh的行為，它不再自動加載存儲在鑰匙串（Keychain）中（通過`ssh-add -K`添加)的密鑰。官方對此有一個[回應](https://openradar.appspot.com/27348363)，說明不是一個漏洞，而是官方刻意為之。

那麼，如何才能像之前那樣便利呢？[這裡](https://github.com/jirsbek/SSH-keys-in-macOS-Sierra-keychain)列出了解決方案。我參考後選用了最好的一種。創建一個ssh配置文件~/.ssh/config包含以下內容

```
Host *
  UseKeychain yes
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_rsa
```

可選地替換~/.ssh/id_rsa為您的密鑰的路徑。要添加其他密鑰，請為每個密鑰添加一行：`IdentityFile /path/to/your_key`。

參考文獻：

[Revert ssh-agent behavior pre macOS Sierra](http://joshbuchea.com/revert-ssh-agent-behavior-pre-macos-sierra/)
