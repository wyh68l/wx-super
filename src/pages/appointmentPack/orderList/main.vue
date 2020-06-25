<template>
  <div>
    <div class="disflex jsaround pl16 pr16 lh49 ca8 fs16 ordertype bgfff">
      <span
        v-for="item in menus"
        :key="item.id"
        :class="order_type == item.id ? 'active' : '' "
        @click="order_type_tap(item.id)"
      >{{item.label}}</span>
    </div>

    <!--订单-->
    <div class="pl15 pr15">
      <template v-if="cart_lists.length">
        <OrderItem
          v-for="(cart_item,k) in cart_lists"
          :key="k"
          :orderInfo="cart_item"
          @showOrder="showDetail(cart_item)"
          @toPage="toAppointMentPage(cart_item)"
          @confirmUse="showTips(cart_item, 'use')"
          @cancelOrder="showTips(cart_item, 'cancel')"
        ></OrderItem>
        <!--bottom-->
        <!--<div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>-->
          <Bottom v-if="nodata"></Bottom>
      </template>
      <div v-else>
        <NoData>暂无订单</NoData>
      </div>
    </div>
    <div
      class="textc disflex w60 h60 bradius50p bgblue disinblock goToUserCenter"
      @click="page_turn('usercenter')"
    >
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_add.png"
        alt
        class="w30 h30 mt15"
      />
    </div>

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
import WXAJAX from "@/utils/request";
import DialogBox from "@/components/dialogBox"; // 对话框
import OrderItem from "./components/OrderItem";
import NoData from "@/components/noData";
import Bottom from "@/components/Bottom";
import store from "../../../store/index";

export default {
  name: "",
  components: { NoData, DialogBox, OrderItem,Bottom},
  data() {
    return {
      menus: [
        { id: 6, label: "未使用" },
        { id: 7, label: "已完成" }
      ],
      order_type: 6,
      cart_lists: [],
      page: 1,
      isLoading: false, //是否在加载
      nodata: true, //是否已经没有数据
      isShowCancelOrderBox: false,
      currentOrder: {},
      tipsTitle: "",
      dialogType: "hint2", // 弹框类型
      currentOperationType: ""
    };
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "我的预约"
    });
    this.order_type = this.$root.$mp.query.status || 6;
    this.page = 1;
    this.cart_lists = [];
    this.inits();
  },
  async onPullDownRefresh() {
    this.page = 1;
    this.cart_lists = [];

    await this.inits();
    wx.stopPullDownRefresh();
  },
  methods: {
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
    showDetail(info) {
      wx.navigateTo({
        url: `/pages/appointmentPack/orderDetail/main?orderIds=${info.appointmentId}`
      });
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
      let v = this;
      WXAJAX.POST(params, "", _url)
        .then(data => {
          this.isShowCancelOrderBox = false;
          wx.hideLoading();
          if (data) {
            wx.showToast({
              title: "操作成功！",
              icon: "success",
              duration: 1000
            });

            setTimeout(function() {
              v.reset();
              v.inits();
            }, 800);
          }
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
    page_turn(url) {
      wx.navigateTo({ url: "/pages/" + url + "/main" });
    },
    toAppointMentPage(orderInfo) {
      wx.setStorageSync("COMPANYID", orderInfo.companyId);
      wx.setStorageSync("CARDID", orderInfo.companyUserId);
        store.commit('setCurrentTab',4);
      wx.switchTab({ url: `/pages/appointment/main` });
    },
    inits() {
      //获取订单
      let v = this;
      if (v.isLoading) return;

      v.isLoading = true;
      wx.showLoading();

      return WXAJAX.POST(
        {
          state: v.order_type,
          pageNum: v.page
        },
        "",
        "/products/selectAppointmentPage"
      )
        .then(data => {
          if (data) {
            let _datas = [];
            data.pageInfo.list.forEach(i => {
              let price;

              try {
                price = JSON.parse(i.price);
              } catch (e) {
                price = parseInt(i.price) || 0;
              }

              if (
                Object.prototype.toString.call(price).toLowerCase() ===
                "[object number]"
              ) {
                i.price = price.toFixed(2);
              } else {
                i.price = price.map(val => parseInt(val)).join("~");
              }

              i.appointmentTime = `${this.formatDate(
                "yyyy-MM-dd hh:mm",
                i.startTime
              )} - ${this.formatDate("hh:mm", i.endTime)}`;
              _datas.push(i);
            });
            v.cart_lists = [...v.cart_lists, ..._datas];
            v.page++;
            setTimeout(function() {
              v.isLoading = false;
            }, 500);
          } else {
            setTimeout(function() {
              v.nodata = true;
              v.isLoading = false;
            }, 500);
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
          if (err.code == 204) {
            v.nodata = true;
          }
          setTimeout(function() {
            v.isLoading = false;
          }, 500);
        });
    },
    order_type_tap(type_id) {
      //选择订单类型
      this.order_type = type_id;
      this.reset();
      this.inits();
    },
    reset() {
      this.page = 1;
      this.nodata = false;
      this.isLoading = false;
      this.cart_lists = [];
    }
  },
  onReachBottom() {
    let v = this;
    v.inits();
  }
};
</script>

<style>
.ordertype .active {
  color: #00a0e9;
  border-bottom: 6upx solid #00a0e9;
}
.goToUserCenter {
  position: fixed;
  right: 20upx;
  bottom: 90upx;
  z-index: 99;
  box-sizing: border-box;
  text-align: center;
}
</style>








































