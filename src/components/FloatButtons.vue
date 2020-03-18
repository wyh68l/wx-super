<template>
  <FormId>
    <div class="float-buttons flex-sa-c">
      <!-- 人脉集市 -->
      <!-- <div class="custom-cycle talk" @click="market">
      <div class="market bgblue small-cycle flex-c-c">
        <p class="fs14 cfff market-title">人脉集市</p>
      </div>
      </div>-->
      <div class="custom-cycle talk" @click="talk" v-if="isShowTalk">
        <img
          class="small-cycle"
          :src="avatarUrl||'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'"
          alt
        />
        <p class="fs10 talkB bgblue cfff">聊一聊</p>
      </div>
      <PhoneNumberIntercept class="login-intercept" />
      <LoginIntercept @loginSuccess="loginInterceptSuccess" class="login-intercept" />
    </div>
  </FormId>
</template>
<script>
import HandleLogin from "@/utils/handleLogin";
import LoginIntercept from "@/components/LoginIntercept";
import PhoneNumberIntercept from "@/components/PhoneNumberIntercept";

export default {
  props: {
    avatarUrl: {
      type: String
    },
    isShowTalk: {
      type: Boolean,
      default: true
    }
  },
  components: {
    LoginIntercept,
    PhoneNumberIntercept
  },
  data() {
    return {
      isShowLogin: false
    };
  },
  methods: {
    // 其他监听事件登录 成功回调
    loginInterceptSuccess() {
      this.$emit("loginInterceptSuccess");
    },
    //聊一聊
    talk() {
      // if (HandleLogin.returnIsLogin()) {
      //   this.$emit('talk');
      // } else {
      //   this.$emit('loginGuide');
      // }
      // this.isLogin(()=>{
      this.$emit("talk");
      // })
    },
    // isLogin(callback) {
    //   if (HandleLogin.returnIsLogin()) {
    //     callback&&callback();
    //   } else {
    //     this.$emit('loginGuide');
    //   }
    // },
    //人脉集市
    market() {
      wx.redirectTo({ url: "../cardCase/main" });
    }
  }
};
</script>
<style scoped>
.float-buttons {
  position: fixed;
  width: 116upx;
  /* height: 100%; */
  bottom: 100upx;
  right: 30upx;
  flex-direction: column;
  z-index: 1000;
}
.custom-cycle {
  width: 116upx;
  height: 116upx;
  border-radius: 58upx;
  background: white;
  box-shadow: 0 0 10upx #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 20upx;
}
.small-cycle {
  width: 102upx;
  height: 102upx;
  object-fit: cover;
  border-radius: 58upx;
}
.talkB {
  width: 88upx;
  height: 30upx;
  position: absolute;
  bottom: -10upx;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 20upx;
  text-align: center;
}
.market-title {
  width: 62upx;
}
</style>
