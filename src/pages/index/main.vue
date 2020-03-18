<template>
  <div class="index" :style="{height: mainHeight+'px'}">
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
      :style="{height: scrollContentHeight+'px'}"
      class="dynamic-content"
      :scroll-y="true"
      :enable-back-to-top="true"
      :scroll-anchoring="true"
      @scrolltoupper="scrolltoupper"
    >
      <Card_1 v-if="card_type == 1" :card_msg="card_msg" :isPrev="true"></Card_1>
      <div class="pb15 bgfff" v-else>
        <Card_2 v-if="card_type == 2" :card_msg="card_msg" @uploadpic="uploadpic" :isPrev="true"></Card_2>
        <Card_3 v-if="card_type == 3" :isPrev="true" :card_msg="card_msg"></Card_3>
        <Card_4 v-if="card_type == 4" :card_msg="card_msg"></Card_4>
        <Card_5 v-if="card_type == 5" :card_msg="card_msg"></Card_5>
      </div>
      <!-- <div class="pt15 card-case" @click.native="toCardCase">
                    <div class="disflex h30 bra_left_15 bg_line_blue cfff fs12 pl15 pr10 lh30 align-cen">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/cardlist.png" alt class="w24 h24" />
                        <span class="pl7">名片夹</span>
                    </div>
      </div>-->
      <view>
        <FormId>
          <div class="disflex pl15 pr15 fs18 lh44 textc jsbet bgfff user-btn-group">
            <div>
              <button
                class="share_card w165 bradius5 cblue bblue bgfff"
                open-type="share"
                hover-class="other-button-hover"
                style="margin: 0"
              >分享名片</button>
            </div>
            <div
              v-if="type == 0"
              class="bgblue bradius5 cfff w165 edit-btn"
              @click="updateMyCard"
              style="margin: 0"
            >编辑名片</div>
            <button
              v-else-if="type != 0 && hasCard"
              class="bgblue bradius5 cfff w165"
              hover-class="other-button-hover"
              @click="SaveToCustomer"
              style="margin: 0"
            >存为客户</button>
            <div
              v-else
              class="posre bgblue bradius5 cfff w165 flex-c-c create-card"
              style="margin: 0"
            >
              <!-- <div class="fs18 lh44 h44"  @click="createCard">创建名片</div>    -->
              <button
                class="share_card w165 bradius5 cfff bgblue"
                @click="createCard"
                style="margin: 0"
              >创建名片</button>
              <LoginIntercept @loginSuccess="loginInterceptSuccess" class="login-intercept" />
            </div>
          </div>
        </FormId>
      </view>
      <view>
        <div class="card_menu fs12 ca8 bgfff borderbox pl10 pr10">
          <div class="clearfix pt5 pb5 disflex operation-box">
            <FormId>
              <div
                class="shadow_gray textc bradius5 pt15 pl15 pr15 h65 mr10 business_card"
                @click="createCode"
              >
                <p class="pb3">名片码</p>
                <div class="w20">
                  <img
                    src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/ercode.png"
                    alt=" "
                    class="w20 h20"
                  />
                </div>
              </div>
            </FormId>
            <FormId>
              <scroll-view
                scroll-x
                scroll-with-animation
                class="scroll-list"
                :scroll-left="scrollLeft"
              >
                <div class="disflex">
                  <div
                    class="shadow_gray textc pt15 pl15 pr15 h65 mr10"
                    v-if="type == 0"
                    @click="toShowBill"
                  >
                    <p class="pb7">名片海报</p>
                    <img
                      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/wx_timeline.png"
                      alt=" "
                      class="w20 h20"
                    />
                  </div>
                  <div class="posre shadow_gray textc bradius5 pt15 pl15 pr15 h65 mr10">
                    <GetPhoneNumber @next="addToAddressBook">
                      <p class="pb7">同步到</p>
                      <p>通讯录</p>
                    </GetPhoneNumber>
                    <LoginIntercept @loginSuccess="loginInterceptSuccess" class="login-intercept" />
                  </div>
                  <div class="posre shadow_gray textc bradius5 pt15 pl15 pr15 h65 mr10">
                    <GetPhoneNumber @next="makePhone">
                      <p class="disflex align-cen">
                        <img
                          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel.png"
                          alt
                          class="w16 h16"
                        />
                        <span class="pl9">拨打电话</span>
                      </p>
                      <p class="c78 fbold pt7">{{card_msg.tel || '未添加'}}</p>
                    </GetPhoneNumber>
                    <LoginIntercept @loginSuccess="loginInterceptSuccess" class="login-intercept" />
                  </div>
                  <div class="posre shadow_gray textc bradius5 pt15 pl15 pr15 h65 mr10">
                    <GetPhoneNumber @next="addWx">
                      <p class="disflex align-cen">
                        <img
                          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/msg.png"
                          alt
                          class="w16 h16"
                        />
                        <span class="pl9">添加微信</span>
                      </p>
                      <p class="c78 fbold pt7">{{card_msg.wx || '未添加'}}</p>
                    </GetPhoneNumber>
                    <LoginIntercept @loginSuccess="loginInterceptSuccess" class="login-intercept" />
                  </div>
                  <div class="posre shadow_gray textc bradius5 pt15 pl15 pr15 h65 mr10">
                    <GetPhoneNumber>
                      <p class="disflex align-cen">
                        <img
                          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190425164542.png"
                          alt
                          class="w16 h16"
                        />
                        <span class="pl9">公司地址</span>
                      </p>
                      <p class="c78 fbold pt7">{{card_msg.address || '未添加'}}</p>
                    </GetPhoneNumber>
                    <LoginIntercept @loginSuccess="loginInterceptSuccess" class="login-intercept" />
                  </div>
                </div>
              </scroll-view>
            </FormId>
          </div>
          <div class="more-info" @click="scrollviewRight">
            <img
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190514143457.png"
              alt
              class="left-img"
            />
          </div>
        </div>
      </view>
      <div class="seen_peo disflex pl15 pr26 fs10 pb15 ca8 jsbet bgfff">
        <div>
          <div class="disflex">
            <img
              v-for="(v,k) in card_msg.browsePhoto"
              :key="k"
              :src="v"
              alt
              mode="aspectFill"
              class="w20 h20 bradius3 mr3"
            />
          </div>
          <p class="lh20">已有{{card_msg.browseNum}}人浏览</p>
        </div>
        <div class="textc" @click="doThumbs">
          <img
            :src="isThumbs ? 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//product-index/20190418161136.png' : 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/like.png' "
            alt
            class="w20 h20 trans2"
          />
          <p>
            靠谱
            <span class="cpurple">{{card_msg.thumbsNum}}</span>
          </p>
        </div>
      </div>
      <!--introduce begin-->
      <div class="bgf5f6 c38 fs16 pl15 pr15">
        <p class="lh44 fs16 fbold">个人简介</p>
        <div class="shadow_gray pl15 pr15 bgfff bradius5">
          <div class="pt15 disflex pb20" v-if="audioArr.src">
            <img :src="card_msg.picchecked" mode="aspectFill" alt class="w40 h40 bradius5 mr15" />
            <div class="disinblock">
              <div class="output-audio">
                <!-- 默认状态 -->
                <div
                  class="audio"
                  v-if="audioArr.bl==false"
                  @click="audioPlay"
                  :data-id="audioArr.id"
                  :data-bl="audioArr.bl"
                >
                  <img
                    class="ico"
                    src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/card/yuyin-ico.png"
                  />
                </div>
                <!-- 当前正在播放状态 -->
                <div
                  class="audio"
                  v-if="audioArr.bl==true"
                  @click="audioStop"
                  :data-id="audioArr.id"
                  :data-bl="audioArr.bl"
                >
                  <img
                    class="ico"
                    src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/card/yuyin-gif.gif"
                  />
                </div>
              </div>
            </div>
            <span class="fs12 ca8 disflex column-reverse">{{audioArr.time + '"' || 0 + '"'}}</span>
          </div>
          <div
            class="fs14 self_introduce lh22"
            :style="{height:seemore?introHeight : '' }"
            v-if="introduce"
          >
            <div
              class="introduce pb20"
              :style="{'padding-top': audioArr.src ? '0' : '40rpx'}"
            >{{introduce}}</div>
          </div>
          <div class="more fs12 ca8 lh40 textc" @click="seemore = !seemore" v-if="moreshow">了解更多</div>
        </div>
      </div>
      <!--公司视频-->
      <div class="pl15 pr15" v-if="currentCompany.videoList">
        <p class="lh44 fs16 c38 fbold">个人视频</p>
        <div class="disflex wrap jsbet">
          <!--<div class="bgfff h211 shadow_gray">{{}}</div>-->
          <div
            v-for="(videoItem, index) in currentCompany.videoList"
            :key="index"
            class="bgfff overhidden"
            :class=" index === 0 ? 'firstVideo' : 'notFirstVideo'"
          >
            <video
              :id="'myVideo'+ videoItem.videoId"
              class="disblock"
              v-if="playIndex === videoItem.videoId"
              :title="videoItem.videoTitle"
              :poster="videoItem.videoCover || ''"
              :src="videoItem.videoUrl"
              objectFit="cover"
              enable-danmu
              danmu-btn
              controls
              :autoplay="true"
            ></video>
            <div
              class="posre"
              :class="index === 0 ? 'w100p h194' : 'w168 h94'"
              @click="showVideo(videoItem.videoId)"
              v-else
            >
              <img
                mode="aspectFill"
                :src="videoItem.videoCover || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619324240.png'"
                alt
                :class="index === 0 ? 'w100p h194' : 'w168 h94'"
              />
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619365051.png"
                alt
                class="w50 h50 posab top0 left0 right0 bottom0 mauto"
              />
            </div>
            <div class="fs14 pl15 c38 fbold">{{videoItem.videoTitle}}</div>
          </div>
        </div>
      </div>
      <!--introduce end-->
      <!--pic begin-->
      <div class="bgf5f6 c38 fs16" v-if="self_photos.length">
        <p class="lh44 fs16 pl15 fbold">我的照片</p>
        <!-- 没有照片直接不显示此模块，此处不要 -->
        <!-- <div class="textc shadow_gray pl15 pr15 bgfff bradius5" style="height: 104px" v-if="self_photos.length == 0">
                暂无图片
        </div>-->
        <div>
          <img
            :lazy-load="true"
            :src="v"
            alt
            v-for="(v,k) in self_photos"
            :key="k"
            mode="widthFix"
            class="w100p h375"
            @click="previewImage(v)"
          />
        </div>
      </div>
      <!--pic end-->
      <!--bottom-->
      <div class="textc lh42 fs12 ca8 bgf5f6">- 汉全科技集团出品 -</div>
      <!--右边悬浮框-->
      <!-- <div class="index_float_right trans2 overhidden">
                <RightFloat :isShow="isShow" @clickRightRowEvent="clickRightRowEvent"></RightFloat>
                <div :class="{fadeInRight: !isShow, fadeOutRight: isShow}" style="width: 40rpx;right: 0;border-top-left-radius: 10rpx;border-bottom-left-radius: 10rpx" class="animated posfix fs10 ca8 textc floats trans2 bottom30 shadow_gray bgfff pb15" >
                    <div class="pt16" @click="clickRightRowEvent">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right_row.png" alt style="width: 30rpx;transform: rotate(180deg);height: 30rpx;" />
                    </div>
                </div>
      </div>-->
      <div v-if="isShowCourse">
        <addWxCourse top="136rpx" :isShow="isShowCourse" @close="isShowCourse=false" />
      </div>
    </scroll-view>

    <FloatButtons
      class="index_float_right trans2 overhidden"
      :isShowTalk="isShowTalk"
      :avatarUrl="targetAvatarUrl"
      @talk="talk"
      @loginInterceptSuccess="loginInterceptSuccess"
    ></FloatButtons>
  </div>
</template>
<script>
let myaudio = wx.createInnerAudioContext();
myaudio.obeyMuteSwitch = false;

import RightFloat from "@/components/rightFloat"; //
import FloatButtons from "@/components/FloatButtons.vue";
import GetPhoneNumber from "@/components/getPhoneNumber"; //
import AddWxCourse from "@/components/addWxCourse";
import Card_1 from "@/components/card_1"; //
import Card_2 from "@/components/card_2"; //
import Card_3 from "@/components/card_3"; //
import Card_4 from "@/components/card_4"; //
import Card_5 from "@/components/card_5"; //

import FormId from "@/components/formId";
import NavBarByUser from "@/components/NavBarByUser.vue";

import { mapActions, mapGetters } from "vuex";
import WXAJAX from "../../utils/request";
import util from "../../utils/index";
import HandleLogin from "@/utils/handleLogin";
import LoginIntercept from "@/components/LoginIntercept";

export default {
  data() {
    return {
      introduce: "", //介绍
      seemore: false,
      introHeight: "",

      //音频列表
      audioArr: {
        id: "0",
        src: "",
        time: "",
        bl: false,
        startTime: 0
      },
      card_type: 1, //名片样式
      type: 0, //0我的名片，1别人名片
      card_msg: {
        //名片信息
        username: "",
        post: "",
        tel: "",
        company_logo: "",
        picchecked: "",
        company: ""
      },
      COMPANYID: 0,
      CARDID: 0,
      playIndex: "",
      moreShow: false,
      self_photos: [],
      isThumbs: 0, //是否点赞
      right_float_show: false, //右边悬浮框
      goType: 0, // 0小程序进入，1分享进入
      hasCard: false, //  是否有名片
      isShowCourse: false,
      isShow: true,
      avatarUrl: "", //用户的头像地址,
      isLogin: HandleLogin.returnIsLogin() || false, //是否已经登录
      isShowTalk: true, //是否显示右边侧边栏的聊一聊
      isShowLoginGuide: true, //是否显示登录引导页,
      targetAvatarUrl: "", //当前目标的人物头像
      scrollContentHeight: 0, //中间滚动区域的高度
      mainHeight: 0, //整体高度
      scrollLeft: 0
    };
  },

  components: {
    RightFloat,
    Card_1,
    Card_2,
    Card_3,
    Card_4,
    Card_5,
    FormId,
    GetPhoneNumber,
    AddWxCourse,
    NavBarByUser,
    FloatButtons,
    LoginIntercept
  },

  onShareAppMessage(e) {
    const { name, companyName, position } = this.currentCompany;
    let shareSpeech = (this.currentCompany || "").shareSpeech || "";
    try {
      shareSpeech = shareSpeech
        .replace("#name#", name)
        .replace("#company#", companyName);
    } catch (e) {
      console.error("获取分享语出现错误");
    }

    return {
      title:
        shareSpeech ||
        `您好，我是${companyName || ""}的${position || ""}${name ||
          ""}，敬请惠存!`,
      path:
        "/pages/index/main?cardId=" +
        this.CARDID +
        "&companyId=" +
        this.COMPANYID +
        "&goType=1",
      success(e) {
        wx.showShareMenu({
          withShareTicket: true
        });
      },
      fail(e) {
        console.log("失败分享名片--- ", e);
      }
    };
  },
  async onLoad(options) {
    if (options.cardId) {
      //从分享的名片页面进入
      wx.setStorageSync("COMPANYID", options.companyId);
      wx.setStorageSync("CARDID", options.cardId);
      this.goType = options.goType;
    } else if (
      !wx.getStorageSync("COMPANYID") ||
      !wx.getStorageSync("CARDID")
    ) {
      // 在缓存中存在COMPANYID和CARDID标识 通过太阳码扫码进入，在APP.vue中已经设置了COMPANYID和CARDID，则直接查询太阳码扫码进入的名片详情
      // 如果没有，则需要查询默认名片
      this.getAllCard();
    }
  },
  onShow() {
    //获取名片的公司
    let lastCardId = this.CARDID;
    this.COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    this.CARDID = wx.getStorageSync("CARDID") || 0;
    this.hasCard = wx.getStorageSync("hasCard");
    this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    this.isLogin = HandleLogin.returnIsLogin() || false;

    //缓存存储的cardid和当前页面的cardid不相等，或者 当前的card_msg 不存在，或者编辑卡片后返回
    let refreshCard = wx.getStorageSync("refreshCard") || false;
    if (lastCardId !== this.CARDID || !this.card_msg.cardId || refreshCard) {
      wx.removeStorageSync("refreshCard");
      this.inits();
    } else {
      this.inits();
    }
  },
  onHide() {
    myaudio.stop();
  },
  async onPullDownRefresh() {
    // to doing..
    // 停止下拉刷新
    // wx.showNavigationBarLoading();
    // this.inits(1);
    // wx.stopPullDownRefresh();
    // setTimeout(function () {
    //     wx.hideNavigationBarLoading();
    // }, 300);
  },
  onPageScroll() {
    this.right_float_show = false;
  },
  computed: {
    ...mapGetters(["currentCompany"])
  },
  async mounted() {
    let a = await util.systemIfo();
    this.mainHeight = a.windowHeight;
    this.scrollContentHeight = a.windowHeight - getApp().globalData.navHeight;
  },
  methods: {
    ...mapActions(["setCurrentCompany"]),
    getAllCard() {
      WXAJAX.POST(
        {
          name: "",
          pageNum: 1
        },
        "",
        "/businessCard/seeDetail",
        "1"
      )
        .then(data => {
          let selfCard = null;
          let defaultCard = null;
          // state : 1 -- 默认 ， 2 -- 浏览记录 ， 3 -- 自己的
          if (data) {
            for (let index = 0; index < data.length; index++) {
              if (selfCard || defaultCard) {
                break;
              }
              const i = data[index];
              const cardData = {
                picchecked: i.logo || "",
                username: i.name || "",
                tel: i.phone || "",
                wx: i.personalWx || "",
                company_wx: i.companyWx || "",
                email: i.email || "",
                post: i.position || "",
                company: i.companyName,
                company_logo: i.companyLogo,
                cardId: i.cardId,
                companyId: i.companyId,
                recordId: i.recordId,
                shareSpeech: i.shareSpeech || ""
              };
              if (i.state === 3) {
                selfCard = cardData;
              } else if (i.state === 1) {
                //默认名片
                if (defaultCard == null) {
                  defaultCard = cardData;
                }
              }
            }
            if (selfCard) {
              console.log(selfCard);
              this.CARDID = selfCard.cardId;
              wx.setStorageSync("CARDID", selfCard.cardId);
              wx.setStorageSync("COMPANYID", selfCard.companyId);
            } else if (defaultCard) {
              this.CARDID = defaultCard.cardId;
              wx.setStorageSync("CARDID", defaultCard.cardId);
              wx.setStorageSync("COMPANYID", defaultCard.companyId);
            }

            if (this.CARDID) {
              this.inits(1);
            }
          }
        })
        .catch(err => {
          if (err.code == 401) {
            this.islogin = false;
          }
        });
    },
    scrollviewRight() {
      this.scrollLeft += 280;
    },
    //下拉刷新
    scrolltoupper(e) {
      // wx.showLoading({
      // title: '获取最新数据中',
      // });
      this.inits(1);
    },
    clickOne() {
      console.log("click");
    },
    clickRightRowEvent() {
      this.isShow = !this.isShow;
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
      this.loginInterceptSuccess();
      this.getAllCard();
    },
    // 其他监听事件登录 成功回调
    loginInterceptSuccess() {
      this.isLogin = true;
      this.hasCard = wx.getStorageSync("hasCard") || false;
      this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    },
    loginFailed() {
      this.isShowLoginGuide = true;
    },
    toShowBill() {
      if (!HandleLogin.returnIsLogin()) {
        this.loginGuide();
        return;
      }
      wx.navigateTo({
        url: "/pages/showBill/main?cardId=" + this.CARDID
      });
    },
    showVideo(index) {
      this.playIndex = index;
    },
    inits(refresh) {
      this.findCardDetail(refresh);
    },
    findCardDetail(refresh) {
      let url = "/businessCard/cardDetails";
      //获取数据
      // wx.showLoading();
      WXAJAX.POST(
        {
          cardId: this.CARDID,
          refresh: refresh || ""
        },
        "",
        url
      )
        .then((data, code) => {
          wx.hideLoading();
          if (data) {
            if (data.soundRecording) {
              this.audioArr = {
                bl: false,
                time: data.soundTime || 0,
                id: 1,
                src: data.soundRecording
              };
            } else {
              this.audioArr = {
                bl: false,
                time: 0,
                id: 1,
                src: ""
              };
            }
            this.card_msg = {
              cardId: data.cardId,
              companyId: data.companyId,
              picchecked: data.logo || "",
              username: data.name || "",
              tel: data.phone || "",
              wx: data.personalWx || "",
              company_wx: data.companyWx || "",
              email: data.email || "",
              post: data.position || "",
              company: data.companyName,
              company_logo: data.companyLogo,
              browseNum: data.browseNum || 0,
              thumbsNum: data.thumbsNum,
              address: data.address || "",
              browsePhoto: data.browsePhoto ? data.browsePhoto.split(",") : []
            };
            this.introduce = data.briefIntroduction || "";
            this.self_photos = data.photo ? data.photo.split(",") : [];
            this.card_type = data.style + 1;
            this.type = data.cardType;
            this.isThumbs = data.isThumbs;
            wx.setStorageSync("CARDTEL", data.phone);

            this.setCurrentCompany(data);
            if (this.currentCompany.userId === wx.getStorageSync("userId")) {
              this.isShowTalk = false;
            } else {
              this.isShowTalk = true;
              this.targetAvatarUrl = this.currentCompany.logo;
            }
            this.$nextTick(() => {
              this.getIntroHeight();
            });
          }
        })
        .catch(err => {
          this.card_msg = {};
          console.log(err);
          wx.hideLoading();
        });
    },
    toCardCase() {
      //名片夹
      wx.redirectTo({ url: "../cardCase/main" });
    },
    getIntroHeight() {
      let v = this;
      wx.createSelectorQuery()
        .select(".introduce")
        .boundingClientRect(function(rect) {
          if (!rect) return;

          if (rect.height < 107) {
            v.moreShow = false;
          } else {
            v.moreShow = true;
          }
          v.introHeight = rect.height + "px";
        })
        .exec();
    },
    //音频播放
    audioPlay(e) {
      var that = this,
        id = e.currentTarget.dataset.id,
        key = e.currentTarget.dataset.key,
        audioArr = that.audioArr,
        vidSrc = audioArr.src;

      if (!vidSrc) {
        return;
      }

      myaudio.src = vidSrc;
      myaudio.autoplay = true;
      myaudio.startTime = 0;

      //切换显示状态
      that.$set(that.audioArr, "bl", true);
      // audioArr.bl = true;

      //开始监听
      myaudio.onPlay(() => {
        that.audioArr = audioArr;
      });

      //结束监听
      myaudio.onEnded(() => {
        audioArr.bl = false;
        myaudio.stop();
        myaudio.destroy();
        myaudio = wx.createInnerAudioContext();
        myaudio.obeyMuteSwitch = false;
        that.$set(that.audioArr, "bl", false);
      });
    },
    // 音频停止
    audioStop(e) {
      var that = this,
        key = e.currentTarget.dataset.key,
        audioArr = that.audioArr;
      //切换显示状态
      audioArr.bl = false;

      myaudio.stop();
      myaudio.destroy();
      myaudio = wx.createInnerAudioContext();
      myaudio.obeyMuteSwitch = false;
    },
    createCode() {
      if (!HandleLogin.returnIsLogin()) {
        this.loginGuide();
        return;
      }
      WXAJAX.POST(
        {
          cardId: this.CARDID
        },
        "",
        "/businessCard/getWxTwoCode"
      )
        .then(data => {
          wx.navigateTo({ url: "/pages/cardCode/main?code=" + data });
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    page_turn(url) {
      //名片夹
      if (url === "cardCode") {
        wx.setStorageSync({
          wxCodeMsg: {
            name: this.card_msg.name,
            logo: this.card_msg.logo,
            company_logo: this.card_msg.company_logo,
            post: this.card_msg.post
          }
        });
        wx.navigateTo({
          url:
            "../" +
            url +
            "/main?companyId=" +
            this.COMPANYID +
            "&cardId=" +
            this.CARDID
        });
      } else {
        wx.navigateTo({ url: "../" + url + "/main" });
      }
      // wx.redirectTo({url:'../'+url+'/main'})
    },
    uploadpic(type) {
      //card2 选择公司图片
    },
    createCard() {
      // if(!HandleLogin.returnIsLogin()){
      //     this.loginGuide();
      //     return ;
      // }
      this.toCreatePage();
    },
    SaveToCustomer() {
      if (!HandleLogin.returnIsLogin()) {
        this.loginGuide();
        return;
      }
      //存为客户
      util.toMiniProgram(
        `/pages/clientAdd/main?type=userAdd&goType=1&cardId=${this
          .currentCompany.cardId || ""}&userId=${this.currentCompany.userId ||
          ""}`
      );
    },
    updateMyCard() {
      if (!HandleLogin.returnIsLogin()) {
        this.loginGuide();
        return;
      }
      wx.navigateTo({ url: "../editCard/main?type=edit" });
    },
    addToAddressBook() {
      //添加到通讯录
      wx.addPhoneContact({
        firstName: this.card_msg.username,
        mobilePhoneNumber: this.card_msg.tel,
        organization: this.card_msg.company,
        success: function(res) {
          console.log("success", res);
        },
        fail: function(err) {
          console.log(err);
        }
      });
    },
    makePhone() {
      //拨打电话
      this.addCallsPhoneRecord(this.card_msg.cardId); // 好像没用，是underfind
      util.MakePhone(this.card_msg.tel || "");
    },
    addWx() {
      //添加微信
      let v = this;
      if (v.card_msg.wx) {
        wx.setClipboardData({
          data: v.card_msg.wx,
          success: function(res) {
            wx.getClipboardData({
              success: function(res) {
                v.isShowCourse = true;
                wx.showToast({
                  title: "复制成功"
                });
              }
            });
          }
        });
      } else {
        wx.showToast({
          title: "还没有添加微信呢！",
          duration: 2000,
          icon: "none"
        });
      }
    },
    previewImage(src) {
      //点击图片放大
      if (src == "暂无") return;
      var v = this;
      wx.previewImage({
        current: src,
        urls: v.self_photos
        // urls必须是数组 不然会报错
      });
    },
    doThumbs() {
      //点赞
      wx.showLoading();
      WXAJAX.POST(
        {
          cardId: this.CARDID
        },
        "",
        "/businessCard/doThumbs"
      )
        .then(data => {
          wx.hideLoading();
          if (this.isThumbs) {
            this.$set(this.card_msg, "thumbsNum", --this.card_msg.thumbsNum);
          } else {
            this.$set(this.card_msg, "thumbsNum", ++this.card_msg.thumbsNum);
          }
          this.isThumbs = !this.isThumbs;
        })
        .catch(err => {
          wx.hideLoading();
        });
    }
  },
  created() {}
};
</script>
<style>
.more-info {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  height: 262upx;
  width: 30upx;
  background: white;
  /* box-shadow: 0px 0px 20upx 0px rgba(56, 56, 56, 0.1); */
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-info .left-img {
  width: 10upx;
  height: 20upx;
}

.operation-box {
  margin-left: 130upx;
  margin-right: 20upx;
}

.business_card {
  position: absolute;
  box-sizing: border-box;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 0 50% 50% 0;
  display: flex;
  align-items: center;
  padding-top: 0;
  width: 132upx;
}

.business_card p {
  writing-mode: tb-rl;
}

.index {
  position: relative;
}

.user-btn-group > * {
  margin: 0;
}

.card_menu {
  position: relative;
}

.scroll-list {
  width: 567upx;
  white-space: nowrap;
  padding: 20upx 40upx 20upx 20upx;
}

.scroll-list > div {
  white-space: nowrap;
  box-sizing: border-box;
}

.self_introduce {
  min-height: 214upx;
  transition: 0.1s;
  overflow: hidden;
}

.self_introduce.higher {
  height: auto;
}

.output-audio {
  width: 334upx;
  height: 80upx;
  position: relative;
  margin-right: 22upx;
}

.audio::before {
  content: "";
  display: block;
  width: 20upx;
  height: 20upx;
  background: #f5f5f6;
  position: absolute;
  border: 1upx solid #e8e8e8;
  border-radius: 8upx;
  transform: rotate(45deg);
  border-right-width: 0;
  border-top-width: 0;
  top: 0px;
  bottom: 0;
  left: -12upx;
  margin: auto;
}

.output-audio .audio {
  padding: 24upx 0 24upx 34upx;
  background: #f5f5f6;
  border: 1upx solid #e8e8e8;
  position: relative;
  height: 30upx;
  border-radius: 10upx;
}

.output-audio .audio .ico {
  width: 24upx;
  height: 34upx;
  float: left;
}

scroll-view {
  background: #fff;
}

.edit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-case {
  position: fixed;
  right: 0;
  top: 40upx;
  z-index: 999;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
  background-color: transparent;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 20upx transparent;
  border-radius: 20upx;
  background-color: transparent;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 20upx;
  -webkit-box-shadow: inset 0 0 20upx transparent;
  background-color: transparent;
}

video {
  width: 100%;
  height: 388upx;
  border-radius: 10upx 10upx 0 0;
}

.firstVideo {
  width: 100%;
  border-radius: 10upx;
}

.firstVideo div {
  line-height: 84upx;
}

.notFirstVideo {
  width: 336upx;
  margin-top: 20upx;
  border-radius: 10upx 10upx 0 0;
}

.notFirstVideo video {
  height: 188upx;
}

.notFirstVideo div {
  line-height: 48upx;
}

.create-card {
  align-items: stretch;
}
</style>
