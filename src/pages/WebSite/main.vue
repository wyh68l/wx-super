<template>
  <div :style="{height: mainHeight+'px'}">
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
      <SelfSwiper
        v-if="company.photos && company.photos.length"
        :imgUrls="company.photos"
        :self_class="'h211'"
        @swiperChange="swiperChange"
      ></SelfSwiper>

      <!--公司介绍-->
      <div class="pl15 pr15" v-if="company.companyIntroduce">
        <p class="lh45 fs16 c38 fbold">公司介绍</p>

        <div class="bgfff shadow_gray pl15 pt20 pb15 pr15 fs16 bradius5">
          <div v-html="company.companyIntroduce"></div>
        </div>
      </div>

      <!--产品介绍-->
      <div class="pl15 pr15" v-if="company.goodsIntroduce">
        <p class="lh45 fs16 c38 fbold">产品介绍</p>

        <div class="bgfff shadow_gray pl15 pt20 pb15 pr15 fs16 bradius5">
          <div v-html="company.goodsIntroduce"></div>
        </div>
      </div>

      <!--公司视频-->
      <div class="pl15 pr15" v-if="company.companyVideoModelList">
        <p class="lh45 fs16 c38 fbold">企业视频</p>
        <div class="disflex wrap jsbet">
          <!--<div class="bgfff h211 shadow_gray">{{}}</div>-->
          <div
            v-for="(videoItem, index) in company.companyVideoModelList"
            :key="index"
            class="bgfff overhidden firstVideo"
            :class="{mt15: index > 0}"
          >
            <video
              :id="'myVideo'+ videoItem.videoId"
              class="disblock"
              v-if="playIndex === videoItem.videoId"
              :title="videoItem.describes"
              :src="videoItem.url"
              objectFit="cover"
              enable-danmu
              danmu-btn
              controls
              :autoplay="true"
            ></video>
            <div class="w100p h194 posre" @click="showVideo(videoItem.videoId)" v-else>
              <img
                mode="aspectFill"
                :src="videoItem.cover || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619324240.png'"
                alt
                class="w100p h194"
              />
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619365051.png"
                alt
                class="w50 h50 posab top0 left0 right0 bottom0 mauto"
              />
            </div>
            <div class="fs14 pl15 c38 fbold">{{videoItem.describes}}</div>
          </div>
        </div>
        <!--src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"-->
        <!--:src="company.videoUrl"-->
      </div>

      <!--企业招聘-->
      <div class="pl15 pr15" v-if="invites.length">
        <p class="lh45 fs16 c38 fbold">企业招聘</p>

        <div
          class="bgfff pt15 pl16 pr15 pb15 shadow_gray mb10 bradius5"
          @click="page_turn('joinUsDetail' , v.recruitId)"
          v-for="(v,k) in invites"
          :key="k"
        >
          <p class="disflex jsbet fs14">
            <span class="c38 fbold">{{v.position}}</span>
            <span class="cblue fbold">{{v.salary}}</span>
          </p>

          <div class="disflex jsbet fs12 ca8 pt13">
            <div>{{v.recruitAddress}} | {{experienceArray[v.experience-1].title}} | {{educatArray[v.education-1].title}}</div>
          </div>
        </div>
      </div>

      <!--关于我们-->
      <div class="pl15 pr15">
        <p class="lh45 fs16 c38 fbold">关于我们</p>

        <div class="bgfff pt15 pl16 pr15 pb19 shadow_gray mb10 bradius5" v-if="company.phone">
          <p class="fs12 ca8">联系电话</p>

          <div class="disflex jsbet pt15" @click="makePhone">
            <div class="fs14 c38 fbold">{{company.phone}}</div>

            <div class="pl16 left_line disflex column-reverse">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel_blue.png"
                alt
                class="w16 h16"
              />
            </div>
          </div>
        </div>

        <div class="bgfff pt15 pl16 pr15 pb19 shadow_gray mb12 bradius5" v-if="company.address">
          <p class="fs12 ca8">公司地址</p>

          <div class="disflex jsbet pt15">
            <div class="fs14 c38 fbold">{{company.address}}</div>
            <div class="pl16 left_line disflex column-reverse" @click="openAddr">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/addr_2.png"
                alt
                class="w16 h16"
              />
            </div>
          </div>
        </div>

        <!--联系我们-->
        <div class="bgfff shadow_gray bradius5 pt25 pb25 pl25 pr25">
          <p class="under_line textc fs16 c38 fbold pb27">联系我们</p>

          <input
            type="text"
            class="w100p bgf5f6 bradius5 lh39 h39 borderbox pl10 fs14 ca8 phe8 mb10"
            placeholder="请填写您的姓名"
            v-model="form.name"
          />
          <input
            type="text"
            class="w100p bgf5f6 bradius5 lh39 h39 borderbox pl10 fs14 ca8 phe8 mb10"
            placeholder="请填写您的联系电话"
            v-model="form.tel"
          />
          <input
            type="text"
            class="w100p bgf5f6 bradius5 lh39 h39 borderbox pl10 fs14 ca8 phe8 mb15"
            placeholder="请填写您的需求"
            v-model="form.text"
          />

          <div class="w100p bg_line_blue cfff textc fs18 lh44 bradius5" @click="formConfirm">立即提交</div>
        </div>
      </div>

      <!--bottom-->
      <div class="textc pb15 fs12 ca8 bgf5f6 pt15"></div>
    </scroll-view>
    <FloatButtons
      class="float-buttons"
      :isShowTalk="isShowTalk"
      :avatarUrl="targetAvatarUrl"
      @talk="talk"
      @loginGuide="loginGuide"
    ></FloatButtons>
  </div>
</template>

<script>
import SelfSwiper from "@/components/swiper"; //
import WXAJAX from "../../utils/request";
import amapFile from "../../libs/amap-wx.js";
import util from "../../utils/index";

import FloatButtons from "@/components/FloatButtons.vue";
import NavBarByUser from "@/components/NavBarByUser.vue";
import { mapState } from "vuex";
import HandleLogin from "@/utils/handleLogin";

export default {
  name: "",
  components: { SelfSwiper, NavBarByUser, FloatButtons },
  data() {
    return {
      img:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/food.jpg",
      images: [{ url: this.img }, { url: this.img }],
      playIndex: "",
      imgUrls: [
        {
          img: this.img,
          url:
            "/_pages/common/webview/main?url=https://wechat.benmu-health.com/mobile/app/common/material/render/17"
        },
        {
          img: this.img,
          url: "/pages/checkup/filterPackage/index?category=PARENTS_CHECKUP"
        }
      ],
      COMPANYID: 0,
      myAmapFun: "",
      Mc: "",
      form: {
        name: "",
        tel: "",
        text: ""
      },
      company: {
        accuracy: "", //经度
        dimension: "" //维度
      },
      invites: [],
      locat: {
        lat: 30.5702,
        lng: 104.06476
      },
      /*学历*/
      educatArray: [
        { title: "全部", id: 1 },
        { title: "初中及以下", id: 2 },
        { title: "中专/中技", id: 3 },
        { title: "高中", id: 4 },
        { title: "大专", id: 5 },
        { title: "本科", id: 6 },
        { title: "硕士", id: 7 },
        { title: "博士", id: 8 }
      ],
      /*经验*/
      experienceArray: [
        { title: "应届生", id: 1 },
        { title: "1年以内", id: 2 },
        { title: "1-3年", id: 3 },
        { title: "3-5年", id: 4 },
        { title: "5-10年", id: 5 },
        { title: "10年以上", id: 6 },
        { title: "全部", id: 7 }
      ],
      videoContext: null,

      avatarUrl: "", //用户的头像地址,
      isLogin: HandleLogin.returnIsLogin() || false, //是否已经登录
      isShowTalk: true, //是否显示右边侧边栏的聊一聊
      isShowLoginGuide: true, //是否显示登录引导页,
      targetAvatarUrl: "", //当前目标的人物头像,
      scrollContentHeight: 0, //中间滚动区域的高度
      mainHeight: 0, //整体高度
      isLoading: false
    };
  },
  onShow() {
    wx.setNavigationBarTitle({
      title: "官网"
    });
    this.playIndex = "";
    let lastCompanyid = this.COMPANYID;
    this.Mc = wx.createMapContext("map");
    this.myAmapFun = new amapFile.AMapWX({
      key: "e11026819b6d300fda6a2c680fbd2fef"
    });
    //获取当前的公司
    this.COMPANYID = wx.getStorageSync("COMPANYID") || 1;
    //获取官网信息
    if (lastCompanyid != this.COMPANYID || !this.COMPANYID) {
      this.inits();
      // this.getInvite();
    }
    this.isLogin = HandleLogin.returnIsLogin() || false;
    this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    //获取官网招聘信息
    //this.getInvite();
  },
  async mounted() {
    let a = await util.systemIfo();
    let navHeight = getApp().globalData.navHeight;
    this.mainHeight = a.windowHeight;
    this.scrollContentHeight = a.windowHeight - navHeight;
  },
  async onPullDownRefresh() {
    await this.inits();
    //获取官网招聘信息
    await this.getInvite();
    wx.stopPullDownRefresh();
  },
  methods: {
    //下拉刷新
    async scrolltoupper(e) {
      await this.inits();
      //获取官网招聘信息
      await this.getInvite();
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
      this.isLogin = true;
      this.hasCard = wx.getStorageSync("hasCard") || false;
      this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    },
    loginFailed() {
      this.isShowLoginGuide = true;
    },
    cancelLoading() {
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
    async inits() {
      //获取官网信息
      this.invites = [];
      if (this.isLoading) return;
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        let v = this;
        // wx.showLoading();
        WXAJAX.POST(
          {
            companyId: v.COMPANYID,
            cardId: wx.getStorageSync("CARDID")
          },
          "",
          "/personal/getWebsiteInfo/V2"
        )
          .then(data => {
              console.log(data);
            if (data) {
              if (data.photos) {
                data.photos = data.photos.split(",");
              } else {
                data.photos = [];
              }
              v.company = data;
              if (data.recruitModelList) {
                data.recruitModelList.forEach(function(i, k) {
                  i.salary =
                    i.minSalary / 100000 + "k - " + i.maxSalary / 100000 + "k";
                });
              }
              v.invites = data.recruitModelList ? data.recruitModelList : [];
            }
            wx.hideLoading();
            this.cancelLoading();
          })
          .catch(err => {
            console.log(err);
            this.cancelLoading();
            wx.hideLoading();
          })
          .catch(() => {
            this.cancelLoading();
            resolve();
          });
      });
    },
    async getInvite() {
      if (this.isLoading) return;
      return new Promise((resolve, reject) => {
        let v = this;
        wx.showLoading();
        WXAJAX.POST(
          {
            companyId: v.COMPANYID
          },
          "",
          "/personal/getCompanyRecruit"
        )
          .then(data => {
            data.forEach(function(i, k) {
              i.salary =
                i.minSalary / 100000 + "k - " + i.maxSalary / 100000 + "k";
            });
            v.invites = data;
            wx.hideLoading();
          })
          .catch(err => {
            wx.hideLoading();
          })
          .catch(() => {
            resolve();
          });
      });
    },
    showVideo(index) {
      this.playIndex = index;
    },
    //轮播图的切换事件
    swiperChange(current) {
      // console.log(current)
    },
    page_turn(url, recruitId) {
      wx.navigateTo({ url: "../" + url + "/main?recruitId=" + recruitId });
    },
    openAddr() {//打开地图略缩图
        wx.getLocation({
            type: "gcj02",
            isHighAccuracy: true,
            success: function (res) {
                let latitude = res.latitude;
                let longitude = res.longitude;
                wx.openLocation({
                    latitude,
                    longitude,
                    scale: 18
                })
                wx.hideLoading();
            },
            fail: function (err) {
                wx.hideLoading({
                    success() {
                        wx.showToast({
                            title: "定位失败",
                            icon: "none",
                            duration: 2000
                        });
                    }
                });
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },
    formConfirm() {
      //表单提交
      if (!this.form.name) {
        wx.showToast({
          title: "请输入您的姓名！",
          icon: "none"
        });
        return;
      }
      if (!this.form.tel || !util.checkPhone(this.form.tel)) {
        wx.showToast({
          title: "请输入正确的电话！",
          icon: "none"
        });
        return;
      }
      if (!this.form.text) {
        wx.showToast({
          title: "请填写您的需求！",
          icon: "none"
        });
        return;
      }
      let v = this;
      wx.showLoading();
      WXAJAX.POST(
        {
          companyId: v.COMPANYID,
          name: v.form.name,
          phone: v.form.tel,
          text: v.form.text,
          cardId: wx.getStorageSync("CARDID")
        },
        "",
        "/personal/addDemand"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            v.form = {
              name: "",
              tel: "",
              text: ""
            };
            wx.showToast({
              title: "提交成功！",
              icon: "success"
            });
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    makePhone() {
      //拨打电话
      util.MakePhone(String(this.company.phone));
    }
  },
  computed: {
    ...mapState({
      currentCompany: state => state.currentCompany
    })
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
  }
};
</script>

<style>
.left_line {
  position: relative;
  padding-left: 36upx;
}

.left_line::before {
  content: "";
  position: absolute;
  left: 0;
  width: 1upx;
  height: 26upx;
  background: #a8a8a8;
  bottom: 4upx;
}

.under_line {
  position: relative;
}

.under_line::before {
  content: "";
  position: absolute;
  bottom: 30upx;
  width: 50upx;
  height: 4upx;
  background: #00a0e9;
  left: 0;
  right: 0;
  margin: auto;
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
</style>



















