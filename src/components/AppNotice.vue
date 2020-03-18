<template>
  <div class="out">
    <div class="w100p">
      <swiper @change="changeIdx">
        <swiper-item v-for="(notice, idx) in noticeList" :key="notice.noticeId">
          <div class="box bradius5 ml10 mr10">
            <div class="notice-item">
              <div class="title mb10">{{notice.noticeTitle}}</div>
              <div class="notice">{{notice.noticeContent}}</div>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="dots" :style="{top: tops[currentIdx] + 'px'}">
      <div class="item"
           v-for="(val,i) in noticeList"
           :key="i"
           :class="{active: currentIdx === i}"
      ></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AppNotice",
    props:{
      noticeList:{
        type: Array,
        default(){return []}
      }
    },
    data(){
      return {
        currentIdx: 0,
        tops: [],
      }
    },
    mounted(){
      setTimeout(()=>{
        this.changePosition();
      }, .5*1000);
    },
    methods:{
      // 修改swiper下标
      changeIdx(e){
        this.currentIdx = e.target.current;
      },
      changePosition(){
        wx.createSelectorQuery().selectAll('.box').boundingClientRect((rects)=>{
          rects.map(val=>{
            this.tops.push(val.top + val.height + 15);
          });
        }).exec();
      },
    },
    watch:{
      noticeList:{
        handler(){
          this.changePosition();
        },
        deep: true,
      }
    }
  }
</script>

<style scoped>
  swiper{
    height: 425px;
    /*transition: all .3s linear;*/
  }

  swiper-item{
    display: flex;
    align-items: center;
  }

  .out{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0, .5);
    z-index:9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .box{
    width: 100%;
    padding: 30px 0;
    background: white;
    border-radius: 5px;
    position: relative;
  }

  .dots{
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    transition: all .3s linear;
  }

  .dots .item{
    width: 16upx;
    height: 16upx;
    margin: 0 10upx;
    border-radius: 200upx;
    background-color: rgba(255, 255, 255, .15);
  }

  .dots .item.active{
    background-color: rgba(255, 255, 255, .6);
  }

  .notice-item{
    overflow-y: scroll;
    max-height: 560upx;
    padding: 0 60upx;
  }

  .title{
    text-align: center;
    color: #383838;
    font-size: 36upx;
    font-weight: bold;
  }

  .notice{
    text-align: justify;
    font-size:28upx;
    font-weight:400;
    color:#383838;
    line-height:48upx;
  }
</style>
