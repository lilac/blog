---
title: Kubernetes牆內使用技巧
date: "2017-04-26T21:46:37.121Z"
layout: post
category: "技術 網絡 Kubernetes"
description: Kubernetes是Google開發並開源的一個容器集群管理平台。由於谷歌的服務器大多被牆奸，在牆內使用Kubernetes可謂關卡重重。本文總結了一些小技巧，讓你學習Kubernetes的流程更順暢。
---

Kubernetes是Google開發並開源的一個容器集群管理平台。由於谷歌的服務器大多被牆奸，在牆內使用Kubernetes可謂關卡重重。本文總結了一些小技巧，讓你學習Kubernetes的流程更順暢。

## Docker Hub鏡像
使用Docker容器技術，每天打交道最多的無疑是docker hub了。它雖然沒有被牆，但是從牆外下載動輒幾百兆的文件也是非常不可靠的。牆偶爾會對https連接進行干擾，導致文件下載出錯。因此設置一個牆內的鏡像能極大的提升用戶體驗。

網易提供了一個免費的docker hub[鏡像](http://hub-mirror.c.163.com/)服務。阿裡雲也提供鏡像，不過需要用戶註冊帳戶並使用定制化的一個url。如果你使用的Docker 1.13以上版本，它的設置頁面支持配置鏡像。可以直接在那個頁面添加[http://hub-mirror.c.163.com/](http://hub-mirror.c.163.com/)。

## Kubernetes代理
Kubernetes本地集群由minikube來創建。OS X版本的minikube實際上創建一個Linux虛擬機，再在虛擬機上支持容器。雖然我使用了xhyve驅動程序，不需要VirtualBox虛擬機，但其實還是系統層級的一個虛擬機。

由於隔著虛擬機這一層，我在OS X系統上配置的翻牆配置在minikube虛擬機上不起作用，導致一些關鍵的容器鏡像下載失敗。比如，kubernetes-dashboard服務依賴的鏡像`gcr.io/google_containers/kubernetes-dashboard-amd64:v1.6.0`是在`gcr.io`，而這個域名被牆。**容器鏡像無法下載，Kubernetes幾乎如同被廢武功**。

下面是我與牆作戰的艱難歷程。

### 一擊
網絡上其他人提供的解決方案大都是用一台能翻牆的電腦把被牆鏡像上傳到其它沒被牆奸或者牆內的鏡像倉庫*中轉*。然後從中轉網站下載鏡像後，使用`docker tag`將鏡像名重新標記，讓docker以為是從源站下載的鏡像。可是這個過程相當煩瑣而且不通用，每次都要找出被牆的鏡像一一操作，實在太麻煩。

### 二擊
Kubernetes官方文檔中有提及[如何讓minikube使用http代理](https://kubernetes.io/docs/getting-started-guides/minikube/#using-minikube-with-an-http-proxy)。

```
$ minikube start --docker-env HTTP_PROXY=http://$YOURPROXY:PORT \
                 --docker-env HTTPS_PROXY=https://$YOURPROXY:PORT
```

我使用的Shadowsocks也支持http代理，地址是[localhost:1087](http://127.0.0.1:1087)。當我按照上面的規則啓動minikube後，發現還是無法拉取被牆鏡像。

於是我輸入`minikube ssh`進入minikube虛擬機，嘗試拉取一個鏡像看哪裡出錯了。

```
$ docker pull gcr.io/google_containers/pause-amd64:3.0
Error response from daemon: Get https://gcr.io/v1/_ping: http: error connecting to proxy http://localhost:1087: dial tcp 127.0.0.1:1087: getsockopt: connection refused
```
這個錯誤裡提到了Proxy，和之前沒配置代理時不一樣，說明至少代理配置方法是有效的。仔細想想，在虛擬機中連接127.0.0.1不對呀。它連接的是自己嘛。

### 三擊
我給自己主機設置個靜態IP地址192.168.1.8，然後修改上述命令中的IP地址。關閉minikube`minkube stop`後重新啓動。

```
$ minikube start --docker-env HTTP_PROXY=http://$192.168.1.8:1087 \
                 --docker-env HTTPS_PROXY=https://$192.168.1.8:1087
```
發現重啓後拉鏡像還是一樣的錯誤結果

```
$ docker pull gcr.io/google_containers/pause-amd64:3.0
Error response from daemon: Get https://gcr.io/v1/_ping: http: error connecting to proxy http://localhost:1087: dial tcp 127.0.0.1:1087: getsockopt: connection refused
```
它還是認為我配置的代理服務器是127.0.0.1。後來重新啓動minikube多次還是一樣的結果。

### 四擊
我猜想前面的代理配置只在第一次調用`minikube start`創建虛擬機時才有效。那時候配置的代理服務器地址錯誤，之後在命令行修改參數也無效。這有可能是minikube的一個漏洞。於是我嘗試找下有沒有配置文件能夠在虛擬機創建後修改。

終於讓我找到了一個文件`~/.minikube/machines/minikube/config.json`。原來它就是虛擬機的配置文件。在這個Json對象的`HostOptions.EngineOptions.Env`域正存放著之前配置的代理配置。將其修改為

```
"Env": [
        "HTTP_PROXY=http://192.168.1.8:1087",
        "HTTPS_PROXY=http://192.168.1.8:1087",
        "NO_PROXY=192.168.99.0/24"
       ],
```
後保存。然後重啓minikube。再次嘗試

```
docker pull gcr.io/google_containers/pause-amd64:3.0
Error response from daemon: Get https://gcr.io/v1/_ping: http: error connecting to proxy http://192.168.1.8:1087: dial tcp 192.168.1.8:1087: i/o timeout
```
依然失敗，可是至少代理服務器地址是修改過來了。

### 五擊
為何會連接不上呢。我在實體機上試下連接代理服務器
```
curl http://192.168.1.8:1087
curl: (7) Failed to connect to 192.168.1.8 port 1087: Connection refused
```
說明與虛擬機無關，在主機上也被拒絕連接了呀。一般連接服務器被拒絕時，大多因為服務器不接受客戶端IP地址。如果服務器設置`listen(127.0.0.1)`則只有那個IP地址能被接受。於是我想到了也許跟代理服務器有關。

打開Shadowsocks的http代理服務器設置頁面，果然發現它默認的監聽地址（listen address）是127.0.0.1，即只接受本機的代理請求。將其修改為0.0.0.0，即接受來自任何IP地址的請求。保存設置後在主機上運行

```
curl 192.168.1.8:1087
Invalid header received from client.
```
說明curl連接成功了！

再返回minikube虛擬機，嘗試拉取鏡像。**這次成功了！成功了！！！**

```
docker pull gcr.io/google_containers/pause-amd64:3.0
3.0: Pulling from google_containers/pause-amd64
a3ed95caeb02: Already exists 
f11233434377: Already exists 
Digest: sha256:163ac025575b775d1c0f9bf0bdd0f086883171eb475b5068e7defa4ca9e76516
Status: Image is up to date for gcr.io/google_containers/pause-amd64:3.0
```

### 勝利
跳過多個坑，越過多個障礙，終於讓Kubernetes跨過牆，拉回它母體來的鏡像。等待一段時間，當kubernetes-dashboard依賴的所有鏡像都拉取完成後，運行

```
kubectl --namespace kube-system get svc
NAME                   CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns               10.0.0.10    <none>        53/UDP,53/TCP   7h
kubernetes-dashboard   10.0.0.175   <nodes>       80:30000/TCP    8h
```
我欣慰地看到kubernetes-dashboard服務成功運行了。讓我們打開更好用的圖形界面吧。

```
minikube dashboard
Opening kubernetes dashboard in default browser...
```

終於大功告成！謹以此為記，希望對後來者也用。