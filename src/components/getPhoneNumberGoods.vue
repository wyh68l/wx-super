<template>
  <div class="posre">
    <GetPhoneNumber class="posre" @next="$emit('next', goodInfo.goodsId)">
      <FormId>
        <div v-if="goodsType==='goods'" class="bradius10 w168 h270 mt10 bgfff prod_item">
          <img
            :lazy-load="true"
            :src="goodInfo.prodLogo"
            mode="aspectFill"
            alt
            class="w100p h168 pro-img"
          />
          <!-- <img v-if="goodInfo.isDistribution"  src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon13.png" class="isDistribution" style=""  /> -->
          <img
            v-if="goodInfo.isAssemble"
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon11.png"
            class="isAssemble"
          />
          <img
            v-if="goodInfo.isKill"
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon12.png"
            class="isAssemble"
          />
          <p class="fs14 lh15 minh30 c38 over_2 pl16 pr22 pt7 mb7 goods-name">{{goodInfo.goodsName}}</p>

          <p class="fs12 pl16" v-if="!goodInfo.title">
            <span class="corange pr7">
              <b class="disinblock">￥</b>
              <b class="fs20 fbold disinblock">{{goodInfo.price}}</b>
            </span>
            <!--<span class="ca8 line-through">￥198</span>-->
          </p>
            <p v-else class="fs15 pl16 corange">{{goodInfo.title}}</p>

        </div>
        <ProductCard
          v-else
          :imgUrl="goodInfo.prodLogo"
          :title2="goodInfo.title"
          :title="goodInfo.productsName"
          :desc="goodInfo.describe"
          :typeName="goodInfo.productsTypeName"
          :price="goodInfo.price"
        ></ProductCard>
      </FormId>
    </GetPhoneNumber>
    <LoginIntercept class="login-intercept" />
  </div>
</template>

<script>
import FormId from "@/components/formId";
import GetPhoneNumber from "@/components/getPhoneNumber";
import ProductCard from "@/components/ProductCard";
import LoginIntercept from "@/components/LoginIntercept";

export default {
  name: "getPhoneNumberGoods",
  props: {
    goodInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    goodsType: {
      type: String,
      default: "goods" // goods商城中商品， product预约中商品
    }
  },
  components: { GetPhoneNumber, ProductCard, FormId, LoginIntercept },
  methods: {
    loginGuide() {
      this.$emit("loginGuide");
    }
  },
  mounted() {}
};
</script>

<style scoped>
.prod_item {
  position: relative;
}
.prod_item > img {
  border-radius: 20upx 20upx 0 0;
}
.goods-name {
  height: 30upx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.isDistribution {
  position: absolute;
  left: 0;
  top: 276upx;
  width: 160upx;
  height: 60upx;
  border-radius: 0 !important;
}
.isAssemble {
  position: absolute;
  top: 0;
  left: 20upx;
  width: 85upx;
  height: 100upx;
  border-radius: 0 !important;
}
</style>
