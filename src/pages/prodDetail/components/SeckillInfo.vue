<template>
  <div class="seckill">
    <div class="disflex jsbet bgfff pl15 pr15 pt15 pb15">
      <p class="over_2 fs14 c38 fbold flex1">{{proData.goodsName}}</p>
      <button
        style="padding-right: 0"
        class="w46 pl45 bgfff contentbox textr disflex align-cen textr"
        @click="showShare"
        open-type
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
    <!-- 规则 类型选择 -->
    <div class="pl15 pr15 type-specs flex-sb-c bgfff" @click="showSpecChooseModel">
      <div class="left">
        <span class="fs14 ca8">选择</span>
        <span class="fs14 c38 ml10">选择类型,规格</span>
      </div>
      <div style="width: 30rpx;height: 30rpx;">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right_row.png"
          alt
          style="width: 30rpx;height: 30rpx;"
        />
      </div>
      <!-- <LoginIntercept /> -->
    </div>
    <GoodsSpecChoose
      v-if="showSpecChoose"
      :isShow.sync="showSpecChoose"
      :leftBtnText="leftBtnText"
      :rightBtnText="rightBtnText"
      :fullBtnText="fullBtnText"
      :goodsImg="goodsImg"
      :goodsInfo="proData"
      :typeLists="proData.goodSpecModelList"
      @changeChoose="changeChoose"
      @clickButton="clickButton"
      @close="showSpecChoose=false"
    ></GoodsSpecChoose>
  </div>
</template>
<script>
import LoginIntercept from "@/components/LoginIntercept";
import GoodsSpecChoose from "./GoodsSpecChoose";
import WXAJAX from "@/utils/request";

export default {
  components: {
    LoginIntercept,
    GoodsSpecChoose
  },
  watch: {
    showSpecChoose(newVal) {
      if (!newVal) {
        //选择规格和类型的弹窗出现，如果用户是触发的当前的许多参团信息从而弹出的规格窗口，那么在关闭的时候，如果isJoinGroup为true的话，需要把isJoinGroup置为false，说明用户取消了参团
        this.currentSelectPro = null;
      }
    }
  },
  data() {
    let img = this.proData.goodPhoto
      ? this.proData.goodPhoto.split(",")[0]
      : "";
    return {
      goodsImg: img,
      showSpecChoose: false,
      leftBtnText: "",
      rightBtnText: "",
      fullBtnText: "",
      //用户购买类型 购物车和购买  类型分为car, buy
      buyType: "",
      //当前用户选择的产品
      currentSelectPro: null,
      //类型的文本描述
      specName: ""
    };
  },
  props: {
    proData: {
      required: true,
      type: Object
    },
    currentCompany: {
      default: () => {},
      type: Object
    },
    cardId: {
      required: true,
      type: String
    }
  },
  methods: {
    //选择类型和规格的浮窗
    changeChoose(data, type) {
      if (type === "spec") {
        this.currentSelectPro = data;
      } else if (type === "type") {
        this.specName = data.specName;
      }
      if (data && data.specId) {
        this.$emit("changeTypeId", data.specId);
      }
    },
    showSpecChooseModel(flag) {
      console.log("我要开团", flag);
      if (flag === "parent") {
        this.leftBtnText = "";
        this.rightBtnText = "";
        this.fullBtnText = "确定";
      } else {
        this.leftBtnText = "加入购物车";
        this.rightBtnText = "立即购买";
        this.fullBtnText = "";
      }
      this.showSpecChoose = true;
    },
    //选择类型，规格弹框的按钮触发
    clickButton(payload) {
      //先判断是否需要选择类型和规格,如果有需要 但是用户没选择,则先让用户选择了以后才能确定
      let flag = this.isNextValid(payload);
      if (!flag) {
        wx.showToast({
          title: "请先选择类型或者规格！",
          duration: 2000,
          icon: "none"
        });
        return;
      }
      switch (payload.type) {
        case "full":
          this.fullSubmit(payload);
          break;
        case "left":
          this.buyType = "car";
          this.car(payload);
          break;
        case "right":
          this.buyType = "buy";
          this.buy(payload);
          break;
      }
    },
    //加入购物车
    car(payload) {
      if (this.currentSelectPro && this.currentSelectPro.specId) {
        this.$emit("car", {
          num: payload.sum,
          specId: this.currentSelectPro.specId
        });
        setTimeout(() => {
          this.showSpecChoose = false;
        }, 1000);
      }
    },
    buy(payload) {
      //用户开团,产品的id在proData里面,参团自带产品id
      if (!payload.goodsId) {
        payload["goodsId"] = this.proData.goodsId;
      }
      this.submitOrder(payload);
    },
    //提交订单，
    submitOrder(payload) {
      this.currentSelectPro = JSON.parse(JSON.stringify(this.currentSelectPro));
      this.currentSelectPro.goodsName = this.proData.goodsName;
      this.currentSelectPro.num = payload.sum;
      this.currentSelectPro.photoUrl = this.goodsImg;
      this.currentSelectPro.cardId = this.cardId;

      this.currentSelectPro.specName = this.specName;
      this.currentSelectPro.price = (
        this.currentSelectPro.killPrice / 100
      ).toFixed(2);
      this.currentSelectPro.isKill = this.proData.isKill;
      this.currentSelectPro.killEndTime = this.proData.killEndTime;

      this.currentSelectPro.allPrice =
        this.currentSelectPro.price * this.currentSelectPro.num;
      let tmpObj = {
        companyId: this.currentCompany.companyId || "",
        companyName: this.currentCompany.companyName || "",
        orderState: 1,
        allNum: 1,
        orderPrice: this.currentSelectPro.price * this.currentSelectPro.num,
        shopcartModelList: [this.currentSelectPro]
      };
      wx.setStorageSync("orderInfo", [tmpObj]);
      wx.navigateTo({ url: "../orderConfirm/main" });
      //用户已经下单，清空当前用户选择的商品信息
      this.currentSelectPro = null;
      this.showSpecChoose = false;
    },
    //校验是否选择类型或者规格，未选择则不下单或者开团
    isNextValid(payload) {
      if (this.currentSelectPro && this.currentSelectPro.goodsId) {
        return true;
      }
      return false;
    },
    showShare() {
      this.$emit("showShare");
    },
    //确定下单
    fullSubmit(payload) {
      switch (this.buyType) {
        case "car":
          this.car(payload);
          break;
        case "buy":
          this.buy(payload);
          break;
      }
    },
    //选择了立即购买秒杀物品
    seckill(type) {
      this.buyType = type;
      this.showSpecChooseModel("parent");
    }
  }
};
</script>
<style scoped>
.type-specs {
  height: 88upx;
  border-top: 1upx solid #f5f5f6;
}
.title {
  border-bottom: 1upx solid #f5f5f6;
}
</style>
