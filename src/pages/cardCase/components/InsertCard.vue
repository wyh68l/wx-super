<template>
  <div class="insert-card">
    <button v-if="!isLogin" class="insert" open-type="getUserInfo" @getuserinfo="GetUserInfo">
      <div class="left">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/add.png" alt />
        <p class="fs18 cfff">我的智能名片</p>
      </div>
      <p class="right fs18 cfff fbold">立即创建</p>
    </button>
    <div class="insert" v-else @click="updateMyCard">
      <div class="left">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/add.png" alt />
        <p class="fs18 cfff">我的智能名片</p>
      </div>
      <p class="right fs18 cfff fbold">立即创建</p>
    </div>
  </div>
</template>
<script>
import HandleLogin from "@/utils/handleLogin";

export default {
  props: {
    isLogin: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // insertCardImg: require("@/static/card-case-inert.png")
      //是否微信授权获取用户信息
      canIUse: false
    };
  },
  methods: {
    updateMyCard() {
      wx.navigateTo({ url: "../editCard/main?type=add" });
    },
    /**
     * 获取用户信息
     * @param e
     * @constructor
     */
    GetUserInfo(e) {
      const msg = e.target;
      if (!msg.rawData || !msg.signature || !msg.encryptedData || !msg.iv) {
        return;
      }
      HandleLogin.login(data => {
        HandleLogin.setLoginMessageInStorage(data, false);
        this.$emit("loginSuccess", "insert");
      });
    }
  }
};
</script>
<style scoped>
.insert-card {
  position: fixed;
  right: 0;
  bottom: 90upx;
  z-index: 299;
  padding-right: 30upx;
  padding-left: 30upx;
  box-sizing: border-box;
  text-align: right;
}

.insert {
  width: 690upx;
  height: 120upx;
  background: #00a0e9;
  border-radius: 60upx;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.insert:active {
  opacity: 0.8;
}
.insert .left {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 42upx;
}
.insert .left img {
  width: 60upx;
  height: 60upx;
  margin-right: 22upx;
}
.right {
  margin-right: 42upx;
}
</style>
