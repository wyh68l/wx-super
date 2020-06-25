<template>
  <div class="h100p toppage pb50" :class="pageFixed ? 'fix' : '' " id="CONT">
    <!--顶部-->
    <div class="pl35 pt10 textc pr35 pb9 bgfff disflex jsbet fix_top borderbox fs12 c78">
      <div @click="addWx">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/im_msg.png"
          alt
          class="w30 h30"
        />
        <p class="pt8">加微信</p>
      </div>
      <div @click="makePhone">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel_blue.png"
          alt
          class="w30 h30"
        />
        <p class="pt8">打电话</p>
      </div>
      <label v-if="!myPhone">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/im_link.png"
          alt
          class="w30 h30"
        />
        <p class="pt8">请联系我</p>
        <button open-type="getPhoneNumber" class="hide" @getphonenumber="getPhoneNumber"></button>
      </label>
      <div @click="contactMe" v-else>
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/im_link.png"
          alt
          class="w30 h30"
        />
        <p class="pt8">请联系我</p>
      </div>
    </div>
    <!--IM内容-->
    <div class="pt123 chat-box">
      <div class="im_by_time" v-if="msgCont" v-for="(msgitem,k) in msgCont.data" :key="k">
        <!--时间-->
        <p class="lh39 fs12 ca8 textc">{{indexs[k]}}</p>
        <div class="textc" v-if="msgitem.messageType == 4">
          <div
            class="sys-message"
          >{{seedName}} {{msgitem.sendId== myid ? '已收到您的联系方式' : '已向您发送了联系方式，尽快与他联系'}}</div>
        </div>
        <template v-else>
          <!--right-->
          <div class="im_right disflex pl22 pr15 im_item flex-end" v-if="msgitem.sendId== myid">
            <!--消息状态-->
            <div class="disflex column-reverse w33 fs12 ca8" v-if="msgitem.type==0">未读</div>
            <div class="disflex column-reverse w33 fs12 ca8" v-if="msgitem.type==1">已读</div>
            <!--语音-->
            <div v-if="msgitem.contentType && msgitem.contentType === 3">
              <div class="disinblock">
                <div class="output-audio-right">
                  <div class="audio-right" @click="audioPlay(msgitem.message, k)">
                    <img
                      class="ico-right"
                      v-if="urls !== msgitem.message"
                      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/card/yuyin-ico.png"
                    />
                    <img
                      class="ico-right"
                      v-else
                      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/card/yuyin-gif.gif"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!--图片-->
            <div v-else-if="msgitem.contentType && msgitem.contentType === 2">
              <img
                mode="aspectFill"
                :src="msgitem.message"
                @click="previewImg(msgitem.message)"
                style="border-radius: 10rpx;max-height: 310rpx;max-width: 310rpx"
              />
            </div>
            <!--视频-->
            <div v-else-if="msgitem.contentType && msgitem.contentType === 4">
              <video
                show-play-btn="false"
                enable-progress-gesture="false"
                vslide-gesture-in-fullscreen="false"
                play-btn-position="center"
                style="border-radius: 10rpx;max-height: 310rpx;max-width: 310rpx"
                controls="false"
                :src="msgitem.message"
              ></video>
            </div>
            <!--信息-->
            <div v-else>
              <div
                class="im_right_msg im_msg pl15 pt10 pr18 pb10 bgblue bradius5 w250 be8 posre"
                v-if="msgitem.messageType==1"
              >
                <p class="fs14 cfff im_text">{{msgitem.message}}</p>
                <span class="triangle_border_right1"></span>
              </div>
              <div
                class="im_left_msg im_msg pl8 pr23 pb15 pt14 bgfff bradius5 w250 be8 posre disflex"
                @click="toGoodsDetail(msgitem.message)"
                v-if="msgitem.messageType==3"
              >
                <img :src="msgitem.message.url" alt mode="aspectFill" class="w40 h40 bradius5 mr13" />
                <div class="flex1">
                  <p class="fs14 c38">{{msgitem.message.goodsName}}</p>
                  <p class="pt5">
                    <span class="corange fs16">￥{{priceObj[k]}}</span>
                    <!--                <span class="fs12 ca8 line-through pl10">￥666</span>-->
                  </p>
                </div>
                <span class="triangle_border_right"></span>
              </div>
              <div
                class="im_right_msg pl15 pt14 pr18 bgfff bradius5 w250 be8 posre"
                v-if="msgitem.messageType==2"
              >
                <p class="fs14 c38">
                    {{welcome}}
                    <!--您好，我是{{msgitem.message.companyName}}的{{msgitem.message.name}}，欢迎进入我的名片，有什么可以帮到您的吗？-->
                </p>
                <p class="fs12 ca8 pt10 pb9">您还可以点击查看</p>
                <div class="disflex jsbet fs12 c38 lh30 textc wrap">
                  <span class="be8 bgf5f6 borderbox w104 mb10" @click="page_turn('Product')">企业产品</span>
                  <span class="be8 bgf5f6 borderbox w104 mb10" @click="page_turn('index')">我的名片</span>
                  <span class="be8 bgf5f6 borderbox w104 mb10" @click="page_turn('WebSite')">企业官网</span>
                  <span class="be8 bgf5f6 borderbox w104 mb10" @click="page_turn('Dynamic')">企业动态</span>
                </div>
                <span class="triangle_border_right"></span>
              </div>
            </div>
            <!--头像-->
            <img :src="logo" mode="aspectFill" alt class="im_right_img ml10 w40 h40 bradius5" />
          </div>
          <!--left-->
          <div class="im_left disflex pl15 pr22 im_item" v-if="msgitem.sendId==sendId">
            <!--头像-->
            <img
              :src="userlogo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png'"
              alt
              mode="aspectFill"
              class="im_left_img mr10 w40 h40 bradius5"
            />
            <!--语音-->
            <div v-if="msgitem.contentType && msgitem.contentType === 3">
              <div class="disinblock">
                <div class="output-audio-left">
                  <div class="audio-left" @click="audioPlay(msgitem.message, k)">
                    <img
                      class="ico-left"
                      v-if="urls !== msgitem.message"
                      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/card/yuyin-ico.png"
                    />
                    <img
                      class="ico-left"
                      v-else
                      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/card/yuyin-gif.gif"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!--图片-->
            <div v-else-if="msgitem.contentType && msgitem.contentType === 2">
              <img
                mode="aspectFill"
                :src="msgitem.message"
                @click="previewImg(msgitem.message)"
                style="border-radius: 10rpx;max-height: 310rpx;max-width: 310rpx"
              />
            </div>
            <!--视频-->
            <div v-else-if="msgitem.contentType && msgitem.contentType === 4">
              <video
                style="border-radius: 10rpx;max-height: 310rpx;max-width: 310rpx"
                controls="false"
                :src="msgitem.message"
              ></video>
            </div>
            <!--信息-->
            <div v-else>
              <div
                class="im_right_msg im_msg pl15 pt10 pr18 pb10 bgfff bradius5 w250 be8 posre word-break-all"
                v-if="msgitem.messageType==1"
              >
                <p class="fs14 c38 im_text">{{msgitem.message}}</p>
                <span class="triangle_border_left"></span>
              </div>
              <div
                class="im_left_msg im_msg pl8 pr23 pb15 pt14 bgfff bradius5 w250 be8 posre disflex"
                @click="toGoodsDetail(msgitem.message)"
                v-if="msgitem.messageType==3"
              >
                <img :src="msgitem.message.url" alt mode="aspectFill" class="w40 h40 bradius5 mr13" />
                <div class="flex1">
                  <p class="fs14 c38">{{msgitem.message.goodsName}}</p>
                  <p class="pt5">
                    <span class="corange fs16">￥{{priceObj[k]}}</span>
                  </p>
                </div>
                <span class="triangle_border_left"></span>
              </div>
              <div
                class="im_right_msg pl15 pt14 pr18 bgfff bradius5 w250 be8 posre"
                v-if="msgitem.messageType==2"
              >
                <p class="fs14 c38">{{welcome}}</p>
                <p class="fs12 ca8 pt10 pb9">您还可以点击查看</p>
                <div class="disflex jsbet fs12 c38 lh30 textc wrap">
                  <span class="be8 bgf5f6 borderbox w104 mb10" @click="page_turn('Product',3)">企业产品</span>
                  <span class="be8 bgf5f6 borderbox w104 mb10" @click="page_turn('index',5)">我的名片</span>
                  <span class="be8 bgf5f6 borderbox w104 mb10" @click="page_turn('WebSite',1)">企业官网</span>
                  <span class="be8 bgf5f6 borderbox w104 mb10" @click="page_turn('Dynamic',2)">企业动态</span>
                </div>

                <span class="triangle_border_left"></span>
              </div>
            </div>

            <!--信息状态-->
            <div class="disflex textr column-reverse w33 fs12 ca8" v-if="msgitem.type==0">未读</div>
            <div class="disflex textr column-reverse w33 fs12 ca8" v-if="msgitem.type==1">已读</div>
          </div>
        </template>
      </div>
    </div>
    <div :style="{paddingBottom: isPadding === '' ? '100rpx' : '130rpx'}"></div>
    <EditInputer
      :isInput="isInput"
      :isMore="isMore"
      :isPadding="isPadding"
      :phrases="phrases"
      :text="text"
      @clickPhrasesEvent="clickPhrasesEvent"
      @closeMore="isMore = false"
      @closePhrases="phrases = false"
      @voiceIconEvent="isInput = false"
      @moreIconEvent="moreIconEvent"
      @keyboardEvent="isInput = true"
      @touchStartEvent="touchStartEvent"
      @touchEndEvent="touchEndEvent"
      @clickPhotoEvent="clickPhotoEvent"
      @clickShotEvent="clickShotEvent"
      @clickVideoEvent="clickVideoEvent"
      @inputBlurEvent="isMore = phrases = false"
      v-on:comment="getcomment"
      :titleLists="titleLists"
    />

    <!--微信复制成功-->
    <div class="fix_top w100p h100p bggray_5 disflex align-cen jscen" v-show="pageFixed">
      <!--<img src="./../../../static/images/add_wx.png" alt="" class="w326 h533">-->
    </div>

    <div v-if="isShowCourse">
      <addWxCourse :isShow="isShowCourse" @close="isShowCourse=false" />
    </div>
  </div>
</template>

<script>
import EditInputer from "@/components/editInputer";
import WebSocket from "../../utils/websocket";
import AddWxCourse from "@/components/addWxCourse";
import store from "../../store/index";
import { mapGetters, mapActions, mapMutations } from "vuex";
import WXAJAX from "../../utils/request";
// 录音
const recorderManager = wx.getRecorderManager();
// 播放音频
let myaudio = wx.createInnerAudioContext();
// 录音状态
let recorderStatus = false;
// 录音持续时间
let recorderTime = null;
export default {
  name: "",
  components: { EditInputer, AddWxCourse },
  data() {
    return {
      input_word: "",
      pageFixed: "",
      socket: null,
      messageCont: {},
        welcome:'',
      logo: "",
      myid: "",
      userlogo: "",
      sendId: "",
      times: [],
      indexs: {},
      params: {},
      priceObj: {},
      wxCode: "",
      phone: "",
      myPhone: "",
      seedName: "",
      isShowCourse: false,
      appHeight: 0,
      chatHeight: 0,
      isShow: false,
      titleLists: [
        { title: "您好，请问有智能名片的产品相关介绍文档吗？" },
        { title: "您好，请问智能名片都有什么套餐，价格是怎么样的？" },
        { title: "您好，请问有智能名片的产品相关介绍文档吗？" },
        { title: "您好，我想和贵公司合作，具体怎么操作呢？" }
      ],
      isInput: true,
      isMore: false,
      urls: "",
      isPadding: "",
      phrases: false,
      text: "按住 说话",
        formData:{}
    };
  },
  onUnload() {
    wx.setStorageSync("sendId", "");
    this.isShow = false;
    myaudio.stop();
  },
  mounted() {
    this.logo = wx.getStorageSync("avatarUrl") || "";
    this.myid = wx.getStorageSync("userId") || "";
    const res = wx.getSystemInfoSync();
    if (res.model.indexOf("iPhone X") !== -1) this.isPadding = "40rpx";

      let userId = wx.getStorageSync("userId") || "";

      this.formData = {userId, accountType:1};//过滤内容添加字段
      this.getWelcomeMes();
  },
  onShow() {
      console.log(this.msgCont,'aa');

    let v = this;
    this.isShow = true;
    const {
      type,
      specId,
      userId,
      cardId,
      logo,
      wxCode,
      phone,
      name
    } = this.$root.$mp.query;
    console.log(this.$root.$mp.query);
    this.appHeight = wx.getSystemInfoSync().windowHeight;
    this.wxCode = wxCode || "";
    this.phone = phone || "";
    this.isInput = true;
    this.isMore = false;
    this.phrases = false;
    this.urls = "";
    this.userlogo = logo || "";
    this.seedName = name || "";
    this.sendId = userId || "";
    this.myPhone = wx.getStorageSync("phone") || "";
    wx.setStorageSync("sendId", userId);
    // 获取聊天记录
    let param = {
      code: 105,
      type: type,
      specId: specId,
      clientNum: 0,
      pageSize: 20,
      cardId: cardId,
      targetId: userId
    };
    this.params = param;
    WebSocket.getChatRecord(param);
    wx.setNavigationBarTitle({
      title: v.$root.$mp.query.name
    });
    this.getCommonPhrases();
  },
  async onPullDownRefresh() {
    this.params.clientNum = this.msgCont.data.length;
    WebSocket.getChatRecord(this.params);
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 3 * 1000);
  },
  methods: {
    ...mapActions(["add", "change"]),
    ...mapMutations(["setPhone"]),

      //获取欢迎语
      getWelcomeMes(){
          WXAJAX.POST({card_id:this.params.cardId},"", "/businessCard/selectByPrimaryKey").then(res => {
              this.welcome = res.welcomeSpeech;
              this.welcome  = this.welcome?this.welcome.replace('#name#', this.seedName).replace('#company#', res.companyName):'';
              console.log(this.welcome);
          })
      },

    // 更多按钮
    moreIconEvent() {
      if (this.phrases) {
        this.phrases = false;
      }
      this.isMore = !this.isMore;
    },
    // 点击常用语
    clickPhrasesEvent() {
      this.phrases = !this.phrases;
    },
    // 预览图片
    previewImg(urls) {
      wx.previewImage({ urls: [urls + ".primary.png"] });
    },
    // 点击相册
    clickPhotoEvent() {
      // this.isMore = !this.isMore
      wx.chooseImage({
        sourceType: ["album"],
        sizeType: ["original"],
        success: res => {
          this.uploadImgFun(res.tempFilePaths, 0, 2);
        }
      });
    },
    // 递归上传
    async uploadImgFun(arr, index = 0, type) {
      wx.showLoading({ title: "上传中", mask: true });
      await this.uploadFiles(arr[index], type);
      if (index < arr.length - 1) {
        this.uploadImgFun(arr, index + 1, type);
      }
    },
    // 点击拍摄
    clickShotEvent() {
      // this.isMore = !this.isMore
      wx.chooseImage({
        sourceType: ["camera"],
        count: 1,
        success: res => {
          this.uploadFiles(res.tempFilePaths[0], 2);
        }
      });
    },
    // 点击视频{{{
    clickVideoEvent() {
      // this.isMore = !this.isMore
      wx.chooseVideo({
        maxDuration: 60,
        success: res => {
          this.uploadFiles(res.tempFilePath, 4);
        }
      });
    },
    // 播放音频
    audioPlay(url, k) {
      if (this.urls !== url) {
        this.urls = url;
        myaudio.src = url;
        myaudio.play();
        myaudio.onEnded(() => {
          this.urls = "";
        });
        myaudio.onError(res => {
          this.urls = "";
          wx.showToast({
            title: "系统错误",
            duration: 2000,
            icon: "none"
          });
        });
      } else {
        this.urls = "";
        myaudio.stop();
      }
    },
    // 触摸开始
    touchStartEvent() {
      this.text = "松开 结束";
      wx.getSetting({
        success: res => {
          if (!res.authSetting["scope.record"]) {
            wx.authorize({
              scope: "scope.record",
              success: res => {
                console.log(res);
              },
              fail: res => {
                wx.showToast({
                  title: "请先授权录音权限",
                  duration: 2000,
                  icon: "none"
                });
              }
            });
          } else {
            recorderManager.start({ duration: 60000 });
            recorderManager.onError(err => {
              wx.showToast({
                title: "录音失败，请重试",
                duration: 2000,
                icon: "none"
              });
            });
            recorderManager.onStart(() => {
              recorderStatus = true;
              recorderTime = Date.now();
              wx.showToast({
                title: "录音开始",
                duration: 60000,
                icon: "none"
              });
            });
          }
        }
      });
    },
    // 触摸结束
    touchEndEvent() {
      this.text = "按住 说话";
      setTimeout(() => {
        if (recorderStatus) {
          recorderStatus = false;
          recorderManager.stop();
          recorderManager.onStop(res => {
            wx.hideToast();
            if (Date.now() - recorderTime < 1000) {
              wx.showToast({
                title: "录音时间太短",
                duration: 2000,
                icon: "none"
              });
              return;
            }
            this.uploadFiles(res.tempFilePath, 3);
          });
        }
      }, 500);
    } /*}}}*/,
    // 上传语音、视频、图片
    uploadFiles(filePath, contentType) {
      if (contentType === 4) wx.showLoading({ title: "上传中", mask: true });
      return WXAJAX.UploadImage(filePath,this.formData)
        .then(res => {
          res = JSON.parse(res);
          wx.hideLoading();
          if (res.code == 200) {
            WebSocket.sendMessage({
              code: 103,
              message: WXAJAX.imgBackUrl + res.data,
              messageType: 1,
              contentType,
              targetId: this.$root.$mp.query.userId
            });
          }else if(data.code == "201"){
              wx.showToast({
                  title: data.message,
                  duration: 2000,
                  icon: "none"
              });
          }
        })
        .catch(err => console.log(err));
    },
    // 联系我
    contactMe() {
      WebSocket.sendMessage({
        code: 103,
        message: this.myPhone,
        messageType: 4,
        targetId: this.$root.$mp.query.userId
      });
    },
    getCommonPhrases() {
      WXAJAX.POST(
        {
          cardId: this.$root.$mp.query.cardId,
          type: 1
        },
        "",
        "/personal/selectUserCommonList"
      ).then(res => {
        this.titleLists = res
          ? res.map(val => {
              return { title: val.text };
            })
          : [
              { title: "您好，请问有智能名片的产品相关介绍文档吗？" },
              { title: "您好，请问智能名片都有什么套餐，价格是怎么样的？" },
              { title: "您好，请问有智能名片的产品相关介绍文档吗？" },
              { title: "您好，我想和贵公司合作，具体怎么操作呢？" }
            ];
      });
    },
    getPhoneNumber(e) {
      console.log(e);
      let { encryptedData, iv } = e.target;

      if (!encryptedData || !iv) {
        wx.showToast({
          title: "手机号未授权，请绑定手机号后再次发送",
          icon: "none",
          duration: 2000
        });
        return;
      }

      WXAJAX.POST(
        {
          phoneData: e.target.encryptedData,
          phoneIv: e.target.iv
        },
        "",
        "/home/getWxPhone"
      ).then(res => {
        wx.setStorageSync("phone", res);
        this.setPhone(res);
        this.myPhone = res;
        this.contactMe();
      });
    },
    toGoodsDetail(goodsInfo) {
      const { goodsId, parentId, specId } = goodsInfo;
      wx.navigateTo({
        url: `/pages/prodDetail/main?goodId=${goodsId}&parentId=${parentId}&specId=${specId}`
      });
    },
    getTime() {
      let priceObj = {};
      if (this.msgCont.data) {
        let times = this.msgCont.data.map((res, idx) => {
          if (res.messageType == 3) priceObj[idx] = res.message.price / 100;
          return res.time;
        });
        let asd = {};
        asd[0] = this.dateF(times[0]);
        for (let i = 1; i < times.length; i++) {
          let a = (times[i] - times[i - 1]) / 1000 / 60;

          if (a > 3) {
            asd[i] = this.dateF(times[i]);
          }
        }
        this.$set(this, "indexs", asd);
        this.$set(this, "priceObj", priceObj);
      }
    },
    dateF(data) {
      let year = new Date(data).getFullYear();
      let month = new Date(data).getMonth() + 1;
      let day = new Date(data).getDate();
      let h =
        new Date(data).getHours() - 10 < 0
          ? "0" + new Date(data).getHours()
          : new Date(data).getHours();
      let m =
        new Date(data).getMinutes() - 10 < 0
          ? "0" + new Date(data).getMinutes()
          : new Date(data).getMinutes();
      let s =
        new Date(data).getSeconds() - 10 < 0
          ? "0" + new Date(data).getSeconds()
          : new Date(data).getSeconds();
      let newDate = new Date();
      let year1 = newDate.getFullYear();
      let month1 = newDate.getMonth() + 1;
      let day1 = newDate.getDate();
      let result = "";
      if (year === year1 && month === month1 && day === day1) {
        result = h + ":" + m;
      } else {
        result = month + "月" + day + " " + h + ":" + m;
      }
      return result;
    },
    //            发送消息
    getcomment(data) {
      if (!data.trim()) return;

      // let messageSend = {};
      // messageSend.message = data;
      // messageSend.messageType = 1;
      // messageSend.sendId = wx.getStorageSync('userId');
      // messageSend.type = 0;
      // messageSend.time=(new Date()).getTime();
      // messageSend.targetId = this.$root.$mp.query.userId;
      // console.log("发送消息----", this.messageCont);
      //        this.$forceUpdate();
      let v = this;
      console.log(v.$root.$mp.query.userId);
      WebSocket.sendMessage({
        code: 103,
        message: data,
        messageType: 1,
        targetId: v.$root.$mp.query.userId
      });
      // this.add(messageSend);
      this.change();
      //              console.log("监听连接打开--",res,that.message,that.$root.$mp.query.type);
      // this.connect();
    },
    addWx() {
      if (!this.wxCode) {
        wx.showToast({
          title: "未绑定微信号",
          icon: "none",
          duration: 2000
        });
        return;
      }

      let v = this;
      wx.setClipboardData({
        data: this.wxCode,
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {
              /* wx.showToast({
                 title: '复制成功'
                 })*/
              v.pageFixed = true;
              v.isShowCourse = true;
              setTimeout(function() {
                v.pageFixed = false;
              }, 2000);
            }
          });
        }
      });
    },
    makePhone() {
      if (!this.phone) {
        wx.showToast({
          title: "未绑定手机号",
          icon: "none",
          duration: 2000
        });
        return;
      }

      wx.makePhoneCall({
        phoneNumber: this.phone
      });
    },
    page_turn(url, index) {
        store.commit('setCurrentTab',index);
      wx.switchTab({ url: "../" + url + "/main" });
    }
  },
  watch: {
    msgCont: {
      handler() {
        this.getTime();
        this.$nextTick(() => {
          wx.pageScrollTo({ scrollTop: 999999999 });
        });
      },
      deep: true
    }
    /**changePosition(){
        setTimeout(()=>{
          if (this.isShow) {
            wx.createSelectorQuery().select('.chat-box').boundingClientRect((rect)=>{
              this.chatHeight = rect.height;
            }).exec()
          }
        }, 100)
      }**/
  },
  computed: {
    ...mapGetters(["msgCont", "currentCompany", "changePosition"])
  }
};
</script>

<style>
.bottom-chat {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100upx;
}
.sys-message {
  display: inline-block;
  text-align: center;
  height: 50upx;
  line-height: 50upx;
  font-size: 24upx;
  color: #a8a8a8;
  border-radius: 1998upx;
  background: #e8e8e8;
  padding: 0 40upx;
  margin-bottom: 30upx;
}
.fix.toppage {
  position: fixed;
  top: 0;
  width: 100%;
  overflow: hidden;
}
.w250 {
  max-width: 500upx;
  width: auto;
}
.output-audio-right {
  width: 334upx;
  height: 80upx;
  position: relative;
}

.audio-right::before {
  content: "";
  display: block;
  width: 24upx;
  height: 24upx;
  background: #00a0e9;
  position: absolute;
  border: 1upx solid #00a0e9;
  border-radius: 6upx;
  transform: rotate(225deg);
  border-right-width: 0;
  border-top-width: 0;
  top: 0px;
  bottom: 0;
  right: -10upx;
  margin: auto;
}

.output-audio-right .audio-right {
  padding: 24upx 34upx 24upx 0;
  background: #00a0e9;
  border: 1upx solid #e8e8e8;
  position: relative;
  height: 30upx;
  border-radius: 10upx;
}

.output-audio-right .audio-right .ico-right {
  width: 24upx;
  height: 34upx;
  float: right;
  transform: rotate(0.5turn);
}
.output-audio-left {
  width: 334upx;
  height: 80upx;
  position: relative;
}

.audio-left::before {
  content: "";
  display: block;
  width: 24upx;
  height: 24upx;
  background: #fff;
  position: absolute;
  border: 1upx solid #e8e8e8;
  border-radius: 6upx;
  transform: rotate(45deg);
  border-right-width: 0;
  border-top-width: 0;
  top: 0px;
  bottom: 0;
  left: -10upx;
  margin: auto;
}

.output-audio-left .audio-left {
  padding: 24upx 34upx 24upx 0;
  background: #fff;
  border: 1upx solid #e8e8e8;
  position: relative;
  height: 30upx;
  border-radius: 10upx;
}

.output-audio-left .audio-left .ico-left {
  width: 24upx;
  height: 34upx;
  float: left;
  margin-left: 22upx;
}

.im_by_time .im_item {
  margin-bottom: 30upx;
}

/*.im_by_time .im_item:last-child {*/
/*margin-bottom: 0;*/
/*}*/

.triangle_border_right,
.triangle_border_left,
.triangle_border_right1 {
  position: absolute;
  top: 24upx;
  display: block;
  width: 24upx;
  height: 24upx;
  border-radius: 6upx;
  border: 1upx solid #e8e8e8;
  border-top: 0;
  border-left: 0;
  background: #fff;
  box-sizing: border-box;
}
.triangle_border_right1 {
  background: #00a0e9;
}
.triangle_border_right,
.triangle_border_right1 {
  right: -12upx;
  transform: rotate(-45deg);
}

.triangle_border_left {
  left: -12upx;
  transform: rotate(135deg);
}

.noread .im_msg {
  background: #00a0e9;
  color: #fff;
}

.noread .im_text {
  color: #fff;
}

.noread .triangle_border_left,
.noread .triangle_border_right,
.noread .triangle_border_right1 {
  background: #00a0e9;
  border: none;
}
</style>
