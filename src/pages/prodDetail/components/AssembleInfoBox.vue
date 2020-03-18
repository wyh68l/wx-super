<template>
  <div class="pl15 pr15 bgfff pt15 pb10">
    <div class="disflex jsbet">
      <div class="disflex align-cen">
        <div class="team disflex align-cen mr5">{{proData.peopleNum}}人团</div>
        <span class="corange fs20">￥{{(price/100).toFixed(2)}}</span>
      </div>
      <div class="c38 fs14">距拼团结束还剩</div>
    </div>
    <div class="disflex jsbet" style="align-items:flex-end;">
      <div class="c78 fs10">已{{dealNum}}售件</div>
      <CountDown :diffTime="parseInt(endTime/1000)" />
    </div>
  </div>
</template>

<script>
import CountDown from "@/components/CountDown";

export default {
  name: "AssembleInfoBox",
  components: { CountDown },
  props: {
    proData: {
      required: true,
      type: Object
    },
    price: {
      required: true,
      type: Number
    },
    dealNum: {
      required: true,
      type: Number
    },
    endTime: {
      required: true,
      type: Number
    }
  }
};
</script>

<style scoped>
.team {
  height: 40upx;
  padding: 0 15upx;
  border: 2upx solid rgba(81, 205, 203, 1);
  border-radius: 10upx;
  color: #00a0e9;
  font-size: 20upx;
}
</style>
