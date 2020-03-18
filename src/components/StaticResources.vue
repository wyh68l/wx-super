<template>
    <img :src="fullSrc" :mode="mode" :class="className" :style="styleText">
</template>

<script>
  export default {
    name: "StaticResources",
    props:{
      // 资源类型
      type: {
        type: String,
        default: 'img',
      },
      // 资源路径
      src:{
        type: String,
        default: '',
      },
      // class名称
      className:{
        type: String,
        default: '',
      },
      // 图片 mode
      mode: {
        type: String,
        default: '',
      },
      styleText: {
        type: String,
        default: '',
      }
    },
    computed:{
      fullSrc(){
        return this.src.startsWith('http') ? this.src : wx.getStorageSync('ossUrl') + this.src;
      }
    }
  }
</script>

<style scoped>
  .out{
    display: inline-block;
    line-height: 1;
  }
</style>
