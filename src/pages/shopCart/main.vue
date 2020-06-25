<template>
  <div class="shopcart_bg w100p h100p posre">
    <div class="disflex jsbet lh44 pl16 pr16 cfff fs16">
      <div class="disflex">
        共
        <b>{{cart_total}}</b>件宝贝
      </div>
      <span class="fs18 fbold" @click="todel">{{isdel ? '完成' : '管理'}}</span>
    </div>
    <!--lists-->
    <div class="pl15 pr15 pb50">
      <div class="mb10" v-if="!cart_lists.length">
        <div class="bgfff bradius10">
          <NoData></NoData>
        </div>
      </div>
      <div v-else>
        <div class="mb10" v-for="(cart_item,k) in cart_lists" :key="k">
          <OrderItem
            :orderData="cart_item"
            :orderIndex="k"
            iscart="true"
            :index1="k"
            :label_prod="labels[k].prod"
            :label_company="labels[k].company"
            @prodChangeNum="prodChangeNum"
            @choose_order="choose_order"
            @order_tap="toDetail"
          ></OrderItem>
        </div>
      </div>
    </div>
    <!--bottom-->
    <div
      class="disflex jsbet fix_bottom bgfff lh39 fs16 pt5 pb5 borderbox pl15 pr16 bte8"
      v-show="!isdel"
    >
      <div class="c68" @click="choose_all('all')">
        <label class="checkBox" :class="label_all ? 'active' :''">
          <!--<input type="checkbox">-->
          <span></span>
        </label>
        <span class="pl30">全选</span>
      </div>
      <div class="pl21">
        <span class="c38">合计：</span>
        <span class="corange fbold">￥{{choose_total_money}}</span>
      </div>
      <span
        class="bradius20 trans2 cfff w110 textc lh39"
        @click="toPay"
        :class="choose_total_num > 0 ? 'bg_line_blue' : 'bga8' "
      >结算({{choose_total_num}})</span>
    </div>
    <div
      class="disflex jsbet fix_bottom bgfff lh30 fs16 pt10 pb10 borderbox pl15 pr16 bte8 h50 borderbox"
      v-show="isdel"
    >
      <div class="c68" @click="choose_all('all')">
        <label class="checkBox" :class="label_all ? 'active' :''">
          <!--<input type="checkbox">-->
          <span></span>
        </label>
        <span class="pl30">全选</span>
      </div>
      <div class="disflex">
        <span
          class="w90 textc byellow cyellow fs14 mr10 bradius15 h30 borderbox"
          @click="toCollect"
        >加入收藏夹</span>
        <span class="w50 textc borange corange fs14 bradius15 h30 borderbox" @click="delCart">删除</span>
      </div>
    </div>
  </div>
</template>
<script>
import OrderItem from "@/components/orderItem"; // 订单项
import WXAJAX from "../../utils/request";
import NoData from "@/components/noData";

export default {
  name: "",
  components: { OrderItem, NoData },
  data() {
    return {
      canChangeShopCartNum: true,
      choose_total_money: "0.00",
      choose_total_num: "0",
      cart_total: "0",
      isdel: false,
      cart_lists: [],
      labels: [
        {
          company: false,
          prod: []
        }
      ],
      label_all: false
    };
  },
  onLoad() {
    this.inits();
  },
  async onPullDownRefresh() {
    this.inits();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1 * 1000);
  },
  methods: {
    inits() {
      let v = this;
      this.cart_total = 0;
      v.cart_lists = [];
      WXAJAX.POST(
        {
          page: 1,
          pageSize: 999
        },
        "",
        "/orders/selectShopcart"
      )
        .then(data => {
          console.log("shopcart -- ", data);
          let _data, items;
          v.labels = [];

          if (data) {
            data.forEach(function(i, k) {
              v.labels.push({
                company: false,
                prod: []
              });

              i.shopcartModelList.forEach(function(i2, k2) {
                if (i2.isKill) {
                  i2.killPrice = i2.killPrice / 100;
                }
                i2.price = i2.price / 100;
                v.labels[k].prod.push(false);
                v.cart_total++;
              });
            });
            v.cart_lists = data;
          } else {
            v.cart_lists = [];
          }

          v.label_all = true;
          this.choose_all("all");
        })
        .catch(err => {
          v.cart_lists = [];
        });
    },
    prodChangeNum(index1, index2, num) {
      if (this.canChangeShopCartNum) {
        // 在更改购物车数量结果OK之前，不可以多次重复点击，防止购物车商品数量快速点击之后可以更改为0
        this.canChangeShopCartNum = false;
        let old_num = this.cart_lists[index1].shopcartModelList[index2].num;
        if (old_num === 1 && num == -1) {
          // 减
          wx.showToast({
            title: "不能再少了！",
            icon: "none"
          });
          this.canChangeShopCartNum = true;
          return;
        }
        wx.showLoading();
        WXAJAX.POST(
          {
            shopCartId: this.cart_lists[index1].shopcartModelList[index2].shopCartId,
            num: old_num + num,
          },
          "",
          "/orders/updShopcartNum"
        )
          .then(data => {
            wx.hideLoading();
            if (data) {
              this.$set(
                this.cart_lists[index1].shopcartModelList[index2],
                "num",
                this.cart_lists[index1].shopcartModelList[index2].num + num
              );
              let tmp = JSON.parse(JSON.stringify(this.cart_lists));
              this.$set(this, "cart_lists", []);
              setTimeout(() => {
                this.$set(this, "cart_lists", tmp);
                this.total_money();
                this.canChangeShopCartNum = true;
              }, 20);
            } else {
              this.canChangeShopCartNum = true;
            }
          })
          .catch(err => {
            this.canChangeShopCartNum = true;
            wx.hideLoading();
          });
      }
    },
    choose_order(method, index1, index2) {
      let v = this;
      if (method == "company") {
        //选择商家
        let old_status = this.labels[index1].company,
          new_status = true;
        if (old_status) {
          new_status = false;
        }
        v.$set(this.labels[index1], "company", new_status);
        v.labels[index1].prod.forEach(function(item, k) {
          v.$set(v.labels[index1].prod, k, new_status);
        });
        /*   old_status = null;
           new_status = null;*/
      } else if (method == "prod") {
        //选择单个产品

        let old_status = v.labels[index1].prod[index2],
          length = 0;
        v.$set(v.labels[index1].prod, index2, !old_status);
        v.labels[index1].prod.forEach(function(item, k) {
          if (item) {
            length++;
          }
        });
        if (length === v.labels[index1].prod.length) {
          v.$set(v.labels[index1], "company", true);
        } else {
          v.$set(v.labels[index1], "company", false);
        }
      }
      this.choose_all();
    },
    choose_all(method) {
      let v = this;
      if (method === "all") {
        //全选

        let old_status = v.label_all;
        console.log("old_status---", old_status);
        if (v.label_all) {
          //取消全选

          v.labels.forEach(function(item1, index1) {
            v.$set(v.labels[index1], "company", false);
            item1.prod.forEach(function(item2, index2) {
              v.$set(v.labels[index1].prod, index2, false);
            });
          });
        } else {
          v.labels.forEach(function(item1, index1) {
            v.$set(v.labels[index1], "company", true);
            item1.prod.forEach(function(item2, index2) {
              v.$set(v.labels[index1].prod, index2, true);
            });
          });
        }

        v.label_all = !v.label_all;
      } else {
        let length = 0;
        v.labels.forEach(function(i, k) {
          if (i.company) {
            length++;
          }
        });
        if (length === v.labels.length) {
          v.label_all = true;
        } else {
          v.label_all = false;
        }
      }
      v.total_money();
    },
    total_money() {
      //计算总金额
      let v = this,
        new_money = 0,
        length = 0;
      v.labels.forEach(function(item1, index1) {
        item1.prod.forEach(function(item2, index2) {
          if (item2) {
            new_money +=
              v.cart_lists[index1].shopcartModelList[index2].price *
              v.cart_lists[index1].shopcartModelList[index2].num;
            length++;
          }
        });
      });
      v.choose_total_money = new_money.toFixed(2);
      v.choose_total_num = length;
    },
    todel() {
      //显示删除按钮
      this.isdel = !this.isdel;
    },
    delCart() {
      //删除商品

      let _prods = [],
        v = this;

      v.labels.forEach(function(item1, k1) {
        item1.prod.forEach(function(item2, k2) {
          if (item2) {
            _prods.push(v.cart_lists[k1].shopcartModelList[k2].shopCartId);
          }
        });
      });

      if (_prods.length == 0) {
        wx.showToast({
          title: "请选择要删除的商品！",
          icon: "none"
        });
        return;
      }

      wx.showLoading();

      WXAJAX.POST(
        {
          shopCartIds: _prods.join(",")
        },
        "",
        "/orders/delShopcart"
      )
        .then(data => {
          wx.hideLoading();

          if (data) {
            v.inits();
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    checkOneCompany() {
      let companys = this.labels.filter(
        val => val.prod.filter(val => val).length
      );

      return companys.length <= 1;
    },
    toPay() {
      //结算

      let _prods = [];
      let v = this;
      let companyInfo = {};
        console.log(v.cart_lists);
      v.labels.forEach(function(item1, k1) {
        item1.prod.forEach(function(item2, k2) {
          if (item2) {
            companyInfo = JSON.parse(JSON.stringify(v.cart_lists[k1]));
            let tmpProd = JSON.parse(
              JSON.stringify(v.cart_lists[k1].shopcartModelList[k2])
            );
            tmpProd.allPrice = tmpProd.price * tmpProd.num;
            _prods.push(tmpProd);
          }
        });
      });

      if (_prods.length == 0) {
        wx.showToast({
          title: "请选择要结算的商品！",
          icon: "none"
        });
        return;
      }

      if (!this.checkOneCompany()) {
        wx.showToast({
          title: "只能选择同一公司商品下单~!",
          icon: "none"
        });
        return;
      }

      companyInfo.shopcartModelList = [..._prods];
      companyInfo.allNum = _prods.length;
      companyInfo.orderPrice = _prods.reduce((a, b) => {
        return {
          allPrice: a.allPrice + b.allPrice
        };
      }).allPrice;
      companyInfo.orderPrice = companyInfo.orderPrice.toFixed(2);

      console.log("companyInfo----------", companyInfo);
      wx.setStorageSync("orderInfo", [companyInfo]);
      wx.navigateTo({ url: "../orderConfirm/main" });
    },
    toDetail(goodId, cardId) {
      wx.navigateTo({
        url: "../prodDetail/main?goodId=" + goodId + "&cardId=" + cardId
      });
    },
    toCollect() {
      //移入收藏夹

      let _prods = [],
        v = this;
      v.labels.forEach(function(item1, k1) {
        item1.prod.forEach(function(item2, k2) {
          if (item2) {
            _prods.push(v.cart_lists[k1].shopcartModelList[k2].goodsId);
          }
        });
      });

      if (_prods.length == 0) {
        wx.showToast({
          title: "请选择要收藏的商品！",
          icon: "none"
        });
        return;
      }

      wx.showLoading();

      WXAJAX.POST(
        {
          itemIds: _prods.join(","),
          itemType: 1 //
        },
        "",
        "/orders/shopAddCollection"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            //订单id
            wx.showToast({
              title: "收藏成功！",
              icon: "success"
            });
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
    }
  }
};
</script>
<style>
.shopcart_bg::after {
  content: "";
  width: 100%;
  height: 248upx;
  background: #00a0e9;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
</style>
