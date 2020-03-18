<template>
  <div class="textc outer">
    <img
      mode="widthFix"
      width="340rpx"
      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190418164236.png"
      alt
    />
    <p class="desc">
      <slot>暂无产品</slot>
    </p>
  </div>
</template>

<script>
export default {
  name: "noData"
};
</script>

<style scoped>
.outer {
  padding: 60upx 0;
}
img {
  width: 340upx;
  height: 340upx;
}
.desc {
  font-size: 28upx;
  color: #a8a8a8;
}
</style>
