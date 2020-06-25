<template>
  <div class="navbar" :style="{height: navHeight}">
    <FormId>
      <img
        @click="dismissLoginGuide"
        v-if="!cancelLoginGuide && !isLogin"
        :style="{height: loginImgHeight, top: navTop}"
        class="login-img"
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/land-s.gif"
      />
      <div class="navbar-user" :style="{width: navbarWidth, top: navTop, height: navBarUserHeight}">
        <button
          v-if="!isLogin"
          class="user-info user-open-data"
          open-type="getUserInfo"
          @getuserinfo="GetUserInfo"
        >
          <open-data class="user-header" type="userAvatarUrl"></open-data>

          <p class="fs14 fbold" @click="() => console.log(111)">未登录</p>
        </button>
        <div v-else class="user-info" @click="goUserCenter">
          <div class="user-header">
            <img
              :src="userInfo && userInfo.avatarUrl?userInfo.avatarUrl:'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'"
              width="100"
            />
          </div>
          <p class="fs14 fbold">我的</p>
        </div>
        <div class="menus">
          <!-- 名片夹 -->
          <div v-if="isShowCardCase" class="menus-item">
            <div class="cycle" @click="toCardCase">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/cardcase2.png"
                alt
                class="w30 h30"
              />
            </div>
          </div>
          <!--        <GetPhoneNumber-->
          <!--          class="menus-item"-->
          <!--          v-if="isShowCardCase"-->
          <!--          @next="toCardCase"-->
          <!--          isFromUserCenter="true"-->
          <!--        >-->
          <!--        </GetPhoneNumber>-->
          <!-- 购物车 -->
          <div v-if="isShowShopCar" class="menus-item">
            <div class="cycle" @click="page_turn('shopCart')">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/shopping-trolley2.png"
                alt
                class="w30 h30"
              />
            </div>
          </div>
        </div>
      </div>
    </FormId>
  </div>
</template>

<script>
import FormId from "@/components/formId";
import GetPhoneNumber from "@/components/getPhoneNumber"; //
import { mapGetters, mapState } from "vuex";
import HandleLogin from "@/utils/handleLogin";
import HandleWebsocket from "@/utils/websocket";

export default {
  props: {
    isShowCardCase: {
      type: Boolean,
      default: false
    },
    isShowShopCar: {
      type: Boolean,
      default: true
    }
    // avatarUrl: {
    //   type: String
    // },
  },
  components: {
    FormId,
    GetPhoneNumber
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLoginStatus,
      userInfo: state => state.userInfo
    }),
    ...mapGetters(["currentCompany"]),
    isSelf() {
      return this.currentCompany.userId == wx.getStorageSync("userId");
    }
  },
  data() {
    return {
      navHeight: "", // 导航高度
      navTop: "", // 导航距离顶部的距离
      navbarWidth: "", // 导航宽度
      navBarUserHeight: "", // 顶部菜单和胶囊空间同高
      //是否微信授权获取用户信息
      canIUse: false,
      //用户手动拒绝给予用户权限
      noPermission: false,
      loginImgHeight: "",
      //取消登录引导
      cancelLoginGuide: false
    };
  },
  async mounted() {
    this.authUserInfo();
    this.calculateNavBarHeight();
  },
  methods: {
    dismissLoginGuide() {
      // this.$emit('cancelLoginGuide');
      this.cancelLoginGuide = true;
    },
    /**
     * 去用户的个人中心
     */
    goUserCenter() {
      wx.navigateTo({ url: "../usercenter/main" });
    },
    /**
     * 计算navbar的高度
     */
    calculateNavBarHeight() {
      if (getApp().globalData.menuButtonBounding === 0) {
        getApp().globalData.menuButtonBounding = wx.getMenuButtonBoundingClientRect();
      }
      let menuButtonBounding = getApp().globalData.menuButtonBounding;
      wx.getSystemInfo({
        success: res => {
          let statusBarHeight = res.statusBarHeight; //胶囊按钮与顶部的距离
          let navHeight =
            statusBarHeight +
            (menuButtonBounding.top - statusBarHeight) * 2 +
            menuButtonBounding.height; //导航高度
          let navBarUserHeight = navHeight - statusBarHeight;

          this.navHeight = navHeight + "px";
          this.navTop = statusBarHeight + "px";
          this.navBarUserHeight = navBarUserHeight + "px";
          this.navbarWidth =
            menuButtonBounding.right - menuButtonBounding.width - 20 + "px";
          // 特此说明: 由于动态提示图片的框框部分在原图中的比例为0.36，由此计算出同比例放大缩小的图片大小为一下数据
          this.loginImgHeight = navBarUserHeight / 0.36 + "px";
            wx.setStorageSync('environment',res.environment?2:1);
            console.log('平台',res.environment?2:1);
          getApp().globalData.navHeight = navHeight;
        },
        fail(err) {
          console.log(err);
        }
      });
    },
    /**
     * 获取用户是否已经进行了微信用户授权
     */
    authUserInfo() {
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"]) {
            this.canIUse = true;
          } else {
            this.canIUse = false;
          }
        }
      });
    },
    toCardCase() {
      //名片夹
      wx.navigateTo({ url: "../cardCase/main" });
    },
    /**
     * 获取用户信息
     * @param e
     * @constructor
     */
    GetUserInfo(e) {
      let _v = this;
      wx.getUserInfo({
        success(res) {},
        fail(res) {
          _v.noPermission = true;
        }
      });

      const msg = e.target;
      if (!msg.rawData || !msg.signature || !msg.encryptedData || !msg.iv) {
        this.loginFailed();
        return;
      }
      HandleLogin.login(
        data => {
          HandleLogin.setLoginMessageInStorage(data, false);
          // 进入首页，则需要连接websocket
          HandleWebsocket.connectWebsocket();
          this.loginSuccess();
        },
        () => {
          this.loginFailed();
        }
      );
    },
    page_turn(url) {
      wx.navigateTo({
        url:
          "/pages/" +
          url +
          "/main?type=" +
          this.intoType +
          "&cardId=" +
          this.currentCompany.cardId +
          "&userId=" +
          this.currentCompany.userId +
          "&logo=" +
          (this.currentCompany.logo || "") +
          "&wxCode=" +
          (this.currentCompany.personalWx || "") +
          "&phone=" +
          (this.currentCompany.phone || "") +
          "&specId=" +
          (this.specId || "") +
          "&name=" +
          (this.currentCompany.name || "")
      });
    },
    loginSuccess() {
      // let avatarUrl = wx.getStorageSync("avatarUrl");
      // this.$emit("update:avatarUrl", avatarUrl);
      this.$emit("loginSuccess");
      this.authUserInfo();
    },
    loginFailed() {
      this.$emit("loginFailed");
    }
  },
  onLaunch() {}
};
</script>
<style scoped>
.navbar {
  width: 100%;
  background-color: #ffffff;
  position: relative;
}
.navbar-user {
  position: absolute;
  width: 100%;
  /*height: 32px;*/
  display: flex;
  justify-content: space-between;
}
.user-info {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  background: none;
}
.user-header {
  width: 70upx;
  height: 70upx;
  margin-right: 20upx;
  overflow: hidden;
  margin-left: 20upx;

  border-radius: 35upx;
}
.user-open-data {
  padding: 0 !important;
  margin-left: 0 !important;
}

.user-header img {
  width: 70upx;
  height: 70upx;
}
.menus {
  width: 25%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.menus-item {
  margin-left: 40upx;
}
.cycle {
  width: 56upx;
  height: 56upx;
  text-align: center;
  text-align: center;
}

.login-img {
  width: 64%;
  position: absolute;
  left: 0;
  z-index: 1000;
}
</style>
