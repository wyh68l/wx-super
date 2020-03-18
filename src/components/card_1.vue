<template>
  <div>
    <div class="top_card fs12 mb15 shadow_gray pb28" v-if="type == 'plus'">
      <div class="pl34 pt25 cblue fs12">
        <span class="before_line_3">{{card_msg.company || '公司名称'}}</span>
      </div>
      <div class="top_msg disflex pt25 jsbet" @click="page_turn('index')">
        <div>
          <p class="fbold c38 fs18">{{card_msg.username || '姓名'}}</p>
          <p class="fs140 ca8 pt10 pb23">{{card_msg.post || '职位'}}</p>
          <p class="fs12 c78">» {{card_msg.tel || '电话'}}</p>
          <p class="fs12 c78">» {{card_msg.email || '邮箱'}}</p>
        </div>
        <img
          :src="card_msg.picchecked || card1_logo"
          alt
          mode="aspectFill"
          class="w60 h60 bradius5"
          @click="previewImage"
        />
      </div>
      <div class="disflex jsbet pl25 pr27 pt33">
        <div class="disflex">
          <span class="cblue fs12 mr20" v-if="!hasCard">NO.{{index }}</span>
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel.png"
            alt
            class="w16 h16 mr20"
            mode="aspectFill"
            @click.stop="makePhone"
            v-if="!hasCard"
          />
          <!--   <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/share.png"
                  alt="" class="w16 h16"
          @click.stop="share(card_msg.companyId,card_msg.cardId)">-->

          <button
            class="w16 h16 bgfff contentbox textr disflex align-cen textr pl0 pr0"
            id="111"
            :data-companyId="card_msg.companyId"
            :data-cardId="card_msg.cardId"
            open-type="share"
          >
            <img
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/share2.png"
              alt
              class="w16 h16"
            />
          </button>
        </div>
        <span class="w60 lh20 ba8 bradius10 textc fs12 ca8" v-if="hasCard">我的名片</span>
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/edit_card.png"
          alt
          class="w16 h16"
          v-else
          @click.stop="moreTap"
        />
      </div>
    </div>

    <div class="pt15 pl16 pr15 pt16 bgfff pb15" v-else @click="page_turn('index')">
      <div class="top_card fs12 shadow_gray pb42">
        <div class="pl34 pt25 cblue fs12">
          <span class="before_line_3">{{card_msg.company || '公司名称'}}</span>
        </div>
        <div class="top_msg disflex jsbet pt40">
          <div>
            <p class="fbold c38 fs18">{{card_msg.username || '姓名'}}</p>
            <p class="fs14 ca8 pt10 pb25">{{card_msg.post || '职位'}}</p>
            <p class="fs12 c78 pb10">» {{card_msg.tel || '电话'}}</p>
            <p class="fs12 c78">» {{card_msg.email || '邮箱'}}</p>
          </div>

          <div class="disflex column-reverse">
            <img
              :src="card_msg.picchecked || card1_logo"
              mode="aspectFill"
              alt
              @click="previewImage"
              class="w60 h60 bradius5"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "card_1",
  props: ["card_msg", "type", "hasCard", "isdel", "index", "isPrev"],
  data() {
    return {
      card1_logo:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_user.png"
    };
  },
  methods: {
    page_turn(url) {
      this.$emit(
        "page_turn",
        url,
        this.card_msg.companyId,
        this.card_msg.cardId
      );
    },
    moreTap() {
      this.$emit(
        "moreTap",
        this.card_msg.recordId,
        this.card_msg.cardId,
        this.isdel
      );
    },
    makePhone() {
      //拨打电话
      if (this.card_msg.tel) {
        wx.makePhoneCall({
          phoneNumber: this.card_msg.tel
        });
      } else {
        wx.showToast({
          title: "还没有添加电话呢！",
          duration: 2000,
          icon: "none"
        });
      }
    },
    previewImage() {
      if (!this.isPrev) return;

      let urls = [this.card_msg.picchecked || this.card1_logo];

      wx.previewImage({
        current: urls[0],
        urls: urls
        // urls必须是数组 不然会报错
      });
    },
    share(companyId, cardId) {
      this.$emit("shareApp", companyId, cardId);
    }
  }
};
</script>

<style scoped>
</style>
