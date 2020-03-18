<template>
  <div class="bgfff pl16 pr15 mb10 mt10">
    <div
      class="disflex jsbet fs16 h44 align-cen bbf5f6"
      style="margin: 0 -30upx 0 -32upx; padding: 0 30upx 0 32upx"
    >
      <span class="fbold c38">拼团玩法</span>
    </div>
    <div class="disflex jsbet play-step align-cen">
      <div class="step-item">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/assemble-step-1.png"
          alt
          class="w50 h50"
        />
        <div class="step-title">参团/开团</div>
      </div>
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/assemble-step-arrow.png"
        alt
        class="arrow"
      />
      <div class="step-item">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/assemble-step-2.png"
          alt
          class="w50 h50"
        />
        <div class="step-title">邀请好友</div>
      </div>
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/assemble-step-arrow.png"
        alt
        class="arrow"
      />
      <div class="step-item">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/assemble-step-3.png"
          alt
          class="w50 h50"
        />
        <div class="step-title">
          <p>满员发货</p>不成团自动退款
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AssemblePlay"
};
</script>

<style scoped>
.arrow {
  width: 106upx;
  height: 8upx;
}

.play-step {
  padding: 30upx 50upx 100upx;
  position: relative;
}

.step-item {
  position: relative;
}

.step-title {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 -50upx;
  text-align: center;
  color: #383838;
  font-size: 24upx;
}
</style>
