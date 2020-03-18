<template>
  <div class="phone-slots"
       v-if="!phone">
    {{phone||''}}
    <!-- <button class="user-info" ref="loginUser" open-type="getUserInfo" @getuserinfo="GetUserInfo"></button> -->
    <button class="user-info"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumbers"></button>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import WXAJAX from '@/utils/request'

export default {
  data() {
    return {
      //   isLogin: wx.getStorageSync("isLogin")
    };
  },
  computed: {
    ...mapState({
      phone: state => state.phone
    })
  },
  methods: {
    ...mapMutations(['setPhone']),
    getPhoneNumbers(e) {
      WXAJAX.POST({
        phoneData: e.target.encryptedData,
        phoneIv: e.target.iv,
      }, '', '/home/getWxPhone')
        .then(res => {
          wx.setStorageSync('phone', res);
          this.setPhone(res);

        }).catch(err => {
          console.log("获取手机号出错：", err)
        });
    }
  }
};
</script>
<style scoped>
.masks {
  position: relative;
}
.phone-slots {
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