<template>
  <cover-view class="mask" @click="close" v-if="isShow" :style="top?'top:'+top: ''">
    <cover-image
      mode="widthFix"
      class="img"
      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190423140716.png"
    />
  </cover-view>
</template>

<script>
export default {
  name: "addWxCourse",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    top: {
      type: String
    }
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.mask {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 10upx 50upx 0;
  background: rgba(0, 0, 0, 0.6);
}
.img {
  width: 650upx;
  height: 1065upx;
}
</style>
