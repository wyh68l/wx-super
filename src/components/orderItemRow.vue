<template>
  <div class="bgfff orderrow" @click="order_tap(orderData.ordersId)">
    <div class="pl15 lh44 posre disflex jsbet pl20 pr21">
      <div class="disflex align-cen" @click.stop="toCompany">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/company_name.png"
          alt
          class="w16 h16 mr7"
        />
        <span class="fs14 pr7">{{orderData.companyName}}</span>
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
      <span v-if="!orderData.assembleSuccess && order_type == 2" class="corange fs14">待成团</span>
      <span v-if="order_type==3" class="corange fs14">等待收货</span>
      <span v-if="order_type==4" class="cblue fs14">已完成</span>
      <span v-if="order_type==5" class="corange fs14">交易取消</span>
      <span v-if="order_type==6" class="corange fs14">退款成功</span>
      <span v-if="order_type==7" class="corange fs14">退款中</span>
    </div>

    <!--产品-->
    <div class="posre pl15 pr16">
      <scroll-view scroll-x class="nav" scroll-with-animation>
        <div class>
          <img
            :src="v.photoUrl"
            mode="aspectFill"
            alt
            class="w70 h70 bradius5 mr7 disinblock"
            v-for="(v,k) in orderData.shopcartModelList"
            :key="k"
          />
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: ["orderData", "order_type"],
  components: {},
  data() {
    return {
      menu: [
        { title: "全部产品", id: "0" },
        { title: "软件开发", id: "1" },
        { title: "电商运营", id: "2" },
        { title: "品牌推广", id: "3" },
        { title: "品牌推广1", id: "4" },
        { title: "品牌推广2", id: "5" },
        { title: "品牌推广3", id: "6" },
        { title: "品牌推广4", id: "7" },
        { title: "品牌推广5", id: "8" },
        { title: "品牌推广6", id: "9" }
      ]
    };
  },
  mounted() {
    console.log("====================================");
    console.log(this.orderData);
    console.log("====================================");
  },
  methods: {
    toCompany() {
      //公司
      wx.switchTab({ url: "../Product/main" });
    },
    order_tap(orderIds) {
      this.$emit("order_tap", orderIds);
    }
  }
};
</script>

<style>
.orderrow .nav {
  height: 220upx;
  width: 100%;
  white-space: nowrap;
  padding-top: 40upx;
  box-sizing: border-box;
}

.orderrow .nav-item {
  display: inline-block;
}
</style>
















