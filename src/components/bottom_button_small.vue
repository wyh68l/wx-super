<template>
  <div class="lh49 fix_bottom">
    <p class="fs18 textc lh49  bg_line_blue cfff"
       @click="btn_tap(url)">{{text}}</p>
    <LoginIntercept @loginSuccess="loginInterceptSuccess"
                    class="login-intercept" />
  </div>
</template>

<script>
import LoginIntercept from "@/components/LoginIntercept";
export default {
  name: '',
  props: ['text', 'url'],
  components: { LoginIntercept },
  data() {
    return {}
  },
  mounted() {

  },
  methods: {
    btn_tap(url) {
      this.$emit('btn_tap', url);
    },
    loginInterceptSuccess() {
      wx.showToast({
        title: '登录成功',
        duration: 2000,
      })
    }
  }
}
</script>

<style>
</style>
