<template>
  <div class="bgfff pl15 pt15 pr15 card2">
    <div class="posre h214 overhidden">

        <div class="posab card2_user">
            <img
                    :src="card_msg.picchecked || card2_logo"
                    alt
                    :class="card_msg.picchecked ? 'w60' : 'w100p' "
                    @click="previewImage(card_msg.picchecked || card2_logo)"
                    mode="aspectFill"
                    class="h60 mauto"
            />
            <span class="line"></span>
            <p style="color: #9C7F40;" class="fs14 mt4">{{card_msg.company || '公司名称'}}</p>
        </div>


      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/20200402card07.png"
        alt
        class="posab right0 top0 card_bg"
      />

      <div class="card2_inner">
        <p class="fs18 fbold pb3" style="font-size:14px; color: #A08554;">{{card_msg.username || '姓名'}}</p>
        <p class="fs10" style="color: #A08554;">{{card_msg.post || '职位'}}</p>

        <div class="ca8" style="position: absolute;top: 130rpx;">
          <p class="fs12 pb10" style="color: #B09B75;">
                <img
                      class="i-phone"
                      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/phoneicon.png"
                      alt
              />
              {{card_msg.tel || '电话'}}</p>
          <p class="fs12 pb10" style="color: #B09B75;">
                <img
                      class="i-phone"
                      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/emailicon.png"
                      alt
              />
              {{card_msg.email || '邮箱'}}</p>
            <p class="fs12 w160" style="color: #B09B75;">
                  <img
                      class="i-phone"
                      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/addressicon.png"
                      alt
              />{{companyAddress}}</p>
        </div>

      </div>

        <div class="disflex align-cen">
            <img
                    :src="card_msg.company_logo || card1_company"
                    alt
                    class="h60 company"
                    mode="aspectFit"
                    @click="previewImage(card_msg.company_logo || card1_company)"
            />
            <!--@click.stop="uploadpic('company')"-->
        </div>

      <div class="align-cen fs10 ce8 card_company disflex">
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
        companyAddress:wx.getStorageSync('companyAddress') || '地址',
      card2_logo:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card2_user.png",
        card1_company:
            "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_logo.png"
    };
  },
    onShow(){

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

<style scoped>
/* .pb6 {
  margin-top: 26upx;
  padding-bottom: 18upx;
} */
.card2 .card_bg {
  width: 100%;
  height: 100%;
    z-index: 1;
}

.company{
    height: 80rpx;
    position: absolute;
    z-index: 2;
    top: 45rpx;
    right: -120rpx;
}
.i-phone {
    transform: translate(0,5rpx);
    width: 24upx;
    height: 24upx;
    margin-right: 15rpx;
}
.card2 .card2_user{
    z-index: 2;
    top: 227rpx;
    left: 414rpx;
    text-align: center;
    border-radius: 50%;
}

.line{
    display: block;
    width: 200rpx;
    height: 5rpx;
    background-color: #A4894F;
}

.card2 .card2_inner {
  position: absolute;
    left: 67rpx;
    top: 104rpx;
    z-index: 2;
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
    z-index: 2;
}
</style>
