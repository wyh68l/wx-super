<template>
  <div>
    <!--menu-->
    <div class="disflex jsbet pl16 pr16 lh49 ca8 fs16 ordertype bgfff">
      <span :class="order_type == 1 ? 'active' : '' " @click="order_type_tap(1)">待付款</span>
      <span :class="order_type == 2 ? 'active' : '' " @click="order_type_tap(2)">待发货</span>
      <span :class="order_type == 3 ? 'active' : '' " @click="order_type_tap(3)">待收货</span>
      <span :class="order_type == 4 ? 'active' : '' " @click="order_type_tap(4)">已完成</span>
      <span :class="order_type == 5 ? 'active' : '' " @click="order_type_tap(5)">退款/售后</span>
    </div>

    <!--订单-->
    <div class="pl15 pr15">
      <template v-if="cart_lists.length">
        <div class="mt11 bradius10 overhidden" v-for="(cart_item,k) in cart_lists" :key="k">
          <OrderItem
            :orderData="cart_item"
            :orderIndex="k"
            :index1="k"
            :isOrder="true"
            :order_type="cart_item.refundState == 2?7:order_type"
            v-if="cart_item.shopcartModelList.length===1"
            @order_tap="order_tap"
          ></OrderItem>
          <OrderItemRow
            :orderData="cart_item"
            :order_type="refundState == 2?7:order_type"
            @order_tap="order_tap"
            v-else
          ></OrderItemRow>

          <div class="textr lh44 bgfff pr20" v-if="order_type == 1">
            <span class="fs14 c333">共{{cart_item.allNum}}件商品 待付款:</span>
            <span class="fs18 c333 pl10 fbold">¥{{cart_item.orderPrice}}</span>
          </div>
          <div class="textr lh44 bgfff pr20" v-else>
            <span class="fs14 c333">共{{cart_item.allNum}}件商品 实付款:</span>
            <span class="fs18 c333 pl10 fbold">¥{{cart_item.payPrice}}</span>
          </div>
          <!--退款-->
          <div class="lh44 pl20 bgfff fs14 c38 disflex align-cen" v-if="cart_item.refundState == 2">
            <img
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/refund.png"
              alt
              class="w16 h16 mr7"
            />
            退款原因：{{cart_item.refundRemark}}
          </div>

          <div class="textr lh30 pt10 pb10 fs14 bgfff pr21">
            <form report-submit @submit="submitOrder">
              <input hidden name="deliverGood" :value="cart_item.ordersId" />
              <span
                v-if="order_type == 1"
                class="disinblock textc be8 ca8 bradius20 w90 mr10"
                @click="showTips(cart_item, 1)"
              >撤销订单</span>
              <span
                v-if="order_type == 1"
                class="disinblock bgblue textc cfff bradius20 w90"
                @click="toPay(cart_item.ordersId)"
              >立即支付</span>
              <label
                class="disinblock textc be8 ca8 bradius20 w90"
                v-if="cart_item.assembleId? (cart_item.assembleSuccess && order_type == 2): order_type == 2"
              >
                提醒发货
                <button form-type="submit" style="display: none"></button>
              </label>
              <span
                v-if="order_type == 3"
                class="disinblock bgblue textc cfff bradius20 w90"
                @click="showTips(cart_item,4)"
              >确认收货</span>
              <span
                v-if="order_type == 4"
                class="disinblock textc cblue bradius20 w90 bblue"
                @click="changeOrder('oneMoreOrder',cart_item.ordersId)"
              >再来一单</span>
              <span
                v-if="cart_item.refundState == 2"
                class="disinblock textc be8 ca8 bradius20 w90 ml10"
                @click="changeOrder('cancelRefund',cart_item.ordersId,5)"
              >撤销退款</span>
              <!-- <span v-if="!cart_item.assembleSuccess && order_type == 2 &&!cart_item.ordersModelList[0].isKill" class="disinblock textc be8 ca8 bradius20 w90 ml10 bgblue cfff"
              @click="invite(cart_item.assembleId)">邀请拼团</span>-->
              <span
                v-if="!cart_item.assembleSuccess && order_type == 2 && cart_item.ordersModelList[0].isAssemble"
                class="disinblock textc be8 ca8 bradius20 w90 ml10 bgblue cfff"
                @click="invite(cart_item.assembleId)"
              >邀请拼团</span>
            </form>
          </div>
        </div>
        <!--bottom-->
        <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>
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

    <div v-if="isShowCancelOrderBox">
      <DialogBox
        :dialog_title="'提示'"
        @btn_tap="cancelOrder"
        :dialog_ph="tipsTitle"
        :type="'hint2'"
        :left="'取消'"
        :right="'确定'"
      ></DialogBox>
    </div>
  </div>
</template>

<script>
import OrderItem from "@/components/orderItem"; // 订单项
import OrderItemRow from "@/components/orderItemRow"; // 订单项
import WXAJAX from "../../utils/request";
import DialogBox from "@/components/dialogBox"; // 对话框
import NoData from "@/components/noData";

export default {
  name: "",
  components: { OrderItem, OrderItemRow, NoData, DialogBox },
  data() {
    return {
      order_type: 0,
      cart_lists: [],
      page: 1,
      loading: false,
      isLoading: false, //是否在加载
      nodata: true, //是否已经没有数据
      isShowCancelOrderBox: false,
      currentOrder: {},
      tipsTitle: "确定要撤销该订单吗？",
      currentOperationType: 0
    };
  },
  onShow() {
    this.order_type = this.$root.$mp.query.status || 1;
    this.page = 1;
    this.cart_lists = [];
    this.inits();
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "订单"
    });
  },
  async onPullDownRefresh() {
    this.page = 1;
    this.cart_lists = [];
    this.inits();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1.5 * 1000);
  },
  methods: {
    showTips(orderInfo, type) {
      if (type == 1) {
        this.tipsTitle = "确定要撤销该订单吗？";
      } else if (type == 4) {
        this.tipsTitle = "是否确认收货？";
      }

      this.currentOperationType = type;
      this.currentOrder = orderInfo;
      this.isShowCancelOrderBox = true;
    },
    cancelOrder(str) {
      if (str == "save") {
        this.currentOperationType == 1 &&
          this.changeOrder("cancel", this.currentOrder.ordersId);
        this.currentOperationType == 4 &&
          this.changeOrder("getGood", this.currentOrder.ordersId);
      }
      this.isShowCancelOrderBox = false;
    },
    page_turn(url) {
      wx.navigateTo({ url: "../" + url + "/main" });
    },
    //邀请拼团
    invite(assembleId) {
      wx.navigateTo({ url: "../assembleDetail/main?assembleId=" + assembleId });
    },
    inits() {
      //获取订单
      let v = this;
      if (v.isLoading) {
        return;
      }
      v.isLoading = true;
      wx.showLoading();
      WXAJAX.POST(
        {
          orderState: v.order_type,
          pageNum: v.page
        },
        "",
        "/orders/getOrderList"
      )
        .then(data => {
          if (data) {
            let _datas = [];
            data.forEach(i => {
              if (i.ordersModelList) {
                i.ordersModelList.forEach(i2 => {
                  i2.price /= 100;
                  i2.price = i2.price.toFixed(2);
                });
                i.allNum = i.ordersModelList.length;
                i.shopcartModelList = i.ordersModelList;
                i.orderPrice /= 100;
                i.orderPrice = i.orderPrice.toFixed(2);
                i.payPrice /= 100;
                i.payPrice = i.payPrice.toFixed(2);
                _datas.push(i);
              }
            });
            console.log("cart_lists", data);
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
    submitOrder(e) {
      let formId = e.mp.detail.formId;
      let _url = "/orders/doReminder",
        params = {
          ordersId: e.mp.detail.value.deliverGood,
          formId: formId
        };
      wx.showLoading();
      let v = this;
      WXAJAX.POST(params, "", _url)
        .then(data => {
          wx.hideLoading();
          if (data) {
            wx.showToast({
              title: "操作成功！",
              icon: "success",
              duration: 1000
            });
            if (type == "oneMoreOrder") {
              v.order_type = 1;
            }
            setTimeout(function() {
              v.reset();
              v.inits();
            }, 800);
          }
        })
        .catch(err => {
          wx.hideLoading();
          console.log(err);
        });
    },
    order_type_tap(type_id) {
      //选择订单类型
      this.order_type = type_id;
      this.reset();
      this.inits();
    },
    order_tap(orderIds) {
      wx.setStorageSync("orderState", this.order_type);
      this.reset();
      wx.navigateTo({
        url:
          "../orderDetail/main?orderIds=" +
          orderIds +
          "&orderState=" +
          this.order_type
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
          this.order_type = 2;
          this.reset();
          this.inits();
        })
        .catch(err => {});
    },
    changeOrder(type, orderId, status) {
      //订单操作
      if (this.loading) return;
      let _url = "",
        params = {};
      switch (type) {
        case "cancel": //撤销订单
          _url = "/orders/updateOrderState";
          params = {
            ordersId: orderId,
            orderState: 5
          };
          break;
        case "payNow": //立即支付
          this.reset();
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
            orderState: 4
          };
          break;
        case "cancelRefund": //  撤销退款
          _url = "/orders/backRefundState";
          params = {
            ordersId: orderId
          };
          break;
        case "oneMoreOrder": //再来一单
          _url = "/orders/anotherOrder";
          params = {
            ordersId: orderId
          };
          break;
      }
      wx.showLoading();
      let v = this;
      this.loading = true;
      WXAJAX.POST(params, "", _url)
        .then(data => {
          wx.hideLoading();
          if (data) {
            wx.showToast({
              title: "操作成功！",
              icon: "success",
              duration: 1000
            });
            if (type == "oneMoreOrder") {
              v.order_type = 1;
            }
            if (type == "getGood") {
              v.order_type = 4;
            }
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
        })
        .catch(() => {
          this.loading = false;
        });
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
