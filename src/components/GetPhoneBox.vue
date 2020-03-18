<template>
  <div class="fix_top h100p dialog_box">
    <div class="dialog_con bgfff bradius5" >
      <p class="textc fs18 c38 pt25 pb25 ">获取手机号</p>

      <div class="fs14 c78 pl35 pr31 pb36">
        阿萨德assadas啊啊所多阿萨德
      </div>

      <div class="disflex fs18 textc lh44 dialog_bottom">
        <label class="w100p bg_line_blue cfff">
          前往授权
          <button open-type="getPhoneNumber"
                  style="display: none"
                  @getphonenumber="getPhoneNumber"
          >微信授权</button>
        </label>
      </div>
    </div>

  </div>
</template>

<script>
  import WXAJAX from '@/utils/request'
  import { clearLoginInfo } from '@/utils';
  import { mapMutations } from 'vuex';

  export default {
    name: 'GetPhoneBox',
    props:[],
    components: {},
    data() {
      return{
      }
    },
    mounted() {

    },
    methods: {
      ...mapMutations(['setPhone']),

      getPhoneNumber(e){
        if(!e.target.encryptedData){

          return;
        }

        WXAJAX.POST({
          phoneData:  e.target.encryptedData,
          phoneIv: e.target.iv,
        }, '', '/home/getWxPhone')
          .then(res=>{
            wx.setStorageSync('phone', res);
            this.setPhone(res);
          }).catch(err=>{
          clearLoginInfo();
        });
      }
    },

  }
</script>

<style>
  .dialog_box {
    background: rgba(0, 0, 0, .5);
    z-index: 100;
  }

  .dialog_bottom{
    border-radius: 0 0 10upx 10upx;
  }
</style>























