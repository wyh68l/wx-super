<template>
  <div>
    <!--top-->

    <!--msg lists-->
    <template v-if="msgList.imList.length > 0">
      <div v-for="(msgitem,k) in msgList.imList" :key="k" class="bbf5f6 mt10">
        <MsgBox
          :msg="msgitem"
          :isImMsg="true"
          :istime="msgitem.newestMessage && msgitem.newestMessage.time"
          @row_tap="row_tap(msgitem.userId || '',msgitem.cardId || '',msgitem.logo || '',msgitem.name || '',msgitem.wxCode || '', msgitem.phone || '')"
        ></MsgBox>
      </div>
    </template>
    <div v-else>
      <NoData>暂无消息</NoData>
    </div>
    <div
      class="textc disflex w60 h60 bradius50p bgblue disinblock back-btn"
      @click="page_turn('usercenter')"
    >
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_add.png"
        alt
        class="w30 h30 mt15"
      />
    </div>
  </div>
</template>

<script>
import NoData from "@/components/noData";
import store from "../../store/index";
import MsgBox from "@/components/msgBox"; // 订单项
import websocket from "../../utils/websocket";
import HandleLogin from "@/utils/handleLogin";
export default {
  name: "",
  components: { MsgBox, NoData },
  data() {
    return {
      msg_lists: [
        //                    {
        //                        isread:true,
        //                        logo:'',
        //                        name:'付鑫',
        //                        status:'2',
        //                        time:'18:20',
        //                        text:'您好，我想了解一下超级销售猿智能名片'
        //                    },
        //                    {
        //                        logo:'',
        //                        name:'付鑫',
        //                        status:'1',
        //                        time:'18:20',
        //                        text:'您好，我想了解一下超级销售猿智能名片'
        //                    },
      ]
    };
  },
  onShow() {
    HandleLogin.isLoginAndShowModal(() => {
      websocket.sendSocketJSON("108");
    });
    // if (!wx.getStorageSync('token')) {
    //   wx.setStorageSync('redirectPage', '/pages/msg/main');
    //   wx.reLaunch({url:'/pages/cardCase/main'});
    //   return;
    // }
    //
    //   websocket.sendSocketJSON("108");
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "消息"
    });
  },
  computed: {
    msgList() {
      console.debug("store接收的消息+++", store.state.msgList.msglist);
      return store.state.msgList.msglist;
    }
  },
  async onPullDownRefresh() {
    websocket.sendSocketJSON("108");
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2 * 1000);
  },
  methods: {
    page_turn(url) {
      wx.reLaunch({ url: "../" + url + "/main" });
    },
    row_tap(id, cardid, logo, name, wxCode, phone) {
      wx.navigateTo({
        url:
          "../IM/main?userId=" +
          id +
          "&logo=" +
          logo +
          "&type=2&cardId=" +
          cardid +
          "&name=" +
          name +
          "&wxCode=" +
          wxCode +
          "&phone=" +
          phone
      });
    }
  }
};
</script>

<style>
.back-btn {
  position: fixed;
  bottom: 40upx;
  right: 40upx;
}
</style>



