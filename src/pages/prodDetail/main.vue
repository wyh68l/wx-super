<template>
  <div class="pb50">
    <!--  <swiper class="h375" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
              :duration="duration">
          <div v-for="(item, index) in images" :key="index">
              <swiper-item>
                  <img :src="img" class="w100p h100p" mode="aspectFill"/>
              </swiper-item>
          </div>
    </swiper>-->
    <SelfSwiper :imgUrls="images" :self_class="'h375'"></SelfSwiper>
    <!-- 拼团 -->
    <AssembleInfo
      ref="assembleInfo"
      @changeTypeId="changeTypeId"
      :groupAssembleId="groupAssembleId"
      :isJoin="isJoin"
      :cardId="cardId"
      :currentCompany="currentCompany"
      v-if="proData.isAssemble"
      :proData="proData"
      @showShare="showShare"
    ></AssembleInfo>
    <!-- 秒杀 -->
    <SpikeBox
      v-if="proData.isKill"
      :killType="proData.killType"
      :spikePrice="proData.killPrice"
      :diffTime="proData.killEndTime"
      :originalPrice="proData.price"
    ></SpikeBox>
    <SeckillInfo
      ref="seckillInfo"
      @changeTypeId="changeTypeId"
      v-if="proData.isKill"
      :cardId="cardId"
      @car="car"
      :currentCompany="currentCompany"
      :proData="proData"
      @showShare="showShare"
    />
    <!-- 非拼团 非秒杀 -->
    <div class="bgfff pl16 pr15 pb15 mb10" v-else-if="!proData.isKill && !proData.isAssemble">
      <p class="lh45">
        <span class="corange fs20 mr10">¥{{ goodsPrice || goodsMsg.price }}</span>
        <!--<span class="fs12 ca8 line-through">¥199.9</span>-->
      </p>
      <div class="disflex jsbet">
        <p class="over_2 fs14 c38 fbold flex1">{{ goodsMsg.name }}</p>
        <button
          style="padding-right: 0"
          class="w46 pl45 bgfff contentbox textr disflex align-cen textr"
          @click="showShare"
          open-type
          hover-class="other-button-hover"
        >
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/share2.png"
            alt
            class="w15 h15 mr7"
          />
          <b class="fs12 ca8">分享</b>
        </button>
      </div>
    </div>
    <!--规格-->
    <div class="pl16 pr16 bgfff pt16" v-if="!proData.isAssemble && !proData.isKill">
      <p class="fs14 ca8 pb10">类型</p>
      <div class="pb15">
        <span
          v-for="(v, k) in types"
          class="fs12 c38 pl10 mb10 pr11 mr10 bgf5f6 disinblock lh30 bradius3 bf5f6 size_item"
          :class="type_id_1 == v.specId ? 'active' : ''"
          @click="type_tap_1(v.specId, k)"
          :key="k"
        >{{ v.specName }}</span>
        <p class="fs14 ca8 pb10">规格</p>
        <div v-if="types[type_index_1] && types[type_index_1].goodSpecModelList">
          <span
            v-for="(v2, k2) in types[type_index_1].goodSpecModelList"
            class="fs12 c38 pl10 pr11 mr10 bgf5f6 disinblock lh30 bradius3 bf5f6 size_item"
            :class="types[type_index_1].selectId == v2.specId ? 'active' : ''"
            @click="type_tap(type_index_1, k2, v2.specId)"
            :key="k2"
          >{{ v2.specAttribute }}</span>
        </div>
        <div style="background: #E8E8E8;height: 1px;margin: 30rpx 0;" class="disflex"></div>
        <div class="disflex jsbet align-cen">
          <div class="fs14 ca8">数量</div>
          <div class="counter disflex number-change-btn-group">
            <span class="textc be8 lh25 w25 minus ca8" @click.stop="prodChangeNum(-1)">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190505113629.png"
                class="w10 h10"
              />
            </span>
            <span class="bte8 bbe8 fs12 c68 w40 lh25 textc">
              <input type="number" v-model="num" class="lh22 h25" />
            </span>
            <span class="textc be8 lh25 w25 add ca8" @click.stop="prodChangeNum(1)">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190505113647.png"
                class="w10 h10"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 宝贝详情 -->
    <div class="pl15 pr15">
      <p class="lh43 textc fs14 ca8">- 宝贝详情 -</p>
      <div class="bgfff" v-html="goodsMsg.goodsDetails"></div>
    </div>
    <p class="lh43 textc fs12 ca8">- 汉全科技集团出品 -</p>
    <!--bottom-->
    <!--右边悬浮框-->
    <div
      class="index_float_right trans2 overhidden"
      v-if="proData.isAssemble == 0 && proData.isKill == 0"
    >
      <RightFloat
        :isShow="isShow"
        @clickRightRowEvent="clickRightRowEvent"
        :bottom="60"
        :intoType="1"
        :specId="typeId"
      ></RightFloat>
      <div
        :class="{ fadeInRight: !isShow, fadeOutRight: isShow }"
        style="border-top-left-radius: 10rpx;border-bottom-left-radius: 10rpx;width: 40rpx;right: 0; bottom: 60px;"
        class="animated posfix fs10 ca8 textc floats trans2 shadow_gray bgfff pb15"
      >
        <div class="pt16" @click="clickRightRowEvent">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right_row.png"
            alt
            style="width: 30rpx;transform: rotate(180deg);height: 30rpx;"
          />
        </div>
      </div>
    </div>
    <!--购买-->
    <div class="disflex fix_bottom bte8" v-if="goodsMsg.name">
      <div class="disflex flex1 bgfff textc posre">
        <div class="w33p pt7" @click="toProductList">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/prod_select.png"
            alt
            class="w20 h20"
          />
          <b class="cblue fs12 textc mt-4">商城</b>
        </div>
        <div class="w33p pt7" @click="makePhone">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel_gray.png"
            alt
            class="w20 h20"
          />
          <b class="ca8 fs12 textc mt-4">通话</b>
        </div>
        <div class="w33p pt7" @click="collect">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/like_gray.png"
            alt
            class="w20 h20"
            v-if="!isCollect"
          />
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190418161144.png"
            alt
            class="w20 h20"
            v-else
          />
          <b class="fs12 textc mt-4" :class="isCollect ? 'cblue' : 'ca8'">收藏</b>
        </div>
        <LoginIntercept />
      </div>
      <!-- 拼团 -->
      <div
        class="collage w220 disflex textc fs16 cfff borderbox bgfff posre"
        v-if="canbuy && proData.isAssemble"
      >
        <div
          v-if="!isJoin"
          class="w50p bg_line_yellow flex-c-c flex-column"
          @click="buyCollage('alone')"
        >
          <span class="textc fs16 lh18">¥{{ (proData.price / 100).toFixed(2) }}</span>
          <span class="textc fs14 lh18">单独购买</span>
        </div>
        <div
          v-if="!isJoin"
          class="w50p bg_line_orange flex-c-c flex-column"
          @click="buyCollage('group')"
        >
          <span class="textc fs16 lh18">¥{{ (proData.assemblePrice / 100).toFixed(2) }}</span>
          <span class="textc fs14 lh18">一键开团</span>
        </div>
        <div
          v-if="isJoin"
          class="w100p bg_line_orange flex-c-c flex-column"
          @click="buyCollage('join')"
        >
          <span class="textc fs16 lh18">¥{{ (proData.assemblePrice / 100).toFixed(2) }}</span>
          <span class="textc fs14 lh18">我要参团</span>
        </div>
        <LoginIntercept />
      </div>
      <!-- 非拼团 -->
      <div
        class="posre w220 disflex textc fs16 cfff pr15 pt5 pb5 borderbox bgfff lh40"
        v-if="canbuy && !proData.isAssemble"
      >
        <span class="w50p bg_line_yellow add_to_card" @click="addToCart">加入购物车</span>
        <span class="w50p bg_line_orange buy_now" @click="buynow">立即购买</span>
        <LoginIntercept />
      </div>
      <div
        class="w220 bg_line_orange textc fs18 cfff lh49 disflex align-cen jscen"
        @click="toIM"
        v-else-if="!canbuy"
      >
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/icon_message%403x.png"
          alt
          class="w24 h24 mr7"
        />
        <span>立即咨询</span>
      </div>
    </div>
    <div v-if="showShareOrSave">
      <ShareOrSave :status="showShareOrSave" @closeModal="closeModal" @save="save"></ShareOrSave>
    </div>
    <!--全屏预览-->
    <div class="mask disflex align-cen jscen" v-if="isPreviewImg">
      <div class="disinblock">
        <div class="disflex flex-end">
          <img @click="closePreviewImg" src="/static/close.png" style="height: 48rpx; width: 48rpx" />
        </div>
        <img class="img-size bradius5" :src="maskImg" />
        <span
          @click="saveImg"
          class="bg_line_blue cfff textc fs18 fbold bradius5 lh44 mb15"
          style="width: 465rpx;display: block"
        >保存图片</span>
      </div>
    </div>
    <LoginDialog :isShow="showLogin" @loginSuccess="loginSuccess" @cancelLogin="cancelLogin" />
  </div>
</template>
<script>
import SelfSwiper from "@/components/swiper"; //
import RightFloat from "@/components/rightFloat"; // 订单项
import ShareOrSave from "@/components/shareOrSave";
import WXAJAX from "../../utils/request";
import util from "../../utils/index";
import { mapGetters, mapActions } from "vuex";
import AssembleInfo from "./components/AssembleInfo";
import SeckillInfo from "./components/SeckillInfo";
import SpikeBox from "./components/SpikeBox";
import LoginIntercept from "@/components/LoginIntercept";
import { addShareRecord } from "@/utils/behavior";
import LoginDialog from "@/components/login";

export default {
  name: "",
  components: {
    SelfSwiper,
    RightFloat,
    ShareOrSave,
    AssembleInfo,
    SpikeBox,
    LoginIntercept,
    SeckillInfo,
    LoginDialog
  },
  data() {
    return {
      showShareOrSave: false, // 显示分享/保存下拉选框
      canbuy: true, //是否可以支付
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      img:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/food.jpg",
      images: [],
      types: [
        {
          title: "类型",
          lists: [
            { name: "系统租用", id: "0" },
            { name: "源码出售", id: 1 }
          ],
          selectId: 0
        },
        {
          title: "规格",
          lists: [
            { name: "3000/年", id: 0 },
            { name: "10个／15斤装", id: 1 },
            { name: "一斤装", id: 2 }
          ],
          selectId: 0
        }
      ],
      typeId: 0,
      goodsPrice: "",
      goodId: 0,
      goodsMsg: {
        goodsDetails: "",
        name: "",
        price: ""
      },
      isCollect: false, //是否收藏
      cardTel: "",
      type_id_1: 0, //
      type_index_1: 0,
      right_float_show: false, //右边悬浮框
      cardId: 0,
      num: 1, // 加入购物车/直接下单的数量
      placeOrder: false,
      forwardId: wx.getStorageSync("forwardId"),
      forwardGoodsId: wx.getStorageSync("forwardGoodsId"),
      shareForwardId: "", // 给别人分享生成的ID，onShareAppMessage中使用async函数后，自定义内容无效，所以移动至最开始调用获取分享id
      isPreviewImg: false,
      maskImg: "",
      isShow: true,
      userId: "",
      //拼团数据
      assembleData: null,
      //获取的数据详情
      proData: {},
      //是否是从参团页面过来的，只允许参团
      isJoin: false,
      //参团页面的参团ID
      groupAssembleId: -1,
      showLogin: false //是否显示登录弹窗
    };
  },
  async onLoad() {
    // 重置页面部分显示数据
    /**this.showShareOrSave = false;
    this.maskImg = '';
    this.isPreviewImg = false;
    this.num = 1;
    this.images = [];
    this.goodsMsg = {
      goodsDetails : '',
      name : '',
      price : ''
    };**/
    // 判断是否存在 storage -- prod
    if (wx.getStorageSync("prod")) {
      let prod = wx.getStorageSync("prod");
      this.images = prod.goodPhoto ? prod.goodPhoto.split(",") : [];
      this.goodsMsg = {
        goodsDetails: prod.goodsDetails,
        name: prod.goodsName,
        price: prod.price
      };
      wx.removeStorageSync("prod");
    }
    let query = this.$root.$mp.query;
    //获取是否有参团的逻辑
    this.isJoin = query.join || false;
    this.groupAssembleId = query.assembleId || -1;

    if (query.cardId) {
      //从分享的商品页面进入
      this.cardId = query.cardId;
      this.goodId = query.goodId;
      this.cardTel = query.tel;
      await this.findCompany(this.cardId);
    } else {
      this.cardTel = wx.getStorageSync("CARDTEL") || "";
      this.goodId = this.$root.$mp.query.goodId || 0;
      this.cardId = wx.getStorageSync("CARDID") || 0;
    }
    this.checkCollect();
    this.getProdDetail();
    this.addGoodsForwardRecord(this.cardId, this.goodId).then(res => {
      this.shareForwardId = res;
    });
    this.forwardId = wx.getStorageSync("forwardId");
    this.forwardGoodsId = wx.getStorageSync("forwardGoodsId");
    //this.getProdSize() ;
  },
  async onPullDownRefresh() {
    this.checkCollect();
    this.getProdDetail();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1 * 1000);
  },
  onPageScroll() {
    this.right_float_show = false;
  },
  onShareAppMessage(e) {
    this.validGoodsForwardRecord();
    let url = this.goodsMsg.coverImg || "";

    let uuid = this.cardId + "" + new Date().getTime();
    addShareRecord(this.currentCompany.companyId, 3, this.goodId, uuid).then(
      res => {},
      err => {}
    );
    return {
      title: this.goodsMsg.name,
      path:
        "/pages/prodDetail/main?goodId=" +
        this.goodId +
        "&cardId=" +
        this.cardId +
        "&tel=" +
        this.cardTel +
        "&companyId=" +
        this.currentCompany.companyId +
        "&forwardId=" +
        this.shareForwardId +
        "&goType=1" +
        "&shareId=" +
        uuid,
      imageUrl: url
    };
  },
  onUnload() {
    this.typeId = "";
  },
  methods: {
    ...mapActions(["setCurrentCompany"]),
    //获取公司信息
    async findCompany(cardId) {
      wx.showLoading();
      let url = "/businessCard/cardDetails";
      //获取数据
      // wx.showLoading();
      try {
        let data = await WXAJAX.POST(
          {
            cardId,
            refresh: true || ""
          },
          "",
          url
        );
        this.setCurrentCompany(data);
        wx.hideLoading();
      } catch (error) {
        wx.hideLoading();
      }
    },
    loginSuccess() {
      // this.onReady();
    },
    //取消登录
    cancelLogin() {
      this.showLogin = false;
    },
    showShare() {
      this.showShareOrSave = true;
    },
    closeModal() {
      this.showShareOrSave = false;
    },
    clickRightRowEvent() {
      this.isShow = !this.isShow;
    },
    // 关闭预览图片
    closePreviewImg() {
      this.isPreviewImg = false;
      wx.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#ffffff",
        animation: {
          duration: 1
        }
      });
    },
    // 保存图片
    saveImg() {
      wx.saveImageToPhotosAlbum({
        filePath: this.maskImg,
        success: res => {
          wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#ffffff",
            animation: {
              duration: 1
            }
          });
          this.isPreviewImg = false;
          wx.showToast({
            title: "保存成功",
            duration: 1000,
            icon: "success",
            mask: true
          });
        },
        fail: res => {
          wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#ffffff",
            animation: {
              duration: 1
            }
          });
          this.isPreviewImg = false;
          wx.showToast({
            title: "保存失败",
            duration: 1000,
            icon: "none",
            mask: true
          });
        }
      });
    },
    // 保存图片
    save() {
      this.showShareOrSave = false;
      if (this.maskImg !== "") {
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#848485",
          animation: {
            duration: 200
          }
        });
        this.isPreviewImg = true;
        return;
      }
      wx.showLoading();
      WXAJAX.POST({ specId: this.typeId }, "", "/goods/goodsCard").then(
        data => {
          let url = WXAJAX.imgBackUrl + data;
          wx.getImageInfo({
            src: url,
            success: sres => {
              wx.hideLoading();
              this.maskImg = sres.path;
              wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#848485",
                animation: {
                  duration: 200
                }
              });
              this.isPreviewImg = true;
            }
          }).catch(err => {
            wx.hideLoading();
          });
        }
      );
    },
    validGoodsForwardRecord() {
      // 将分销id转为
      WXAJAX.POST(
        {
          forwardId: this.shareForwardId
        },
        "",
        "/record/validGoodsForwardRecord"
      ).then(res => {});
    },
    prodChangeNum: function(n) {
      let num = parseInt(this.num.toString().replace(/[^\d]/g, "") || 0);
      this.num = num + n > 0 ? num + n : 1;
    },
    toIM() {
      WXAJAX.ToIMPage(this.currentCompany, 1, this.typeId);
      // uni.navigateTo({
      //   url: `/pages/IM/main?type=1&cardId=${this.cardId}&userId=${this.currentCompany.userId}&logo=${this.currentCompany.logo}&specId=${this.typeId || ''}&name=${this.currentCompany.name}`
      // })
      // wx.navigateTo({
      //   url: '/pages/IM/main?type=1' +'&cardId=' + this.cardId +
      //     '&userId=' + this.userId +
      //     '&logo=' + this.currentCompany.logo +
      //     '&specId=' + (this.typeId || '') +
      //     '&name=' + this.currentCompany.name
      // });
    },
    getProdDetail(refresh) {
      if (!this.goodId) return;

      let v = this;
      const { parentId, specId } = this.$root.$mp.query;
      WXAJAX.POST(
        {
          goodsId: v.goodId,
          cardId: this.cardId,
          refresh: refresh || ""
        },
        "",
        "/goods/getGoodsInfo"
      )
        .then(data => {
          if (data) {
            this.proData = data;
            v.goodsMsg = {
              goodsDetails: data.goodsDetails || "",
              name: data.goodsName,
              // price: data.isKill ? (data.killPrice / 100) : (data.price / 100),
              price: data.price / 100,
              coverImg: data.coverImg
            };
            v.goodsMsg.price = v.goodsMsg.price.toFixed(2);

            v.canbuy = data.ispayment == 1;
            data.goodPhoto && (v.images = data.goodPhoto.split(","));
            if (data.goodSpecModelList) {
              data.goodSpecModelList.forEach(function(i, k) {
                if (i.goodSpecModelList) {
                  //有二级分类
                  i.selectId = i.goodSpecModelList[0].specId;
                  i.price = i.goodSpecModelList[0].price / 100;
                  i.price = i.price.toFixed(2);
                  i.specNum = i.goodSpecModelList[0].specNum;
                } else {
                  i.selectId = i.specId;
                  i.price = i.price / 100;
                  i.price = i.price.toFixed(2);
                }
              });
              v.types = data.goodSpecModelList;
              v.type_id_1 = parentId || v.types[0].specId;
              v.goodsPrice = v.types[0].price;
              v.typeId = specId || v.types[0].selectId;
              if (parentId)
                v.type_index_1 = data.indexOf(
                  data.find(res => res.specId == parentId)
                );
              v.type_index_1 = v.type_index_1 == -1 ? 0 : v.type_index_1;
            }
            //获取拼团数据
            if (data.goodsAssembleModel) {
              this.assembleData = data.goodsAssembleModel;
            }
          }
        })
        .catch(err => {
          v.goodsMsg = {};
          v.images = [];
        });
    },
    getProdSize() {
      //查询产品规格
      let v = this;
      const { parentId, specId } = this.$root.$mp.query;
      WXAJAX.POST(
        {
          goodsId: v.goodId
        },
        "",
        "/goods/getGoodSpec"
      )
        .then(
          data => {
            if (data) {
              data.forEach(function(i, k) {
                if (i.goodSpecModelList) {
                  //有二级分类
                  i.selectId = i.goodSpecModelList[0].specId;
                  i.price = i.goodSpecModelList[0].price / 100;
                  i.specNum = i.goodSpecModelList[0].specNum;
                } else {
                  i.selectId = i.specId;
                  i.price = i.price / 100;
                }
              });
              v.types = data;
              v.type_id_1 = parentId || v.types[0].specId;
              v.goodsPrice = v.types[0].price.toFixed(2);
              v.typeId = specId || v.types[0].selectId;
              if (parentId)
                v.type_index_1 = data.indexOf(
                  data.find(res => res.specId == parentId)
                );
              v.type_index_1 = v.type_index_1 == -1 ? 0 : v.type_index_1;
            }
            //获取拼团数据
            if (data.goodsAssembleModel) {
              this.assembleData = data.goodsAssembleModel;
            }
          },
          err => {
            if (err.code && err.code === 401) {
              this.showLogin = true;
            }
          }
        )
        .catch(err => {
          v.goodsMsg = {};
          v.images = [];
        });
    },
    getProdSize() {
      //查询产品规格
      let v = this;
      const { parentId, specId } = this.$root.$mp.query;
      WXAJAX.POST(
        {
          goodsId: v.goodId
        },
        "",
        "/goods/getGoodSpec"
      )
        .then(data => {
          if (data) {
            data.forEach(function(i, k) {
              if (i.goodSpecModelList) {
                //有二级分类
                i.selectId = i.goodSpecModelList[0].specId;
                i.price = i.goodSpecModelList[0].price / 100;
                i.specNum = i.goodSpecModelList[0].specNum;
              } else {
                i.selectId = i.specId;
                i.price = i.price / 100;
              }
            });
            v.types = data;
            v.type_id_1 = parentId || v.types[0].specId;
            v.goodsPrice = v.types[0].price.toFixed(2);
            v.typeId = specId || v.types[0].selectId;
            if (parentId)
              v.type_index_1 = data.indexOf(
                data.find(res => res.specId == parentId)
              );
            v.type_index_1 = v.type_index_1 == -1 ? 0 : v.type_index_1;
          }
        })
        .catch(err => {
          v.typeId = 0;
          v.goodsPrice = "";
          v.types = [];
        });
    },
    //修改typeId
    changeTypeId(id) {
      this.typeId = id;
    },
    checkCollect() {
      //
      WXAJAX.checkCollect({
        itemType: 1,
        itemId: this.goodId
      })
        .then(data => {
          this.isCollect = data.status;
          console.log(this.isCollect);
        })
        .catch(err => {});
    },
    type_tap_1(id_1, index_1) {
      //点击一级分类
      this.type_id_1 = id_1;
      this.type_index_1 = index_1;
      this.type_tap(
        this.type_index_1,
        0,
        this.types[this.type_index_1].goodSpecModelList[0].specId
      );
    },
    type_tap(index_1, index_2, id) {
      wx.showLoading();
      this.types[index_1].selectId = id;
      let price = (
          this.types[index_1].goodSpecModelList[index_2].price / 100
        ).toFixed(2),
        specNum = this.types[index_1].goodSpecModelList[index_2].specNum;
      this.$set(this.types[index_1], "price", price);
      this.$set(this.types[index_1], "specNum", specNum);
      this.goodsPrice = price;
      this.typeId = id;
      wx.hideLoading();
    },
    toProductList() {
      wx.switchTab({ url: "/pages/Product/main" });
    },
    page_turn(url) {
      wx.navigateTo({ url: "../" + url + "/main?type=3" });
    },
    //选择了秒杀
    seckill(type) {
      this.$refs["seckillInfo"].seckill(type);
    },
    buynow() {
      //如果是秒杀,需要唤起选择类型和规格的弹框
      if (this.proData.isKill) {
        this.seckill("buy");
        return;
      }
      let selectId = this.types[this.type_index_1].selectId;
      let currentGoods = this.types[this.type_index_1].goodSpecModelList.find(
        val => selectId === val.specId
      );
      currentGoods = JSON.parse(JSON.stringify(currentGoods));
      currentGoods.goodsName = this.goodsMsg.name;
      currentGoods.num = this.num;
      currentGoods.photoUrl = this.images[0];
      currentGoods.cardId = this.cardId;
      currentGoods.price = (currentGoods.price / 100).toFixed(2);
      currentGoods.allPrice = currentGoods.price * currentGoods.num;

      let tmpObj = {
        companyId: this.currentCompany.companyId,
        companyName: this.currentCompany.companyName,
        orderState: 1,
        allNum: 1,
        orderPrice: currentGoods.price * currentGoods.num,
        shopcartModelList: [currentGoods]
      };
      wx.setStorageSync("orderInfo", [tmpObj]);
      wx.navigateTo({ url: "../orderConfirm/main" });
    },
    //拼团购买
    buyCollage(type) {
      this.$refs["assembleInfo"].buyCollage(type);
    },
    collect() {
      //收藏

      wx.showLoading();
      let _url = "",
        _request = {};
      if (this.isCollect) {
        //取消收藏
        _url = "/personal/delCollection";
      } else {
        //添加收藏
        _url = "/personal/addCollection";
      }
      _request = {
        itemType: 1,
        itemId: this.goodId
      };
      WXAJAX.POST(_request, "", _url)
        .then(data => {
          if (data) {
            this.isCollect = !this.isCollect;
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    makePhone() {
      //拨打电话
      util.MakePhone(this.cardTel || "");
    },
    car(payload) {
      this.typeId = payload.specId;
      this.num = payload.num;
      this.addToCart(true);
    },
    addToCart(isKill) {
      //加入购物车
      if (this.proData.isKill) {
        if (typeof isKill !== "boolean") {
          this.seckill("car");
          return;
        }
      }
      console.log("type", this.typeId);
      let v = this;

      wx.showLoading();

      WXAJAX.POST(
        {
          goodsId: v.goodId,
          cardId: v.cardId,
          specId: v.typeId, //规格ID
          forwardId: v.goodId == v.forwardGoodsId ? v.forwardId : "",
          num: v.num
        },
        "",
        "/orders/addShopcart"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            wx.showToast({
              title: "成功！",
              icon: "success",
              duration: 1000
            });
          }
        })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: "none"
          });
        });
    }
  },
  computed: {
    ...mapGetters(["currentCompany"])
  }
};
</script>
<style>
page {
  width: 100%;
  height: 100%;
  background: #f5f5f6;
}

.size_item.active {
  color: #00a0e9;
  background: #e5f8f7;
  border: 1upx solid #00a0e9;
}

.add_to_card {
  border-radius: 40upx 0 0 40upx;
}

.buy_now {
  border-radius: 0 40upx 40upx 0;
}

.prod_detail_float > div {
  bottom: 200upx;
}

.number-change-btn-group > span:first-child {
  line-height: 46upx;
  border-radius: 10upx 0 0 10upx;
}

.number-change-btn-group > span:last-child {
  line-height: 46upx;
  border-radius: 0 10upx 10upx 0;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.img-size {
  width: 465upx;
  height: 827.08upx;
  margin-top: 30upx;
  margin-bottom: 60upx;
}
.collage {
  height: 98upx;
}
</style
>>
