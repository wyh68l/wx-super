<template>
  <div class="disinblock">
    <div class="count-down-zh align-cen"
         :class="className"
         v-if="type==1">
      <span class="date">
        {{timeObj.day}}
      </span>
      <span class="unit">天</span>
      <span class="date">
        {{timeObj.hour}}
      </span>
      <span class="unit">时</span>
      <span class="date">
        {{timeObj.min}}
      </span>
      <span class="unit">分</span>
      <span class="date">
        {{timeObj.sec}}
      </span>
      <span class="unit">秒</span>
    </div>
    <div class="count-down"
         :class="className"
         v-else-if="type==2">
      <span class="date spans" v-if="timeObj.day !=0">
        {{timeObj.day}}
      </span>
      <span class="unit day spans"  v-if="timeObj.day !=0">天</span><span class="spans">{{timeObj.hour}}</span>:
      <span class="spans">{{timeObj.min}}</span>:<span class="spans">{{timeObj.sec}}</span>
    </div>
    <div class="count-down-zh align-cen"
         :class="className"
         v-else-if="type==3">
      <span class="date" v-if="timeObj.day !=0">
        {{timeObj.day}}
      </span>
      <span class="unit day"  v-if="timeObj.day !=0">天</span><span class="date">{{timeObj.hour}}</span>:<span class="date">{{timeObj.min}}
        </span>:<span class="date">{{timeObj.sec}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CountDown",
    props:{
      // 剩余时间，单位s
      diffTime:{
        type: Number,
        default: 0,
      },
      // 倒计时切换间隔，单位s，默认1s
      interval: {
        type: Number,
        default: 1,
      },
      type:{
        type: Number,
        default: 1, // 1 为中文格式， 2 为 hh:mm:ss
      },
      // 样式
      className:{
        type: String,
        default: '',
      }
    },
    data(){
      return {
        time: 0,
        timeObj: {},
        timer: null,
      };
    },
    mounted(){
      if (this.diffTime>0) {
        this.restart();
      }else {
          this.formatSurplus(0);
      }
    },
    beforeDestroy(){
      clearTimeout(this.timer)
    },
    methods:{
      // 格式化时间
      formatSurplus(num){
        let s = 0;
        let m = 0;
        let h = 0;
        let d = 0;

        ([s, m] = [num%60, parseInt(num/60)]);
        ([m, h] = [m%60, parseInt(m/60)]);
        ([h, d] = [h%24, parseInt(h/24)]);

        this.$set(this, 'timeObj', {
          day: d.toString().padStart(2,'0'),
          hour: h.toString().padStart(2,'0'),
          min: m.toString().padStart(2,'0'),
          sec: s.toString().padStart(2,'0')
        });
      },
      // 开始执行定时器
      start(){
        this.timer = setTimeout(() => {
          this.time = this.time - this.interval;
          this.formatSurplus(this.time);

          clearTimeout(this.timer);
          this.timer = null;
          if(this.time > 0) {
            this.start();
          }
        },this.interval*1000);
      },
      // 重启;
      restart(){
        clearTimeout(this.timer);
        this.time = this.diffTime;
        this.formatSurplus(this.time);
        this.start();
      },
    },
    watch:{
      diffTime(newVal){
        if (newVal>0) {
          this.restart();
        }else {
          this.formatSurplus(0);
        }
      },
    }
  }
</script>

<style scoped>
  .count-down-zh{
    display: inline-flex;
    font-size: 28upx;
    line-height: 1;
  }
  .count-down-zh .date{
    padding: 10upx;
    background:rgba(56,56,56,1);
    border-radius:10upx;
    color: white;
    font-weight: bold;
    margin: 0 4upx;
  }
  .count-down-zh .unit{
    color: #383838;
    font-weight: bold;
    margin: 0 8upx;
  }
  .count-down-zh .unit:last-child{
    margin-right: 0;
  }
  .count-down{
    color: #FD634E;
    font-size: 28upx;
    line-height: 1;
  }
  .day {
    margin: 0 !important;
  }

  .spike-count-down .spans{
  padding: 5upx 4upx;
  margin: 0 4upx;
}
</style>
