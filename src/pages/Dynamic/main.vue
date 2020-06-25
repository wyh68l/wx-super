<template>
  <div class="posre borderbox dynamic" :style="{ height: mainHeight + 'px' }" @click="tap_all">
    <NavBarByUser
      @cancelLoginGuide="cancelLoginGuide"
      :isLogin="isLogin"
      :isShowLoginGuide="isShowLoginGuide"
      :isShowCardCase="true"
      @loginSuccess="loginSuccess"
      @loginFailed="loginFailed"
      :avatarUrl.sync="avatarUrl"
    />
    <scroll-view
      :style="{ height: scrollContentHeight + 'px' }"
      class="dynamic-content"
      :scroll-y="true"
      :enable-back-to-top="true"
      :scroll-anchoring="true"
      @scrolltoupper="scrolltoupper"
      @scrolltolower="scrolltolower"
    >
      <!-- <div class="dynamic-content"  :style="{'margin-bottom': tabBarHeight+'px'}"> -->
      <!-- <div class="dynamic-content" > -->
      <div class="w100p">
        <SelfSwiper
          :imgUrls="banners"
          :self_class="'h211'"
          :isShowMask="true"
          @swipclick="preview"
          :isShowDots="false"
        />
      </div>
      <div style="position: relative; z-index: 2; padding-top:80rpx" class="bgfff">
        <!--title begin-->
        <div class="fs18 cfff disflex pl15 pr16 row-reverse dynamic-title">
          <img
            :src="company_msg.admin_logo"
            alt
            class="w60 h60 bradius5 ml10 bgfff"
            mode="aspectFill"
          />
          <div class="row-reverse">
            <b class="fbold">{{ company_msg.company_name }}</b>
          </div>
        </div>
        <!--title end-->
        <!--lists begin-->
        <template v-if="dynamic_lists.length">
          <div v-for="(dynamic_item, k1) in dynamic_lists" :key="k1" style="position: relative;">
            <DynamicItem
              :dynamic_item="dynamic_item"
              @operate_tap="operate_tap"
              @addComment="addComment"
              @zan="zan"
              @getMoreComment="getMoreComment"
              :index1="k1"
            ></DynamicItem>
            <LoginIntercept />
          </div>
          <!--<div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>-->
        </template>
        <div v-else>
          <NoData>暂无数据</NoData>
        </div>
          <Bottom></Bottom>

        <!--lists end-->
      </div>
      <!-- </div> -->
    </scroll-view>

    <!--评论输入框-->
    <div class="fix_bottom bgfff edit_input trans2 reviews" :class="input_show ? '' : 'hide'">
      <!--:class="input_show ? '' : 'hide' "-->
      <div class="bgfff pt3 pb5 pl10 disflex jsbet pr11 borderbox align-cen">
        <input
          fixed="true"
          class="borderbox lh30 pr11 bgf5f6 bradius5 flex1 mr11 comment_input ca8 fs12 pl15"
          :focus="comment_focus"
          :placeholder="
            replayComment.commentId
              ? '回复 ' + replayComment.userName + '：'
              : '评论'
          "
          cursor-spacing="4"
          @focus="inputgetFocus(this, $event)"
          @confirm="inputConfirm"
          :style="{ height: text_height + 'px' }"
          v-model="comments"
        />
        <!--        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/smile.png" alt="" class="w25 h25" @click="smile_tap">-->
        <span
          class="bgblue cfff w50 textc lh30 fs16 bradius5 disblock ml10"
          @click.stop="inputConfirm"
        >发送</span>
      </div>
    </div>
    <FloatButtons
      class="float-buttons"
      :isShowTalk="isShowTalk"
      :avatarUrl="targetAvatarUrl"
      @talk.stop="talk"
      @loginGuide.stop="loginGuide"
    ></FloatButtons>
      <Tabbar></Tabbar>
  </div>
</template>

<script>
    import Tabbar from "@/components/Tabbar"; //
import DynamicItem from "@/components/dynamicItem"; // 订单项
import Bottom from "@/components/Bottom";
import NavBarByUser from "@/components/NavBarByUser.vue";

import NoData from "@/components/noData";
import SelfSwiper from "@/components/swiper"; //

import { mapState,mapGetters } from "vuex";
import FloatButtons from "@/components/FloatButtons.vue";
import HandleLogin from "@/utils/handleLogin";
import LoginIntercept from "@/components/LoginIntercept";

import WXAJAX from "../../utils/request";
import util from "../../utils/index";
import {authSubscribeMessage} from '@/utils/auth'
import { addShareRecord } from "@/utils/behavior";

let httpImg =
  "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551961574244&di=8729881910dc1f229760af2da633dad5&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201401%2F22%2F20140122194030_JBjii.jpeg";

export default {
  name: "",
  components: {
    DynamicItem,
    NoData,
    SelfSwiper,
    NavBarByUser,
    FloatButtons,
    LoginIntercept,
      Bottom,
      Tabbar
  },
  data() {
    return {
      prevImg: [httpImg, httpImg, httpImg],
      dynamic_operate_show: false,
      dynamic_lists: [],
      emojiArray: [
        [
          "😠",
          "😩",
          "😲",
          "😞",
          "😵",
          "😰",
          "😒",
          "😍",
          "😤",
          "😜",
          "😝",
          "😋",
          "😘",
          "😚",
          "😷",
          "😳",
          "😃",
          "😅",
          "😆",
          "😁",
          "😂",
          "😊",
          "☺",
          "😄",
          "😢",
          "😭",
          "😨",
          "😣",
          "😡",
          "😡",
          "😖",
          "😔"
        ],
        ["😱", "😪", "😏", "😓", "😥", "😫", "😉"]
      ],
      emoji_show: false,
      comment_focus: false,
      comments: "",
      input_show: false,
      add_comments_index: 0, //当前点击的哪条动态
      text_height: 30,
      emojiChar:
        "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
      emoji: [
        "60a",
        "60b",
        "60c",
        "60d",
        "60f",
        "61b",
        "61d",
        "61e",
        "61f",
        "62a",
        "62c",
        "62e",
        "602",
        "603",
        "605",
        "606",
        "608",
        "612",
        "613",
        "614",
        "615",
        "616",
        "618",
        "619",
        "620",
        "621",
        "623",
        "624",
        "625",
        "627",
        "629",
        "633",
        "635",
        "637",
        "63a",
        "63b",
        "63c",
        "63d",
        "63e",
        "63f",
        "64a",
        "64b",
        "64f",
        "681",
        "68a",
        "68b",
        "68c",
        "344",
        "345",
        "346",
        "347",
        "348",
        "349",
        "351",
        "352",
        "353",
        "414",
        "415",
        "416",
        "466",
        "467",
        "468",
        "469",
        "470",
        "471",
        "472",
        "473",
        "483",
        "484",
        "485",
        "486",
        "487",
        "490",
        "491",
        "493",
        "498",
        "6b4"
      ],
      emojis: [], //qq、微信原始表情
      keyboard_height: 0,
      COMPANYID: 0,
      CARDID: "0",
      company_msg: {
        admin_logo: "",
        company_logo: "",
        company_name: ""
      },
      page: 1,
      isLoading: false, //是否在加载
      nodata: false, //是否已经没有数据
      replayComment: {}, // 回复信息对象
      banners: [
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//product-index/20190418160834.png"
      ],

      avatarUrl: "", //用户的头像地址,
      isLogin: HandleLogin.returnIsLogin() || false, //是否已经登录
      isShowTalk: true, //是否显示右边侧边栏的聊一聊
      isShowLoginGuide: true, //是否显示登录引导页,
      targetAvatarUrl: "", //当前目标的人物头像,
      scrollContentHeight: 0, //中间滚动区域的高度
      mainHeight: 0, //整体高度
        startTime:0,
        time:0,//浏览时间段
    };
  },
  onHide() {
      this.setTimeOut();
    this.clearPage();
  },
  onShow() {
      wx.hideTabBar();//隐藏官方tabbar
    let v = this;
    //获取当前的公司
    let lastCardId = v.CARDID;
    v.COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    v.CARDID = wx.getStorageSync("CARDID") || 0;

    if (lastCardId != v.CARDID || !v.CARDID) {
      this.page = 1;
      v.getcompany();
      v.inits();
      this.getAd();
    }
    this.isLogin = HandleLogin.returnIsLogin() || false;
    this.avatarUrl = wx.getStorageSync("avatarUrl") || "";

      //初始化时间
      this.startTime = setInterval(()=>{this.time++;},1000);
  },
  onPageScroll: function(e) {
    this.comment_focus = false;
    this.input_show = false;
  },

  async mounted() {
    let a = await util.systemIfo();
    let navHeight = getApp().globalData.navHeight;
    this.mainHeight = a.windowHeight;
    this.scrollContentHeight = a.windowHeight - navHeight;
  },
  methods: {
      //计算时长
      setTimeOut(){
          clearInterval(this.startTime);
          let url = "/businessCard/cardDetails";
          console.log(this.time);
          WXAJAX.POST({seeType:4,timeQuantum:this.time}, "", url).then(()=>{
              this.time = 0;
          })
      },
    //下拉刷新
    scrolltoupper(e) {
      wx.showLoading({
        title: "获取最新数据中"
      });
      this.page = 1;
      this.dynamic_lists = [];
      this.nodata = false;
      this.isLoading = false;
      this.inits();
      this.getAd();
    },
    //上拉加载更多
    scrolltolower(e) {
      this.inits();
    },
    //隐藏登录引导
    cancelLoginGuide() {
      this.isShowLoginGuide = false;
    },
    //需要登录引导的回调
    loginGuide() {
      this.isShowLoginGuide = true;
    },
    //聊一聊
    talk() {
        //订阅授权 信息相关
        authSubscribeMessage(this.subscriptionNew);

      wx.navigateTo({
        url:
          "../IM/main?userId=" +
          this.currentCompany.userId +
          "&logo=" +
          this.currentCompany.logo +
          "&type=2&cardId=" +
          this.currentCompany.cardId +
          "&name=" +
          this.currentCompany.name +
          "&wxCode=" +
          (this.currentCompany.personalWx || "") +
          "&phone=" +
          this.currentCompany.phone
      });
    },
    //头像登录成功的回调
    loginSuccess(url) {
      this.isLogin = true;
      this.inits();
      this.getAd();
      this.hasCard = wx.getStorageSync("hasCard") || false;
      this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    },
    loginFailed() {
      this.isShowLoginGuide = true;
    },
    preview(idx) {
      this.previewImages(this.banners, this.banners[idx]);
    },
    getAd() {
      this.getPlateAds(3)
        .then(res => {
          this.banners = res
            ? res.map(val => val.photo)
            : [
                "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//product-index/20190418160834.png"
              ];
        })
        .catch(() => {
          this.banners = [
            "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//product-index/20190418160834.png"
          ];
        });
    },
    getMoreComment(comments, idx) {
      this.dynamic_lists[idx].commentModelList.push(...comments);
      this.$set(
        this,
        "dynamic_lists",
        JSON.parse(JSON.stringify(this.dynamic_lists))
      );
    },
    getcompany() {
      //获取公司信息
      let v = this;
      var em = {},
        emChar = v.emojiChar.split("-");
      var emojis = [];
      v.dynamic_lists = [];
      v.emoji.forEach(function(v, i) {
        em = {
          char: emChar[i],
          emoji: "0x1f" + v
        };
        emojis.push(em);
      });
      v.emojis = emojis;

      WXAJAX.POST(
        {
          companyId: v.COMPANYID
        },
        "",
        "/goods/getCompanyInfo/V2"
      )
        .then((data, code) => {
          if (data) {
            v.company_msg = {
              admin_logo: data.companyLogo || "",
              company_logo: data.companyLogo || "",
              company_name: data.companyName || ""
            };
          }
        })
        .catch(err => {
          v.company_msg = {};
        });
    },
    inits(refresh = "") {
      //动态
      let v = this;
      if (v.isLoading) {
        wx.hideLoading();
        return;
      }
      v.isLoading = true;
      // wx.showLoading();
      WXAJAX.POST(
        {
          companyId: v.COMPANYID,
          pageNum: v.page,
          refresh,
          cardId: this.currentCompany.cardId || v.CARDID || 0
        },
        "",
        "/personal/getDynamicInfo"
      )
        .then((data, code) => {
          wx.hideLoading();
          if (data) {
            // wx.showToast({
            //   title: '更新成功',
            //   icon: 'success',
            //   duration: 1000
            // })
            let nowTime = +new Date(),
              addTime = "",
              diff = 0;
            data.forEach(function(i, k) {
              i.photos = i.photos ? i.photos.split(",") : [];
              i.createTime = util.getdate(i.createTime, "dateTime");
              i.doThumbsName = i.doThumbsName ? i.doThumbsName.split(",") : [];
                i.logo = i.logo ? i.logo.split(",") : [];
                //i.logo.reverse();
              /*addTime = +new Date(i.createTime);
            diff = nowTime - addTime ;
            if( diff < 60*60*1000){
                console.log('超出一小时');
                i.createTime = diff / 1000 / 60 ;
                i.createTime = i.createTime +'分钟前' ;
            }*/
            });
            v.dynamic_lists = [...v.dynamic_lists, ...data];
           // console.log(v.dynamic_lists);
            v.page++;
            setTimeout(function() {
              v.isLoading = false;
            }, 500);
          } else {
            // wx.showToast({
            //   title: '没有更多信息',
            //   icon: 'success',
            //   duration: 1000
            // })
            // setTimeout(function () {
            //   v.nodata = true ;
            //   v.isLoading = false ;
            // },500);
          }
        })
        .catch(err => {
          console.log(err);
          wx.hideLoading();
          if (err.code == 204) {
            v.nodata = true;
          }
          setTimeout(function() {
            v.isLoading = false;
          }, 500);
        });
    },
    operate_tap(index) {
      //显示点赞或者评论
      let status = !this.dynamic_lists[index].operate_show;
      this.$set(this.dynamic_lists[index], "operate_show", status);
    },
    addComment(index1, replayComment) {
      //添加评论
      let isLogin = HandleLogin.returnIsLogin();
      if (!isLogin) {
        uni.showToast({
          title: "请先登录,才可以评论喔",
          icon: "none"
        });
        return;
      }
      if (
        (replayComment.userName && !replayComment.commentId) ||
        (replayComment.commentId &&
          replayComment.userId == wx.getStorageSync("userId"))
      ) {
        return;
      }

      this.input_show = true;
      this.replayComment = replayComment;
      // this.comment_focus = true ;
      this.add_comments_index = index1;
      let v = this;
      setTimeout(function() {
        v.$set(v.dynamic_lists[index1], "operate_show", false);
        v.comment_focus = true;
      }, 200);
    },
    smile_tap() {
      //显示关闭emoji
      if (!this.emoji_show) {
        this.emoji_show = true;
        this.comment_focus = false;
        // this.height_class = 'h195'
      } else {
        this.comment_focus = false;
      }
    },
    inputgetFocus(that, e) {
      //input框focus时
      let v = this;
      /*
                      if(v.keyboard_height == 0) {
                          wx.getSystemInfo({
                              success(res) {
                                  let tabbar = res.screenHeight - res.windowHeight ;
                                  v.keyboard_height = e.target.height - tabbar + 'px';
                              }
                          });
                      }*/
      /*   v.comment_focus = false ;
         setTimeout(function () {
             v.comment_focus = true ;
         },100)*/
      /*   this.emoji_show = false ;
     let v= this ;
     console.log('commentFocus')
     v.comment_focus = false ;
     setTimeout(function () {
         // v.comment_focus = true ;
     },100)*/
    },
    emoji_tap(char) {
      //点击表情时
      this.comments = this.comments + char;
    },
    emoji_del() {
      console.log("del");
      this.comments.substr(0, this.comments.length - 1);
      console.log(this.comments);
    },
    tap_all() {
      this.input_show = false;
      this.comment_focus = false;
      try {
        if (this.dynamic_lists[this.add_comments_index]) {
          this.$set(
            this.dynamic_lists[this.add_comments_index],
            "operate_show",
            false
          );
        }
      } catch (e) {
        console.log("e", e);
      }
    },
    clearPage() {
      //页面还原
      console.log("clearpage");
      this.input_show = false;
      this.comment_focus = false;
      this.comments = "";
      try {
        this.$set(
          this.dynamic_lists[this.add_comments_index],
          "operate_show",
          false
        );
      } catch (e) {}
    },
    inputConfirm() {
      //输入完成
      this.emoji_show = false;
      this.comment_focus = false;

      WXAJAX.POST(
        {
          dynamicId: this.dynamic_lists[this.add_comments_index].dynamicId,
          parentId: this.replayComment.commentId || 0,
          cardId: this.currentCompany.cardId || this.CARDID || 0,
          text: this.comments
        },
        "",
        "/personal/doComment"
      ).then(res => {
        let comments = this.dynamic_lists[this.add_comments_index];
        comments.commentModelList = comments.commentModelList ? comments.commentModelList : [];
        if (
          // comments.commentModelList.length < 10 ||
          // comments.commentNum > comments.commentModelList.length
            true
        ) {
          this.dynamic_lists[this.add_comments_index].commentModelList.push({
            text: this.comments,
            replyName: this.replayComment.userName || "",
            userName: wx.getStorageSync("USERNAME")
          });
          this.$set(
            this,
            "dynamic_lists",
            JSON.parse(JSON.stringify(this.dynamic_lists))
          );
        }
        this.input_show = false;
        this.comments = "";
      });
    },
    zan(index1, isThumbs, dynamicId) {
        // console.log(this.dynamic_lists[index1]);
      //点赞
      let isLogin = HandleLogin.returnIsLogin();
      if (!isLogin) {
        uni.showToast({
          title: "请先登录,才可以点赞喔",
          icon: "none"
        });
        return;
      }

      let v = this;
        WXAJAX.POST(
            {
                dynamicId: dynamicId,
                cardId: wx.getStorageSync("CARDID"),
                logo:wx.getStorageSync('avatarUrl')
            },
            "",
            "/personal/doDynamicThumbs"
        )
            .then(data => {
                wx.hideLoading();
                if (data) {
                    //点赞
                  //  console.log(v.dynamic_lists[index1]);
                    v.dynamic_lists[index1].logo.push(data); //添加头像
                    v.$set(v.dynamic_lists[index1], "isThumbs", 1);
                    v.$set(
                        v.dynamic_lists[index1],
                        "logo",
                        v.dynamic_lists[index1].logo
                    );
                } else {
                    v.dynamic_lists[index1].logo.pop();
                    v.$set(v.dynamic_lists[index1], "isThumbs", 0);
                    v.$set(
                        v.dynamic_lists[index1],
                        "logo",
                        v.dynamic_lists[index1].logo
                    );
                }
                let status = !v.dynamic_lists[index1].operate_show;
                v.$set(v.dynamic_lists[index1], "operate_show", status);
            })
            .catch(err => {
                console.log(err);
                wx.hideLoading();
            });
    }
  },
  computed: {
    ...mapState({
      currentCompany: state => state.currentCompany
    }),
      ...mapGetters(["subscriptionNew"])
  },
  watch: {
    currentCompany: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal) {
          if (newVal.userId === wx.getStorageSync("userId")) {
            this.isShowTalk = false;
          } else {
            this.isShowTalk = true;
            this.targetAvatarUrl = newVal.logo;
          }
        }
      }
    }
  },
  // onReachBottom() {
  //   let v = this ;
  //   console.log('onReachBottom');
  //   v.inits();
  // },
  onShareAppMessage(e) {
    let dynamicid = null;
    try {
      dynamicid = e.target.dataset.dynamicid;
    } catch (e) {}
    this.addDynamicForwardRecord(this.CARDID, dynamicid);
    let uuid = this.CARDID + "" + new Date().getTime();
    addShareRecord(this.COMPANYID, 4, dynamicid, uuid).then(
      res => {},
      err => {}
    );

    let url = dynamicid
      ? `/pages/dynamicDetail/main?dynamicId=${dynamicid}&companyId=${this.COMPANYID}&cardId=${this.CARDID}&goType=1&shareId=${uuid}`
      : `/pages/Dynamic/main?companyId=${this.COMPANYID}&cardId=${this.CARDID}&goType=1&shareId=${uuid}`;

    return {
      path: url,
      success(e) {
        wx.showShareMenu({
          withShareTicket: true
        });
      },
      fail(e) {
        console.log("失败-- ", e);
      }
    };
  },
  async onPullDownRefresh() {
    console.log("onPullDownRefresh");
    // // to doing..
    // // 停止下拉刷新
    // wx.showNavigationBarLoading();
    // this.page = 1 ;
    // this.dynamic_lists = [] ;
    // this.nodata = false ;
    // this.isLoading = false ;
    // this.inits();
    // this.getAd();
    // wx.stopPullDownRefresh();
    // setTimeout(function () {
    //   wx.hideNavigationBarLoading();
    // },300)
  }
};
</script>

<style>
/* page{
    background: white;
  } */
.hide {
  display: none;
}
.reviews{
    bottom: 90rpx;
}
.dynamic {
  overflow: hidden;
  height: 1240upx;
  /* padding-bottom: 48px; */
}
.dynamic-content {
  overflow: auto;
  height: 1008upx;
}
.dynamic-title {
  position: absolute;
  top: -60upx;
  right: 30upx;
  z-index: 10;
}
</style>
