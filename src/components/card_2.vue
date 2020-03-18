<template>
  <div class="posre bgfff bg-content">
    <img
      :src="card_msg.picchecked || card1_logo"
      @click="previewImage(card_msg.picchecked || card1_logo)"
      alt
      class="w100p bg-img left0 top0"
      mode="aspectFill"
    />

    <div class="pl15 pr15 posab desc-content">
      <div class="shadow_gray bgfff pl25 pt25 pr22 pb21 disflex jsbet">
        <div>
          <p class="fs18 c38 fbold pb7">{{card_msg.username || '姓名'}}</p>
          <p class="fs14 c78 pb15">{{card_msg.post || '职位'}}</p>
          <p class="disflex align-cen">
            <img
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel_blue.png"
              alt
              class="w16 h16 mr11"
            />
            <span class="fs12 ca8">{{card_msg.tel || '电话'}}</span>
          </p>
        </div>
        <div class="disflex align-cen">
          <img
            :src="card_msg.company_logo || card1_company"
            alt
            class="w60 h60"
            mode="aspectFill"
            @click="previewImage(card_msg.company_logo || card1_company)"
          />
          <!--@click.stop="uploadpic('company')"-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "card_2",
  props: ["card_msg", "isPrev"],
  data() {
    return {
      card1_logo:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_user.png",
      card1_company:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_logo.png"
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
    },
    uploadpic(type) {
      this.$emit("uploadpic", type);
    }
  }
};
</script>

<style>
.bg-content {
  height: 850upx;
}
.bg-img {
  height: 750upx;
}
.desc-content {
  z-index: 20;
  width: 690upx;
  bottom: 0upx;
}
</style>
