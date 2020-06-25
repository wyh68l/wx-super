<template>
  <div @click="row_tap">
    <div class="disflex jsbet pl15 pr15 bgfff pt15 pb15" :class="bradius">
      <div class="pr10 posre">
        <!--头像-->
        <img
          :src="msg.logo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png'"
          alt
          mode="aspectFill"
          class="w50 h50 bradius5"
        />
        <!--根据消息状态判断是否显示头像旁的红点-->
        <span
          class="disblock posab top0 right5 bradius50p bg_line_orange w10 h10"
          v-if="msg.newestMessage.type== 0 && msg.newestMessage.sendId != myid"
        >

        </span>
      </div>
      <div class="flex1">
        <div class="disflex jsbet">
          <div>
            <span class="fs18 c38 pr7">{{msg.name}}</span>
            <span
              class="fs12 cfff lh15 pl6 pr5 bradius3 bgblue"
              v-if="isusertag"
            >{{msg.newestMessage.type}}</span>
            <span class="fs12 c78 lh15 pl7" v-if="isport">{{msg.position}}</span>
          </div>
          <span class="fs12 ca8" v-if="istime">{{dateTime}}</span>
          <!--type == 1 || type == 3-->
        </div>
        <!--tel-->
        <div class="disflex align-cen pt6 phone" v-if="istel && !telReverse">
          <span class="fs14 ca8">{{msg.phone}}</span>
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/tel_2.png"
            alt
            class="w16 h16 ml16"
            @click.stop="makePhone(msg.phone)"
          />
        </div>
        <div class="disflex align-cen pt6 phone" v-if="istel && telReverse">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/tel_2.png"
            alt
            class="w16 h16"
            @click.stop="makePhone(msg.phone)"
          />
          <span class="fs14 ca8 ml16">{{msg.phone}}</span>
        </div>
        <!--IM信息内容-->
        <div v-if="isImMsg" class="w267 over_1 disflex align-cen">
          <span
            v-if="msg.newestMessage.type == 0 && msg.newestMessage.sendId==myid"
            class="borderbox mr5 disinblock w34 lh15 fs12 textc bradius3 receive"
          >送达</span>
          <span
            v-if="msg.newestMessage.type == 1"
            class="borderbox mr5 disinblock w34 lh15 fs12 textc bradius3 send"
          >已读</span>
          <!--显示的消息内容-->
          <span
            v-if="msg.newestMessage.contentType && msg.newestMessage.contentType == 2"
            class="fs14 ca8 disinblock"
            style="font-size: 28upx"
          >[图片]</span>
          <span
            v-else-if="msg.newestMessage.contentType && msg.newestMessage.contentType == 3"
            class="fs14 ca8 disinblock"
            style="font-size: 28upx"
          >[语音]</span>
          <span
            v-else-if="msg.newestMessage.contentType && msg.newestMessage.contentType == 4"
            class="fs14 ca8 disinblock"
            style="font-size: 28upx"
          >[视频]</span>
          <span
            class="fs14 ca8 disinblock"
            style="font-size: 28upx"
            v-else-if="msg.newestMessage.messageType==1"
          >{{msg.newestMessage.message}}</span>
          <span
            class="fs14 ca8 disinblock"
            style="font-size: 28upx"
            v-else-if="msg.newestMessage.messageType==2"
          >我是{{msg.newestMessage.message.companyName}}的{{msg.newestMessage.message.name}},欢迎进入我的名片，有什么可以帮到您的吗？</span>
        </div>
      </div>
    </div>
    <!---->
    <!--<div class="btf5f6 pl16 pr15 fs14 cb8 lh34 bgfff disflex jsbet">&lt;!&ndash; v-if="type == 2 || type == 4"&ndash;&gt;-->
    <!--&lt;!&ndash;附加记录&ndash;&gt;-->
    <!--&lt;!&ndash;  <div>-->
    <!--<p v-if="islogtitle" class="c38 fbold fs16 lh1 pt15 pb5">跟进记录</p>-->
    <!--<span v-if="issppend_record">{{msg.time}} 由 <span class="cblue">{{msg.by}}</span> 主动加入超级销售猿</span>-->
    <!--</div>&ndash;&gt;-->

    <!--<div v-if="ismsg">-->
    <!--<span>{{msg.newestMessage.message}}</span>-->
    <!--</div>-->
    <!--<span @click.stop="page_turn('editLog' ,'?clientName='+msg.name + '&id='+msg.cardId)"-->
    <!--class="lh40 bblue cblue bradius5 pl20 pr21 h40 borderbox mt17"-->
    <!--v-if="isaddLog">添加</span>-->

    <!--</div>-->
  </div>
</template>

<script>
import util from "../utils/index";

export default {
  name: "",
  props: [
    "msg",
    "type",
    "bradius",
    "isaddLog",
    "isrightpoint",
    "ismsg",
    "isrank",
    "istime",
    "istel",
    "isaction",
    "issppend_record",
    "istags",
    "isImMsg",
    "islogtitle",
    "isport",
    "isusertag",
    "actionType",
    "index",
    "telReverse"
  ],
  // type :  1 -- 显示信息 ， 2 -- 不显示信息
  components: {},
  data(v) {
    return {
      myid: ""
    };
  },
  computed: {
    dateTime() {
      //console.log(util.dateFormat(this.istime));
      return this.istime ? util.dateFormat(this.istime) : "";
    }
  },
  mounted() {
      console.log(this.msg);
    this.myid = wx.getStorageSync("userId") || "";
  },
  methods: {
    row_tap() {
      this.$emit("row_tap", this.msg.cardId, this.msg.userId);
    },
    page_turn(url, query) {
      query = query || "";
      wx.navigateTo({ url: "../" + url + "/main" + query });
    },
    makePhone(tel) {
      util.MakePhone(tel || "");
    },
    dateT(data) {
      console.log(util.dateFormat(data));
    }
  }
};
</script>

<style>
.send {
  color: #00a0e9;
  border: 1upx solid #00a0e9;
}
.receive {
  color: #2bcf88;
  border: 1upx solid #2bcf88;
}
</style>
