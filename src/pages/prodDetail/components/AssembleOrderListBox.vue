<template>
  <div
    class="fixed-mask disflex align-cen"
    @catchtouchmove="preventTouchMove"
    v-if="isShow"
    @click="close"
  >
    <div class="assemble-list-box animated" @click.stop :class="{bounceIn: isShow}">
      <div class="header">
        正在拼团
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/icon-close.png"
          @click="close"
          class="dialog-close-btn"
          alt
        />
      </div>
      <scroll-view scroll-y="true" class="assemble-list">
        <div class="pl15 pr15">
          <AssembleOrderItem
            v-for="(item, index) in lists"
            :key="item.id"
            :orderInfo="item"
            v-show="index<10"
            @join="join"
            class="bbf5f6"
          />
          <div class="pt15 pb15 textc ca8 fs14" style="line-height: 1">仅显示10个正在拼单的人</div>
        </div>
      </scroll-view>
      <div class="footer-mask"></div>
    </div>
  </div>
</template>

<script>
import AssembleOrderItem from "./AssembleOrderItem";

export default {
  name: "AssembleOrderListBox",
  components: { AssembleOrderItem },
  props: {
    lists: {
      type: Array,
      default() {
        return [];
      }
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    join(info) {
      this.$emit("join", info);
    },
    preventTouchMove() {}
  }
};
</script>

<style scoped>
.assemble-list-box {
  /*position: absolute;*/
  /*left: 40upx;*/
  /*right: 40upx;*/
  /*top: 50%;*/
  /*transform: translateY(-50%);*/
  margin: 0 40upx;
  flex-grow: 1;
  background: white;
  border-radius: 10upx;
  overflow: hidden;
}

.header {
  height: 98upx;
  line-height: 98upx;
  color: #383838;
  font-size: 36upx;
  font-weight: bold;
  position: relative;
  text-align: center;
  border-bottom: 1upx solid #f5f5f6;
}

.assemble-list {
  max-height: 700upx;
}

.footer-mask {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30upx;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 0px 0px 10upx 10upx;
}
</style>
