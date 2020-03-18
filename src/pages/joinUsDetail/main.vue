<template>
    <div class="h100p bgfff pl16 pr15 pt8 borderbox">
        <div class="disflex jsbet">
            <p class="fs18 c38 fbold pb15">{{invites.position}}</p>
            <p class="fs12 ca8">{{invites.createTime}}</p>
        </div>

        <div class="disflex jsbet fs12 ca8">
            <div>
                {{invites.recruitAddress}} | {{experienceArray[invites.experience-1].title}} | {{educatArray[invites.education-1].title}}
            </div>
            <span class="cblue fs14">{{invites.salary}}</span>
        </div>

        <div class="pl15 pt20 pb10 pr15 fs16 c38">
          <text>{{invites.requirement}}</text>
        </div>

        <BottomButtonSmall :text="'联系HR'" :url="'tel'" @btn_tap="btn_tap"></BottomButtonSmall>

    </div>
</template>

<script>
    import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
    import WXAJAX from '../../utils/request'
    import util from '../../utils/index'

    export default {
        name: '',
        components: {BottomButtonSmall},
        data() {
            return{
                recruitId : 0,
                invites:{},
                COMPANYID:0,
              /*学历*/
              educatArray:[
                {title:'全部',id:1},{title:'初中及以下',id:2},{title:'中专/中技',id:3},
                {title:'高中',id:4},{title:'大专',id:5},{title:'本科',id:6},
                {title:'硕士',id:7},{title:'博士',id:8}
              ],
              /*经验*/
              experienceArray:[
                {title:'应届生',id:1},{title:'1年以内',id:2},
                {title:'1-3年',id:3},{title:'3-5年',id:4},{title:'5-10年',id:5},
                {title:'10年以上',id:6}, {title:'全部',id:7},
              ],
            }
        },
        async onPullDownRefresh() {
          await this.inits();
          wx.stopPullDownRefresh();
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: '招聘详情'
            });
            //获取当前的公司
            this.COMPANYID = wx.getStorageSync('COMPANYID') || 0 ;

            this.recruitId = this.$root.$mp.query.recruitId ;
            this.inits();
        },
        methods: {
            btn_tap(){
                let phone = '' ;
                if(this.invites.recruitPhone){
                    phone = String(this.invites.recruitPhone);
                }

                if (!phone) {
                  wx.showToast({
                    title: 'hr还未添加联系方式！',
                    duration: 2000,
                    icon: 'none'
                  });
                  return;
                }

                util.MakePhone(phone);
            },
            inits(){
                let v = this ;
                wx.showLoading();

                return new Promise(resolve => {
                  WXAJAX.POST({
                    companyId  : v.COMPANYID,
                    recruitId : v.recruitId
                  }, '', '/personal/getCompanyRecruit').then((data) => {
                    data = data[0];
                    data.createTime = util.getdate(data.createTime,'dateTime') ;
                    data.salary = data.minSalary / 100000 + 'k - ' + data.maxSalary/100000 + 'k';
                    v.invites = data ;
                    wx.hideLoading();
                  }).catch((err) => {
                    wx.hideLoading();
                  }).catch(()=>{
                    resolve();
                  })
                })
            }
        }
    }
</script>

<style>

</style>
