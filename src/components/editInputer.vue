<template>
  <div class="fix_bottom bgfff edit_input trans2" :style="{paddingBottom: isPadding}">
    <div
      class="im_bottom fix_bottom animated disflex align-cen pl15 pr15 pt5 pb5 bgfff borderbox"
      :class="{'fadeInUp': isMore}"
    >
      <div class="disflex">
        <img
          v-if="isInput"
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/voice_off.png"
          class="icon"
          @click="voice"
        />
        <img
          v-else
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/input.png"
          class="icon"
          @click="keyboard"
        />
      </div>
      <input
        v-if="isInput"
        type="text"
        class="bgf5f6 bradius5 mr12 ml-12 pl6 lh39 h39 fs14 edit_input_inner"
        v-model="comments"
        fixed="true"
        :focus="comment_focus"
        @focus="inputgetFocus"
        @blur="inputBlurEvent"
        cursor-spacing="4"
        confirm-type="send"
        @confirm="inputConfirm"
        style="flex-grow: 1;"
      />
      <button
        @touchstart="touchStartEvent"
        @touchend="touchEndEvent"
        v-else
        class="mr12 ml-12 bradius5 fs14 disflex align-cen jscen"
        style="height: 79rpx;color: #383838;border: 1px solid #E8E8E8; flex-grow: 1;"
      >{{text}}</button>
      <div class>
        <span
          style="line-height: 58rpx"
          class="disblock w65 textc bblue cblue fs16 bradius5"
          @click="useful_tap"
        >常用语</span>
        <!---->
      </div>
      <div class="disflex ml10">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/more.png"
          @click="more"
          class="icon"
        />
      </div>
    </div>

    <!--表情-->
    <div
      v-if="phrases"
      class="pl15 fs14 c38 pr15 useful-list animated"
      :class="{'fadeInUp': phrases}"
    >
      <p
        v-for="(v,k) in titleLists"
        :key="k"
        class="bbe8 pt10 pb10"
        @click="chooseUseful(v.title)"
      >{{v.title}}</p>
    </div>
    <!--更多-->
    <div
      v-if="isMore"
      style="border-top: 2upx solid #E8E8E8;"
      :class="{'fadeInUp': isMore, 'fadeOutDown': !isMore}"
      class="more-box animated disflex align-cen jscen pl15 fs14 c38 pr15 useful-list"
    >
      <div @click="photo">
        <div
          style="border: 2upx solid #E8E8E8;border-radius:10rpx;width: 96rpx;height: 96rpx;"
          class="disflex align-cen jscen"
        >
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/photo.png"
            style="height: 60rpx; width: 60rpx;"
            mode="widthFix"
          />
        </div>
        <div class="textc mt5 fs12 c78">相册</div>
      </div>
      <div @click="shot" style="margin: 0 67rpx;">
        <div
          style="border: 2upx solid #E8E8E8;border-radius:10rpx;width: 96rpx;height: 96rpx;"
          class="disflex align-cen jscen"
        >
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/camera.png"
            style="height: 60rpx; width: 60rpx;"
            mode="widthFix"
          />
        </div>
        <div class="textc mt5 fs12 c78">拍摄</div>
      </div>
      <div @click="video">
        <div
          style="border: 2upx solid #E8E8E8;border-radius:10rpx;width: 96rpx;height: 96rpx;"
          class="disflex align-cen jscen"
        >
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/video.png"
            style="height: 60rpx; width: 60rpx;"
            mode="widthFix"
          />
        </div>
        <div class="textc mt5 fs12 c78">视频</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "editInputer",
  props: {
    titleLists: {
      type: Array,
      default: ""
    },
    isInput: {
      type: Boolean,
      default: true
    },
    isMore: {
      type: Boolean,
      default: false
    },
    isPadding: {
      type: String,
      default: "0"
    },
    phrases: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: "按住 说话"
    }
  },
  data() {
    return {
      comment_focus: false,
      comments: ""
    };
  },
  onPageScroll: function(e) {
    this.comment_focus = false;
  },
  onUnload() {
    this.clearPage();
  },
  watch: {
    comments(newVal, oldVal) {
      this.comments = newVal;
    }
  },
  methods: {
    inputgetFocus(e) {
      //input框focus时
      this.comment_focus = true;
    },
    // input失去焦点
    inputBlurEvent() {
      this.comment_focus = false;
      this.$emit("inputBlurEvent");
    },
    // 触摸开始
    touchStartEvent() {
      this.$emit("touchStartEvent");
    },
    // 触摸结束
    touchEndEvent() {
      this.$emit("touchEndEvent");
      if (this.isMore) this.$emit("closeMore");
      if (this.phrases) this.$emit("closePhrases");
    },
    // 点击相册
    photo() {
      this.$emit("clickPhotoEvent");
    },
    // 点击拍摄
    shot() {
      this.$emit("clickShotEvent");
    },
    // 点击视频
    video() {
      this.$emit("clickVideoEvent");
    },
    // 换成input输入框
    keyboard() {
      this.$emit("keyboardEvent");
    },
    // 点击常用语
    useful_tap() {
      // 点常用语 收起更多bug！！！！
      if (this.isMore) {
        this.$emit("closeMore");
      }
      this.$emit("clickPhrasesEvent");
      this.comment_focus = false;
      this.$emit("keyboardEvent");
    },
    clearPage() {
      //页面还原
      this.comment_focus = false;
      this.comments = " ";
    },
    chooseUseful(title) {
      //点击常用语
      this.$emit("closePhrases");
      this.$emit("comment", title);
    },
    inputConfirm() {
      //输入完成
      this.$emit("comment", this.comments);
      this.comment_focus = false;
      this.phrases = false;
      this.comments = "";
    },
    // 点击语音
    voice() {
      this.$emit("voiceIconEvent");
      if (this.isMore) this.$emit("closeMore");
      if (this.phrases) this.$emit("closePhrases");
    },
    // 点击+号更多
    more() {
      this.comment_focus = false;
      this.$emit("moreIconEvent");
      this.$emit("keyboardEvent");
    }
  }
};
</script>

<style>
.im_by_time .im_item {
  margin-bottom: 30upx;
}

/*.im_by_time .im_item:last-child {*/
/*margin-bottom: 0;*/
/*}*/

.triangle_border_right,
.triangle_border_left,
.triangle_border_right1 {
  position: absolute;
  top: 24upx;
  display: block;
  width: 24upx;
  height: 24upx;
  border-radius: 6upx;
  border: 1upx solid #e8e8e8;
  border-top: 0;
  border-left: 0;
  background: #fff;
  box-sizing: border-box;
}
.triangle_border_right1 {
  background: #00a0e9;
}
.triangle_border_right,
.triangle_border_right1 {
  right: -12upx;
  transform: rotate(-45deg);
}

.triangle_border_left {
  left: -12upx;
  transform: rotate(135deg);
}

.noread .im_msg {
  background: #00a0e9;
  color: #fff;
}

.noread .im_text {
  color: #fff;
}

.noread .triangle_border_left,
.noread .triangle_border_right,
.noread .triangle_border_right1 {
  background: #00a0e9;
  border: none;
}

.useful-list {
  max-height: 600upx;
  overflow: auto;
  padding-bottom: 100upx;
}
.icon {
  width: 54upx;
  height: 54upx;
}
.more-box {
  height: 262upx;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}

.fadeOutDown {
  animation-name: fadeOutDown;
}

.fadeInUp {
  animation-name: fadeInUp;
}
.animated {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}
</style>
