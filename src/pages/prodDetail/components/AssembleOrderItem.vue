<template>
  <div class="disflex jsbet align-cen pl15 pr15 pt15 pb15 bgfff line" :class="className">
    <div class="disflex align-cen">
      <img
        :src="orderInfo.avatarUrl || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_user.png'"
        class="user-head mr10"
        alt
      />
      <div>
        <div class="c38 fs16 disflex align-cen">
          <span class="disinblock mr10 over_1" style="max-width: 340upx">{{orderInfo.nickeName}}</span>
          <!-- <span class="c78">还差{{orderInfo.assembleNum-orderInfo.putAssemble}}人</span> -->
        </div>
        <div class="fs12 ca8 mt5">
          <span class="c78">还差{{orderInfo.assembleNum-orderInfo.putAssemble}}人，</span>
          剩余
          <CountDown :diffTime="parseInt(orderInfo.assembleEndTime/1000)" type="2" />结束
        </div>
      </div>
    </div>
    <div class="join" :class="{'disable': orderInfo.state!==1}" @click="join">参团</div>
  </div>
</template>

<script>
import CountDown from "@/components/CountDown";

export default {
  name: "AssembleOrderItem",
  components: { CountDown },
  props: {
    orderInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    className: {
      type: String,
      default: ""
    }
  },
  methods: {
    join() {
      if (this.orderInfo.state == 1) {
        this.$emit("join", this.orderInfo);
      }
    }
  }
};
</script>

<style scoped>
.user-head {
  width: 100upx;
  height: 100upx;
  border-radius: 10upx;
  flex: 0 0 100upx;
}

.join {
  display: flex;
  height: 60upx;
  background: rgba(254, 115, 97, 1);
  border-radius: 6upx;
  color: #fff;
  font-size: 32upx;
  padding: 0 20upx;
  line-height: 1;
  align-items: center;
}
.disable {
  background: #ccc;
}
</style>
