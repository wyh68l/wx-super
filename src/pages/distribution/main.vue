<template>
  <div>
    <div class="total-money">
      <p class="title">合计佣金</p>
      <p class="money">￥ {{totalMoney}}</p>
    </div>
    <div class="total-num">共{{total}}条数据</div>
    <div class="distribution-list">
      <DistributionItem v-for="item in lists" :record="item" :key="item.ordersId"></DistributionItem>
    </div>
  </div>
</template>

<script>
import DistributionItem from "@/components/DistributionItem";
import WXAJAX from "@/utils/request";

export default {
  name: "distribution",
  components: { DistributionItem },
  data() {
    return {
      totalMoney: "0.00",
      total: 0,
      page: 1,
      lists: []
    };
  },
  onShow() {
    this.page = 1;
    this.lists = [];
    this.total = 0;
    this.totalMoney = "0.00";
    this.getRoyaltyList();
  },
  async onPullDownRefresh() {
    this.page = 1;
    this.lists = [];
    this.total = 0;
    this.totalMoney = "0.00";
    await this.getRoyaltyList();
    wx.stopPullDownRefresh();
  },
  methods: {
    getRoyaltyList() {
      new Promise((resolve, reject) => {
        wx.showLoading();
        WXAJAX.POST(
          {
            type: 1,
            pageNum: this.page
          },
          "",
          "/record/selectRoyaltyRecord"
        )
          .then(res => {
            let list = JSON.parse(res.list) || [];
            this.lists = list.map(val => {
              val.royaltyMoney = (val.royaltyMoney / 100).toFixed(2);
              val.createTime = this.formatDate(
                "yyyy-MM-dd hh:mm:ss",
                val.createTime
              );

              return val;
            });

            this.totalMoney = (res.allMoney / 100).toFixed(2);
            this.total = res.total;
          })
          .catch(() => {
            wx.hideLoading();
            resolve();
          });
      });
    }
  }
};
</script>

<style>
page {
  background: white;
}
.total-money {
  height: 300upx;
  line-height: 1;
  background: url("https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/photo/20190524/20190524112535.png")
    no-repeat;
  background-size: 100%;
  color: white;
  margin: 0 20upx;
  padding-left: 92upx;
}
.total-money .title {
  font-size: 26upx;
  padding-top: 90upx;
}
.total-money .money {
  font-size: 72upx;
  padding-top: 40upx;
}

.total-num {
  box-sizing: border-box;
  padding: 0 30upx;
  height: 86upx;
  line-height: 86upx;
  background: #f5f5f6;
  font-size: 28upx;
  font-weight: 400;
  color: rgba(162, 160, 160, 1);
}
</style>
