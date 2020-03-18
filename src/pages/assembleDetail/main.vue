<template>
  <div>
    <div class="commander-info textc pt15">
      <img :src="assembleInfo.avatarUrl" alt class="w50 h50 bradius5" />
      <p class="c38 fs16 mt15">{{assembleInfo.nickeName}}</p>
      <div class="invitations">{{msg}}</div>
    </div>

    <div class="disflex btf5f6 pl15 pr15 pt15 mt15 mb15">
      <img :src="assembleInfo.goodsPhotoUrl" alt class="goods-img" />
      <div class="disflex wrap" style="align-content: space-between;">
        <div class="title word-break-all w100p over_2 c38 fs14 lh25">{{assembleInfo.goodsName}}</div>
        <div class="w100p ca8 fs12">成团人数：{{assembleInfo.assembleNum}}人团</div>
        <div class="w100p corange">
          <span class="fs12">￥</span>
          <span class="fs20 fbold">{{(assembleInfo.goodsMinPrice/100).toFixed(2)}}</span>
        </div>
      </div>
    </div>

    <div class="textc">
      <span class="fs14 c38">距拼团结束还剩</span>
      <div class="mt14 count-down-cut-line">
        <CountDown :diffTime="cutTime" class="bgfff pl10 pr10" />
      </div>
    </div>

    <div class="pt40 pl10 pr10">
      <div class="avatar-list disflex wrap jscen">
        <!-- <img :src="'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_user.png'" alt="" class="w40 h40 bradius50p mr5 ml5 mb5"> -->
        <img
          :key="index"
          v-for="(item, index) of assembleInfo.ordersModelList"
          v-show="index<5"
          :src="item.avatarUrl"
          alt
          class="w40 h40 bradius50p mr5 ml5 mb5"
        />
      </div>
      <div class="progress-box">
        <div
          class="progress-tips"
          :style="{left: progress+'%'}"
        >{{assembleInfo.putAssemble===assembleInfo.assembleNum?'拼团成功':assembleInfo.putAssemble+'人已参团'}}</div>
        <div class="progress-line" :style="{width: progress+'%'}"></div>
      </div>
    </div>

    <div class="h49"></div>

    <div class="disflex fs18 textc lh49 fix_bottom bte8">
      <span class="w50p cfff bg-gradient-orange" @click="moreCollage">
        更多拼团
        <LoginIntercept class="w50p"></LoginIntercept>
      </span>
      <label class="w50p bg-gradient-red cfff" v-if="isShare">
        分享出去￥{{(assembleInfo.goodsMinPrice/100).toFixed(2)}}
        <button
          style="display: none"
          open-type="share"
        ></button>
        <LoginIntercept class="w50p"></LoginIntercept>
      </label>
      <span
        class="w50p cfff bg-gradient-red cfff"
        v-else-if="assembleInfo.state===1"
        @click="joinGroup"
      >
        立即参团￥{{(assembleInfo.goodsMinPrice/100).toFixed(2)}}
        <LoginIntercept class="w50p"></LoginIntercept>
      </span>
      <span
        class="w50p cfff bg-gradient-red cfff"
        v-else-if="assembleInfo.state!==1"
        @click="group"
      >
        我也要开团
        <LoginIntercept class="w50p"></LoginIntercept>
      </span>
    </div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import CountDown from "@/components/CountDown";
import LoginIntercept from "@/components/LoginIntercept";
import { addShareRecord } from "@/utils/behavior";

export default {
  name: "",
  components: { CountDown, LoginIntercept },
  data() {
    return {
      // 订单信息
      orderInfo: {},
      //拼团id
      assembleId: "",
      msg: "发起了拼团，邀你一起来参与",
      assembleInfo: {},
      cutTime: 0,
      progress: 0,
      //是否显示分享按钮,前置条件用户已经参与当前拼团,且处于拼团状态中
      isShare: false,
      myUserId: wx.getStorageSync("userId") || -1
    };
  },
  onLoad(options) {
    if (options && options.assembleId) {
      this.assembleId = options.assembleId;
    }
  },
  onShow() {
    this.getInfo();
  },
  onUnload() {
    // this.assembleId = '';
  },
  methods: {
    //参团
    joinGroup() {
      wx.navigateTo({
        url:
          "../prodDetail/main?goodId=" +
          this.assembleInfo.goodsId +
          "&join=true&assembleId=" +
          this.assembleId +
          "&cardId=" +
          (wx.getStorageSync("CARDID") || 0) +
          "&tel=" +
          (wx.getStorageSync("CARDTEL") || "")
      });
    },
    //我也要开团
    group() {
      wx.navigateTo({
        url: "../prodDetail/main?goodId=" + this.assembleInfo.goodsId
      });
    },
    getInfo() {
      WXAJAX.POST(
        {
          assembleId: this.assembleId
        },
        "",
        "/assembles/getGoodsAssembleInfo"
      )
        .then(res => {
          this.assembleInfo = res;
          this.cutTime = parseInt((res.endTime - new Date().getTime()) / 1000);
          this.progress = (res.putAssemble / res.assembleNum) * 100;
          this.myUserId = wx.getStorageSync("userId") || -1;
          let myArray = res.ordersModelList.find(
            item => item.userId === this.myUserId
          );
          if (myArray && res.state === 1) {
            this.isShare = true;
          } else {
            this.isShare = false;
          }
          //如果不是分享进入的,则欢迎语根据数据来设置
          this.dxAssembleMsg();
          //如果是分享进入的, 则写死为  发起了拼团，邀你一起来参与
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    //动态修改欢迎语
    dxAssembleMsg() {
      if (this.assembleInfo.assembleNum > this.assembleInfo.putAssemble) {
        this.msg = `还差${this.assembleInfo.assembleNum -
          this.assembleInfo.putAssemble}人，赶快邀请好友来拼团吧!`;
      } else if (
        this.assembleInfo.assembleNum === this.assembleInfo.putAssemble
      ) {
        this.msg = "恭喜您,拼团成功!";
      }
    },
    //更多拼团 回到商城页
    moreCollage() {
      wx.switchTab({ url: "../Product/main" });
    }
  },
  async onShareAppMessage(e) {
    console.log("/pages/assembleDetail/main?assembleId=" + this.assembleId);
    let COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    let CARDID = wx.getStorageSync("CARDID") || 0;

    let uuid = CARDID + "" + new Date().getTime();
    addShareRecord(COMPANYID, 2, this.assembleId, uuid).then(
      res => {},
      err => {}
    );
    return {
      path: `/pages/assembleDetail/main?assembleId=${this.assembleId}&goType=1&shareId=${uuid}&cardId=${CARDID}`,
      title: this.assembleInfo.goodsName,
      success(e) {
        wx.showShareMenu({
          withShareTicket: true
        });
      },
      fail(e) {
        console.log("失败-- ", e);
      }
    };
  }
};
</script>

<style>
page {
  background: white;
}

.commander-info {
  font-size: 0;
}

.invitations {
  display: inline-block;
  height: 60upx;
  line-height: 60upx;
  border-radius: 10upx;
  background: #fd634e;
  padding: 0 35upx;
  font-size: 28upx;
  margin-top: 20upx;
  color: white;
  position: relative;
}

.invitations::before {
  content: "";
  position: absolute;
  border-bottom: 13upx solid #fd634e;
  border-left: 12upx solid transparent;
  border-right: 12upx solid transparent;
  top: -12upx;
  left: 50%;
  transform: translateX(-50%);
}

.goods-img {
  width: 216upx;
  height: 220upx;
  flex: 0 0 216upx;
  margin-right: 30upx;
  border-radius: 10upx;
}

.count-down-cut-line {
  position: relative;
}
.count-down-cut-line::before {
  content: "";
  position: absolute;
  height: 1upx;
  width: 100%;
  background: #f5f5f6;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  margin: auto;
}

.progress-box {
  width: 520upx;
  height: 12upx;
  background: rgba(232, 232, 232, 1);
  border-radius: 6upx;
  margin: 114upx auto 0;
  position: relative;
}

.progress-box .progress-line {
  width: 0;
  height: 12upx;
  background: rgba(252, 173, 61, 1);
  box-shadow: 0px 0px 8upx 0px rgba(252, 173, 61, 0.8);
  border-radius: 6upx;
}

.progress-box .progress-tips {
  position: absolute;
  top: -82upx;
  left: 0;
  transform: translateX(-50%);
  height: 60upx;
  line-height: 60upx;
  padding: 0 30upx;
  color: white;
  background: #383838;
  border-radius: 10upx;
  font-size: 28upx;
}

.progress-box .progress-tips::before {
  content: "";
  position: absolute;
  border-top: 13upx solid #383838;
  border-left: 12upx solid transparent;
  border-right: 12upx solid transparent;
  left: 50%;
  transform: translateX(-50%);
  bottom: -12upx;
}
</style>
