<template>
  <div class="assemble-info">
    <AssembleInfoBox
      :proData="proData.goodsAssembleModel"
      :price="proData.assemblePrice"
      :dealNum="proData.dealNum"
      :endTime="proData.assembleEndTime"
    ></AssembleInfoBox>
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
      <div class @click="clickRightRowEvent">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right_row.png"
          alt
          style="width: 30rpx;height: 30rpx;"
        />
      </div>
    </div>
    <!-- 更多拼团 -->
    <div
      class="more-collage mt11"
      v-if="proData.assembleModelList && proData.assembleModelList.length>0"
    >
      <div class="title flex-sb-c bgfff pl15 pr15 pt14 pb15">
        <div class="left fs16 c38 fbold">ta们正在拼...</div>
        <div class="right" @click="showOrderList">
          <span class="fs16 ca8">查看更多</span>
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right_row.png"
            alt
            style="width: 30rpx;height: 30rpx;"
          />
        </div>
      </div>
      <AssembleOrderItem @join="joinGroup" :orderInfo="proData.assembleModelList[0]"></AssembleOrderItem>
      <AssembleOrderItem
        @join="joinGroup"
        v-if="proData.assembleModelList[1]"
        :orderInfo="proData.assembleModelList[1]"
      ></AssembleOrderItem>
    </div>
    <AssemblePlay />
    <GoodsSpecChoose
      v-if="showSpecChoose"
      :isShow.sync="showSpecChoose"
      :leftBtnText="leftBtnText"
      :rightBtnText="rightBtnText"
      :fullBtnText="fullBtnText"
      :goodsImg="goodsImg"
      :goodsInfo="proData"
      :typeLists="proData.goodSpecModelList"
      :buyType="buyType"
      @changeChoose="changeChoose"
      @clickButton="clickButton"
      @close="showSpecChoose=false"
    ></GoodsSpecChoose>
    <AssembleOrderListBox
      @join="joinGroup"
      :lists="proData.assembleModelList"
      :isShow="isShowOrderList"
      @close="closeOrderList"
    ></AssembleOrderListBox>
  </div>
</template>
<script>
import AssembleInfoBox from "./AssembleInfoBox";
import AssembleOrderItem from "./AssembleOrderItem";
import GoodsSpecChoose from "./GoodsSpecChoose";
import AssemblePlay from "./AssemblePlay";
import AssembleOrderListBox from "./AssembleOrderListBox";
import WXAJAX from "@/utils/request";

export default {
  components: {
    AssembleInfoBox,
    AssembleOrderItem,
    AssemblePlay,
    AssembleOrderListBox,
    GoodsSpecChoose
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
    },
    isJoin: {
      required: true,
      type: Boolean
    },
    groupAssembleId: {
      type: Number
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
      //用户购买类型 单独购买和一键开团购买  类型分为alone, group, 参与拼团页面过来的话,类型为join
      buyType: "",
      //当前用户选择的产品
      currentSelectPro: null,
      //类型的文本描述
      specName: "",
      //更多拼团信息的数据
      isShowOrderList: false,
      //是开团还是参团的变量定义 false是开团, true是参团
      isJoinGroup: false,
      //拼团的拼团id
      assembleId: ""
    };
  },
  mounted() {},
  watch: {
    showSpecChoose(newVal) {
      if (!newVal) {
        //选择规格和类型的弹窗出现，如果用户是触发的当前的许多参团信息从而弹出的规格窗口，那么在关闭的时候，如果isJoinGroup为true的话，需要把isJoinGroup置为false，说明用户取消了参团
        if (this.isJoinGroup) {
          this.isJoinGroup = false;
        }
        this.currentSelectPro = null;
      }
    }
  },
  methods: {
    //参团
    joinGroup(info) {
      this.assembleId = info.assembleId;
      // this.group();
      this.isJoinGroup = true;
      this.buyType = "group";
      this.leftBtnText = "";
      this.rightBtnText = "";
      this.fullBtnText = "确定";
      this.showSpecChoose = true;
      this.isShowOrderList = false;
      console.log();
    },
    //关闭拼团list弹窗
    closeOrderList() {
      this.isShowOrderList = false;
    },
    showShare() {
      this.$emit("showShare");
    },
    //显示更多拼团信息
    showOrderList() {
      this.isShowOrderList = true;
    },
    clickRightRowEvent() {},
    //弹出选择类型，规格
    showSpecChooseModel(flag) {
      console.log("我要开团", flag);
      if (flag === "parent" || (this.isJoin && !this.isJoinGroup)) {
        this.leftBtnText = "";
        this.rightBtnText = "";
        this.fullBtnText = "确定";
        this.isJoinGroup = false;
      } else {
        this.leftBtnText = "单独购买";
        this.rightBtnText = "一键开团";
        this.fullBtnText = "";
      }
      this.showSpecChoose = true;
    },
    //选择类型，规格弹框的按钮触发
    clickButton(payload) {
      console.log("payload", payload);
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
          this.buyType = "alone";
          this.alone(payload);
          break;
        case "right":
          this.buyType = "group";
          this.group(payload);
          break;
      }
    },
    //校验是否选择类型或者规格，未选择则不下单或者开团
    isNextValid(payload) {
      if (this.currentSelectPro && this.currentSelectPro.goodsId) {
        return true;
      }
      return false;
    },
    //单独购买
    alone(payload) {
      console.log("alone", payload);
      this.submitOrder(payload);
    },
    //一键开团
    group(payload) {
      console.log("开团........");
      //用户开团,产品的id在proData里面,参团自带产品id
      if (!payload.goodsId) {
        payload["goodsId"] = this.proData.goodsId;
      }
      //拼团, 需要拼团的id
      if (this.isJoinGroup) {
        console.log("是参团，商品详情的参团");
        payload["assembleId"] = this.assembleId;
      }
      //如果用户是参团，不是当前页面的许多小型参团，那么拼团id应该是拼团详情那个页面过来的拼团id
      if (this.isJoin && !this.isJoinGroup) {
        console.log("用户参与了拼团详情过来的拼团");
        payload["assembleId"] = this.groupAssembleId;
      }
      wx.showLoading();
      WXAJAX.POST(
        { goodsId: payload.goodsId, assembleId: payload.assembleId || "" },
        "",
        "/orders/openOrJoinAssemble"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            payload["assembleId"] = data;
            this.submitOrder(payload);
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    //确定下单 至于是购买 还是开团 看用户选择
    fullSubmit(payload) {
      switch (this.buyType) {
        case "alone":
          this.alone(payload);
          break;
        case "join":
        case "":
        case "group":
          this.group(payload);
          break;
      }
    },
    //提交订单，
    submitOrder(payload) {
      this.currentSelectPro = JSON.parse(JSON.stringify(this.currentSelectPro));
        this.currentSelectPro.killId = this.proData.killId;
      this.currentSelectPro.goodsName = this.proData.goodsName;
      this.currentSelectPro.num = payload.sum;
      this.currentSelectPro.photoUrl = this.goodsImg;
      this.currentSelectPro.cardId = this.cardId;
      this.currentSelectPro["assembleId"] = payload.assembleId || "";

      this.currentSelectPro.specName = this.specName;
      let price =
        this.buyType === "alone"
          ? (this.currentSelectPro.price / 100).toFixed(2)
          : (this.currentSelectPro.assemblePrice / 100).toFixed(2);
      this.currentSelectPro.price = price;
      this.currentSelectPro.allPrice =
        this.currentSelectPro.price * this.currentSelectPro.num;
      let tmpObj = {
        companyId: this.currentCompany ? this.currentCompany.companyId : "",
        companyName: this.currentCompany ? this.currentCompany.companyName : "",
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
    //选择类型和规格的浮窗
    changeChoose(data, type) {
      if (type === "spec") {
        this.currentSelectPro = data;
        console.log("spec", data);
      } else if (type === "type") {
        this.specName = data.specName;
      }
      if (data && data.specId) {
        this.$emit("changeTypeId", data.specId);
      }
    },
    //父类调用的方法
    buyCollage(type) {
      this.buyType = type;
      this.showSpecChooseModel("parent");
      // this.leftBtnText="";
      // this.rightBtnText="";
      // this.fullBtnText = "确定";
      // this.isJoinGroup = false;
      // this.showSpecChoose=true;
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
