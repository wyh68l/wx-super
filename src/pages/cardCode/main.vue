<template>
  <div class="main-box bg_line_38 textc posre">
    <div class="posab h520 top0 left0 right0 bottom0 mauto cardcode outer" :class="trans">
      <div class="posre mb25 img-out">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/circle.png"
          alt
          class="w308 h308 posab left0 right0 top0 bottom0 mauto outer-line"
        />
        <div class="posre top3 bradius50p code overhidden w200 h200 disinblock">
          <img :src="code || currentCompany.wxTwoCode" alt class="w200 h200" />
        </div>
      </div>

      <div class="text-outer">
        <div class="name-position">
          <p class="pb15 fs24 cfff fbold">{{currentCompany.name}}</p>
          <p class="fs16 cfff mb25 pb25">{{currentCompany.position}}</p>
        </div>
        <div class="textc pt25 logo-company">
          <img
            :src="currentCompany.companyLogo"
            alt
            class="disinblock w60 h60 bradius5 mb4"
            mode="aspectFill"
          />
          <p class="fs14 cfff fbold">{{currentCompany.companyName}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../../utils/index";
import WXAJAX from "../../utils/request";
import { mapGetters } from "vuex";

export default {
  name: "",
  components: {},
  data() {
    return {
      trans: "",
      COMPANYID: "",
      CARDID: "",
      wxCodeMsg: "",
      code: ""
    };
  },
  onLoad() {
    const { code } = this.$root.$mp.query;
    this.code = code;
    this.COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    this.CARDID = wx.getStorageSync("CARDID") || 0;
    this.wxCodeMsg = wx.getStorageSync("wxCodeMsg") || {};

    setTimeout(() => {
      this.trans = "transform180";
    }, 1 * 1000);

    wx.setNavigationBarColor({
      backgroundColor: "#383838",
      frontColor: "#ffffff",
      animation: {
        // 可选项
        duration: 100,
        timingFunc: "easeIn"
      }
    });
  },
  computed: {
    ...mapGetters(["currentCompany"])
  }
};
</script>

<style>
.outer {
  position: absolute;
  top: 0;
  bottom: 0;
}
.cardcode {
  transition: 0.8s;
}

.img-out {
  margin-top: 240upx;
}
.transform180 {
  /* transform: rotate(180deg); */
}

.text-outer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20upx 0;
}

.code {
  background: white;
  padding: 40upx;
}

.transform180 .text-outer,
.transform180 .code,
.transform180 .outer-line,
.transform180 .logo-company {
  transition: 1s;
}

.transform180 .logo-company {
  top: 868upx;
}

.transform180 .name-position {
  top: 68upx;
}
.logo-company {
  position: absolute;
  top: 800upx;
  left: 0;
  right: 0;
}

.transform180 .code {
  transform: rotate(360deg);
}

.transform180 .outer-line {
  transform: rotate(-180deg);
}
.transform180 .text-outer {
  transform: rotate(360deg);
}
.main-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>















