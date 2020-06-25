<template>
  <div class="bgfff pl15 pt15 pr15 card3">
    <div class="posre h213 overhidden">
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/20200402card05.png"
        alt
        class="posab left0 top0 card3_bg w100p h100p"
      />

        <img
                :src="card_msg.picchecked || card2_logo"
                alt
                :class="card_msg.picchecked ? 'w60' : 'w100p' "
                @click="previewImage(card_msg.picchecked || card2_logo)"
                mode="aspectFill"
                class="posab card2_user h60"
        />

      <div class="card3_right">
        <p
          style="font-size:38upx;"
          class="fs20 fbold"
        >{{card_msg.username || '姓名'}}</p>
        <p class="fs10">{{card_msg.post || '职位'}}</p>
      </div>

      <div class="align-cen fs10 ce8 card_company">
        <span class="pr14">{{card_msg.company || '公司名称'}}</span>
        <!--<div class="card_line_2"></div>-->
          <div class="cacrd3_left">
              <p class="fs10 pb9">电话：{{card_msg.tel || '电话'}}</p>
              <p class="fs10 pb9">邮箱：{{card_msg.email || '邮箱'}}</p>
              <p class="fs10 ">地址：{{companyAddress}}</p>
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
    </div>
  </div>
</template>

<script>
export default {
  name: "card_4",
  props: ["card_msg",'isPrev'],
    data() {
        return {
            companyAddress:wx.getStorageSync('companyAddress') || '地址',
            card2_logo:
                "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card2_user.png",
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
        }
    }
};
</script>

<style>
.pb6 {
  margin-top: 26upx;
  padding-bottom: 18upx;
}
.card_line_2 {
  position: relative;
}
.card3 .card2_user{
    z-index: 2;
    top: 270rpx;
    left: 450rpx;
    border-radius: 50%;
}
.company{
    height: 80rpx;
    position: absolute;
    z-index: 2;
    top: 10rpx;
    left: -200rpx;
}

/*.card_line_2::before,*/
/*.card_line_2::after {*/
  /*position: absolute;*/
  /*width: 6upx;*/
  /*height: 16upx;*/
  /*background: #fff;*/
  /*top: 0;*/
  /*bottom: 0;*/
  /*margin: auto;*/
  /*content: "";*/
/*}*/

/*.card_line_2::before {*/
  /*right: 0;*/
/*}*/

/*.card_line_2::after {*/
  /*right: 10upx;*/
/*}*/

.card_company {
    position: absolute;
    right: 290rpx;
    bottom: 40rpx;
    font-size: 38rpx;
    width: 320rpx;
    color: #333333;
    font-weight: bold;
}

.card3 .cacrd3_left {

}
.card3 .card3_right {
  position: absolute;
  left: 279upx;
  top: 125rpx;
    display: flex;
    color: black;
}
.card3 .card3_right p:nth-child(2){
    margin-top: 19upx;
    margin-left: 20upx;
}
</style>
