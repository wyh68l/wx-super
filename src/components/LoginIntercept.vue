<template>
  <div class="login-slots" v-if="!isLogin">
    <!-- <div class="masks" @click.stop.prevent.self="{}" >  -->
      <button class="user-info" ref="loginUser" open-type="getUserInfo" @getuserinfo="GetUserInfo"></button>
    <!-- </div> -->
   </div>
</template>
<script>
import HandleLogin from "@/utils/handleLogin";
import HandleWebsocket from "@/utils/websocket";
import { mapState } from "vuex";
export default {
  data() {
    return {
    //   isLogin: wx.getStorageSync("isLogin")
    };
  },
  computed: {
      ...mapState({
          isLogin: state=>state.isLoginStatus
      })
  },
  methods: {
    GetUserInfo(e) {
      let _v = this;
      const msg = e.target;
      if (!msg.rawData || !msg.signature || !msg.encryptedData || !msg.iv) {
        return;
      }
      HandleLogin.login(data => {
        HandleLogin.setLoginMessageInStorage(data, false);
        // 进入首页，则需要连接websocket
        HandleWebsocket.connectWebsocket();

        this.$emit("loginSuccess");
      });
    }
  }
};
</script>
<style scoped>
.masks {
  position: relative;
}
.login-slots {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  /* background: rgba(0,0,0,0.1); */
}
.user-info {
  width: 100%;
  height: 100%;
  background: transparent;
}

</style>