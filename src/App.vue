<script>
import HandleWebsocket from './utils/websocket'
import utils from './utils';
import WXAJAX from '@/utils/request'
import HandleLogin from '@/utils/handleLogin'
import { openShare } from '@/utils/behavior'
import { mapState } from "vuex";
export default {
  globalData: {
    menuButtonBounding: 0, // wx.getMenuButtonBoundingClientRect(), // 胶囊控件，iphone 6中，该值在第一次获取没有问题，但是后面获取就为0了，所以第一次获取后，将次存下来
    navHeight: 0, // 导航的高度(胶囊控件加上状态栏所有的高度)
  },
  computed: {
    ...mapState({
      isLogin: state => {
        return state.isLoginStatus;
      }
    })
  },
  data() {
    return {
      preShareId: ""
    }
  },
  async onShow(options) {
    this.checkVersion();

    //第一次加载检测是否登录
    if(!this.isLogin){
        wx.showToast({
            title: '请登录',
            duration: 2000,
            icon: 'none'
        });
        setTimeout(function() {
            let url = '/pages/wxLogin/main';
            console.info('未登录跳转的地址：', url);
            wx.redirectTo({ url: url });
        }, 1000);
    }


    if (options.query.scene) {
      let param = utils.formatParams(decodeURIComponent(options.query.scene));
      console.log("太阳码打开小程序参数:", param);

      if (param.id > 0) {
        this.sceneJump(param);
      } else {
        this.oldSceneJump(param, options);
      }
    }

    if (options.query.goType == 1) {
      let url = '/' + options.path;
      console.log('----------', options.query);
      if (options.query.goodId) {
        wx.setStorageSync('forwardId', options.query.forwardId);
        wx.setStorageSync('forwardGoodsId', options.query.goodId);
        url += ('?goodId=' + options.query.goodId);
      }
      if (options.query.dynamicId) url += ('?dynamicId=' + options.query.dynamicId + '&companyId=' + options.query.companyId + "&cardId=" + options.query.cardId);

      wx.setStorageSync('COMPANYID', options.query.companyId);
      wx.setStorageSync('CARDID', options.query.cardId);
      wx.setStorageSync('redirectPage', url);

      // 分享或者小程序跳转进入，如果当前用户已经登录，且还没有名片，则需要重新登录一次，查看是否还有名片
      if (HandleLogin.returnIsLogin() && !wx.getStorageSync("hasCard")) {
        // HandleLogin.login(data => {
        //     HandleLogin.setLoginMessageInStorage(data, false);
        //     // 进入首页，则需要连接websocket
        //     HandleWebsocket.connectWebsocket();
        // });
        let data = await HandleLogin.loginPromise();
        console.log('app login data', data);
        if (data) {
          HandleLogin.setLoginMessageInStorage(data, false);
          HandleWebsocket.connectWebsocket();
        }
        // } else if (!HandleLogin.returnIsLogin()) {
        //   console.log('app 游客登录');
        //   await HandleLogin.postLoginPromiseByTourists();
      }
      if (options.query.shareId && options.query.shareId !== this.preShareId && this.isLogin) {
        this.preShareId = options.query.shareId;
        openShare(options.query.shareId);
      }
    }

    HandleWebsocket.connectWebsocket();
  },
  created() {
  },
  methods: {
    checkVersion() {
      if (wx.canIUse("getUpdateManager")) {

        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
          console.log('checkInfo', res);
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: "已经有新版本了哟~",
                content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
              });
            });
          }
        });
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
          title: "提示",
          content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
      }
    },
    oldSceneJump(param, options) {
      let url = '/' + options.path;
      wx.setStorageSync('COMPANYID', param.c);
      wx.setStorageSync('CARDID', param.card);

      if (param.g) url += `?goodId=${param.g}`;

      wx.reLaunch({ url: url });
      // if (HandleLogin.returnIsLogin()) {
      //   wx.reLaunch({ url: url });
      // } else {
      //   wx.setStorageSync('redirectPage', url);
      // }
    },
    sceneJump(param) {
      WXAJAX.POST({
        sunCodeId: param.id
      }, '', '/businessCard/getSunCode').then(res => {
        let url = '/' + res.page;
        let paramsObj = utils.formatParams(decodeURIComponent(res.scene));
        console.log("太阳码 scene :", paramsObj);
        wx.setStorageSync('COMPANYID', paramsObj.c);
        wx.setStorageSync('CARDID', paramsObj.card);

        if (url === "/pages/dynamicDetail/main") {
          // 转载文章的太阳码
          url += `?dynamicId=${paramsObj.dynamic}`;
          // userApi/shareRecord/addOpenShareCount 打开分享
          openShare(paramsObj.shareId);
        } else {
          if (paramsObj.g) url += `?goodId=${paramsObj.g}`;
        }

        wx.reLaunch({ url: url });
        // if (HandleLogin.returnIsLogin()) {
        //   wx.reLaunch({ url: url });
        // } else {
        //   wx.setStorageSync('redirectPage', url);
        // }
      });
    },
  },
  log() {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
page {
  width: 100%;
  height: 100%;
  background: #f5f5f6;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
* {
  box-sizing: border-box;
}
</style>
