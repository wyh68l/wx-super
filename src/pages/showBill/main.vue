<template>
  <div class="pb93 h100p borderbox bgf5f6">
    <swiper
      class="swiper_3d"
      @change="handleChange"
      :current="currentIndex"
      previous-margin="100rpx"
      next-margin="100rpx"
      circular
    >
      <div v-for="(img,idx) in imgLists" :key="idx">
        <swiper-item class="item">
          <div :class="currentIndex ==  idx ? 'active' : '' " class="itemImg poster2 posre">
            <img mode="widthFix" style="width: 100%" :src="img" />
          </div>
        </swiper-item>
      </div>
    </swiper>
    <div class="bgfff disflex fs12 ca8 textc h93 fix_bottom pt11 borderbox">
      <div class="textc w100p" @click="shareToTimeLine">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/time_line_share.png"
          alt
          class="w50 h50"
        />
        <p>保存图片</p>
      </div>
    </div>
  </div>
</template>

<script>
import WXAJAX from "../../utils/request";

export default {
  name: "",
  data() {
    return {
      imgUrls: [
        {
          img: this.img,
          url:
            "/_pages/common/webview/main?url=https://wechat.benmu-health.com/mobile/app/common/material/render/17"
        },
        {
          img: this.img,
          url: "/pages/checkup/filterPackage/index?category=PARENTS_CHECKUP"
        }
      ],

      currentIndex: 0,
      bgColor: "",
      poster_msg: {
        company: "成都壹立科技有限企业",
        name: "付鑫",
        code: "",
        tel: "17318989819",
        email: "yiliit@foxmail.com",
        userlogo: "",
        post: "商务经理"
      },
      shareImgSrc: "",
      screenWidth: "",
      shareTempFilePath: "",
      time: {
        day: "",
        month: "",
        year: ""
      },
      months: {
        "1": "Jan",
        "2": "Feb",
        "3": "Mar",
        "4": "Apr",
        "5": "May",
        "6": "Jun",
        "7": "Jul",
        "8": "Aug",
        "9": "Sept",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
      },
      imgLists: []
    };
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "名片海报"
    });

    let d = new Date();
    this.time = {
      day: ("0" + d.getDate()).slice(-2),
      month: this.months[d.getMonth() + 1],
      year: d.getFullYear()
    };

    this.getCardPoster();
  },
  methods: {
    handleChange(e) {
      this.currentIndex = e.target.current;
      // this.bgColor = getRandomColor();
    },
    // 获取名片海报
    getCardPoster() {
      wx.showLoading();
      WXAJAX.POST(
        {
          cardId: this.$root.$mp.query.cardId
        },
        "",
        "/businessCard/getCardPoster"
      ).then(res => {
        wx.hideLoading();
        this.imgLists = res;
      });
    },
    shareToTimeLine() {
      //分享到朋友圈
      let v = this;

      // console.log("shareToTimeLine");
      // console.log(this.imgLists);
      // console.log(this.currentIndex);
      wx.getImageInfo({
        src: this.imgLists[this.currentIndex],
        success: function(sres) {
          wx.saveImageToPhotosAlbum({
            filePath: sres.path,
            success: function(fres) {
              wx.showToast({
                title: "保存成功!",
                icon: "none"
              });
              console.log(fres);
            },
            fail(err) {
              wx.showToast({
                title: "保存失败!",
                icon: "none"
              });
              console.log(err);
            }
          });
        }
      });
    }
  }
};
</script>

<style>
.swiper_3d {
  width: 100%;
  height: 940upx;
  background: #f5f5f6;
  counter-reset: wangxiaoer;
  position: absolute;
  top: 0;
  bottom: 200upx;
  margin: auto;
  /*transform: translateY();*/
}

.swiper_3d .item {
  height: 100%;
  /*padding: 24upx;*/
  box-sizing: border-box;
}

.swiper_3d .itemImg:before {
  /*    content: counters(wangxiaoer, '') '. ';
        counter-increment: wangxiaoer;
        position: relative;
        display: block;
        top: 50%;
        transform: translateY(-50%);
        background-color: #fff;
        width: 60px;
        height: 60px;
        border-radius: 30px;
        margin: 0 auto;
        text-align: center;*/
}

.swiper_3d .itemImg {
  width: 528upx;
  transform: scale(0.8);
  z-index: 5;
  opacity: 0.7;
  margin: auto;
  background-color: #fff;
  text-align: center;
}

.swiper_3d .active {
  opacity: 1;
  z-index: 10;
  transform: scale(1);
  /*height:470px;*/
  /*width: 314px;*/
  transition: all 0.2s ease-in 0s;
  background-color: #fff;
}

.swiper_3d .active img {
  width: 528upx;
}

.share_wx {
  background: none;
  color: #a8a8a8;
  font-size: 24upx;
  line-height: 1;
}

.share_wx::after {
  border: 0;
  background: none;
}

.poster_bottom {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  bottom: 10upx;
  text-align: center;
}

.poster_bottom > img {
  width: 462upx;
  height: 14upx;
}

.line_before_2::before,
.line_before_2::after {
  position: absolute;
}

canvas {
  background: #fff;
}
</style>





















































