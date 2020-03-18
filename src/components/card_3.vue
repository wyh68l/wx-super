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
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card2_bg.png"
        alt
        class="posab right0 top0 card_bg"
      />

      <div class="card2_inner nowrap">
        <p class="fs18 cfff fbold pb3" style="font-size:14px;">{{card_msg.username || '姓名'}}</p>
        <p class="fs10 cfff">{{card_msg.post || '职位'}}</p>

        <div class="pl33 ca8 nowrap" style="position: absolute;top: 144upx;">
          <p class="fs12 pb6">{{card_msg.tel || '电话'}}</p>
          <p class="fs12">{{card_msg.email || '邮箱'}}</p>
        </div>
      </div>

      <div class="align-cen fs10 ce8 card_company disflex">
        <span class="pr14">{{card_msg.company || '公司名称'}}</span>
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
  left: 324upx;
  top: 104upx;
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
  right: 34upx;
  bottom: 30upx;
}
</style>
