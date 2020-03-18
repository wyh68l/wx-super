<template>
  <div class="bgfff pl9 pr18 disflex pt20">
    <!--<div class="bg_line_blue bradius50p w30 h30 textc lh30 mr11 cfff">a</div>-->
    <img
      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/addr_blue_bg.png"
      alt
      class="w30 h30 mr11 mt4"
    />
    <div class="disflex jsbet flex1" @click="toAddr">
      <div class="addr_detail" v-if="addr.name">
        <p class="fs16 c38 fbold">
          <span>{{addr.name}}</span>
          <span style="margin-left: 20rpx">{{addr.tel}}</span>
        </p>
        <p class="fs13 c38 over_1 pt10 pb21">{{addr.address}}</p>
      </div>
      <div class="addr_detail pb21 fs16 c38" v-else>去添加地址</div>

      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
        alt
        class="w10 h10 mt14"
        v-if="ismore"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: ["addr", "ismore", "noJump"],
  components: {},
  data() {
    return {};
  },

  /*     watch: {
            addr: {
                handler(newName, oldName) {
                    console.log('addr -- ' , newName)
                },
                // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
                immediate: true
            }
        },*/
  mounted() {},
  methods: {
    toAddr() {
      if (this.noJump) return;

      wx.navigateTo({ url: "../address/main" });
    }
  }
};
</script>

<style>
.addr_detail {
  width: 568upx;
}
</style>














