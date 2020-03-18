<template>
  <div class="out shadow_gray mb10">
    <div class="top_card fs12 shadow_gray posre" v-if="type == 'plus'">
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card-case-card-bg2.png"
        class="w116 h105 bg-img"
        alt
      />
      <div class="zIndex100 pl34 pt25 cblue fs12 flex-sb-c">
        <span class="before_line_3">{{card_msg.company || '公司名称'}}</span>
        <span @click.stop="moreTap" class="w60 textc disinblock" style="z-index:1000;">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/edit_card.png"
            alt
            class="w16 h16 pl3 pr3"
          />
        </span>
      </div>
      <div class="top_msg zIndex100 disflex pt15" @click="page_turn('index')">
        <img
          :src="card_msg.picchecked || card1_logo"
          mode="aspectFill"
          alt
          class="w60 h60 bradius5"
        />
        <div class="pl10 info-content pt10">
          <p class="fbold c38 fs18">{{card_msg.username || '姓名'}}</p>
          <p class="fs14 ca8 pt10 pb25">{{card_msg.post || '职位'}}</p>
        </div>
      </div>
      <div class="flex-sa-c btf5f6 operate-bottom">
        <div v-if="!isLogin" class="phone flex-c-c" @click.self="makePhone">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel.png"
            alt
            class="w16 h16 mr11 pl3 pr3"
          />
          <span class="fs14 ca8">拨打电话</span>
        </div>
        <button
          class="phone flex-c-c"
          v-else-if="isLogin && !phone"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel.png"
            alt
            class="w16 h16 mr11 pl3 pr3"
          />
          <span class="fs14 ca8">拨打电话</span>
        </button>
        <div v-else-if="isLogin && phone" class="phone flex-c-c" @click.self="makePhone">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel.png"
            alt
            class="w16 h16 mr11 pl3 pr3"
          />
          <span class="fs14 ca8">拨打电话</span>
        </div>

        <span class="c56 separator">|</span>
        <button
          class="bgfff contentbox share-button flex-c-c"
          id="111"
          :data-companyId="card_msg.companyId"
          :data-cardId="card_msg.cardId"
          :data-companyName="card_msg.company"
          :data-name="card_msg.username"
          :data-position="card_msg.post"
          @click.stop="stopClick"
          :data-shareSpeech="card_msg.shareSpeech||''"
          open-type="share"
        >
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card-case-forward-square2.png"
            alt
            class="w16 h16 mr11"
          />
          <span class="fs14 ca8">转发名片</span>
        </button>
      </div>
    </div>

    <!-- <div class="pt15 pl16 pr15 pt16 bgfff pb15" v-else @click="page_turn('index')">
      <div class="top_card fs12 shadow_gray pb42">
        <div class="pl34 pt25 cblue fs12"><span class="before_line_3">{{card_msg.company || '公司名称'}}</span></div>
        <div class="top_msg disflex jsbet pt41">
          <div>
            <p class="fbold c38 fs18">{{card_msg.username || '姓名'}}</p>
            <p class="fs14 ca8 pt10 pb23">{{card_msg.post || '职位'}}</p>
            <p class="fs12 c78">{{card_msg.tel || '电话'}}</p>
            <p class="fs12 c78">{{card_msg.email || '邮箱'}}</p>
          </div>

          <div class="disflex column-reverse">
            <img :src="card_msg.picchecked || card1_logo" alt="" class="w60 h60 bradius5" mode="aspectFill">
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import GetPhoneNumber from "@/components/getPhoneNumber"; //
import handleLogin from "@/utils/handleLogin";
import WXAJAX from "@/utils/request";
import { mapMutations } from "vuex";
export default {
  name: "BusinessCard",
  props: ["card_msg", "type", "hasCard", "isdel", "index", "isLogin"],
  data() {
    return {
      card1_logo:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_user.png",
      phone: wx.getStorageSync("phone") || ""
    };
  },
  mounted() {},
  components: { GetPhoneNumber },
  methods: {
    ...mapMutations(["setPhone"]),
    page_turn(url) {
      // this.$emit('page_turn',url,this.card_msg.companyId , this.card_msg.cardId)
      wx.setStorageSync("COMPANYID", this.card_msg.companyId); /*id*/
      wx.setStorageSync("CARDID", this.card_msg.cardId); /*id*/
      wx.switchTab({
        url:
          "../" +
          url +
          "/main?cardId=" +
          this.card_msg.companyId +
          "&companyId+" +
          this.card_msg.cardId
      });
    },
    moreTap() {
      this.$emit(
        "moreTap",
        this.card_msg.recordId,
        this.card_msg.cardId,
        this.isdel
      );
    },
    stopClick() {
      console.log("do nothing");
    },
    //需要登录引导的回调
    loginGuide() {
      // this.isShowLoginGuide = true;
    },
    makePhone() {
      //拨打电话

      if (this.isLogin) {
        if (this.card_msg.tel) {
          wx.makePhoneCall({
            phoneNumber: this.card_msg.tel
          });
        } else {
          wx.showToast({
            title: "还没有添加电话呢！",
            duration: 2000,
            icon: "none"
          });
        }
      } else {
        this.$emit("needLogin", false);
      }
    },
    getPhoneNumber(e) {
      if (this.phone) return;

      if (!e.target.encryptedData) {
        return;
      }

      WXAJAX.POST(
        {
          phoneData: e.target.encryptedData,
          phoneIv: e.target.iv
        },
        "",
        "/home/getWxPhone"
      )
        .then(res => {
          wx.setStorageSync("phone", res);
          this.setPhone(res);
          this.phone = res;
          this.makePhone();
        })
        .catch(err => {
          console.log("获取手机号出错：", err);
        });
    },

    share(companyId, cardId) {
      this.$emit("shareApp", companyId, cardId);
    }
  }
};
</script>

<style scoped>
.out {
  line-height: 1;
  /* box-shadow: 0 0 10upx #383838; */
  border-radius: 20upx;
}
button {
  border-radius: 0;
}
.info-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
}
.phone {
  height: 100%;
  width: 100%;
  background: white;
}
.operate-bottom {
  width: 100%;
  height: 88upx;
  overflow: hidden;
  background: white;
  border-bottom-right-radius: 20upx;
  border-bottom-left-radius: 20upx;
}
.share-button {
  width: 100%;
}
.separator {
  display: inline-block;
  width: 2upx;
  height: 32upx;
  background: #f5f5f6;
}
.bg-img {
  position: absolute;
  right: 0;
  top: 0;
}
.zIndex100 {
  position: relative;
  z-index: 100;
}
</style>
