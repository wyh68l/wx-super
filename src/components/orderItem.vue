<template>
  <div class="bgfff" :class="iscart || isorder ? 'bradius10' : '' ">
    <div
      class="pl15 lh44 posre disflex jsbet pr21"
      :class="iscart?'pl45 bbF2F3F4':isorder ? 'pl20 pb20' : 'pl15 pb20' "
      @click.stop="toCompany"
    >
      <div class="disflex align-cen">
        <label
          class="checkBox"
          v-if="iscart"
          :class="label_company ? 'active' :''"
          @click.stop="choose_order('company')"
        >
          <input type="checkbox" />
          <span></span>
        </label>
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/company_name.png"
          alt
          class="w16 h16 mr8"
        />
        <span class="fs14 pr11">{{orderData.companyName}}</span>
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
          alt
          class="w10 h10"
        />
      </div>
      <span v-if="order_type==1" class="corange fs14">等待付款</span>
      <span
        v-if="orderData.assembleId? (orderData.assembleSuccess && order_type == 2): order_type == 2"
        class="corange fs14"
      >等待发货</span>
      <span
        v-if="!orderData.assembleSuccess && order_type==2 && orderData.assembleId"
        class="corange fs14"
      >待成团</span>
      <span v-if="order_type==3" class="corange fs14">等待收货</span>
      <span v-if="order_type==4" class="cblue fs14">已完成</span>
      <span v-if="order_type==5" class="corange fs14">交易取消</span>
      <span v-if="order_type==6" class="corange fs14">退款成功</span>
      <span v-if="order_type==7" class="corange fs14">退款中</span>
    </div>
    <div
      class="disflex posre pb21 flex-c-c order-content"
      :class="iscart?'bbF2F3F4':''"
      v-for="(prod_item,k) in orderData.shopcartModelList"
      @click="order_tap(isOrder? orderData.ordersId:prod_item.goodsId, prod_item.cardId)"
      :key="prod_item.goodsId"
    >
      <SeckillCuntdown
        class="pt15 pl15"
        v-if="prod_item.isKill"
        :diffTime="parseInt(prod_item.killEndTime/1000)"
      />
      <div :class="iscart?'pl45 pt20':'pl15 pt15'">
        <label
          class="checkBox"
          @click.stop="choose_order('prod',k)"
          :class="label_prod[k] ? 'active' :''"
          v-if="iscart"
        >
          <input type="checkbox" class="checkBox" />
          <span></span>
        </label>
        <div class="disflex w100p pr16">
          <img :src="prod_item.photoUrl" alt class="w70 h70 mr11 bradius5" mode="aspectFill" />
          <div class="flex1">
            <p class="over_1 fs14 c38 w200">{{prod_item.goodsName || prod_item.name}}</p>
            <!--类型-->
            <div class="disflex mt5" v-if="iscart">
              <span
                class="be8 pl7 pr8 lh20 fs12 ca8 mr8 bradius3"
              >{{prod_item.specName || ''}}；{{prod_item.specAttribute}}</span>
            </div>
            <div class="mt8" v-else>
              <span
                class="pl7 pr8 lh20 fs12 ca8 mr8"
              >{{prod_item.specName || ''}}；{{prod_item.specAttribute}} x {{prod_item.num}}</span>
              <div>
                <span
                  class="pl7 pr8 lh20 fs12 ca8 mr8"
                >￥{{prod_item.isKill ? prod_item.killPrice : prod_item.price}}</span>
              </div>
            </div>
            <!--加减-->
            <div class="disflex jsbet align-cen" v-if="iscart" @click.stop="''">
              <span class="cdeeporange fs14">
                <span>￥</span>
                <span>{{prod_item.isKill ? prod_item.killPrice : prod_item.price}}</span>
              </span>
              <div class="counter disflex number-change-btn-group">
                <span class="textc be8 lh25 w25 minus ca8" @click.stop="prodChangeNum(index1,k,-1)">
                  <img
                    src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190505113629.png"
                    class="w10 h10"
                  />
                </span>
                <span class="bte8 bbe8 fs12 c68 w40 lh25 textc">{{prod_item.num}}</span>
                <span class="textc be8 lh25 w25 add ca8" @click.stop="prodChangeNum(index1,k,1)">
                  <img
                    src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190505113647.png"
                    class="w10 h10"
                  />
                </span>
              </div>
            </div>
            <!--价格-->
            <div class="textr fs14 c38" v-if="isorder">￥{{prod_item.allPrice}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SeckillCuntdown from "@/components/SeckillCuntdown"; // 订单项

export default {
  name: "",
  components: { SeckillCuntdown },
  props: [
    "orderData",
    "iscart",
    "index1",
    "label_company",
    "label_prod",
    "isorder",
    "order_type",
    "isOrder"
  ],
  data() {
    return {
      company_check: false
    };
  },
  mounted() {
    // console.log('orderData----',this.orderData)
  },
  methods: {
    prodChangeNum(index1, index2, num) {
      //改变数量
      this.$emit("prodChangeNum", index1, index2, num);
    },
    choose_order(method, index2) {
      //选择
      if (method == "company") {
        this.company_check = !this.company_check;
      }
      this.$emit("choose_order", method, this.index1, index2);
    },
    order_tap(orderIds, cardId) {
      this.$emit("order_tap", orderIds, cardId);
    },
    toCompany() {
      //公司
      const { cardId, companyId } = this.orderData;
      wx.setStorageSync("COMPANYID", companyId);
      if (this.iscart) {
        wx.setStorageSync("CARDID", cardId);
      } else {
        wx.setStorageSync("CARDID", this.orderData.ordersModelList[0].cardId);
      }

      wx.switchTab({ url: "../Product/main" });
    }
  },
  watch: {}
};
</script>
<style>
.number-change-btn-group > span:first-child {
  line-height: 46upx;
  border-radius: 10upx 0 0 10upx;
}

.number-change-btn-group > span:last-child {
  line-height: 46upx;
  border-radius: 0 10upx 10upx 0;
}
.order-content {
  flex-direction: column;
  align-items: flex-start;
}
</style>
