<template>
  <div class="pb50">
    <div class="edit_card_top trans2" :class="changeing ? 'fade' : '' ">
      <div v-show="card_style == 0">
        <Card_1 :card_msg="card_msg"></Card_1>
      </div>
      <div v-show="card_style == 1">
        <Card_2 :card_msg="card_msg" @uploadpic="uploadpic"></Card_2>
      </div>
      <div v-show="card_style == 2">
        <Card_3 :card_msg="card_msg"></Card_3>
      </div>
      <div v-show="card_style == 3">
        <Card_4 :card_msg="card_msg"></Card_4>
      </div>
      <div v-show="card_style == 4">
        <Card_5 :card_msg="card_msg"></Card_5>
      </div>
    </div>
    <!--名片样式-->
    <div class="bgfff pl16 pb10 pt15 mb10">
      <p class="fs16 c38 fbold pb12">名片样式</p>
      <div class="disflex">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card_1.png"
          alt
          class="w50 h50 mr10 bradius5 borderbox"
          :class="card_style == 0 ? 'bblue' : 'bfff' "
          @click="card_style_change(0)"
        />
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card_2.png"
          alt
          class="w50 h50 mr10 bradius5 borderbox"
          :class="card_style == 1 ? 'bblue' : 'bfff' "
          @click="card_style_change(1)"
        />
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card_3.png"
          alt
          class="w50 h50 mr10 bradius5 borderbox"
          :class="card_style == 2 ? 'bblue' : 'bfff' "
          @click="card_style_change(2)"
        />
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card_4.png"
          alt
          class="w50 h50 mr10 bradius5 borderbox"
          :class="card_style == 3 ? 'bblue' : 'bfff' "
          @click="card_style_change(3)"
        />
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card_5.png"
          alt
          class="w50 h50 mr10 bradius5 borderbox"
          :class="card_style == 4 ? 'bblue' : 'bfff' "
          @click="card_style_change(4)"
        />
      </div>
    </div>
    <div class="bgfff pl16 pr17 lh49 fs16 c38 mb11">
      <div class="disflex jsbet align-cen">
        <label for="post" class="fbold">职位</label>
        <input
          placeholder-class="place-holder"
          type="text"
          id="post"
          class="pha8 textr h49"
          placeholder="职位"
          v-model="card_msg.post"
        />
      </div>
      <div class="disflex jsbet" @click="chooseCompany">
        <label for="company" class="fbold marks pr15">公司</label>
        <div class="disflex align-cen">
          <input
            placeholder-class="place-holder"
            type="text"
            id="company"
            class="pha8 textr h49 pr15"
            placeholder="公司"
            v-model="card_msg.company"
            readonly
            disabled
          />
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
            alt
            class="w10 h10"
          />
        </div>
      </div>
    </div>
    <!--基本信息-->
    <div class="bgfff pl16 pr17 lh49 fs16 c38 mb11">
      <div class="disflex jsbet pt10 pb10">
        <span class="fbold">头像</span>
        <div class="disflex align-cen" @click="uploadpic('user', 1)">
          <img :src="card_msg.picchecked || userlogo " alt mode="aspectFill" class="w50 h50 mr13" />
          <!--   <form action="https://api.youdomain.com/file/uploadObjectOSS" method="post">
                 <input type="file" value="上传">
          </form>-->
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
            alt
            class="w10 h10"
          />
        </div>
      </div>
      <div class="disflex jsbet align-cen">
        <label for="username" class="fbold marks pr15">姓名</label>
        <input
          placeholder-class="place-holder"
          maxlength="6"
          type="text"
          id="username"
          class="pha8 textr h49 c38"
          placeholder="姓名"
          v-model="card_msg.username"
        />
      </div>
      <div class="disflex jsbet align-cen">
        <label for="tel" class="fbold marks pr15">手机号</label>
        <input
          placeholder-class="place-holder"
          type="number"
          id="tel"
          class="pha8 textr h49 c38"
          placeholder="手机号"
          v-model="card_msg.tel"
        />
      </div>
      <div class="disflex jsbet align-cen">
        <label for="wx" class="fbold">微信号</label>
        <input
          placeholder-class="place-holder"
          type="text"
          id="wx"
          class="pha8 textr h49 c38"
          placeholder="微信号"
          v-model="card_msg.wx"
        />
      </div>
      <div class="disflex jsbet align-cen">
        <label for="company_wx" class="fbold">企业微信</label>
        <input
          placeholder-class="place-holder"
          type="text"
          id="company_wx"
          class="pha8 textr h49"
          placeholder="企业微信"
          v-model="card_msg.company_wx"
        />
      </div>
      <div class="disflex jsbet align-cen">
        <label for="email" class="fbold">邮箱</label>
        <input
          placeholder-class="place-holder"
          type="text"
          id="email"
          class="pha8 textr h49"
          placeholder="邮箱"
          v-model="card_msg.email"
        />
      </div>
    </div>
    <!--个人简介-->
    <div class="bgfff pl16 pr18 pb15 pt17 fs16 mb10">
      <p class="pb10 c38 fbold">个人简介</p>
      <div class="disflex pb15">
        <img
          :src="card_msg.picchecked || userlogo"
          mode="aspectFill"
          alt
          class="w40 h40 bradius5 mr15"
        />
        <div class="disflex">
          <div class="output-audio">
            <!-- 默认状态 -->
            <div
              class="audio 111"
              v-if="audioArr.bl == false"
              @click="audioPlay"
              :data-key="audioArr.src"
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
              :data-key="audioArr.src"
              :data-id="audioArr.id"
              :data-bl="audioArr.bl"
            >
              <img
                class="ico"
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/card/yuyin-gif.gif"
              />
            </div>
          </div>
          <span class="fs12 ca8 disflex column-reverse">{{audioArr.time + '"'}}</span>
        </div>
        <button
          open-type="getUserInfo"
          lang="zh_CN"
          class="cfff bg_line_blue textc bradius5 lh40 pl10 pr10 fs16 border0"
          @getuserinfo="onGotUserInfo"
          @touchstart="record_begin"
          @touchend="record_end"
        >长按录音</button>
      </div>
      <div>
        <textarea
          name
          id
          v-model="intro"
          v-if="showTextarea"
          :focus="showTextarea"
          @blur="showTextarea=false"
          class="bgf5f6 pl16 pr16 pt15 pb15 be8 bradius5 fs16 pha8 h119 borderbox w100p"
          placeholder="文字简介(300字以内)"
        ></textarea>
        <div class="textarea" @click="showTextarea=true" v-else>{{intro || "文字简介(300字以内)"}}</div>
      </div>
    </div>
    <!--视频展示-->
    <div v-if="self_video.length === 0" class="bgfff pl16 pr18 pb15 pt17 fs16 mb10">
      <view class="pb10 c38 fbold jsbet align-cen" style="display: flex">
        <text>视频展示</text>
      </view>
      <div class="disflex wrap">
        <div class="bgfff mr10 mb7 posre" v-for="(v,k) in self_video" :key="k">
          <video
            class="bradius10 w100 h100"
            :src="v.videoUrl"
            :poster="v.videoCover || ''"
            objectFit="cover"
            controls
          ></video>
        </div>
        <div class="bgfff bdash_a8 w100 h100 add_img mr7" @click="goPage"></div>
      </div>
    </div>
    <div v-else class="bgfff pl16 pr18 pb15 pt17 fs16 mb10" @click="goPage">
      <view class="pb10 c38 fbold jsbet align-cen" style="display: flex">
        <text>视频展示</text>
        <text style="color: #51BCBD">编辑</text>
      </view>
      <div class="disflex wrap">
        <div class="bgfff mr10 mb7 posre" @click.stop="stop" v-for="(v,k) in self_video" :key="k">
          <video
            class="bradius10 w100 h100"
            :src="v.videoUrl"
            objectFit="cover"
            controls
            :poster="v.videoCover || ''"
          ></video>
        </div>
      </div>
    </div>
    <div class="bgfff pt17 pl16 pb15 mb44">
      <view class="pb10 c38 fbold jsbet align-cen" style="display: flex">
        <text>图片展示</text>
      </view>
      <div class="disflex wrap">
        <div class="bgfff bdash_a8 w100 h100 mr7 mb7 posre" v-for="(v,k) in self_photos" :key="k">
          <img mode="aspectFill" :src="v" alt class="w100p h100p" />
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/del.png"
            alt
            class="w20 h20 posab right2 top2"
            @click="delImg(k)"
          />
        </div>
        <div
          v-if="self_photos.length < 9"
          class="bgfff bdash_a8 w100 h100 add_img mr7"
          @click="uploadpic('self', 9)"
        ></div>
      </div>
    </div>
    <BottomButtonSmall :text="'保存'" :url="'save'" @btn_tap="btn_tap"></BottomButtonSmall>
    <canvas
      style="width: 500px;height: 500px;position: fixed;bottom: -4000px;z-index: -100"
      canvas-id="Canvas"
    ></canvas>
  </div>
</template>
<script>
import util from "../../utils/index";

import BottomButtonSmall from "@/components/bottom_button_small"; //
import Card_1 from "@/components/card_1"; //
import Card_2 from "@/components/card_2"; //
import Card_3 from "@/components/card_3"; //
import Card_4 from "@/components/card_4"; //
import Card_5 from "@/components/card_5"; //
import WXAJAX from "../../utils/request";

let myaudio = wx.createInnerAudioContext();
const recorderManager = wx.getRecorderManager();
const platform = wx.getSystemInfoSync().platform;
const version = wx.getSystemInfoSync().SDKVersion;
/*   if (util.compareVersion(version, '2.3.0') >= 0) {
       wx.setInnerAudioOption({
           obeyMuteSwitch: false
       })
   } else {
       wx.showModal({
           title: '提示',
           content: '当前微信版本过低，静音模式下可能会导致播放音频失败。'
       })
   }*/
export default {
  name: "",
  components: { BottomButtonSmall, Card_1, Card_2, Card_3, Card_4, Card_5 },
  data() {
    return {
      //音频列表
      audioArr: { bl: false, time: 0, id: 0 },
      begin_time: 0,
      end_time: 0,
      diff_time: 0,
      now_get_auth: false, //
      userlogo:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png", //头像
      intro: "", // 120
      card_style: 0, //名片样式
      changeing: false,
      // top_height: ['262px', '410px', '229px', '228px'],
      top_height: ["524rpx", "820rpx", "458rpx", "456rpx"],
      card_msg: {
        picchecked: "",
        username: "",
        tel: "",
        wx: "",
        company_wx: "",
        email: "",
        post: "",
        company: "",
        companyId: 0,
        company_logo: ""
      },
      self_photos: [], //个人图片
      type: "add", //新增 / 编辑
      cardId: 0,
      showTextarea: false,
      selfCompany: {},
      isLoading: false,
      self_video: []
    };
  },
  watch: {
    intro: function(newVal, oldVal) {
      if (newVal.length > 300) {
        this.intro = this.intro.slice(0, 300);
      }
    }
  },
  onLoad() {
    //是否为编辑
    if (this.$root.$mp.query.type && this.$root.$mp.query.type == "edit") {
      //编辑名片
      this.type = "edit";
      this.getMyCard();
    } else {
      this.type = "add";

      //还原数据
      this.card_msg = {
        picchecked: "",
        username: "",
        tel: "",
        wx: "",
        company_wx: "",
        email: "",
        post: "",
        company: "",
        companyId: 0,
        company_logo: ""
      };
      this.self_photos = []; //个人图片
      this.getSelfCompany();
    }
  },
  onShow() {
    // if (this.type == 'edit') this.getMyCard();

    let company = wx.getStorageSync("choose_company") || "",
      company_id = wx.getStorageSync("choose_company_id") || "",
      company_logo = wx.getStorageSync("choose_company_logo") || "";
    this.$set(this.card_msg, "company", company);
    this.$set(this.card_msg, "companyId", company_id);
    this.$set(this.card_msg, "company_logo", company_logo);
    this.now_get_auth = wx.getStorageSync("now_get_auth") || false;
  },
  onUnload() {
    //页面卸载
    myaudio.stop();
  },
  methods: {
    // 视频展示
    goPage() {
      if (this.self_video.length !== 0) {
        wx.navigateTo({
          url: "../videoExhibition/main"
        });
      } else {
        /**if (this.type === 'add') {
          wx.showToast({
            title: '请保存名片后再添加视频噢',
            duration: 2000
          })
        }**/
        // 添加视频
        wx.navigateTo({
          url: "../editVideoExhibition/main?type=create"
        });
      }
    },
    getSelfCompany() {
      WXAJAX.POST({ ignore: true }, "", "/businessCard/getCompanyId").then(
        data => {
          if (data) {
            this.selfCompany = data || {};
            this.$set(this.card_msg, "company", data.companyName);
            this.$set(this.card_msg, "companyId", data.companyId);
            this.$set(this.card_msg, "company_logo", data.companyLogo);
          }
        }
      );
    },
    // 阻止事件冒泡
    stop(e) {
      e.stopPropagation();
    },
    getMyCard() {
      //获取名片信息
      wx.showLoading();
      WXAJAX.POST({}, "", "/businessCard/getUserCard")
        .then(data => {
          wx.hideLoading();
          if (data) {
            console.log("名片data", data);
            if (data.soundRecording) {
              this.audioArr = {
                bl: false,
                time: data.soundTime,
                id: 1,
                src: data.soundRecording
              };
            }
            this.card_msg = {
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
              cardId: data.cardId
            };

            this.cardId = data.cardId;
            this.card_style = data.style;
            this.self_photos =
              data.photo == "暂无" ? [] : data.photo.split(",");
            this.self_video = data.videoList || [];
            this.intro = data.briefIntroduction || "";
            wx.setStorageSync("choose_company", this.card_msg.company);
            wx.setStorageSync("choose_company_id", this.card_msg.companyId);
            wx.setStorageSync(
              "choose_company_logo",
              this.card_msg.company_logo
            );
          } else {
            this.type = "add";
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    audioPlay(e) {
      //音频播放

      myaudio = wx.createInnerAudioContext();
      myaudio.obeyMuteSwitch = false;
      if (!this.audioArr.id) {
        wx.showToast({
          title: "您还没有录音！",
          duration: 2000,
          icon: "none"
        });
        return;
      }
      var that = this,
        id = e.currentTarget.dataset.id,
        key = e.currentTarget.dataset.key,
        audioArr = that.audioArr,
        vidSrc = audioArr.src;

      myaudio.src = vidSrc;
      myaudio.autoplay = true;

      //切换显示状态
      /*  for (var i = 0; i < audioArr.length; i++) {
            audioArr[i].bl = false;
        }*/
      audioArr.bl = true;

      //开始监听
      myaudio.onPlay(() => {
        that.audioArr = audioArr;
      });

      //结束监听
      myaudio.onEnded(() => {
        audioArr.bl = false;
        that.audioArr = audioArr;
      });
    },
    audioStop(e) {
      // 音频停止
      var that = this,
        key = e.currentTarget.dataset.key,
        audioArr = that.audioArr;
      //切换显示状态
      /* for (var i = 0; i < audioArr.length; i++) {
           audioArr[i].bl = false;
       }*/
      audioArr.bl = false;

      myaudio.stop();
      //停止监听
      myaudio.onStop(() => {
        audioArr.bl = false;
        that.audioArr = audioArr;
      });
      //结束监听
      myaudio.onEnded(() => {
        audioArr.bl = false;
        that.audioArr = audioArr;
      });
    },

    onGotUserInfo(res) {
      //获取用户信息--授权
      var data = res.mp.detail;
      this.audioArr.bl = false;
      // this.showdiaglo = false ;

      if (data.encryptedData) {
        this.now_get_auth = true;
        wx.setStorageSync("now_get_auth", true);
      } else {
        wx.showToast({
          title: "您已取消授权！",
          duration: 2000,
          icon: "none"
        });
      }
      data = null;
    },
    record_begin() {
      //手指按下
      var that = this;
      myaudio.stop();
      that.audioArr.bl = true;

      recorderManager.start({
        format: "mp3" // 如果录制acc类型音频则改成aac
      });
      that.begin_time = +new Date();

      recorderManager.onError(function() {
        console.log("失败-----");
        // 录音失败的回调处理
      });
      recorderManager.onStop(function(res) {
        if (!that.now_get_auth) {
          that.now_get_auth = true;
          return;
        }

        //上传录音
        WXAJAX.UploadImage(res.tempFilePath)
          .then(data => {
            wx.hideLoading();
            data = JSON.parse(data);
            if (data.code == "200") {
              wx.showToast({
                title: "恭喜!录音成功",
                icon: "success",
                duration: 1000
              });
              that.end_time = +new Date();

              that.diff_time = that.end_time - that.begin_time;
              that.diff_time = Math.ceil(that.diff_time * 0.001);

              // that.audioArr = [];
              // 停止录音之后，把录取到的音频放在res.tempFilePath
              that.audioArr = {
                id: "1",
                src: WXAJAX.imgBackUrl + data.data,
                bl: false,
                time: that.diff_time
              };
            } else {
              wx.showToast({
                title: "录音失败，请重试！",
                icon: "none",
                duration: 1000
              });
              that.audioArr = {
                id: "0",
                src: "",
                bl: false,
                time: 0
              };
            }
          })
          .catch(err => {
            wx.hideLoading();
            that.audioArr = {
              id: "0",
              src: "",
              bl: false,
              time: 0
            };
            console.log("err -- ", err);
          });
      });
    },
    record_end() {
      //手指抬起
      recorderManager.stop();
      this.audioArr.bl = false;
    },

    async uploadpic(str, count) {
      // let a = this.card_msg;
      if (str == "self" && this.self_photos.length >= 9) {
        wx.showToast({
          title: "最多选择九张！",
          duration: 1500,
          icon: "none"
        });
        return;
      }
      let path = await util.chooseImage("file", count);
      if (!(path instanceof Array)) return;
      this.uploadImgFun(path, 0, str);
    },
    // 递归上传
    async uploadImgFun(arr, index = 0, str) {
      await this.uploadImg(arr[index], str);
      if (index < arr.length - 1) {
        this.uploadImgFun(arr, index + 1, str);
      }
    },
    uploadImg(path, str) {
      let v = this;
      wx.showLoading({ mask: true });
      return WXAJAX.UploadImage(path)
        .then(data => {
          wx.hideLoading();
          data = JSON.parse(data);
          if (data.code == "200") {
            if (str == "user") {
              v.$set(v.card_msg, "picchecked", WXAJAX.imgBackUrl + data.data);
            } else if (str == "self") {
              this.self_photos.push(`${WXAJAX.imgBackUrl}${data.data}`);
            }
          } else {
            wx.showToast({
              title: "网络异常",
              duration: 2000,
              icon: "none"
            });
          }
        })
        .catch(err => {
          wx.hideLoading();
          console.log("err -- ", err);
        });
    },
    btn_tap() {
      //保存名片
      if (this.isLoading) return;
      let v = this,
        _url = "";

      myaudio.stop();

      if (!v.card_msg.username) {
        wx.showToast({
          title: "请输入姓名！",
          duration: 2000,
          icon: "none"
        });
        return;
      }
      if (!v.card_msg.tel || !util.checkPhone(v.card_msg.tel)) {
        wx.showToast({
          title: "请输入正确的电话！",
          duration: 2000,
          icon: "none"
        });
        return;
      }
      if (!v.card_msg.company && this.type == "add") {
        wx.showToast({
          title: "请选择公司！",
          duration: 2000,
          icon: "none"
        });
        return;
      }
      let photos = v.self_photos.join(",");
      let companyId = "",
        position = "";
      if (this.type == "add") {
        _url = "/businessCard/createCard";
        companyId = v.card_msg.companyId;
      } else {
        _url = "/businessCard/updateCard";
      }
      position = v.card_msg.post;

      this.isLoading = true;
      wx.showLoading();
      WXAJAX.POST(
        {
          style: v.card_style,
          companyId: companyId,
          name: v.card_msg.username,
          phone: v.card_msg.tel,
          logo: v.card_msg.picchecked, //头像
          personalWx: v.card_msg.wx,
          companyWx: v.card_msg.company_wx,
          photo: photos, //个人照片集合（1.png,2.png,3.png）
          position: position, //
          soundRecording: v.audioArr.src, //个人录音
          soundTime: v.audioArr.time,
          email: v.card_msg.email,
          briefIntroduction: v.intro, //个人简介
          cardId: v.cardId
        },
        "",
        _url
      )
        .then(data => {
          wx.hideLoading();
          this.isLoading = false;
          if (data) {
            wx.showToast({
              title: "保存成功",
              duration: 2000,
              icon: "none"
            });
            wx.setStorageSync("refreshCard", true);
            setTimeout(function() {
              wx.navigateBack();
            }, 500);
          }
        })
        .catch(err => {
          wx.hideLoading();
          this.isLoading = false;
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: "none"
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    card_style_change(type) {
      //切换名片样式
      wx.showLoading();
      this.changeing = true;
      this.card_style = type;
      setTimeout(() => {
        this.changeing = false;
        wx.hideLoading();
      }, 500);
    },
    chooseCompany() {
      if (this.selfCompany.companyId) {
        wx.showToast({
          title: "如需更换企业，请先退出当前企业，再重新创建名片",
          duration: 2000,
          icon: "none"
        });
        return;
      }

      if (!this.card_msg.cardId) {
        this.page_turn("searchChooseItem", "company");
      } else {
        wx.showToast({
          title: "禁止修改",
          icon: "none",
          duration: 2000
        });
      }
    },
    page_turn(url, type) {
      wx.navigateTo({ url: "../" + url + "/main?type=" + type });
    },
    delImg(index) {
      //删除图片
      wx.showLoading();
      this.self_photos.splice(index, 1);
      wx.hideLoading();
    }
  }
};
</script>
<style>
.textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 30upx 32upx;
  min-height: 238upx;
  font-size: 32upx;
  border-radius: 10upx;
  border: 1upx solid #e8e8e8;
  background: #f5f5f6;
  cursor: auto;
  display: block;
  position: relative;
  color: #a8a8a8;
}

.place-holder {
  color: #a8a8a8;
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
  padding: 20upx 0 24upx 34upx;
  background: #f5f5f6;
  border: 1upx solid #e8e8e8;
  position: relative;
  height: 34upx;
  border-radius: 10upx;
}

.output-audio .audio .ico {
  width: 24upx;
  height: 34upx;
  float: left;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  /*初始状态 透明度为0*/
  40% {
    opacity: 0;
  }

  /*过渡状态 透明度为0*/
  100% {
    opacity: 1;
  }

  /*结束状态 透明度为1*/
}

@-webkit-keyframes fade-in {
  /*针对webkit内核*/
  0% {
    opacity: 0;
  }

  40% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.edit_card_top.fade {
  animation: fade-in;
  animation-duration: 0.5s;
  /*-webkit-animation:fade-in 1.5s;*/
}

.card2 .card_bg {
  width: 452upx;
  height: 100%;
}

.card2 .card2_inner {
  position: absolute;
  left: 324upx;
  top: 104upx;
}

.card_line_2 {
  position: relative;
}

.card_line_2::before,
.card_line_2::after {
  position: absolute;
  width: 6upx;
  height: 16upx;
  background: #fff;
  top: 0;
  bottom: 0;
  margin: auto;
  content: "";
}

.card_line_2::before {
  right: 0;
}

.card_line_2::after {
  right: 10upx;
}

.card_company {
  position: absolute;
  right: 34upx;
  bottom: 30upx;
}

.card3 .cacrd3_left {
  position: absolute;
  left: 106upx;
  top: 96upx;
}

.card3 .card3_right {
  position: absolute;
  left: 414upx;
  top: 98upx;
}
</style>
