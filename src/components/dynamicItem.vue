<template>
  <div class="disflex jsbet bgfff pt20 pl15 pr16 pb15 bbf5f6">
    <img
      :src="dynamic_item.companyLogo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_logo.png'"
      alt
      mode="aspectFill"
      class="w50 h50 bradius5 mr8"
    />
    <div class="flex1">
      <p class="disflex cdeepblue fs16 jsbet lh27">
        <span class="fbold w250 over_1">{{dynamic_item.companyName}}</span>
        <!--<span class="fs12">转发</span>-->
        <button
          v-if="dynamic_item.type != 2"
          class="bgfff fs12 cdeepblue p0"
          :data-dynamicId="dynamic_item.dynamicId"
          open-type="share"
          hover-class="other-button-hover"
        >
          <!--转发-->
          <span>转发</span>
        </button>
      </p>

      <div v-if="dynamic_item.type == 2">
        <p class="fs16 c38">{{dynamic_item.title}}</p>
        <div class="disflex pt15 picture-list">
          <div class="w93 h93" v-for="(v,k) in dynamic_item.photos" :key="k">
            <img :src="v" mode="aspectFill" :lazy-load="true" @click.stop="previewImage(v)" />
          </div>
        </div>
      </div>

      <div
        class="bgf5f6 pt10 pb10 pl10 pr15 disflex jsbet align-cen"
        v-if="dynamic_item.type == 1 || dynamic_item.type == 3"
        @click="toDetail"
      >
        <img
          :lazy-load="true"
          mode="aspectFill"
          :src="dynamic_item.photos[0]"
          alt
          class="w50 h50 mr8"
        />
        <p class="fs14 c38 w200 over_1">{{dynamic_item.type==3?'':''}}{{dynamic_item.title||'标题'}}</p>
      </div>
      <!-- >{{dynamic_item.type==3?'(转载) ':''}}{{dynamic_item.title||'标题'}}</p> -->

      <div class="disflex jsbet pt15 pb15 posre">
        <span class="ca8 fs12">{{dynamic_item.createTime}}</span>
        <span class="w34 h22 bradius5 textc point_two bgf5f6" @click.stop="operate_tap(index1)"></span>
        <div class="posab dynamic_operate" :class="dynamic_item.operate_show ? '' : 'w0' ">
          <div class="w178 bg38 pl25 pr28 disflex jsbet">
            <div class="disflex align-cen" @click.stop="zan(index1 , dynamic_item.isThumbs)">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/zan_fff.png"
                alt
                class="w20 h20"
              />
              <span class="fs14 cfff pl8">{{dynamic_item.isThumbs == 1 ?'已赞':'赞'}}</span>
            </div>
            <div class="disflex align-cen" @click.stop="addComment(index1)">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/talk.png"
                alt
                class="w20 h20"
              />
              <span class="fs14 cfff pl8">评论</span>
            </div>
          </div>
          <span class="triangle_border_right"></span>
        </div>
      </div>
      <div
        class="bgf5f6 pl10 pr10 fbold pt9 pb9 cdeepblue fs16"
        v-if="dynamic_item.doThumbsNum > 0 || (dynamic_item.commentModelList && dynamic_item.commentModelList.length)"
      >
        <div class="dynamic_likes" v-if="dynamic_item.doThumbsNum > 0">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/zan.png"
            alt
            class="w20 h20 mr8 posre top4"
          />
          <span
            v-for="(like_item,k2) in dynamic_item.doThumbsName"
            :key="k2"
            class="like_name posre"
          >{{like_item}}</span>
        </div>
        <p
          v-for="(comment_item,k3) in dynamic_item.commentModelList"
          :key="k3"
          class="cdeepblue pt9"
          @click.stop="addComment(index1, comment_item)"
        >
          <span v-if="comment_item.text">
            <span class="fbold">
              {{comment_item.userName}}
              <template v-if="comment_item.replyName">
                <span class="c38">回复</span>
                {{comment_item.replyName}}
              </template>
            </span>
            <span class="c38">：{{comment_item.text || ''}}</span>
          </span>
        </p>
        <p
          class="textc pt10"
          @click="getMore"
          v-if="dynamic_item.commentModelList && (dynamic_item.commentNum>dynamic_item.commentModelList.length)"
        >查看更多</p>
      </div>
    </div>
  </div>
</template>

<script>
import WXAJAX from "../utils/request";
import { mapGetters } from "vuex";
export default {
  name: "dynamicItem",
  props: ["dynamic_item", "index1"],
  computed: {
    ...mapGetters(["currentCompany"])
  },
  methods: {
    dynamic_detail(id) {
      this.$emit("dynamic_detail", id);
    },
    operate_tap(index1) {
      this.$emit("operate_tap", index1);
    },
    addComment(index1, replayComment = {}) {
      this.$emit("addComment", index1, replayComment);
    },
    zan(index1, isThumbs) {
      //点赞
      this.$emit("zan", index1, isThumbs, this.dynamic_item.dynamicId);
    },
    getMore() {
      wx.showLoading();
      WXAJAX.POST(
        {
          pageSize: 10,
          pageNum: parseInt(this.dynamic_item.commentModelList.length / 10) + 1,
          dynamicId: this.dynamic_item.dynamicId
        },
        "",
        "/personal/selectComment"
      ).then(res => {
        wx.hideLoading();
        this.$emit("getMoreComment", res, this.index1);
      });
    },
    previewImage(src) {
      let source = this.checkImgNameIsNumber(src) ? src : src + ".primary.png";
      let sourceArr = this.dynamic_item.photos.map(val =>
        this.checkImgNameIsNumber(val) ? val : val + ".primary.png"
      );
      wx.previewImage({
        current: source,
        urls: sourceArr
        // urls必须是数组 不然会报错
      });
    },
    toDetail() {
      //查看文章详情
      const { companyId, cardId } = this.currentCompany;
      let url =
        "../dynamicDetail/main?dynamicId=" +
        this.dynamic_item.dynamicId +
        "&companyId=" +
        companyId +
        "&cardId=" +
        cardId;

      wx.navigateTo({ url: url });
    }
  }
};
</script>

<style scoped>
.picture-list {
  flex-wrap: wrap;
}
.picture-list div {
  overflow: hidden;
  margin-right: 6upx;
  margin-top: 6upx;
}
.picture-list img {
  width: 100%;
  height: 100%;
}
.picture-list div:nth-child(3n) {
  margin-right: 0;
}

.picture-list div:nth-child(1),
.picture-list div:nth-child(2),
.picture-list div:nth-child(3) {
  margin-top: 0;
}
.dynamic_operate {
  width: 376upx;
  top: 0;
  bottom: 0;
  right: 104upx;
  margin: auto;
  transition: 0.2s;
  overflow: hidden;
  height: 80upx;
}

.dynamic_operate > div {
  border-radius: 10upx;
  line-height: 80upx;
  height: 80upx;
  box-sizing: border-box;
}

.dynamic_operate.w0 {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.triangle_border_right {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-width: 20upx 0 20upx 20upx;
  border-style: solid;
  border-color: transparent transparent transparent #383838; /*透明 透明 透明 黄*/
  top: 50%;
  transform: translateY(-50%);
  right: 4upx;
  transition: 0.2s;
}
.w0 .triangle_border_right {
  border: 0;
}
.dynamic_likes {
  word-break: break-all;
}
.dynamic_likes .like_name::after {
  content: "，";
}
.dynamic_likes .like_name:last-child::after {
  content: "";
}
</style>
