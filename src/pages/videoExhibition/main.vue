<template>
  <div class="pt10 pb44">
    <div v-for="(videoItem, index) in videoLists" :key="index">
      <div class="disflex jsbet bgfff pl15 pr15 h49">
        <div class="fs16 fbold w100 textl h49 lh49">视频名称</div>
        <div class="pl15 pha8 fs14 lh49 h49 w100p c38 textr">{{videoItem.videoTitle}}</div>
      </div>
      <div
        class="bgfff textc h49 lh49 fs16 cblue btf5f6 bbf5f6"
        @click="toEditVideo(videoItem)"
      >替换视频内容</div>
      <div class="bgfff textc borderbox h212 overhidden">
        <video
          :id="'myVideo' + index"
          class="w100p h212 disblock"
          v-if="playIndex === index"
          :title="videoItem.videoTitle"
          objectFit="cover"
          :src="videoItem.videoUrl"
          enable-danmu
          danmu-btn
          controls
          :autoplay="true"
        ></video>
        <div class="w100p h212 posre" @click="showVideo(index)" v-else>
          <img
            mode="aspectFill"
            :src="videoItem.videoCover || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619324240.png'"
            alt
            class="w100p h212"
          />
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619365051.png"
            alt
            class="w50 h50 posab top0 left0 right0 bottom0 mauto"
          />
        </div>
      </div>
      <div class="disflex jsbet bffff mt20 pb20 pl15 pr15 h30 overhidden">
        <div class="w30 h30">
          <img
            @click="deleteVideo(videoItem, index)"
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_del_2.png"
            alt
            class="w30 h30"
          />
        </div>
        <div class="w70 h30 disflex jsbet">
          <img
            @click="moveVideo(videoItem, index, '1')"
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_up.png"
            alt
            class="w30 h30"
          />
          <img
            @click="moveVideo(videoItem, index, '2')"
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_down.png"
            alt
            class="w30 h30"
          />
        </div>
      </div>
    </div>
    <BottomButtonSmall v-if="videoLists.length < 3" :text="'新增视频'" :url="'save'" @btn_tap="btn_tap"></BottomButtonSmall>
  </div>
</template>
<script>
import WXAJAX from "@/utils/request";
import BottomButtonSmall from "@/components/bottom_button_small"; //
export default {
  components: { BottomButtonSmall },
  data() {
    return {
      playIndex: "",
      videoLists: []
    };
  },
  onShow() {
    wx.showLoading({
      title: "数据加载中",
      mask: true
    });
    WXAJAX.POST({ test: true }, "", "/businessCardVideo/moveList")
      .then((data, code) => {
        wx.hideLoading();
        this.videoLists = data;
      })
      .catch(res => {
        wx.hideLoading();
        wx.showToast({
          title: "视频获取出错",
          duration: 2000,
          icon: "none"
        });
      });
  },
  methods: {
    showVideo(index) {
      this.playIndex = index;
    },
    // 替换视频内容
    toEditVideo(editExhibition) {
      wx.setStorageSync("editVideoExhibition", editExhibition);
      wx.navigateTo({
        url: "../editVideoExhibition/main?type=edit"
      });
    },
    // 新增视频
    btn_tap() {
      wx.navigateTo({
        url: "../editVideoExhibition/main?type=create"
      });
    },
    // 删除视频
    deleteVideo(videoItem, index) {
      wx.showLoading();
      WXAJAX.POST(
        { videoId: videoItem.videoId },
        "",
        "/businessCardVideo/delVideo"
      )
        .then(data => {
          wx.hideLoading();
          wx.showToast({
            title: "删除成功",
            duration: 2000,
            icon: "none"
          });
          this.videoLists.splice(index, 1);
        })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: "none"
          });
        });
    },
    // 上下移动视频{{{
    moveVideo(videoItem, index, type) {
      // type=1 为上移; 为2是下移
      let videoTemp = [];
      this.videoLists.forEach(item => {
        videoTemp.push(item);
      });
      if (type == 1) {
        if (index == 0) {
          wx.showToast({
            title: "不能再上移了噢",
            duration: 2000,
            icon: "none"
          });
          return false;
        }
        this.swapItems(videoTemp, index, index - 1);
      } else {
        if (index == videoTemp.length - 1) {
          wx.showToast({
            title: "不能下移了噢",
            duration: 2000,
            icon: "none"
          });
          return false;
        }
        this.swapItems(videoTemp, index, index + 1);
      }
      let temp = [];
      videoTemp.forEach((item, index) => {
        temp.push(item.sort);
      });
      wx.showLoading();
      WXAJAX.POST(
        { videoId: videoItem.videoId, sorts: temp },
        "",
        "/businessCardVideo/moveVideo"
      )
        .then(data => {
          this.videoLists = [];
          wx.hideLoading();
          wx.showToast({
            title: "移动成功",
            duration: 2000,
            icon: "none"
          });
          this.videoLists = videoTemp;
        })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: "none"
          });
        });
    } /*}}}*/,
    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    }
  }
};
</script>
<style>
page {
  background: #f5f5f6;
}
</style>
