<template>
  <div class="distribution-item bgfff">
    <div class="disflex jsbet mb25">
      <div class="title c38 fs14 fbold">{{levelMap[record.level]}}：{{record.ordersNo}}</div>
      <div class="money">+￥{{record.royaltyMoney}}</div>
    </div>
    <div class="disflex jsbet">
      <div class="ca8 fs12">{{record.createTime}}</div>
      <div class="ca8 fs12">{{stateMap[record.state]}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DistributionItem",
    props:{
      record:{
        type: Object,
        default(){return {}},
      },
    },
    data(){
      return {
        levelMap:{
          1: '一级订单',
          2: '二级订单',
          3: '三级订单',
        },
        stateMap:{
          0: '未提现',
          1: '线上提现成功',
          2: '线下提现成功',
        }
      }
    },
    methods:{

    },
  }
</script>

<style scoped>
  .distribution-item{
    padding: 40upx 30upx;
    border-bottom: 1upx solid #f5f5f6;
    line-height: 1;
  }
  .money{
    color: #FD634E;
  }
</style>
