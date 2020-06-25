<template>
  <div>
    <!--名片-->
    <div class="bgfff pt15 pl15 pb15 disflex jsbet mb10">
      <div class="disflex">
        <img
          :src="userInfo.logo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'"
          mode="aspectFill"
          alt
          class="w60 h60 mr10"
        />
        <div class="name-id">
          <p class="c38 fs18 fbold">{{userInfo.username}}</p>
          <!-- <div class="ca8 fs12">
            用户ID:{{userInfo.userId}}
            <span
              style="margin-left: 20rpx"
              v-if="userInfo.companyId != 0"
            >企业ID:{{userInfo.companyId}}</span>
          </div>-->
        </div>
      </div>
      <GetPhoneNumber @next="toCardCase" isFromUserCenter="true">
        <div class="pt15">
          <div class="disflex h30 bra_left_15 bg_line_blue cfff fs12 pl15 pr10 lh30 align-cen">
            <img
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/cardlist.png"
              alt
              class="w24 h24"
            />
            <span class="pl7">名片夹</span>
          </div>
        </div>
      </GetPhoneNumber>
    </div>

    <!--订单-->
    <div class="bgfff fs12 c78">
      <div
        class="lh18 pl15 pr15 h44 align-cen disflex jsbet bbe8"
        @click="page_tap('orderLists',1)"
      >
        <span class="fs16 c38 fbold">我的订单</span>
        <div>
          <span class="ca8 pr11">查看全部订单</span>
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
            alt
            class="w10 h10"
          />
        </div>
      </div>

      <div class="disflex pl20 pr20 mb10 fs12 c78 pt20 pb20 textc bgfff link-list">
        <div class="textc" @click="page_tap('orderLists',1)">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/pay.png"
            alt
            class="w30 h30"
          />
          <p class="pt5">待付款</p>
          <div class="count" v-if="waitPayOrderNum > 0">{{waitPayOrderNum}}</div>
        </div>
        <div @click="page_tap('orderLists',2)">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/daifahuo.png"
            alt
            class="w30 h30"
          />
          <p class="pt5">待发货</p>
          <div class="count" v-if="waitSendOrderNum > 0">{{waitSendOrderNum}}</div>
        </div>
        <div @click="page_tap('orderLists',3)">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/daishouhuo.png"
            alt
            class="w30 h30"
          />
          <p class="pt5">待收货</p>
          <div class="count" v-if="waitGetPayOrderNum > 0">{{waitGetPayOrderNum}}</div>
        </div>
        <div @click="page_tap('orderLists',4)">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/payed.png"
            alt
            class="w30 h30"
          />
          <p class="pt5">已完成</p>
        </div>
        <div @click="page_tap('orderLists',5)">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/refund.png"
            alt
            class="w30 h30"
          />
          <p class="pt5">退款/售后</p>
        </div>
      </div>
    </div>

    <div class="bgfff fs12 c78">
      <div class="disflex pl30 pr30 fs12 c78 pt20 pb20 bgfff textc jsbet servers-list bbe8">
        <div class="textc" @click="page_tap('shopCart')">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/img-shop-cat.png"
            alt
            class="w40 h40"
          />
          <p class="pt5">购物车</p>
        </div>
        <div class="textc" @click="page_tap('address')">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/img-location.png"
            alt
            class="w40 h40"
          />
          <p class="pt5">我的地址</p>
        </div>
        <div class="textc" @click="toMSGPage()">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/icon-message.png"
            alt
            class="w40 h40"
          />
          <p class="pt5">我的消息</p>
           <div class="count" v-if="countNum > 0">{{countNum}}</div>
        </div>
        <div class="textc" @click="showDevelopingTips">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/img-card-roll.png"
            alt
            class="w40 h40"
          />
          <p class="pt5">我的卡券</p>
        </div>
      </div>
      <div class="disflex pl30 pr30 fs12 c78 pt20 pb20 bgfff textc jsbet servers-list">
        <div class="textc" @click="page_tap('distribution')">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/img-distribution.png"
            alt
            class="w40 h40"
          />
          <p class="pt5">分销中心</p>
        </div>
        <div class="textc" @click="page_tap('appointmentPack/orderList')">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/img-appointment.png"
            alt
            class="w40 h40"
          />
          <p class="pt5">我的预约</p>
        </div>
        <div class="textc" @click="page_tap('collect')">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/img-collect.png"
            alt
            class="w40 h40"
          />
          <p class="pt5">我的收藏</p>
        </div>
          <div class="textc" @click="clearCache">
              <img
                      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/delete2.png"
                      alt
                      class="w30 h30 tip"
              />
              <p class="pt5">删除缓存</p>
          </div>
        <!--<div class="textc"></div>-->
      </div>
    </div>

    <div class="toCRMBtn textc" @click="toCrmAPP">前往CRM</div>
  </div>
</template>

<script>
import Login from "@/components/login"; //
import GetPhoneNumber from "@/components/getPhoneNumber"; //
import WXAJAX from "../../utils/request";
import HandleLogin from "@/utils/handleLogin";
import store from "../../store/index";

import { toMiniProgram } from "@/utils";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "",
  components: { Login, GetPhoneNumber },
  data() {
    return {
      userInfo: {
        username: "",
        logo:
          "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png",
        userId: "",
        companyId: ""
      },
      waitPayOrderNum: 0,
      waitSendOrderNum: 0,
      waitGetPayOrderNum: 0,
      msgUnRead: 0
    };
  },
  onShow() {
    this.setUserInfo();
    this.init();
    this.getMsgList();
  },

  async onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },
  mounted() {
    this.init();
    wx.setNavigationBarTitle({
      title: "个人中心"
    });
  },
  methods: {
    ...mapActions(["setPhone"]),
    init() {
      this.getOrderListCount();
    },
    getMsgList() {
      this.msgUnRead = 0;

      // if (
      //   this.msgList &&
      //   this.msgList.imList.length &&
      //   this.msgList.imList.length > 0
      // ) {
      //   for (let item of this.msgList.imList) {
      //     if (item.newestMessage.type == 0) {
      //       this.msgUnRead += 1;
      //     }
      //   }
      // }
    },
    getOrderListCount: function() {
      // var v = this;
      WXAJAX.POST({}, "", "/orders/getOrderListCount")
        .then(data => {
          if (data) {
            // 数组过滤处理得到目标值
            this.waitPayOrderNum =
              data.filter(item => {
                return item.orderState === 1;
              }).length > 0
                ? data.filter(item => {
                    return item.orderState === 1;
                  })[0].num
                : 0; // 订单状态（1待付款，2待发货，3待收货，4已完成，5交易取消，6退款成功，0已过期）
            this.waitSendOrderNum =
              data.filter(item => {
                return item.orderState === 2;
              }).length > 0
                ? data.filter(item => {
                    return item.orderState === 2;
                  })[0].num
                : 0;
            this.waitGetPayOrderNum =
              data.filter(item => {
                return item.orderState === 3;
              }).length > 0
                ? data.filter(item => {
                    return item.orderState === 3;
                  })[0].num
                : 0;
          }
        })
        .catch(err => {
          wx.showToast({
            title: err.message,
            icon: "none",
            duration: 2000
          });
        });
    },

    // 到达消息页面
    toMSGPage() {
      WXAJAX.ToMSGPage(this.userInfo.companyId, () => {});
    },
    page_tap(url, status) {
      if (status) {
        wx.navigateTo({ url: "/pages/" + url + "/main?status=" + status });
      } else {
        wx.navigateTo({ url: "/pages/" + url + "/main" });
      }
    },
      clearCache(){
          wx.showToast({
              title: '清除缓存成功！'
          })
          wx.clearStorageSync();
      },
    toCrmAPP() {
      toMiniProgram(`/pages/index/main`);
    },
    toCardCase() {
      //名片夹
      wx.redirectTo({ url: "../cardCase/main" });
    },

    /**
     * 设置当前页面所需要的用户信息
     */
    setUserInfo() {
      this.userInfo.username = wx.getStorageSync("USERNAME") || "";
      this.userInfo.logo = wx.getStorageSync("avatarUrl") || "";
      this.userInfo.userId = wx.getStorageSync("userId") || "";
      this.userInfo.companyId = wx.getStorageSync("roleId") || "";
    }
  },
  computed: {
    ...mapGetters(["countNum",]),
    msgList() {
      console.debug("store接收的消息+++", store.state.msgList.msglist);
      return store.state.msgList.msglist;
    }
  }
};
</script>

<style>
.name-id {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.link-list > div {
  width: 20%;
  position: relative;
}
.textc {
  position: relative;
}
.tip{
    padding: 10rpx;
    border: 2rpx dotted #6BB6F5;
    border-radius: 8upx;
}
.textc > .count {
  position: absolute;
  top: -10upx;
  right: 0;
  width: 32upx;
  height: 32upx;
  text-align: center;
  line-height: 32upx;
  font-size: 24upx;
  color: #fff;
  background: #fd634e;
  border-radius: 50%;
}
.link-list > div > .count {
  position: absolute;
  top: -10upx;
  right: 24upx;
  width: 32upx;
  height: 32upx;
  text-align: center;
  line-height: 32upx;
  font-size: 24upx;
  color: #fff;
  background: #fd634e;
  border-radius: 50%;
}

.toCRMBtn {
  margin: 100upx 86upx 0;
  height: 88upx;
  line-height: 88upx;
  background: linear-gradient(90deg, #00a0e9, #00a0e9);
  border-radius: 10upx;
  color: white;
  font-size: 36upx;
  font-weight: 400;
}

.servers-list > div {
  width: 80upx;
}

.servers-list > div p {
  margin: 0 -20upx;
}
</style>
