<template>
  <div class="order-item">
    <div class="company disflex jsbet pl15 lh44 posre pr21" @click="$emit('toPage', orderInfo)">
      <div class="disflex align-cen h44">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/company_name.png"
          alt
          class="w16 h16 mr8"
        />
        <span class="fs14 pr11">{{orderInfo.companyName}}</span>
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
          alt
          class="w10 h10"
        />
      </div>
      <span v-if="orderInfo.state==1" class="corange fs14">等待商户接单</span>
    </div>
    <ProductCard
      :title="orderInfo.productsName"
      :desc="orderInfo.describe"
      :price="orderInfo.price"
      :typeName="orderInfo.productsTypeName"
      :imgUrl="orderInfo.photo"
      outStyle="margin-top:0"
    />
    <div class="user-info">
      <div class="user over_1">预约人：{{orderInfo.name}}</div>
      <div class="time mt10 disflex jsbet">
        <span>预约时间：{{orderInfo.appointmentTime}}</span>
        <span v-if="orderInfo.state == 1" class="cblue">未使用</span>
      </div>
      <img
        v-if="orderInfo.state == 3 || orderInfo.state == 4 || orderInfo.state == 5"
        :src="stateImgs[orderInfo.state]"
        alt
        class="order-state"
      />
    </div>
    <div class="operation">
      <div class="textr lh30 pt10 pb10 fs14 bgfff pr21">
        <span class="disinblock textc be8 ca8 bradius20 w90" @click="showOrder">查看预约</span>
        <span
          class="disinblock textc be8 ca8 bradius20 w90"
          v-if="orderInfo.state==1 || orderInfo.state == 2"
          @click="cancelOrder"
        >取消预约</span>
        <span
          class="disinblock bgblue textc cfff bradius20 w90"
          v-if="orderInfo.state == 2"
          @click="confirmUse"
        >确认使用</span>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard";

export default {
  name: "OrderItem",
  components: { ProductCard },
  props: {
    orderInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      stateImgs: {
        3: "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/icon-order-finish.png", // 已完成
        4: "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/icon-order-cancel.png", // 已取消
        5: "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/icon-order-overdue.png" // 已过期
      }
    };
  },
  methods: {
    showOrder(e) {
      this.$emit("showOrder", e);
    },
    cancelOrder(e) {
      this.$emit("cancelOrder", e);
    },
    confirmUse(e) {
      this.$emit("confirmUse", e);
    }
  }
};
</script>

<style scoped>
.order-item {
  background: white;
  border-radius: 20upx;
  margin-top: 20upx;
  overflow: hidden;
}

.operation span {
  margin-right: 20upx;
}

.operation span:last-child {
  margin-right: 0;
}

.user-info {
  font-size: 28upx;
  padding: 40upx;
  color: #383838;
  border-top: 1upx solid #f5f5f6;
  border-bottom: 1upx solid #f5f5f6;
  position: relative;
}

.user-info .user {
  padding-right: 120upx;
}

.order-state {
  position: absolute;
  width: 100upx;
  height: 100upx;
  right: 40upx;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>
