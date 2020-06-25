<template>
  <div class="pb50">
    <SelfSwiper :imgUrls="images" :self_class="'h375'" @swipclick="preview"></SelfSwiper>

    <div class="bgfff pl16 pr15 pb15 mb10">
      <p class="lh45">
        <span class="corange fs20 mr10">¥{{goodsPrice || goodsMsg.price}}</span>
        <!--<span class="fs12 ca8 line-through">¥199.9</span>-->
      </p>
      <div class="disflex jsbet">
        <p class="over_2 fs14 c38 fbold flex1">{{goodsMsg.name}}</p>
        <!--        <button class='w46 pl45 bgfff contentbox textr disflex align-cen textr ' @click="showShare" open-type="" hover-class="other-button-hover">-->
        <!--          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/share.png" alt="" class="w15 h15 mr7">-->
        <!--          <b class="fs12 ca8">分享</b>-->
        <!--        </button>-->
        <button
          style="padding-right: 0"
          class="w46 pl45 bgfff contentbox textr disflex align-cen textr"
          open-type="share"
          hover-class="other-button-hover"
        >
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/share2.png"
            alt
            class="w15 h15 mr7"
          />
          <b class="fs12 ca8">分享</b>
        </button>
      </div>

      <div class="fs12 ca8">{{goodsMsg.describe}}</div>
    </div>

    <!-- 宝贝详情 -->
    <div>
      <p class="lh43 textc fs14 ca8">- 宝贝详情 -</p>
      <div class="bgfff" v-html="goodsMsg.goodsDetails"></div>
    </div>

    <!--<p class="lh43 textc fs12 ca8">- 汉全科技集团出品 -</p>-->
      <Bottom></Bottom>

    <!--bottom-->

    <!--右边悬浮框-->
    <div class="index_float_right trans2 overhidden">
      <RightFloat
        :isShow="isShow"
        @clickRightRowEvent="clickRightRowEvent"
        :bottom="60"
        :intoType="1"
        :specId="typeId"
      ></RightFloat>
      <div
        :class="{fadeInRight: !isShow, fadeOutRight: isShow}"
        style="border-top-left-radius: 10rpx;border-bottom-left-radius: 10rpx;width: 40rpx;right: 0; bottom: 60px;"
        class="animated posfix fs10 ca8 textc floats trans2 shadow_gray bgfff pb15"
      >
        <div class="pt16" @click="clickRightRowEvent">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right_row.png"
            alt
            style="width: 30rpx;transform: rotate(180deg);height: 30rpx;"
          />
        </div>
      </div>
    </div>

    <!--购买-->
    <div class="disflex fix_bottom bte8" v-if=" goodsMsg.name">
      <div class="disflex flex1 bgfff textc">
        <div class="w50p pt7" @click="toProductList">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/prod_select.png"
            alt
            class="w20 h20"
          />
          <b class="cblue fs12 textc mt-4">预约</b>
        </div>
        <div class="w50p pt7" @click="makePhone">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel_gray.png"
            alt
            class="w20 h20"
          />
          <b class="ca8 fs12 textc mt-4">通话</b>
        </div>
      </div>

      <div
        class="w250 bg_line_orange fbold textc fs18 cfff lh49 disflex align-cen jscen"
        @click="toAppointment"
      >
        <span>立即预约</span>
      </div>
    </div>
  </div>
</template>

<script>
import SelfSwiper from "@/components/swiper"; //
import RightFloat from "@/components/rightFloat"; // 订单项
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import { mapGetters } from "vuex";
import { addShareRecord } from "@/utils/behavior";
import Bottom from "@/components/Bottom";
import store from "../../../store/index";

export default {
  name: "",
  components: { SelfSwiper, RightFloat,Bottom},
  data() {
    return {
      canbuy: true, //是否可以支付
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      img:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/food.jpg",
      images: [],
      typeId: 0,
      goodsPrice: "",
      goodId: 0,
      goodsMsg: {
        goodsDetails: "",
        name: "",
        price: ""
      },
      cardTel: "",
      type_id_1: 0, //
      type_index_1: 0,
      right_float_show: false, //右边悬浮框
      cardId: 0,
      isShow: true
    };
  },
  mounted() {
    // 重置页面部分显示数据
    this.images = [];
    this.goodsMsg = {
      goodsDetails: "",
      name: "",
      price: ""
    };
    let query = this.$root.$mp.query;
    console.log(query);
    if (query.cardId) {
      //从分享的商品页面进入
      this.cardId = query.cardId;
      this.goodId = query.goodId;
      this.cardTel = query.tel;
    } else {
      this.cardTel = wx.getStorageSync("CARDTEL") || "";
      this.goodId = this.$root.$mp.query.goodId || 0;
      this.cardId = wx.getStorageSync("CARDID") || 0;
    }
    this.getProdDetail();
  },
  async onPullDownRefresh() {
    this.getProdDetail();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1 * 1000);
  },
  onPageScroll() {
    this.right_float_show = false;
  },
  onShareAppMessage(e) {
    let url = this.goodsMsg.sharePhoto || "";
    // let shareId = await addShareRecord(this.currentCompany.companyId, 3, this.goodId);
    let uuid = this.cardId + "" + new Date().getTime();
    addShareRecord(this.currentCompany.companyId, 3, this.goodId, uuid).then(
      res => {},
      err => {}
    );
    return {
      title: this.goodsMsg.name,
      path:
        "/pages/appointmentPack/productDetail/main?goodId=" +
        this.goodId +
        "&cardId=" +
        this.cardId +
        "&tel=" +
        this.cardTel +
        "&companyId=" +
        this.currentCompany.companyId +
        "&goType=1&shareId=" +
        uuid,
      imageUrl: url
    };
  },
  methods: {
    getProdDetail(refresh) {
      let v = this;
      const { parentId, specId } = this.$root.$mp.query;
      WXAJAX.POST(
        {
          productsId: v.goodId,
          cardId: this.cardId,
          refresh: refresh || ""
        },
        "",
        "/products/getProductsInfo/V2"
      )
        .then(data => {
          if (data) {
            v.goodsMsg = {
              goodsDetails: data.productsDetails,
              name: data.productsName,
              price: data.price,
              describe: data.describe,
              sharePhoto: data.sharePhoto
            };

            let price;

            try {
              price = JSON.parse(data.price);
            } catch (e) {
              price = parseInt(data.price) || 0;
            }

            if (
              Object.prototype.toString.call(price).toLowerCase() ===
              "[object number]"
            ) {
              v.goodsMsg.price = price.toFixed(2);
            } else {
              v.goodsMsg.price = price.map(val => parseInt(val)).join("~");
            }

            v.images = data.productsPhoto
              ? data.productsPhoto.split(",").map(val => {
                  return this.checkImgNameIsNumber(val)
                    ? val
                    : val + ".primary.png";
                })
              : [];
          }
        })
        .catch(err => {
          v.goodsMsg = {};
          v.images = [];
        });
    },
      //预览图片
      preview(idx) {
          this.previewImages(this.images, this.images[idx]);
      },
    clickRightRowEvent() {
      this.isShow = !this.isShow;
    },
    toProductList() {
        store.commit('setCurrentTab',4);
      wx.switchTab({ url: "/pages/appointment/main" });
    },
    toAppointment() {
      wx.navigateTo({
        url: `/pages/appointmentPack/addAppointment/main?productsId=${this.goodId}`
      });
    },
    makePhone() {
      //拨打电话
      util.MakePhone(this.cardTel || "");
    }
  },
  computed: {
    ...mapGetters(["currentCompany"])
  }
};
</script>

<style>
page {
  width: 100%;
  height: 100%;
  background: #f5f5f6;
}

.size_item.active {
  color: #00a0e9;
  background: #e5f8f7;
  border: 1upx solid #00a0e9;
}
.add_to_card {
  border-radius: 40upx 0 0 40upx;
}
.buy_now {
  border-radius: 0 40upx 40upx 0;
}
.prod_detail_float > div {
  bottom: 200upx;
}
.number-change-btn-group > span:first-child {
  line-height: 46upx;
  border-radius: 10upx 0 0 10upx;
}
.number-change-btn-group > span:last-child {
  line-height: 46upx;
  border-radius: 0 10upx 10upx 0;
}
</style>





























