<template>
  <div class="seckill-count-down flex-sb-c">
    <div class="seckill-count-title flex-c-c mr3">
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/seckill-flash2.png"
        alt
        style="width: 30rpx;height: 30rpx;margin-right:6rpx"
      />
      <span class="fs12 cfff">秒杀</span>
    </div>
    <p class="fs12 c38 mr3">距离活动结束时间还剩</p>
    <CountDown :diffTime="diffTime" class="count-down" type="3" />
  </div>
</template>
<script>
import CountDown from "@/components/CountDown";

export default {
  props: {
    // 倒计时
    diffTime: {
      type: Number,
      default: 800
    }
  },
  components: { CountDown }
};
</script>
<style scoped>
.seckill-count-down {
  height: 40upx;
}
.seckill-count-title {
  width: 114upx;
  height: 40upx;
  background-color: #fd634e;
  border-radius: 10upx;
}
.count-down {
  height: 60upx;
}
</style>
