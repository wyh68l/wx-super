<template>
  <div class="auth-tag disflex align-cen jscen mb10">
    <img
      src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/icon-authentication.png"
      class="w10 h10 mr5"
      alt
    />
    <span>认证企业</span>
  </div>
</template>

<script>
export default {
  name: "AuthenticationTag"
};
</script>

<style scoped>
.auth-tag {
  width: 70px;
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 20upx;
  font-size: 20upx;
  color: white;
}
</style>
