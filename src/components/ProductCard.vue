<template>
  <div class="product-card" :style="outStyle">
    <img :src="imgUrl" alt="" class="thumbnail" mode="aspectFill">
    <div class="synopsis borderbox w200">
      <div class="w100p">
        <div class="title w100p over_1">
          {{title}}
        </div>
        <div class="desc over_2">
          {{desc}}
        </div>
      </div>
      <div class="footer">
        <div class="price-type disflex jsbet align-cen">
          <div class="price">
            ￥<span>{{price}}</span>
          </div>
          <div class="tag disflex jscen align-cen" v-if="typeName">
            {{typeName}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProductCard",
    props:{
      imgUrl: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      desc: {
        type: String,
        default: '',
      },
      typeName: {
        type: String,
        default: '',
      },
      price: {
        type: [String, Number],
        default: '',
      },
      outStyle:{
        type: String,
        default: '',
      }
    }
  }
</script>

<style scoped>
  .product-card{
    padding: 30upx;
    display: flex;
    background: white;
    border-radius: 20upx;
    margin-top: 22upx;
  }

  .product-card .thumbnail{
    flex:  0 0 216upx;
    width:216upx;
    height:220upx;
    border-radius:10upx;
    margin-right: 30upx;
  }

  .synopsis{
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    align-content: space-between;
  }

  .synopsis .title{
    font-size:28upx;
    color:rgba(56,56,56,1);
    line-height: 56upx;
    word-break: break-all;
  }

  .synopsis .desc{
    font-size:24upx;
    color:rgba(168,168,168,1);
    line-height: 40upx;
  }

  .synopsis .footer{
    width: 100%;
  }

  .price-type{
  }

  .price-type .price{
    color: #FD634E;
    font-size: 24upx;
  }

  .price-type .price span{
    font-size: 36upx;
    font-weight: bold;
  }

  .price-type .tag{
    height:40upx;
    border: 1upx solid rgba(232,232,232,1);
    border-radius: 10upx;
    font-size: 20upx;
    color:rgba(168,168,168,1);
    padding: 0 14upx;
  }
</style>
