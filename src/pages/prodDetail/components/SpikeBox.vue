<template>
  <div class="spike-box align-cen jsbet pl15">
    <div class>
      <div class="cfff">
        <span class="fs12 fbold">￥</span>
        <span style="font-size: 60upx;" class="fbold">{{spikePrice | rmb}}</span>
      </div>
      <div class="fs10" style="color: #f5f5f6;text-decoration: line-through">
        <span>原价</span>
        <span>￥{{originalPrice | rmb}}</span>
      </div>
    </div>
    <div class="time-box pr15">
      <div class="fs16 fbold disflex align-cen" style="color: #956015;">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/img-spike.png"
          style="margin-right: 15upx"
          class="w20 h20"
        />
        {{killType===1?"限时秒杀":"促销秒杀"}}
      </div>
      <div class="fs12 mt5 pb5" style="color: #d17923">距离结束还剩</div>
      <CountDown :diffTime="parseInt(diffTime/1000)" type="2" class="spike-count-down" />
    </div>
  </div>
</template>

<script>
import CountDown from "@/components/CountDown";

export default {
  name: "SpikeBox",
  components: { CountDown },
  props: {
    // 秒杀价格
    spikePrice: {
      type: [String, Number],
      default: "0.00"
    },
    // 原价
    originalPrice: {
      type: [String, Number],
      default: "0.00"
    },
    killType: {
      type: Number
    },
    // 倒计时
    diffTime: {
      type: Number,
      default: 800
    }
  },
  filters: {
    rmb(value) {
      return (value / 100).toFixed(2);
    }
  },
  methods: {}
};
</script>

<style>
.spike-box {
  box-sizing: border-box;
  height: 160upx;
  width: 100%;
  background: #fd4e56;
  display: flex;
}

.time-box {
  display: flex;
  box-sizing: border-box;
  height: 100%;
  width: 276upx;
  background: #ffca12;
  align-content: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  position: relative;
  line-height: 1;
}

.time-box::before {
  content: "";
  position: absolute;
  border-right: 31upx solid #ffca12;
  border-top: 80upx solid transparent;
  border-bottom: 80upx solid transparent;
  left: -30upx;
  top: 0;
}
</style>
