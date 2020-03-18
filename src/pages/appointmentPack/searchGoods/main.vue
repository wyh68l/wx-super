<template>
  <div class="pt44">
    <div class="disflex jsbet bgfff lh30 pl16 pr15 pt5 pb5 posfix top0 left0 w100p borderbox">
      <div class="bgf5f6 bradius17 disflex pl15 flex1">
        <span class="disflex pl10 jscen align-cen">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/search.png"
            alt
            class="w16 h16 menu_more posab"
          />
        </span>
        <input
          type="text"
          v-model="key"
          class="pl15 pha8 fs14 lh34 h34 w100p c38"
          @confirm="search"
          placeholder="请输入预约名称搜索"
        />
      </div>
      <span class="fs16 cblue lh34 pl15" @click="search">搜索</span>
    </div>
    <div class="pt80 textc" v-if="goodsList.length === 0">
      <template v-if="haveNoSearch">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190520/1558319783804.png"
          alt
          class="w170 h170"
        />
      </template>
      <template v-else>
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190521/1558429867593.png"
          alt
          class="w170 h170"
        />
        <div class="fs12 lh32 ca8">没有搜索到此类预约哦</div>
      </template>
    </div>
    <div class="bgf5f6 pl15 pr15 pb23" v-else>
      <getPhoneNumberGoods
        v-for="(v,k) in goodsList"
        :key="k"
        goodsType="product"
        @next="toProdDetail(v.productsId)"
        :goodInfo="v"
      ></getPhoneNumberGoods>
    </div>
    <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata && goodsList.length > 0">- 汉全科技集团出品 -</div>
  </div>
</template>
<script>
import WXAJAX from "@/utils/request";
import getPhoneNumberGoods from "@/components/getPhoneNumberGoods";
export default {
  components: { getPhoneNumberGoods },
  data() {
    return {
      goodsList: [],
      haveNoSearch: true,
      pageNum: 1,
      key: "",
      isLoading: false, // 是否在加载
      companyId: "",
      nodata: false,
      tapFlag: true //
    };
  },
  mounted() {
    this.init();
  },
  onShow() {
    this.tapFlag = true;
  },
  methods: {
    init() {
      this.pageNum = 1;
      this.goodsList = [];
      this.key = "";
      this.nodata = false;
      this.haveNoSearch = true;
      this.isLoading = false;
      this.companyId = this.$root.$mp.query.companyId;
      wx.setNavigationBarTitle({
        title: "搜索预约"
      });
    },
    toProdDetail(id) {
      if (!this.tapFlag) return;
      this.tapFlag = false;
      wx.navigateTo({
        url: "/pages/appointmentPack/productDetail/main?goodId=" + id
      });
    },
    search() {
      this.goodsList = [];
      this.nodata = false;
      this.pageNum = 1;
      this.getGoodsList();
    },
    getGoodsList() {
      let v = this;
      if (v.isLoading) {
        wx.hideLoading();
        return;
      }
      v.isLoading = true;
      let params = {
        productsTypeId: "",
        pageNum: this.pageNum,
        companyId: this.companyId,
        productsName: this.key
      };
      WXAJAX.POST(params, "", "/products/selectProductsPage/V2")
        .then(data => {
          wx.hideLoading();
          v.haveNoSearch = false;
          if (data) {
            data.pageInfo.list.forEach(function(i, k) {
              if (i.productsPhoto) {
                i.prodLogo = i.productsPhoto.split(",")[0];
              } else {
                i.prodLogo = "";
              }
              if (i.price) {
                let price;

                try {
                  price = JSON.parse(i.price);
                } catch (e) {
                  price = parseInt(i.price) || 0;
                }

                if (
                  Object.prototype.toString.call(price).toLowerCase() ===
                  "[object number]"
                ) {
                  i.price = price.toFixed(2);
                } else {
                  i.price = price.map(val => parseInt(val)).join("~");
                }
              } else {
                i.price = "";
              }
            });

            v.goodsList = [...v.goodsList, ...data.pageInfo.list];
            v.pageNum++;
            setTimeout(function() {
              v.isLoading = false;
            }, 500);
          } else {
            setTimeout(function() {
              v.nodata = true;
              v.isLoading = false;
            }, 500);
          }
        })
        .catch(err => {
          wx.hideLoading();
          console.log(err);
          v.goodsList = [];
          v.haveNoSearch = false;
          setTimeout(function() {
            v.isLoading = false;
          }, 500);
        });
    }
  },
  onReachBottom() {
    if (this.nodata) {
      return;
    }
    wx.showLoading({
      title: "加载中..."
    });
    let v = this;
    v.getGoodsList();
  }
};
</script>
<style>
page {
  background: #f5f5f6;
}
</style>
