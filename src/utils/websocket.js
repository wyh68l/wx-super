
import store from '../store';
import { clearLoginInfo } from "./index";
let socketOpen = false;
let isGetReturn = false;
let extJSON = wx.getExtConfigSync();
/**
 *
 * @param sendcode 登录成功时发送的code
 */
export function connect(sendcode) {
  wx.connectSocket({
    url: extJSON.wssUrl,
    // url: 'wss://api.youdomain.com:8090/ws',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': null
    },
    protocol: ['protocol1'],
    method: 'GET',
    data: 'data',
    success: function (res) {
      console.log('WebSocket连接创建', res)
    },
    fail: function (err) {
      // wx.showToast({
      //   title: '网络异常！',
      //   icon: 'none'
      // });
    }
  });
  /**
   * 监听websocket连接打开
   */
  wx.onSocketOpen(function () {
    sendRegister();
  });
  /**
   * 接受消息
   */
  wx.onSocketMessage(function (res) {
    jsMessage(res,sendcode);
  });
  //error事件
  wx.onSocketError(function (err) {
    console.log('err -- ', err);
  });

  wx.onSocketClose(function (){
    wx.getNetworkType({
      success(res) {
        if(res.networkType == 'none') return;

        setTimeout(()=>{
          connect(101);
        }, 1*1000);
      }
    })

  })
}
/**
 * 接受消息
 * @param res
 */
export  function jsMessage(res,sendcode) {
  // console.log("接受消息 --- ",res);
  var messageData=JSON.parse(res.data);
  if(!messageData.success){
    console.log('操作失败')
  }
  //收到注册回复
  if (messageData.code===1001){
    sendSocketJSON("108");
    resultRegister(messageData,sendcode)
  }
  //心条回复
  if(messageData.code===1002){
    isGetReturn = true;
    resultRegister(messageData,sendcode);
  }
  //获取列表回复
  if(messageData.code===1008){
    //console.log("数据---",messageData,typeof messageData)
    // imList(messageData);
    store.dispatch('setMsgList',messageData)
  }
  //获取聊天记录
  if(messageData.code===1005){
    if(messageData.clientNum != 0){
      store.commit('ADD_LIST',messageData);
    }else{
      store.commit('GET_MSG_CONT',messageData);
      store.commit('CHANGE_STATUE');
    }
  }
  if(messageData.code===1003){
    store.dispatch('add', messageData);
    store.commit('CHANGE_STATUE');
  }

  if(messageData.code===1009) {
    let num = messageData.unreadMessageEntity ? (messageData.unreadMessageEntity.size || 0) : 0;
    if (messageData.targetId) {
      store.dispatch('setCurrentNum', num);
    }else{
      store.dispatch('setCountNum', num);
    }
  }

  if(messageData.code===201){
    let sendId = wx.getStorageSync('sendId');
    messageData.type = 1;
    store.dispatch('add', messageData)
    if(sendId){
      sendMessage({
        code: 104,
        targetId: sendId,
      })
    }

  }

  if (messageData.code === 204) {
    store.dispatch('readMsg');
  }

  if(messageData.code === 1401){
      console.log("websocket 返回 1401 没登录 --------")
      // clearLoginInfo();
      wx.showToast({
          title: '请登录',
          duration: 1000,
          icon: 'none'
      });
  }
}


/**
 * 消息列表
 * @param messageData
 */
export function imList(messageData) {
//TODO 获取到列表后的操作
//   console.log("列表消息---",messageData)
//   return messageData;

}


/**
 * 接收到注册命令
 * @param messageData
 */
export function resultRegister(messageData,sendcode) {
  //注册成功发送心跳
  if(messageData.success){
    heartCheck.reset().start(sendcode);
  }else {
    sendRegister();
  }
}

/**
 * 心跳检查
 */
export function heartbeat(messageData) {
//TODO 检查10秒内没收到回复就进行 重新连接

}


/**
 * 收到封装JSON
 * @param data
 */
export function sendSocketMessage(data){
  wx.sendSocketMessage(Object.assign(data, {
    fail(){
      connect(101);
    }
  }));
}


/**
 * 自动组装 发送消息
 * @param code   接收的code
 */
export function sendSocketJSON(code){
  sendSocketMessage(
    {data:JSON.stringify({
        code:code,
        token:wx.getStorageSync('token'),
        version:'v1'
      })})
}

/**
 * 获取聊天记录
 * @param data
 */
export function getChatRecord(data) {
  sendSocketMessage(
    {data:JSON.stringify({
        code:data.code,
        targetId:data.targetId,
        clientNum:data.clientNum,
        pageSize:data.pageSize,
        intoType:data.type,
        specId:data.specId,
        token:wx.getStorageSync('token'),
        version:'v1',
        cardId:data.cardId
      })
    })
}


/**
 * 发送消息
 */
export function sendMessage(data) {
  sendSocketMessage({
    data:JSON.stringify({
      code:data.code,
      token:wx.getStorageSync('token'),
      version:'v1',
      message:data.message,
      targetId:data.targetId,
      messageType:data.messageType,
      contentType: data.contentType
    })
  })
}
/**
 * 发送注册
 */
export function sendRegister() {
  socketOpen = true ;
  var json={
    code:101,
    token:wx.getStorageSync('token'),
    version:'v1'
  }
  //注册上报
  sendSocketMessage(
    {
      data:JSON.stringify(json)
    }
  )
}

var heartCheck = {
  timeout: 4000, //9分钟发一次心跳
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function(sendcode) {
    var self = this;
    this.timeoutObj = setTimeout(function() {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      sendSocketMessage({
        data:JSON.stringify({
          code:102,
          token:wx.getStorageSync('token'),
          version:'v1'
        })
      });
      self.serverTimeoutObj = setTimeout(function() { //如果超过一定时间还没重置，说明后端主动断开了
        wx.closeSocket({
          success(){
            connect(101);
          }
        });
      }, 10*10000)
    }, this.timeout)
  }
}


// 连接websocket
export function connectWebsocket(){
    sendSocketMessage({
        data: JSON.stringify({
            code: 102,
            token: wx.getStorageSync('token'),
            version: 'v1'
        })
    });
}


export default{
  connect,
  jsMessage,
  imList,
  resultRegister,
  sendRegister,
  sendSocketMessage,
  sendSocketJSON,
  sendMessage,
  getChatRecord,
    connectWebsocket
}

