<template>
  <div class="pb50 posre h100p">
    <p class="pt15 fbold fs18 c38 pl15 pr27 bgfff">{{title}}</p>
    <div class="px15 dec">
      <div class="left-dec">
        <span>{{companyName}}</span>
        <span style="margin-left: 20upx;">{{time}}</span>
      </div>
      <span class="right-dec" @click="collect">{{isCollect ? '已收藏' : '收藏'}}</span>
    </div>

    <div v-if="isShowMore||type=='3'" style="position: absolute;left: 0;right: 0;">
      <image
        mode="widthFix"
        class="w100p"
        style="max-height: 80vh;"
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/detail_img.png"
      />
      <div class="more-btn">
        <button @click="goPage">点击查看更多</button>
      </div>
    </div>
    <div style="padding-bottom:100upx;" class="bgfff pt20 pl15 pr15 pb10" v-else>
      <img :src="v" alt v-for="(v,k) in photos" mode="widthFix" :key="k" class="w100p" />
      <div v-html="details"></div>
    </div>
    <!-- 分享弹窗 -->
    <cover-view
      class="w100p h100p prod_choose_class borderbox disflex column-reverse"
      :class="{show : isShowShare} "
      @click.stop="isShowShare = false"
    >
      <cover-view class="bgfff inner textc lh44">
        <cover-view class="share-box">
          <button style="margin-right: 136.5upx;margin-left: 0;background: #fff;" open-type="share">
            <cover-image
              class="share-img"
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/weixin_share.png"
            ></cover-image>
            <cover-view class="share-title">微信好友</cover-view>
          </button>
          <cover-view style="margin-left: 136.5upx;" @click="onShareEvent">
            <cover-image
              class="share-img"
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/weixin_share2.png"
            ></cover-image>
            <cover-view class="share-title">名片海报</cover-view>
          </cover-view>
        </cover-view>
        <cover-view class="share-ornament"></cover-view>
        <cover-view class="fs16 c38 lh44" @click.stop="isShowShare = false">取消</cover-view>
      </cover-view>
    </cover-view>
    <!--全屏预览-->
    <div class="mask disflex align-cen jscen" v-if="isPreviewImg">
      <div class="disinblock">
        <div class="disflex flex-end">
          <img
            @click="isPreviewImg = false"
            src="/static/close.png"
            style="height: 48rpx; width: 48rpx"
          />
        </div>
        <img class="img-size bradius5" :src="maskImg" />
        <span
          @click="saveImg"
          class="bg_line_blue cfff textc fs18 fbold bradius5 lh44 mb15"
          style="width: 465rpx;display: block;margin: 0 auto"
        >保存图片</span>
      </div>
    </div>
    <BottomButtonSmall :text="'去分享'" @btn_tap="showShare" />
    <LoginIntercept @loginSuccess="loginInterceptSuccess" />
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import BottomButtonSmall from "@/components/bottom_button_small";
import LoginIntercept from "@/components/LoginIntercept";

import util from "@/utils/index";
import { mapGetters, mapState } from "vuex";
import { addShareRecord } from "@/utils/behavior";
import HandleLogin from "@/utils/handleLogin";

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const isUrl = path => reg.test(path);

export default {
  components: { BottomButtonSmall, LoginIntercept },
  computed: {
    ...mapGetters(["currentCompany"]),
    ...mapState({
      isLogin: state => {
        return state.isLoginStatus;
      }
    })
  },
  watch: {
    isLogin: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.isShowMore = false;
        }
      }
    }
  },
  data() {
    return {
      webViewSrc: "",
      dynamicId: 98,

      addTypeShow: false,
      addTypes: [
        { name: "删除", id: "delete" },
        { name: "取消", id: "cancel" }
      ],

      title: "",
      companyName: "",
      time: "",
      details: "",
      photos: [],

      isShowShare: false,
      isCollect: false,
      isPreviewImg: false,
      maskImg: "",
      openStatus: false,
      isShowMore: true, //是否展示点击查看更多的页面
      cardId: "",
      type: "1" //类型
    };
  },
  // onShareAppMessage() {
  //   return {
  //     title: this.title,
  //     path:  `pages/dynamicDetail/main?dynamicId=${this.dynamicId}`,
  //     success: () => {
  //       uni.showToast({
  //         title: '分享成功',
  //         icon: 'none'
  //       })
  //     }
  //   }
  // },
  onShareAppMessage(e) {
    const { companyId, cardId } = this.currentCompany;
    this.addDynamicForwardRecord(cardId, this.dynamicId);
    // let shareId = await addShareRecord(companyId, 4, this.dynamicId);

    let uuid = cardId + "" + new Date().getTime();
    addShareRecord(companyId, 4, this.dynamicId, uuid).then(
      res => {
        console.log(
          "添加一条记录",
          this.dynamicId,
          "uuid",
          uuid,
          this.photos[0],
          this.title
        );
      },
      err => {}
    );
    let path =
      "/pages/dynamicDetail/main?dynamicId=" +
      this.dynamicId +
      "&companyId=" +
      companyId +
      "&cardId=" +
      cardId +
      "&goType=1&shareId=" +
      uuid;
    // let path = '/pages/dynamicDetail/main?companyId=' + companyId + '&cardId=' + cardId + '&goType=1&shareId=' + uuid;
    return {
      imageUrl: this.photos[0],
      title: this.title,
      path,
      success(e) {
        wx.showShareMenu({
          withShareTicket: true
        });
      },
      fail(e) {
        console.log("失败-- ", e);
      }
    };
  },
  async onLoad(options) {
    this.dynamicId = this.$root.$mp.query.dynamicId;
    this.COMPANYID =
      this.$root.$mp.query.companyId || wx.getStorageSync("COMPANYID") || "";
    let cardId = options.cardId;
    this.cardId = options.cardId;
    await this.getInits(cardId);
    //判断是否已经收藏
    await this.checkCollect();
  },
  methods: {
    //登录成功
    async loginInterceptSuccess() {
      if (!this.webViewSrc) {
        this.isShowMore = false;
      } else {
        this.isShowMore = true;
        this.goPage();
      }
    },
    showShare() {
      this.isShowShare = true;
    },
    collect() {
      wx.showLoading();
      let _url = "",
        _request = {};
      if (this.isCollect) {
        //取消收藏
        _url = "/personal/delCollection";
      } else {
        //添加收藏
        _url = "/personal/addCollection";
      }
      _request = {
        itemType: 2,
        itemId: this.dynamicId
      };

      WXAJAX.changeCollect(_request, _url)
        .then(data => {
          if (data) {
            this.isCollect = !this.isCollect;
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    async getInits(cardId) {
      let v = this;
      wx.showLoading();
      try {
        let data = await WXAJAX.POST(
          {
            companyId: v.COMPANYID,
            dynamicId: v.dynamicId,
            cardId: wx.getStorageSync("CARDID") || cardId
          },
          "",
          "/personal/getDynamicInfo"
        );
        wx.hideLoading();
        console.log(data);
        if (data && data.length > 0) {
          data = data[0];
          if (isUrl(data.details)) {
            this.webViewSrc = data.details;
          } else {
            this.details = data.details;
          }

          this.title = data.title || "";
          this.companyName = data.companyName;
          this.type = data.type;
          console.log("type", this.type);
          this.time = util.getdate(data.createTime, "dateTime");
          this.photos = data.photos.split(",");
        }
      } catch (error) {
        console.log("err---------or", error);
      }
    },
    async toLogin(i) {
      if (i > 3) return;
      try {
        await HandleLogin.postLoginPromiseByTourists();
      } catch (error) {
        await this.toLogin(++i);
      }
    },
    // 保存图片
    saveImg() {
      let path = this.maskImg;
      wx.getImageInfo({
        src: path,
        success: sres => {
          //console.log(sres.path);
          wx.saveImageToPhotosAlbum({
            filePath: sres.path,
            success: res => {
              wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#ffffff",
                animation: {
                  duration: 1
                }
              });
              this.isPreviewImg = false;
              wx.showToast({
                title: "保存成功",
                duration: 1000,
                icon: "success",
                mask: true
              });
            },
            fail: res => {
              wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#ffffff",
                animation: {
                  duration: 1
                }
              });
              this.isPreviewImg = false;
              wx.showToast({
                title: "保存失败",
                duration: 1000,
                icon: "none",
                mask: true
              });
            }
          });
        }
      });
    },
    // 分享给朋友
    async onShareEvent() {
      wx.showLoading({ title: "生成海报中", mask: true });
      await WXAJAX.POST(
        { companyId: this.COMPANYID, shareType: 4, itemId: this.dynamicId },
        "",
        "/shareRecord/addShareRecord"
      )
        .then(data => {
          WXAJAX.POST(
            { itemId: this.dynamicId, shardRecordId: data },
            "",
            "/personal/getDynamicPoster"
          )
            .then(result => {
              this.maskImg = result;
              this.isPreviewImg = true;
              wx.hideLoading();
            })
            .catch(err => {
              uni.showToast({
                title: "生成分享图片失败",
                icon: "none"
              });
              wx.hideLoading();
            });
        })
        .catch(err => {
          uni.showToast({
            title: "生成分享图片失败",
            icon: "none"
          });
          wx.hideLoading();
        });
    },
    checkCollect() {
      //
      WXAJAX.checkCollect({
        itemType: 2,
        itemId: this.dynamicId
      })
        .then(data => {
          this.isCollect = data.status;
        })
        .catch(err => {});
    },
    goPage() {
      uni.navigateTo({
        url: `./webView?url=${this.webViewSrc}`
      });
    },
    //  删除
    choose_tap(id) {
      if (id === "cancel") {
        this.addTypeShow = false;
        return;
      }
      wx.showLoading();

      WXAJAX.POST(
        {
          dynamicId: this.dynamicId
        },
        "",
        "/company/delDynamicInfo"
      )
        .then(data => {
          wx.hideLoading();
          wx.showToast({
            title: "成功！",
            icon: "success"
          });
          setTimeout(function() {
            wx.navigateBack();
          }, 600);
        })
        .catch(err => {
          console.log(err);
          wx.hideLoading();
        });
    }
  }
};
</script>
<style>
page {
  background: #fff !important;
}
.dec {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30upx;
  padding-bottom: 40upx;
  border-bottom: 1upx solid #e8e8e8;
}
.left-dec {
  font-size: 24upx;
  color: #a8a8a8;
}

.right-dec {
  font-size: 24upx;
  color: rgba(86, 108, 132, 1);
}
.prod_choose_class {
  position: fixed;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  bottom: -100%;
  /* transition: all 0.2s linear; */
}
.more-btn {
  position: absolute;
  top: 12vh;
  left: 0;
  right: 0;
  text-align: center;
}
.more-btn button {
  width: 250upx;
  border: 1upx solid rgba(81, 203, 205, 1);
  border-radius: 10upx;
  color: rgba(81, 203, 205, 1);
  font-size: 28upx;
}
.show {
  bottom: 0;
  z-index: 1000;
}

.prod_choose_class .inner {
  border-radius: 10upx 10upx 0 0;
}
.share-box {
  display: flex;
  justify-content: center;
  margin-top: 20upx;
  margin-bottom: 30upx;
}
.share-img {
  width: 100upx;
  height: 100upx;
}
.share-title {
  font-size: 24upx;
  color: #a8a8a8;
  /* line-height:14upx; */
}
.share-ornament {
  background: #f5f5f6;
  height: 10upx;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.img-size {
  width: 600upx;
  height: 600upx;
  margin-top: 30upx;
  margin-bottom: 60upx;
}
</style>
