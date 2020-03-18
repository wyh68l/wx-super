<template>
  <div
    :class="{fadeInRight: isShow, fadeOutRight: !isShow}"
    class="animated posfix fs10 bradius5 ca8 textc floats trans2 bottom30 right6 shadow_gray bgfff w50 pb15"
    :style="'bottom:' +bottom+'px'"
  >
    <FormId>
      <div class="pt16" @click="page_turn('shopCart')">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/cart_gray.png"
          alt
          class="w24 h24"
        />
        <p class="pt5">购物车</p>
      </div>
    </FormId>
    <FormId v-if="!isSelf">
      <GetPhoneNumber @next="toIMPage">
        <div class="pt16 posre">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/msg_gray.png"
            alt
            class="w24 h24"
          />
          <!--        <span class="right_point"></span>-->
          <span class="right_point" v-if="currentNum>0">{{currentNum}}</span>
          <p class="pt5">咨询</p>
        </div>
      </GetPhoneNumber>
    </FormId>
    <FormId>
      <div class="pt16" @click="page_turn('usercenter')">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_gray.png"
          alt
          class="w24 h24"
        />
        <p class="pt5">我的</p>
      </div>
    </FormId>
    <div class="pt16" @click="clickRightRowEvent">
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right_row.png"
        alt
        style="width: 30rpx;height: 30rpx;"
      />
    </div>
  </div>
</template>

<script>
import store from "../store/index";
import FormId from "@/components/formId";
import { mapGetters, mapActions } from "vuex";
import WXAJAX from "@/utils/request";
import websocket from "@/utils/websocket";
import GetPhoneNumber from "@/components/getPhoneNumber"; //

export default {
  name: "rightFloat",
  components: { FormId, GetPhoneNumber },
  props: {
    intoType: {
      type: [Number, String],
      default: 2
    },
    specId: {
      type: [Number, String],
      default: ""
    },
    bottom: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      timer: null
    };
  },
  mounted() {
    this.getCompany();
    this.getMessageNum();
    this.timer = setInterval(() => {
      this.getMessageNum();
    }, 3 * 1000);
  },
  onShow() {
    this.getCompany();
    this.getMessageNum();
    this.timer = setInterval(() => {
      this.getMessageNum();
    }, 3 * 1000);
  },
  onUnload() {
    clearInterval(this.timer);
  },
  onHide() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions(["setCurrentCompany"]),
    getCompany() {
      let cardId = wx.getStorageSync("CARDID");

      if (cardId == this.currentCompany.cardId) return;

      setTimeout(() => {
        WXAJAX.POST(
          {
            cardId: cardId || 1,
            refresh: ""
          },
          "",
          "/businessCard/cardDetails"
        )
          .then((data, code) => {
            if (data) {
              this.setCurrentCompany(data);
            }
          })
          .catch(err => {});
      }, 0.5 * 1000);
    },
    clickRightRowEvent() {
      this.$emit("clickRightRowEvent");
    },
    // 到达消息页面
    toIMPage() {
      WXAJAX.ToIMPage(this.currentCompany, this.intoType);
    },
    page_turn(url) {
      wx.navigateTo({
        url:
          "/pages/" +
          url +
          "/main?type=" +
          this.intoType +
          "&cardId=" +
          this.currentCompany.cardId +
          "&userId=" +
          this.currentCompany.userId +
          "&logo=" +
          (this.currentCompany.logo || "") +
          "&wxCode=" +
          (this.currentCompany.personalWx || "") +
          "&phone=" +
          (this.currentCompany.phone || "") +
          "&specId=" +
          (this.specId || "") +
          "&name=" +
          (this.currentCompany.name || "")
      });
    },
    getMessageNum() {
      if (!this.currentCompany.userId || this.isSelf) return;

      websocket.sendMessage({
        code: 109,
        targetId: this.currentCompany.userId
      });
    }
  },
  computed: {
    ...mapGetters(["currentCompany", "currentNum"]),
    isSelf() {
      return this.currentCompany.userId == wx.getStorageSync("userId");
    }
  }
};
</script>

<style>
/*.right_point{*/
/*  position: absolute;*/
/*  width: 20upx;*/
/*  height: 20upx;*/
/*  background: #FD634E;*/
/*  border-radius: 50%;*/
/*}*/
.right_point {
  position: absolute;
  min-width: 30upx;
  min-height: 30upx;
  background: #fd634e;
  border-radius: 1998upx;
  right: 12upx;
  top: 24upx;
  color: white;
}
.h0 .floats {
  height: 0;
  overflow: hidden;
  padding-bottom: 0;
}
</style>
