<template>
  <div class="mask" @click="close">
    <div
      class="spec-content animated"
      @click.stop
      :class="{ fadeInUps: isShowFadeIn, fadeOutDowns: !isShowFadeIn }"
    >
      <div class="pl15 pr15 pt15 pb15">
        <div class="goods-info disflex align-cen fs12">
          <img :src="goodsImg" alt class="goods-img mr10 bradius5" mode="aspectFill" />
          <div class="price-box">
            <div class="c78">
              价格
              <span class="ml10">
                <span class="corange">￥</span>
                <span v-if="buyType != 'alone'" class="corange fbold fs20">
                  {{
                  (typeLists[typeIdx] &&
                  typeLists[typeIdx].goodSpecModelList &&
                  typeLists[typeIdx].goodSpecModelList[specIdx]
                  ? isKill
                  ? typeLists[typeIdx].goodSpecModelList[specIdx].killPrice
                  : isAssemble
                  ? typeLists[typeIdx].goodSpecModelList[specIdx]
                  .assemblePrice
                  : typeLists[typeIdx].goodSpecModelList[specIdx].price
                  : 0) | formatMoney
                  }}
                </span>
                <span v-else class="corange fbold fs20">
                  {{
                  (typeLists[typeIdx] &&
                  typeLists[typeIdx].goodSpecModelList &&
                  typeLists[typeIdx].goodSpecModelList[specIdx]
                  ? typeLists[typeIdx].goodSpecModelList[specIdx].price
                  : 0) | formatMoney
                  }}
                </span>
              </span>
            </div>
            <div class="c38 mt14">
              已选：
              <span v-if="typeLists[typeIdx]">“{{ typeLists[typeIdx].specName }}”</span>
              <span
                v-if="
                  typeLists[typeIdx] &&
                    typeLists[typeIdx].goodSpecModelList[specIdx]
                "
              >
                “{{
                typeLists[typeIdx].goodSpecModelList[specIdx].specAttribute
                }}”
              </span>
            </div>
          </div>
        </div>
        <div>
          <div class="pt15 pb10 ca8 fs14">类型</div>
          <div>
            <span
              v-for="(v, k) in typeLists"
              :class="{ active: typeIdx === k }"
              @click="choose('typeIdx', k)"
              class="size_item"
              :key="k"
            >{{ v.specName || "" }}</span>
          </div>
        </div>
        <div class="pb5">
          <div class="pt5 pb10 ca8 fs14">规格</div>
          <div>
            <span
              v-for="(v, k) in typeLists[typeIdx == -1 ? 0 : typeIdx]
                .goodSpecModelList"
              :class="{ active: specIdx === k }"
              @click="choose('specIdx', k)"
              class="size_item"
              :key="k"
            >{{ v.specAttribute || "" }}</span>
          </div>
        </div>
        <div class="disflex jsbet align-cen pt15 bte8">
          <span class="ca8 fs14">数量</span>
          <div>
            <div class="counter disflex number-change-btn-group">
              <span class="textc be8 lh25 w25 minus ca8" @click.stop="prodChangeNum(-1)">
                <img
                  src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190505113629.png"
                  class="w10 h10"
                />
              </span>
              <span class="bte8 bbe8 fs12 c68 w40 lh25 textc">
                <input type="number" v-model="num" class="lh22 h25" />
              </span>
              <span class="textc be8 lh25 w25 add ca8" @click.stop="prodChangeNum(1)">
                <img
                  src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190505113647.png"
                  class="w10 h10"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="disflex btn-list">
        <div
          v-if="leftBtnText"
          class="flex1 left-btn disflex align-cen jscen"
          @click="clickButton('left')"
        >{{ leftBtnText }}</div>
        <div
          v-if="rightBtnText"
          class="flex1 right-btn disflex align-cen jscen"
          @click="clickButton('right')"
        >{{ rightBtnText }}</div>
        <div
          v-if="fullBtnText"
          class="flex1 right-btn disflex align-cen jscen"
          @click="clickButton('full')"
        >{{ fullBtnText }}</div>
      </div>
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/icon-close.png"
        @click="close"
        class="close-btn"
        alt
      />
      <LoginIntercept />
    </div>
  </div>
</template>

<script>
import LoginIntercept from "@/components/LoginIntercept";
export default {
  name: "GoodsSpecChoose",
  components: {
    LoginIntercept
  },
  props: {
    leftBtnText: {
      type: String,
      default: ""
    },
    rightBtnText: {
      type: String,
      default: ""
    },
    fullBtnText: {
      type: String,
      default: ""
    },
    // 商品信息
    goodsInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    goodsImg: {
      type: String,
      default: ""
    },
    // 商品型号
    typeLists: {
      type: Array,
      default() {
        return [];
      }
    },
    isShow: {
      type: Boolean,
      default: false
    },
    buyType: {
      type: String
    }
  },
  data() {
    return {
      num: 1,
      typeIdx: -1, // 类型下标
      specIdx: -1, // 规格下标
      //是否显示规格
      isShowFadeIn: false,
      isKill: false, // 是否是秒杀
      isAssemble: false // 是否是拼团
    };
  },
  mounted() {
    console.log(this.isKill, this.goodsInfo);
    this.isShowFadeIn = this.isShow;
    this.isKill = this.goodsInfo.isKill;
    this.isAssemble = this.goodsInfo.isAssemble;
  },
  methods: {
    // 选择后页面需要同步更新显示
    choose(name, idx) {
      let lastIdx = this[name];
      this[name] = idx;

      if (name === "typeIdx") {
        if (lastIdx !== this.typeIdx) this.specIdx = -1;

        this.$emit("changeChoose", this.typeLists[this.typeIdx], "type");
        this.$emit("changeChoose", {}, "spec");
      } else {
        if (this.typeIdx === -1) {
          this.typeIdx = 0;
          this.$emit("changeChoose", this.typeLists[this.typeIdx], "type");
        }
        this.$emit(
          "changeChoose",
          this.typeLists[this.typeIdx].goodSpecModelList[this.specIdx],
          "spec"
        );
      }
    },
    //点击触发按钮
    clickButton(type) {
      this.$emit("clickButton", { sum: this.num, type });
    },
    emit(eventName) {
      this.$emit(eventName, {
        num: this.num,
        eventName: eventName
      });
    },
    prodChangeNum(flag) {
      this.num = parseInt(this.num) + flag;
    },
    close() {
      this.isShowFadeIn = false;
      setTimeout(() => {
        this.$emit("close");
      }, 500);
    }
  }
};
</script>

<style scoped>
.mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
}

.spec-content {
  background: rgba(255, 255, 255, 1);
  border-radius: 10upx 10upx 0 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(100%);
  transition: all 0.5s;
}
.fadeInUps {
  transform: translateY(0);
}
.fadeOutDowns {
  transform: translateY(100%);
}
.close-btn {
  width: 40upx;
  height: 41upx;
  position: absolute;
  right: 30upx;
  top: 30upx;
}

.goods-img {
  width: 220upx;
  height: 216upx;
  flex: 0 0 220upx;
}

.size_item {
  box-sizing: border-box;
  height: 60upx;
  padding: 0 20upx;
  background: rgba(245, 245, 246, 1);
  border: 1upx solid rgba(245, 245, 246, 1);
  border-radius: 6upx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24upx;
  margin-right: 20upx;
  margin-bottom: 20upx;
  color: #383838;
}

.size_item:last-child {
  margin-right: 0;
}

.size_item.active {
  background: rgba(229, 248, 247, 1);
  border: 1upx solid rgba(81, 205, 203, 1);
  color: #00a0e9;
}

.btn-list .left-btn,
.btn-list .right-btn {
  height: 98upx;
  color: white;
  font-size: 36rpx;
}

.btn-list .left-btn {
  background: linear-gradient(
    90deg,
    rgba(252, 173, 61, 1),
    rgba(255, 161, 51, 1)
  );
}

.btn-list .right-btn {
  background: linear-gradient(
    90deg,
    rgba(254, 117, 99, 1),
    rgba(253, 99, 78, 1)
  );
}
</style>
