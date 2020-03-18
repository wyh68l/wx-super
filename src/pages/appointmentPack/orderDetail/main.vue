<template>
  <div>
    <div class="bg_line_blue pl16 pr15 cfff disflex jsbet h99 borderbox pt30">
      <div>
        <p class="fs18 fbold" v-if="orderState">{{textInfo[orderState].title}}</p>
        <p class="fs12 pt7" v-if="orderInfo.applyRemark">{{orderInfo.applyRemark}}</p>
      </div>
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/orderDetail.png"
        alt
        class="w57 h79"
        style="flex: 0 0 114upx;"
      />
    </div>

    <!--商品-->
    <div class="bgfff mt10">
      <div class="company disflex jsbet pl15 lh44 posre pr21" @click="toAppointMentPage">
        <div class="disflex align-cen h44">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/company_name.png"
            alt
            class="w16 h16 mr8"
          />
          <span class="fs14 pr11">{{orderInfo.companyName}}</span>
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
            alt
            class="w10 h10"
          />
        </div>
        <span v-if="orderInfo.state==1" class="corange fs14">等待商户接单</span>
      </div>
      <ProductCard
        :title="orderInfo.productsName"
        :desc="orderInfo.describe"
        :price="orderInfo.price"
        :typeName="orderInfo.productsTypeName"
        :imgUrl="orderInfo.photo"
        outStyle="margin-top:0"
      />
    </div>

    <!--订单信息-->
    <div class="bgfff lh44 fs16 c38 mb15 mt10">
      <p class="before_line fs18 pl21 fbold">订单信息</p>
      <div class="disflex jsbet pl15 pr16">
        <span>预约人</span>
        <span class="ca8">{{orderInfo.name}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>联系电话</span>
        <span class="ca8">{{orderInfo.phone}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>下单时间</span>
        <span class="ca8">{{orderInfo.createTime}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>预约时间</span>
        <span class="ca8">{{orderInfo.appointmentTime}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16" v-if="orderInfo.state == 3 || orderInfo.state == 4">
        <span>{{ orderInfo.state == 3 ? '完成时间' : '取消时间' }}</span>
        <span
          class="ca8"
        >{{orderInfo.state == 3 ? orderInfo.completionTime : orderInfo.cancellationTime}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>服务类型</span>
        <span class="ca8">{{orderInfo.typeName}}</span>
      </div>

      <div class="pl15 pr16" v-if="orderInfo.remark">
        <p>备注</p>
        <p class="fs14 ca8 lh18 pb10">{{orderInfo.remark}}</p>
      </div>
    </div>

    <!--操作-->
    <div
      class="disflex row-reverse pt9 pb11 lh30 bgfff fs14 pr6 footer-btns bte8"
      v-if="orderInfo.state == 1 || orderInfo.state == 2"
    >
      <span
        class="disinblock bgblue textc cfff bradius20 w90 mr10"
        @click="showTips(orderInfo, 'use')"
        v-if="orderInfo.state == 2"
      >确认使用</span>
      <span
        class="disinblock textc be8 ca8 bradius20 w90 mr10"
        @click="showTips(orderInfo, 'cancel')"
      >取消预约</span>
    </div>

    <!--退款提醒-->
    <!--dialog-->
    <div v-show="isShowCancelOrderBox">
      <DialogBox
        :dialog_title="'提示'"
        @btn_tap="dialogTap"
        :dialog_ph="tipsTitle"
        :type="dialogType"
        :left="'取消'"
        :right="'确定'"
      ></DialogBox>
    </div>
  </div>
</template>

<script>
import AddressItem from "@/components/addressItem"; //
import ProductCard from "@/components/ProductCard";
import DialogBox from "@/components/dialogBox"; // 对话框
import WXAJAX from "@/utils/request";
import util from "@/utils/index";

export default {
  name: "",
  components: { AddressItem, ProductCard, DialogBox },
  data() {
    return {
      isShowCancelOrderBox: false,
      dialogType: "",
      tipsTitle: "",
      currentOperationType: {},
      currentOrder: {},
      orderInfo: {},
      count_money: [],
      orderIds: 0, //订单id
      orderState: 0, //订单状态
      textInfo: {
        1: {
          title: "等待商户确认"
        },
        2: {
          title: "服务未使用"
        },
        3: {
          title: "服务已使用"
        },
        4: {
          title: "服务已取消"
        },
        5: {
          title: "服务已过期"
        }
      },
      createTime: ""
    };
  },
  onShow() {},
  mounted() {
    wx.setNavigationBarTitle({
      title: "订单详情"
    });
    let v = this;

    v.orderIds = this.$root.$mp.query.orderIds || 0;
    //获取订单详情
    v.inits();
  },
  async onPullDownRefresh() {
    await this.inits();
    wx.stopPullDownRefresh();
  },
  methods: {
    inits() {
      let v = this;

      wx.showLoading();

      return WXAJAX.POST(
        {
          appointmentId: v.orderIds
        },
        "",
        "/products/getAppointmentInfo"
      )
        .then(data => {
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
            data.price = price.toFixed(2);
          } else {
            data.price = price.map(val => parseInt(val)).join("~");
          }

          data.appointmentTime = `${this.formatDate(
            "yyyy-MM-dd hh:mm",
            data.startTime
          )} - ${this.formatDate("hh:mm", data.endTime)}`;
          data.typeName = data.serviceType == "1" ? "到店" : "上门";
          data.createTime = this.formatDate(
            "yyyy-MM-dd hh:mm",
            data.createTime
          );
          data.cancellationTime = this.formatDate(
            "yyyy-MM-dd hh:mm",
            data.cancellationTime
          );
          data.completionTime = this.formatDate(
            "yyyy-MM-dd hh:mm",
            data.completionTime
          );

          this.orderInfo = data;
          this.orderState = data.state;
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
          v.cart_lists = [];
          console.log(err);
        });
    },
    showTips(orderInfo, type) {
      if (type === "cancel") {
        this.tipsTitle = "请输入取消原因";
        this.dialogType = "input_1";
      } else {
        this.tipsTitle = "是否确认使用？";
        this.dialogType = "hint2";
      }

      this.currentOperationType = type;
      this.currentOrder = orderInfo;
      this.isShowCancelOrderBox = true;
    },
    dialogTap(method, remark) {
      if (method === "cancel") {
        this.isShowCancelOrderBox = false;
      } else {
        this.changeOrder(this.currentOperationType, remark);
      }
    },
    changeOrder(type, remark = "") {
      //订单操作
      let _url = "/products/updAppointmentState";
      let params = {
        appointmentId: this.currentOrder.appointmentId
      };
      switch (type) {
        case "cancel": // 取消订单
          params.state = 4;
          params.applyRemark = remark;
          break;
        case "use": // 确认订单
          params.state = 3;
          break;
      }
      wx.showLoading({ mask: true });

      WXAJAX.POST(params, "", _url)
        .then(data => {
          this.isShowCancelOrderBox = false;
          wx.hideLoading();
          wx.showToast({
            title: "操作成功！",
            icon: "success",
            duration: 1000
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1 * 1000);
        })
        .catch(err => {
          wx.hideLoading();
          console.log(err);
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: "none"
          });
        });
    },
    toAppointMentPage() {
      wx.setStorageSync("COMPANYID", this.orderInfo.companyId);
      wx.setStorageSync("CARDID", this.orderInfo.companyUserId);

      wx.switchTab({ url: `/pages/appointment/main` });
    }
  }
};
</script>

<style>
.before_line {
  position: relative;
}
.before_line::before {
  content: "";
  position: absolute;
  width: 8upx;
  height: 40upx;
  background: #34cbc1;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.order_detail_addr > div {
  padding-left: 32upx;
}

.footer-btns {
  position: sticky;
  bottom: 0;
}
</style>
