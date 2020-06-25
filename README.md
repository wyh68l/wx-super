# uni-business-card

## 项目配置
```
npm install
```

### 启动命令
```
npm run dev:mp-weixin
```

### build命令
```
npm run build:mp-weixin
```

### uni-app官方文档
```
https://uniapp.dcloud.io/
```

### 坑点一:
```
  注意打包时候，app.json是否打包完整，一定要仔细检查app.json中的 permission、navigateToMiniProgramAppIdList 等字段是否存在。
  crm端每次打包也要注意这个坑，如果没有这两个字段就手动加上去
```

### 坑点二: 
```
  如果socket要增加某些字段、后台给您穿了、控制板ws里面也有、那您就要去util文件夹下的websocket.js 里面发送消息和接受消息那个地方改一下
```

### 小程序上传的问题
```
  需要手动build后在小程序开发工具中打开build出的文件夹再上传，上传时要把ext.json从打包目录中移除
