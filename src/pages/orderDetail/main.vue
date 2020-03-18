<template>
  <div>
    <div class="bg_line_blue pl16 pr15 cfff disflex jsbet h99 borderbox pt30">
      <div>
        <p class="fs18 fbold">{{textInfo[orderState].title}}</p>
        <p class="fs12 pt7" v-if="cart_lists[0].orderState !== 4">{{cart_lists[0].deliveryTimes}}</p>
      </div>
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/orderDetail.png"
        alt
        class="w57 h79"
      />
    </div>

    <div class="mb10 order_detail_addr">
      <AddressItem :addr="default_addr" :noJump="true"></AddressItem>
    </div>

    <!--商品-->
    <div v-for="(cart_item,k) in cart_lists" :key="k">
      <OrderItem :orderData="cart_item" :orderIndex="k" :index1="k"></OrderItem>
    </div>
    <div class="disflex jsbet bbf5f6 pl16 pr17 c38 lh44 bgfff">
      <span class="fs16">订单金额</span>
      <span class="fs14 fbold">￥{{cart_lists[0].orderPrice/100}}</span>
    </div>
    <div class="disflex jsbet pl16 pr17 c38 lh44 bgfff" v-if="orderState != 1">
      <span class="fs16">实付款</span>
      <span class="fs16 corange fbold">￥{{cart_lists[0].payPrice / 100}}</span>
    </div>

    <!--订单信息-->
    <div class="bgfff lh44 fs16 c38 mb15 mt10">
      <p class="before_line fs18 pl21 fbold">订单信息</p>
      <div class="disflex jsbet pl15 pr16">
        <span>订单编号</span>
        <span class="ca8">{{cart_lists[0].ordersNo}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>下单时间</span>
        <span class="ca8">{{createTime}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>支付方式</span>
        <span class="ca8">{{cart_lists[0].payType == 1 ? '线上支付' : '其他支付'}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>配送方式</span>
        <span class="ca8">--</span>
      </div>

      <div class="pl15 pr16">
        <p>订单留言</p>
        <p class="fs14 ca8 lh18 pb3">{{cart_lists[0].remark || ''}}</p>
      </div>
      <div class="disflex row-reverse pt10 pb9 pr15" v-if="orderState == 2">
        <span class="textc be8 ca8 bradius20 w90 lh30 fs14" @click="dialog_show = !dialog_show">申请退款</span>
      </div>
    </div>

    <!--操作-->
    <div class="disflex row-reverse pt9 pb11 lh30 bgfff fs14">
      <!--待支付-->
      <span
        v-if="orderState == 1"
        @click="toPay(cart_lists[0].ordersId)"
        class="bgblue textc cfff bradius20 w110 mr15"
      >立即支付</span>
      <span
        v-if="orderState == 1"
        @click="changeOrder('cancel',cart_lists[0].ordersId)"
        class="textc be8 ca8 bradius20 w110 mr10"
      >撤销订单</span>

      <!--待发货-->
      <span
        v-if="orderState == 2"
        @click="changeOrder('deliverGood',cart_lists[0].ordersId)"
        class="textc be8 ca8 bradius20 w90 mr15"
      >提醒发货</span>
      <!--待收货-->
      <span
        v-if="orderState == 3 "
        @click="changeOrder('getGood',cart_lists[0].ordersId,4)"
        class="bgblue textc cfff bradius20 w110 mr15"
      >确认收货</span>
    </div>

    <!--退款提醒-->
    <!--dialog-->
    <div v-show="dialog_show">
      <DialogBox
        :dialog_title="'退款原因'"
        @btn_tap="btn_tap"
        :dialog_ph="'请输入退款原因'"
        :default="refund_reason"
        :left="'取消'"
        :right="'保存'"
      ></DialogBox>
    </div>
  </div>
</template>

<script>
import AddressItem from "@/components/addressItem"; //
import OrderItem from "@/components/orderItem"; // 订单项
import DialogBox from "@/components/dialogBox"; // 对话框
import WXAJAX from "../../utils/request";
import util from "../../utils/index";

export default {
  name: "",
  components: { AddressItem, OrderItem, DialogBox },
  data() {
    return {
      dialog_show: false,
      refund_reason: "", //退款原因
      cart_lists: [
        {
          orderPrice: 0,
          payPrice: 0
        }
      ],
      count_money: [],
      total_money: "8576",
      default_addr: {},
      orderIds: 0, //订单id
      orderState: 0, //订单状态
      isChooseAddr: false, //是否可以选择地址
      textInfo: {
        1: {
          title: "等待付款",
          subtext: "请在30′00内进行支付，超时后订单将自动取消"
        },
        2: {
          title: "等待发货",
          subtext: "麻烦耐心等待发货哦"
        },
        3: {
          title: "卖家已发货",
          subtext: "离收货还有9天19时自动确认"
        },
        4: {
          title: "已完成",
          subtext: "期待亲下次光临"
        },
        5: {
          title: "交易取消",
          subtext: "期待亲下次光临"
        },
        6: {
          title: "退款成功",
          subtext: "期待亲下次光临"
        }
      },
      createTime: ""
    };
  },
  onShow() {
    this.orderState = wx.getStorageSync("orderState") || 0;
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "订单详情"
    });
    let v = this;
    v.orderIds = this.$root.$mp.query.orderIds || 0;
    //获取订单详情
    v.inits();
  },
  methods: {
    getOrderAddr() {
      let v = this;
      WXAJAX.POST({}, "", "/personal/getAddress")
        .then(data => {
          wx.hideLoading();
          for (let i of data) {
            if (i.isdefault == 1) {
              v.default_addr = {
                name: i.receiveName,
                tel: i.receivePhone,
                address: i.locationAddress + i.detailedAddress,
                addressId: i.addressId
              };
              break;
            }
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    inits() {
      wx.showLoading();
      WXAJAX.POST({ ordersIds: this.orderIds }, "", "/orders/getPayOrderInfo")
        .then(data => {
          if (data) {
            data.forEach((i, k) => {
              this.default_addr = {
                name: i.receiveName,
                tel: i.receivePhone,
                address: i.locationAddress + i.detailedAddress,
                addressId: i.addressId
              };
              if (i.ordersModelList) {
                i.ordersModelList.forEach((i2, k2) => {
                  i2.price /= 100;
                });
                i.shopcartModelList = i.ordersModelList;
                this.$set(this.cart_lists, k, i);
              }
            });
            this.createTime = util.getdate(
              this.cart_lists[0].createTime,
              "dateTime"
            );
          } else {
            this.cart_lists = [];
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
          this.cart_lists = [];
        });
    },
    toPay(orderId) {
      //订单支付
      WXAJAX.ToPay(
        {
          ordersId: orderId
        },
        "/orders/goTwoPay"
      )
        .then(data => {
          this.inits();
        })
        .catch(err => {});
    },
    btn_tap(method, text) {
      //退款点击
      if (method == "cancel") {
        this.dialog_show = false;
      } else if (method == "save") {
        if (!text) {
          wx.showToast({
            title: "请输入退款原因！",
            icon: "none"
          });
          this.dialog_show = false;
          return;
        }

        wx.showLoading();
        let v = this;
        WXAJAX.POST(
          {
            ordersId: v.orderIds,
            refundRemark: text
          },
          "",
          "/orders/refundOrder"
        )
          .then(data => {
            wx.hideLoading();
            v.dialog_show = false;
            if (data) {
              wx.showToast({
                title: "申请成功！",
                icon: "success"
              });
              setTimeout(function() {
                wx.navigateBack();
              }, 500);
            }
          })
          .catch(err => {
            wx.hideLoading();
            v.dialog_show = false;
            console.log(err);
          });
      }
    },
    changeOrder(type, orderId, status) {
      //订单操作
      let _url = "",
        params = {};
      switch (type) {
        case "cancel": //撤销订单
          _url = "/orders/backRefundState";
          params = {
            ordersId: orderId
          };
          break;
        case "payNow": //立即支付
          wx.navigateTo({ url: "../orderConfirm/main?orderId=" + orderId });
          return;
        case "deliverGood": //提醒发货
          _url = "/orders/doReminder";
          params = {
            ordersId: orderId
          };
          break;
        case "getGood": //确认收货
          _url = "/orders/updateOrderState";
          params = {
            ordersId: orderId,
            orderState: status
          };
          break;
        case "cancelRefund": //   撤销退款
          _url = "/orders/backRefundState";
          params = {
            ordersId: orderId
          };
          break;
        case "oneMoreOrder": //再来一单
          _url = "/orders/anotherOrder";
          params = {
            ordersIds: orderId
          };
          break;
      }
      wx.showLoading();
      let v = this;
      WXAJAX.POST(params, "", _url)
        .then(data => {
          wx.hideLoading();
          if (data) {
            let title = "操作成功！";
            if (type == "deliverGood") {
              title = "提醒发货成功";
            } else if (type == "cancelRefund") {
              title = "撤销成功";
            }
            wx.showToast({
              title: title,
              icon: "success",
              duration: 1000
            });

            setTimeout(function() {
              if (type == "cancel" || type == "oneMoreOrder") {
                wx.navigateBack();
              } else {
                v.inits();
              }
            }, 800);
          }
        })
        .catch(err => {
          wx.hideLoading();
          console.log(err);
        });
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
</style>
