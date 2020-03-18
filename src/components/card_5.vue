<template>
  <div class="bgfff pl15 pt15 pr15 card2">
    <div class="posre h214 overhidden">
      <img
        :src="card_msg.picchecked || card2_logo"
        alt
        :class="card_msg.picchecked ? 'w225' : 'w100p' "
        @click="previewImage(card_msg.picchecked || card2_logo)"
        mode="aspectFill"
        class="posab left0 top0 card2_user h100p"
      />

      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card4_bg.png"
        alt
        class="posab right0 top0 card_bg"
      />

      <div class="card2_inner nowrap">
        <p class="fs18 fbold pb3" style="font-size:14px;">{{card_msg.username || '姓名'}}</p>
        <p class="fs10">{{card_msg.post || '职位'}}</p>

        <div class="pl33 nowrap" style="position: absolute;top: 144upx;padding-left:0;color:#333;">
          <p class="fs12 pb6 p-phone">{{card_msg.tel || '电话'}}</p>
          <p class="fs12 p-phone">{{card_msg.email || '邮箱'}}</p>
          <img
            class="i-phone"
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/dianhua001.png"
            alt
          />
          <img
            class="i-email"
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/youxiang001.png"
            alt
          />
          <img
            class="i-address"
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/dizhi001.png"
            alt
          />
        </div>
      </div>

      <div class="align-cen fs10 card_company disflex">
        <span class="pr10" style="color:#333;">{{card_msg.company || '公司名称'}}</span>
        <div class="card_line_2"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "card_3",
  props: ["card_msg", "isPrev"],
  data() {
    return {
      card2_logo:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card2_user.png"
    };
  },
  methods: {
    previewImage(url) {
      if (!this.isPrev) return;

      let urls = [url];

      wx.previewImage({
        current: urls[0],
        urls: urls
        // urls必须是数组 不然会报错
      });
    }
  }
};
</script>

<style>
/* .pb6 {
  margin-top: 26upx;
  padding-bottom: 18upx;
} */
.card2 .card_bg {
  width: 452upx;
  height: 100%;
}

.card2 .card2_inner {
  position: absolute;
  left: 368upx;
  top: 104upx;
  color: #333;
}
.card2_inner .p-phone {
  text-align: right;
  width: 260upx;
}
.card2_inner .i-phone {
  width: 24upx;
  height: 24upx;
  z-index: 999;
  top: 4upx;
  position: absolute;
  right: -40upx;
}
.card2_inner .i-email {
  width: 24upx;
  height: 24upx;
  z-index: 999;
  top: 50upx;
  position: absolute;
  right: -40upx;
}
.card2_inner .i-address {
  width: 24upx;
  height: 24upx;
  z-index: 999;
  bottom: -38upx;
  position: absolute;
  right: -40upx;
}
.card_line_2 {
  position: relative;
}

.card_line_2::before,
.card_line_2::after {
  position: absolute;
  width: 6upx;
  height: 16upx;
  background: #fff;
  top: 0;
  bottom: 0;
  margin: auto;
  content: "";
}

.card_line_2::before {
  right: 0;
}

.card_line_2::after {
  right: 10upx;
}

.card_company {
  position: absolute;
  right: 42upx;
  bottom: 65upx;
}
</style>
