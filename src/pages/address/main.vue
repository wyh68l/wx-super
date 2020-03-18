<template>
  <div class="pb55 pt10">
    <div
      class="bgfff mb10 pl15 pt20 pb21 pr15 disflex jsbet pl45 posre addr"
      v-if="default_addr.addressId"
    >
      <div @click="todetail(default_addr)">
        <label
          class="checkBox"
          :class="default_id == default_addr.addressId ? 'active' :''"
          @click.stop="row_tap(default_addr.addressId)"
        >
          <span></span>
        </label>

        <div class="w267 fs16 c38 fbold">
          <p>{{default_addr.receiveName}} {{default_addr.receivePhone}}</p>
          <p class="over_1 pt11">{{default_addr.locationAddress + default_addr.detailedAddress}}</p>
        </div>
      </div>

      <span></span>
    </div>

    <div v-if="lists.length">
      <div
        v-for="v in lists"
        :key="v.addressId"
        class="bgfff mb10 pl15 pt20 pb21 pr15 disflex jsbet pl45 posre addr"
      >
        <div @click="todetail(v)">
          <label
            class="checkBox"
            :class="default_id == v.addressId ? 'active' :''"
            @click.stop="row_tap(v.addressId)"
          >
            <span></span>
          </label>
          <div class="w267 fs16 c38 fbold">
            <p>{{v.receiveName}} {{v.receivePhone}}</p>
            <p class="over_1 pt11">{{v.locationAddress + v.detailedAddress}}</p>
          </div>
        </div>

        <span></span>
      </div>
    </div>

    <BottomButtonSmall :text="'新增地址'" :url="'addressEdit'" @btn_tap="btn_tap"></BottomButtonSmall>
  </div>
</template>

<script>
import BottomButtonSmall from "@/components/bottom_button_small"; // 订单项
import WXAJAX from "../../utils/request";

export default {
  name: "",
  components: { BottomButtonSmall },
  data() {
    return {
      lists: [],
      default_id: 1,
      default_addr: {}
    };
  },
  onShow() {
    this.inits();
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "我的地址"
    });
  },
  async onPullDownRefresh() {
    this.inits();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1.5 * 1000);
  },
  methods: {
    inits() {
      //获取地址列表
      let v = this;
      v.lists = [];
      this.default_addr = {};
      WXAJAX.POST({}, "", "/personal/getAddress")
        .then(data => {
          wx.hideLoading();
          var addrs = data;
          let lists = [];

          addrs.forEach(function(i, k) {
            if (i.isdefault == 1) {
              v.default_addr = i;
              v.default_id = i.addressId;
            } else {
              lists.push(i);
            }
          });
          v.$set(v, "lists", lists);
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    btn_tap(url) {
      wx.setStorageSync("editAddr", "");
      wx.setStorageSync("clear", true);
      wx.setStorageSync("company_address", ""); //清楚选择的详细地址
      wx.navigateTo({ url: "../" + url + "/main" });
    },
    row_tap(id) {
      //设置默认地址
      wx.showLoading();
      WXAJAX.POST(
        {
          addressId: id
        },
        "",
        "/personal/isdefult"
      )
        .then(data => {
          wx.hideLoading();
          console.log("res---", data);
          if (data == "绑定成功") {
            wx.showToast({
              title: "设置成功！",
              icon: "none",
              duration: 2000
            });
            this.default_id = id;
          } else {
            wx.showToast({
              title: "设置失败，请重新设置！",
              icon: "none",
              duration: 2000
            });
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    todetail(addr) {
      //编辑地址
      wx.setStorageSync("editAddr", addr);
      wx.setStorageSync("company_address", ""); //清楚选择的详细地址
      wx.navigateTo({ url: "../addressEdit/main?id=" + addr.addressId });
    }
  }
};
</script>

<style>
/*  .addr .checkBox span {
        border: none;
        background: #E8E8E8;
    }

    .addr .checkBox span::before {
        content: '>';
        color: #fff;
        text-align: center;
        line-height: 20px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    .addr  .checkBox.active span{
        background: #00a0e9;
    }*/
</style>






























