<template>
  <div class="card-main w100p bgf5f6 bgfff" :style="{height: mainHeight+'px'}">
    <NavBarByUser
      @cancelLoginGuide="cancelLoginGuide"
      :isLogin="isLogin"
      :isShowLoginGuide="isShowLoginGuide"
      @loginSuccess="loginSuccess"
      :avatarUrl.sync="avatarUrl"
      :isShowCardCase="false"
    />

    <scroll-view
      :style="{height: scrollContentHeight+'px'}"
      class="dynamic-content"
      :scroll-y="true"
      :enable-back-to-top="true"
      :scroll-anchoring="true"
      @scrolltoupper="scrolltoupper"
      @scrolltolower="scrolltolower"
    >
      <!--我的 / 默认 名片-->
      <div class="bgfff pt15 pl16 pr15">
        <div class="bradius10 bgfff" v-if="hasCard && card_msg.cardId">
          <!-- <GetPhoneNumber @next="toIndex('index', card_msg.companyId, card_msg.cardId)"> -->
          <MeCard
            :card_msg="card_msg"
            :type="'plus'"
            :hasCard="hasCard"
            :isdel="false"
            :index="0"
            @click.native="toIndex('index', card_msg.companyId, card_msg.cardId)"
            @moreTap="moreTap"
          ></MeCard>
          <!-- </GetPhoneNumber> -->
        </div>
      </div>
      <!--搜索-->
      <div class="bgfff pl15 pb10 pr15" v-if="isLogin">
        <div
          class="bgf5f6 bradius17 textc lh34 disflex align-cen pl25 search trans2 pr25"
          @click="search_focus"
        >
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/search.png"
            style="flex: 0 0 16px"
            alt
            class="w16 h16"
          />
          <span class="searchText over_1" v-if="!isfocus">{{searchkey || '搜索姓名/电话号码'}}</span>
          <input
            type="text"
            v-model="searchkey"
            placeholder="搜索姓名/电话号码"
            class="ca8 fs14 lh34 h34 textl pl10 w100p trans2"
            v-else
            :focus="isfocus"
            @blur="isfocus=false"
            @confirm="search_confirm"
          />
        </div>
      </div>

      <div class="bgfff pt15 pl16 pr15">
        <!--看过的，名片-->
        <div class="my-card-case flex-sb-c pb15">
          <p class="flex-c-c">
            <span class="separator"></span>
            <span class="fs16 pl9">我的名片夹</span>
          </p>
          <div class="right flex-sb-c">
            <span class="fs16 cblue pr8" v-if="lists.length>0">{{lists.length}}</span>
            <img
              class="card-case-num-img"
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card-case-num.png"
              alt
            />
          </div>
        </div>

        <div v-if="lists.length>0">
          <div class="bradius10" v-for="(v,k) in lists" :key="k">
            <div class="bgfff bradius10">
              <BusinessCard
                :card_msg="v"
                :type="'plus'"
                :hasCard="false"
                :isdel="true"
                :index="k+1"
                :isLogin="isLogin"
                @needLogin="needLogin"
                @moreTap="moreTap"
                @shareApp="shareApp"
              ></BusinessCard>
            </div>
          </div>
        </div>

        <!--bottom-->
        <!-- <div class="textc lh70 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div> -->
        <!-- 创建自己的名片 暂时隐藏-->
        <!-- <InsertCard v-if="!hasCard" @loginSuccess="loginSuccess" :isLogin="isLogin"></InsertCard> -->

        <!--创建-->

        <!--添加-->
        <!-- <div class="add_card" :class="{'w100p': !hasCard}">
                    <div class="textc disflex w60 h60 bgblue disinblock create-btn"
                        @click="createCard"
                        :class="addInfo ? 'w100p': ''"
                        v-if="!hasCard && isLogin"
                    >
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/add.png"
                            alt="" class="w30 h30 mr20">
                        <span>我的智能名片</span>
                        <div class="fbold create" >
                            <view v-if="isLogin">立即创建</view>
                        </div>
                    </p>
                    <div class="textc disflex w60 h60 bradius50p bgblue disinblock" @click="page_turn('usercenter')" v-else>
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_add.png" alt="" class="w30 h30 mt15">
                    </div>

        </div>-->
      </div>

      <SelectorOne
        :title="'操作'"
        :status="operateShow"
        :allClass="operateTypes"
        @closeModal="operateShow = !operateShow"
        @choose_tap="choose_tap"
      ></SelectorOne>

      <div v-if="isShowNotice&& noticeList.length&&!isLogin" @click="isShowNotice=false">
        <AppNotice :noticeList="noticeList"></AppNotice>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import BusinessCard from "@/components/BusinessCard"; //
import MeCard from "@/components/MeCard"; //
import SelectorOne from "@/components/selectorOne"; //
import GetPhoneNumber from "@/components/getPhoneNumber"; //
import getPhoneNumberCard from "@/components/getPhoneNumberCard"; //
import AppNotice from "@/components/AppNotice";
import { mapActions } from "vuex";
import NavBarByUser from "@/components/NavBarByUser.vue";
import WXAJAX from "../../utils/request";
import util from "../../utils/index";
import HandleLogin from "@/utils/handleLogin";
import InsertCard from "./components/InsertCard.vue";
import { addShareRecord } from "@/utils/behavior";
import store from "../../store/index";
export default {
  name: "",
  components: {
    MeCard,
    BusinessCard,
    SelectorOne,
    GetPhoneNumber,
    getPhoneNumberCard,
    AppNotice,
    NavBarByUser,
    InsertCard
  },
  data() {
    return {
      searchkey: "",
      last_searchkey: "",
      isfocus: false,
      mine_card: {},
      lists: [],
      hasCard: wx.getStorageSync("hasCard") || false, //是否已经有名片
      isLogin: HandleLogin.returnIsLogin() || false, //是否已经登录
      addInfo: false, //显示添加的按钮
      card_msg: {
        picchecked: "",
        username: "",
        tel: "",
        wx: "",
        company_wx: "",
        email: "",
        post: "",
        company: "",
        company_logo: ""
      },
      phoneMsg: {
        phoneData: "",
        iv: ""
      },
      //名片操作
      operateID: 0,
      operateShow: false,
      operateTypes: [
        { name: "置顶", id: "top" }
        // {name:'删除' , id:'del'},
      ],
      cardId: 0, //删除时使用
      isfresh: false,
      page: 1,
      isLoading: false, //是否在加载
      nodata: false, //是否已经没有数据
      isShowLogin: false,
      isShowNotice: true, // 是否显示公告
      noticeList: [], // 公告列表
      avatarUrl: "", //用户的头像地址,
      isShowLoginGuide: false, //是否显示登录引导页,
      scrollContentHeight: 0, //中间滚动区域的高度
      mainHeight: 0 //整体高度
    };
  },
  onReachBottom() {
    // let v = this ;
    // v.getAllCard();
  },
  onShareAppMessage(e) {
    let cardId = e.target.dataset.cardid;
    let companyId = e.target.dataset.companyid;
    let companyName = e.target.dataset.companyname;
    // let shareId = await addShareRecord(companyId, 1, cardId);
    let uuid = cardId + "" + new Date().getTime();
    addShareRecord(companyId, 1, cardId, uuid).then(
      res => {},
      err => {}
    );
    let { sharespeech = "", position, name } = e.target.dataset;
    sharespeech = sharespeech
      .replace("#name#", name)
      .replace("#company#", companyName);
    return {
      title:
        sharespeech ||
        `您好，我是${companyName}${position || ""}的${name}，敬请惠存!`,
      path: `/pages/index/main?cardId=${cardId}&companyId=${companyId}&goType=1&shareId=${uuid}`,
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
  onUnload() {
    this.isShowLogin = false;
    this.isShowNotice = true;
    this.noticeList = [];
  },
  async onPullDownRefresh() {
    console.log("下拉刷新onPullDownRefresh");
    // to doing..
    // 停止下拉刷新
    wx.showNavigationBarLoading();
    this.page = 1;
    this.card_msg = {};
    this.searchkey = "";
    this.lists = [];
    this.nodata = false;
    this.isLoading = false;
    this.getAllCard();
    wx.stopPullDownRefresh();
    setTimeout(function() {
      wx.hideNavigationBarLoading();
    }, 300);
  },
  onLoad() {},
  onShow() {
    this.searchkey = "";
    this.isfresh = true;
    this.card_msg = {};
    this.page = 1;
    this.isLogin = HandleLogin.returnIsLogin() || false;
    this.hasCard = wx.getStorageSync("hasCard") || false;
    this.avatarUrl = wx.getStorageSync("avatarUrl");

    this.getAllCard();
  },

  onHide() {
    this.addInfo = false;
  },
  async mounted() {
    let a = await util.systemIfo();
    let navHeight = getApp().globalData.navHeight;
    this.mainHeight = a.windowHeight;
    this.scrollContentHeight = a.windowHeight - navHeight;
  },
  methods: {
    ...mapActions(["setPhone"]),
    //点击名片的拨打电话,回调需要登录
    needLogin() {
      this.isLogin = false;
      this.isShowLoginGuide = true;
    },
    //隐藏登录引导
    cancelLoginGuide() {
      this.isShowLoginGuide = false;
    },
    //下拉刷新
    scrolltoupper() {
      this.page = 1;
      this.searchkey = "";
      // this.card_msg = {} ;
      // this.lists = [] ;
      this.nodata = false;
      this.isLoading = false;
      this.getAllCard();
    },
    //上拉加载更多
    scrolltolower() {
      this.getAllCard();
    },
    //点击立即创建名片,因为没有登录,所以授权成功以后,会有登录成功的回调,回调成功以后,跳转到名片创建页面
    loginSuccess(url) {
      this.isLogin = true;
      this.hasCard = wx.getStorageSync("hasCard") || false;
      this.avatarUrl = wx.getStorageSync("avatarUrl") || "";

      if (url && url === "insert") {
        wx.navigateTo({ url: "../editCard/main?type=add&goType=1" });
      } else {
        this.page = 1;
        this.getAllCard();
      }
      //头像登录成功的回调
    },
    getNotice() {
      WXAJAX.POST({}, "", "/notice/selectEffectiveList").then(res => {
        this.noticeList = res || [];
      });
    },
    shareApp(companyId, cardId, companyName, name) {
      this.onShareAppMessage(companyId, cardId, companyName, name);
    },
    createCard() {
      this.toCreatePage();
    },
    search_focus() {
      this.isfocus = true;
    },
    search_confirm() {
      if (this.searchkey === this.last_searchkey) {
        return;
      }
      wx.showLoading();
      this.page = 1;
      this.card_msg = {};
      this.lists = [];
      this.nodata = false;
      this.isLoading = false;
      this.getAllCard();
    },
    page_turn(url) {
      this.addInfo = false;
      wx.navigateTo({ url: "../" + url + "/main" });
    },
    toIndex(url, companyid, cardid) {
        store.commit('setCurrentTab',5);
      //进入首页
      wx.setStorageSync("COMPANYID", companyid); /*id*/
      wx.setStorageSync("CARDID", cardid); /*id*/
      this.addInfo = false;
      wx.switchTab({
        url: "../" + url + "/main?cardId=" + cardid + "&companyId+" + companyid
      });
    },
    getPhoneNumber(e) {
      this.phoneMsg.phoneData = e.encryptedData;
      this.phoneMsg.iv = e.iv;
    },
    getAllCard() {
      let v = this;
      if (v.isLoading) {
        return;
      }
      v.isLoading = true;

      WXAJAX.POST(
        {
          name: this.searchkey,
          pageNum: v.page
        },
        "",
        "/businessCard/seeDetail",
        "1"
      )
        .then(data => {
          this.last_searchkey = this.searchkey;
          // state : 1 -- 默认 ， 2 -- 浏览记录 ， 3 -- 自己的
          if (data) {
            let datas = [];
            data.forEach(function(i, k) {
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
                //默认名片
                v.card_msg = cardData;
              } else {
                cardData.createTime = util.getdate(i.createTime, "dateTime");
                datas.push(cardData);
              }
            });

            if (v.page === 1) {
              this.lists = datas;
            } else {
              this.lists.push(...datas);
            }

            v.page++;

            if (!v.hasCard) {
              v.addInfo = true;
            }
          }
          setTimeout(function() {
            v.nodata = true;
            v.isLoading = false;
          }, 500);

          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    moreTap(recordId, cardId, isdel) {
      //更多操作
      this.operateID = recordId;
      this.cardId = cardId;
      if (isdel) {
        this.operateTypes = [
          { name: "置顶", id: "top" }
          // {name:'删除' , id:'del'},
        ];
      } else {
        this.operateTypes = [{ name: "置顶", id: "top" }];
      }
      this.operateShow = true;
    },
    choose_tap(type) {
      //名片操作
      this.operateShow = false;

      wx.showLoading();

      let _url = "",
        id = 0;
      if (type === "top") {
        _url = "/businessCard/isTop";
        id = this.cardId;
      } else {
        _url = "/businessCard/delSeeCard";
        id = this.cardId;
      }

      WXAJAX.POST(
        {
          cardId: id
        },
        "",
        _url
      )
        .then(data => {
          wx.hideLoading();
          wx.showToast({
            title: "操作成功！",
            duration: 2000,
            icon: "none"
          });
          this.page = 1;
          this.card_msg = {};
          this.searchkey = "";
          this.lists = [];
          this.nodata = false;
          this.isLoading = false;
          this.getAllCard();
        })
        .catch(err => {
          wx.hideLoading();
        });
    }
  }
};
</script>

<style>
.card-main {
  width: 100%;
  height: 100%;
}
.searchText {
  cursor: auto;
  display: inline-block;
  height: 68upx;
  max-width: 100%;
  padding-left: 20upx;
  text-align: left;
  line-height: 68upx;
  font-size: 28upx;
  color: #a8a8a8;
}
.search {
  justify-content: center;
}

.search.focus {
  justify-content: flex-start;
}

.search.focus input {
  width: auto;
}
page {
  width: 100%;
  height: 100%;
}
.add_card {
  position: fixed;
  right: 0;
  bottom: 90upx;
  z-index: 99;
  padding-right: 30upx;
  padding-left: 30upx;
  box-sizing: border-box;
  text-align: right;
}

.create-btn {
  transition: all 0.8s ease-in-out;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 30upx;
  border-radius: 1998upx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: white;
  position: relative;
}
.create-btn .create {
  flex-grow: 1;
  text-align: right;
}

.width-max {
  width: 100%;
}

.create-btn img {
  flex: 0 0 60upx;
}
.my-card-case {
  height: 36upx;
}
.card-case-num-img {
  /* display: inline-block; */
  width: 32upx;
  height: 32upx;
  /* border: 1upx dashed #444 */
}
.separator {
  display: inline-block;
  width: 8upx;
  height: 32upx;
  background: #00a0e9;
}
</style>
