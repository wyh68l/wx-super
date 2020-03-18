<template>
  <div>
    <div class="bgfff">
      <ProductCard
        outStyle="margin:0;"
        :imgUrl="info.prodLogo"
        :title="info.productsName"
        :desc="info.describe"
        :typeName="info.productsTypeName"
        :price="info.price"
      />
    </div>
    <div class="bgfff pl15 pr15 lh49 fs16 c38 mb11">
      <div class="disflex jsbet align-cen">
        <label for="name" class="fbold marks pr15">姓名</label>
        <input
          placeholder-class="place-holder"
          type="text"
          id="name"
          class="pha8 textr h49"
          placeholder="请输入您的姓名"
          v-model="orderForm.name"
        />
      </div>
      <div class="disflex jsbet align-cen">
        <label for="phone" class="fbold marks pr15">电话</label>
        <input
          placeholder-class="place-holder"
          type="text"
          id="phone"
          class="pha8 textr h49"
          placeholder="请输入您的电话"
          v-model="orderForm.phone"
        />
      </div>
      <picker :range="typeLists" range-key="label" @change="chooseType">
        <div class="disflex jsbet align-cen">
          <label for="type" class="fbold marks pr15">服务类型</label>
          <div class="disflex align-cen">
            <input
              placeholder-class="place-holder"
              type="text"
              id="type"
              class="pha8 textr h49 pr15"
              disabled
              placeholder="请选择服务类型"
              v-model="typeName"
            />
            <img
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
              alt
              class="w10 h10"
            />
          </div>
        </div>
      </picker>

      <picker mode="date" @change="chooseDateOrTime($event, 'date')" :start="limitStartDate">
        <div class="disflex jsbet align-cen">
          <label for="date" class="fbold marks pr15">预约日期</label>
          <div class="disflex align-cen">
            <input
              placeholder-class="place-holder"
              type="text"
              id="date"
              class="pha8 textr h49 pr15"
              disabled
              placeholder="请选择您的日期"
              v-model="orderForm.date"
            />
            <img
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
              alt
              class="w10 h10"
            />
          </div>
        </div>
      </picker>

      <picker mode="time" :start="limitTime" @change="chooseDateOrTime($event, 'startTime')">
        <div class="disflex jsbet align-cen">
          <label for="startTime" class="fbold marks pr15">预约开始时间</label>
          <div class="disflex align-cen">
            <input
              placeholder-class="place-holder"
              type="text"
              id="startTime"
              class="pha8 textr h49 pr15"
              disabled
              placeholder="请选择您的开始时间"
              v-model="orderForm.startTime"
            />
            <img
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
              alt
              class="w10 h10"
            />
          </div>
        </div>
      </picker>

      <picker mode="time" @change="chooseDateOrTime($event, 'endTime')" :start="limitStartTime">
        <div class="disflex jsbet align-cen">
          <label for="endTime" class="fbold marks pr15">预约结束时间</label>
          <div class="disflex align-cen">
            <input
              placeholder-class="place-holder"
              type="text"
              id="endTime"
              class="pha8 textr h49 pr15"
              disabled
              placeholder="请选择您的结束时间"
              v-model="orderForm.endTime"
            />
            <img
              src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
              alt
              class="w10 h10"
            />
          </div>
        </div>
      </picker>
    </div>

    <div class="mt10 bgfff pl15 pr15">
      <CTextarea
        v-model="orderForm.remark"
        @updateValue="updateValue"
        title="备注"
        placeholder="请输入您的备注"
      />
    </div>

    <div class="h60"></div>
    <BottomButtonSmall text="立即预约" @btn_tap="submit" />
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import BottomButtonSmall from "@/components/bottom_button_small";
import ProductCard from "@/components/ProductCard";
import CTextarea from "@/components/CTextarea";
import utils from "@/utils";

export default {
  name: "",
  components: { ProductCard, BottomButtonSmall, CTextarea },
  data() {
    return {
      productsId: 0,
      info: {},
      orderForm: {
        name: "",
        phone: "",
        type: "",
        date: "",
        startTime: "",
        endTime: "",
        remark: ""
      },
      disabled: false,
      typeName: "",
      limitTime: "", // 开始时间限制
      limitStartDate: "", // 日期选择限制
      limitStartTime: "" // 结束时间限制
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({ title: "预约信息" });
  },
  mounted() {
    this.productsId = this.$root.$mp.query.productsId;
    [this.limitStartDate, this.limitTime] = this.formatDate(
      "yyyy-MM-dd hh:mm",
      Date.now()
    ).split(" ");

    this.getGoodsInfo();
  },
  onUnload() {
    this.disabled = false;
    this.typeName = "";

    for (let key in this.orderForm) {
      this.$set(this.orderForm, key, "");
    }
  },
  methods: {
    submit() {
      if (!this.checkFields() || this.disabled) return;

      let {
        name,
        phone,
        type,
        date,
        startTime,
        endTime,
        remark
      } = this.orderForm;
      let { productsId, companyId } = this.info;

      let params = {
        name,
        phone,
        productsId,
        companyId,
        serviceType: type,
        startTimes: `${date} ${startTime}`,
        endTimes: `${date} ${endTime}`,
        remark: remark
      };

      wx.showLoading({ mask: true });
      WXAJAX.POST(params, "", "/products/insertAppointment")
        .then(res => {
          this.disabled = true;
          wx.showToast({
            title: "预约成功！",
            icon: "success",
            duration: 1000
          });

          setTimeout(() => {
            this.disabled = false;
            wx.redirectTo({ url: "/pages/appointmentPack/orderList/main" });
          }, 1 * 1000);
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
    checkFields() {
      let nameMap = {
        name: "请输入您的姓名！",
        phone: "请输入您的电话！",
        type: "请选择服务类型！",
        date: "请选择预约日期！",
        startTime: "请选择预约开始时间！",
        endTime: "请选择预约结束时间！"
      };
      if (
        this.orderForm.phone.trim() &&
        !utils.checkPhone(this.orderForm.phone)
      ) {
        wx.showToast({
          title: "请输入正确的手机号！",
          duration: 2000,
          icon: "none"
        });
        return false;
      }

      for (let key in nameMap) {
        if (!this.orderForm[key].trim()) {
          wx.showToast({
            title: nameMap[key],
            duration: 2000,
            icon: "none"
          });
          return false;
        }
      }

      let { startTime, endTime } = this.orderForm;
      let startArr = startTime.split(":").map(val => parseInt(val));
      let endTimeArr = endTime.split(":").map(val => parseInt(val));

      if (
        startArr[0] > endTimeArr[0] ||
        (startArr[0] == endTimeArr[0] && startArr[1] > endTimeArr[1])
      ) {
        wx.showToast({
          title: "预约开始时间必须小于预约结束时间",
          duration: 2000,
          icon: "none"
        });
        return false;
      }

      return true;
    },
    updateValue(text) {
      this.orderForm.remark = text;
    },
    chooseDateOrTime(e, keyName) {
      let val = e.mp.detail.value;

      this.$set(this.orderForm, keyName, val);

      if (keyName === "startTime") {
        this.limitStartTime = val;
      }

      if (keyName === "date") {
        this.limitTime =
          new Date(this.limitStartDate).getTime() < new Date(val).getTime()
            ? ""
            : this.formatDate("yyyy-MM-dd hh:mm", Date.now()).split(" ")[1];
      }
    },
    // 选择
    chooseType(e) {
      let idx = e.mp.detail.value;

      this.orderForm.type = this.typeLists[idx].id;
      this.typeName = this.typeLists[idx].label;
    },
    getGoodsInfo() {
      WXAJAX.POST(
        {
          productsId: this.productsId,
          cardId: this.cardId
        },
        "",
        "/products/getProductsInfo/V2"
      )
        .then(data => {
          if (data) {
            data.prodLogo = data.productsPhoto.split(",")[0];

            let price;

            try {
              price = JSON.parse(data.price);
            } catch (e) {
              price = parseInt(data.price) || 0;
            }

            if (
              Object.prototype.toString.call(price).toLowerCase() ===
              "[object number]"
            ) {
              data.price = price.toFixed(2);
            } else {
              data.price = price.map(val => parseInt(val)).join("~");
            }

            this.info = data;
          }
        })
        .catch(err => {
          this.info = {};
        });
    }
  },
  computed: {
    typeLists() {
      let obj = {
        "": [],
        1: [{ id: "1", label: "到店" }],
        2: [{ id: "2", label: "上门" }],
        3: [
          { id: "1", label: "到店" },
          { id: "2", label: "上门" }
        ]
      };

      return obj[this.info.serviceType];
    }
  }
};
</script>

<style>
</style>
