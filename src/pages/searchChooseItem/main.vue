<template>
  <div>

    <!--top-->
    <div class="disflex jsbet bgfff lh30 pl16 pr15 pt5 pb5">
      <div class="bgf5f6 bradius17 disflex pl15 flex1">

        <span></span>
        <input type="text" v-model="key" class="pha8 fs14 lh34 h34" :placeholder="ph">

      </div>

      <span class="fs16 cblue lh34 pl15" @click="cancle">取消</span>
    </div>

    <!--addr-->
    <div class="pl16 bgfff pt15 pb15 pr16 bbf5f6">
      <div v-if="choose.title">
        <p class="fs12 ca8">{{activeitem}}</p>
        <div class="disflex jsbet pt10">
          <span class="fs16 fbold c38">{{choose.title}}</span>
          <span class="cblue fs16" @click="getlocation">{{reset}}</span>
        </div>
      </div>
      <div v-else class="fs12 ca8">
        还未选择
        <span class="cblue fs16"
              v-if="type == 'company'"
              @click="toCreateCompany"
              style="float: right">
          {{reset}}
        </span>
      </div>
    </div>


    <!--lists-->
    <div v-for="(list,index1) in searchCity" class="bgfff lh44 fs14 c38" :key="index1" v-if="type=='city'">
      <p class="pl16 fs12 ca8 bbf7">{{list.name}}</p>

      <div v-for="(city , index2) in list.citys" :key="index2" class="pl25">

        <p @click="choose_item(city.region_name)">{{city.region_name}}</p>

      </div>

    </div>

    <div class="bgfff lh44 fs14 c38" :key="index1" v-if="type=='company'">
      <div v-for="(item , index2) in lists" :key="index2" class="pl25">

        <p @click="choose_item(item.companyName , item.companyId ,item.companyLogo)">{{item.companyName}}</p>

      </div>

    </div>


  </div>
</template>

<script>
  import amapFile from '../../libs/amap-wx.js'
  import WXAJAX from '../../utils/request'
  import Citys from '../../libs/choose-city'

  export default {
    name: '',
    components: {},
    data() {
      return {
        choose: {
          title: '',
          addr: '',
          lat: '',
          lng: '',
        },
        myAmapFun: '',
        Mc: '',
        lists: [],
        ph: '',
        activeitem: '当前定位',
        reset: '重新定位',
        type: '',
        key: '',
        searchList: [],
      }
    },
    onShow() {

      let title = '';
      this.type = this.$root.$mp.query.type;

      this.key = '' ;

      if (this.type == 'company') {//选择公司
        title = '选择企业';
        this.ph = '输入公司名称';
        this.activeitem = '当前公司';
        this.reset = '创建企业';
        this.init();

      } else if (this.type == 'city') {

        this.ph = '输入城市名';
        this.Mc = wx.createMapContext('map');
        this.myAmapFun = new amapFile.AMapWX({key: 'e11026819b6d300fda6a2c680fbd2fef'});
        this.lists = Citys ;
        this.searchList = [];
        Citys.map(val=>{
          this.searchList.push(...val.citys);
        });

        this.getlocation();
      }
      wx.setNavigationBarTitle({
        title: title
      });


    },
    async onPullDownRefresh() {
      if (this.type == 'company') {//选择公司
        this.init();

      }

      setTimeout(()=>{
        wx.stopPullDownRefresh();
      }, 1.5*1000)
    },
    watch: {
      'key': function (newVal, oldVal) {
        if (this.type == 'company') {
          this.searchItem(newVal);
        }
        // console.log(newVal);
      }
    },
    computed:{
      searchCity() {
        let result;

        if(this.key){
          let citys = this.searchList.filter(val=>{
            return val.region_name.includes(this.key);
          });
          result = [
            {
              name: '',
              citys: citys,
            }
          ];
        } else {
          result = this.lists;
        }

        return result
      },
    },
    methods: {
      toCreateCompany(){
        wx.navigateToMiniProgram({
          appId: 'wx1c06c4e49bf6040e', // 要跳转的小程序的appid
          path: `pages/editEnterprise/main?type=add&goType=1`, // 跳转的目标页面
          extarData: {
            open: 'auth'
          },
          success(res) {

          },
          fail(res) {
            console.log(res)
          }
        })
      },
      init() {//获取lists列表
        let v = this;
        v.lists = [];
        WXAJAX.POST({ ignore:true}, '', '/personal/getCompanyAllInfo').then((data) => {
          // console.log('res---', data);
          this.lists = data ;
        }).catch((err) => {

        })

      },
      searchItem() {//搜索
        WXAJAX.POST({
          companyName: this.key
        }, '', '/personal/getCompanyAllInfo').then((data) => {
          // console.log('res---', data);
          this.lists = data ;
        }).catch((err) => {

        })
      },
      getlocation() {//获取经纬度
        wx.showLoading({
          title: '定位中...',
          mask: true
        });
        var v = this;
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            v.choose.lat = res.latitude;
            v.choose.lng = res.longitude;

            v.getLocal();
            wx.hideLoading();
          },
          fail: function (err) {
            wx.hideLoading();
            // wx.showToast({
            //   title: JSON.stringify(err),
            //   icon: 'none',
            //   duration: 2000
            // })
          },
          complete: function () {
            wx.hideLoading();
          }
        })
      },
      getLocal(latitude, longitude) {

        let v = this;

        v.myAmapFun.getRegeo({
          location: '' + v.choose.lng + ',' + v.choose.lat + '', // location的格式为'经度,纬度'
          success: function (data) {
            let _address = data[0].regeocodeData.addressComponent,
              _neighborhood = _address.neighborhood,
              _street = _address.streetNumber;
            v.choose.title = _address.city;
            v.adcode = _address.adcode;

            if (_neighborhood && _neighborhood.name.length > 0) {
              v.choose.addr = _neighborhood.name;
            } else {
              v.choose.addr = _street.street + _street.number;
            }

          },
          fail: function (info) {
            v.choose.title = '失败';
            v.choose.addr = '重新定位';
            console.log(info)
          }
        })

      },
      choose_item(itemname , itemid ,itemlogo) {//选择
        if (this.type == 'city') {
          wx.setStorageSync("company_city", itemname);
        } else if (this.type == 'company') {
          wx.setStorageSync("choose_company", itemname);
          wx.setStorageSync("choose_company_id", itemid);
          wx.setStorageSync("choose_company_logo", itemlogo);

        }
        this.$set(this.choose, 'title', itemname);
        console.log(this.choose);
        wx.showLoading();
        setTimeout(() => {
          wx.navigateBack();
          wx.hideLoading();
        }, 200);

      },
      cancle() {//取消
        this.key = '';
      }
    }
  }
</script>

<style>
  page {
    background: #fff;
  }
</style>
