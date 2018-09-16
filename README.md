# ArthurSlog_微信小程序之云开发-全栈时代

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 运行之前，请先按照下列步骤进行配置

1. 在 ./project.config.json 配置文件中，填入你的 “appid”

project.config.json
``` json
"appid": "填入你的appid",
```

2. 打开云开发控制台，复制左上角的‘环境ID’
   在 ./miniprogram/app.js 文件中，将‘环境ID’ 代入 “env” 参数

./miniprogram/app.js
``` js
wx.cloud.init({
  env: '填入你的云开发的‘环境ID’',
  traceUser: true,
})
```

3. 右键cloudfunction，选择你的云开发环境（与你刚刚复制的那个‘环境ID’保持一致），然后
   右键 cloudfunction/ 目录下的文件夹，并点击“上传并部署”

4. 请注意数据库的配置，这里我建立的 集合 名为 “Users”，请在使用的过程中，替换成你自己的集合名