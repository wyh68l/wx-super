<template>
  <div class="pt10">

    <div class="bgfff mb10 pl16 pt15 pb15 fs16">

      <p class="fs12 ca8">收货人信息</p>

      <input type="text" class="pt15 w100p phe8" placeholder="收货人姓名" pattern="\w*" v-model="name">
      <input type="number" class="pt15 w100p phe8" placeholder="收货人手机号" v-model="tel" maxlength="11">

    </div>

    <div class="bgfff pl16 pt15 pb15 fs16 pr16">

      <p class="fs12 ca8">详细地址</p>

      <div class="disflex jsbet">

        <input type="text" class="pt15 w100p phe8 flex1 over_1" readonly disabled placeholder="收货人地址"
               v-model="full_address">
        <span class="cblue pt15" @click="resetAddr">重新定位</span>

      </div>
      <input type="text" class="pt15 w100p phe8" placeholder="详细地址（楼层／门牌号)" v-model="district">

    </div>


    <BottomButtonSmall :text="'保存'" :url="'save'" @btn_tap="btn_tap" v-if="!editId"></BottomButtonSmall>
    <BottomButtonTwo :left="bottom.left" :right="bottom.right" @page_turn="page_turn" v-else></BottomButtonTwo>


  </div>
</template>

<script>
  import BottomButtonSmall from '@/components/bottom_button_small' //
  import BottomButtonTwo from '@/components/bottom_button_two' //
  import amapFile from '../../libs/amap-wx.js'
  import WXAJAX from '../../utils/request'

  export default {
    name: '',
    components: {BottomButtonSmall, BottomButtonTwo},
    data() {
      return {
        name: '',
        tel: '',
        full_address: '',
        district: '',
        bottom: {
          left: {
            text: '删除', url: 'del'
          },
          right: {
            text: '保存', url: 'save'
          }
        },
        locat: {
          province: '',
          city: '成都',
          district: '',
          addr: '',
          lat: '',
          lng: '',
        },
        myAmapFun: '',
        Mc: '',
        type: 'add',//添加或者编辑地址
        editId: 0,
      }
    },
    onShow() {
      let _addr = wx.getStorageSync('company_address') || '';
      let clear = wx.getStorageSync('clear') || false;
      let editAddr = wx.getStorageSync('editAddr') || '',
        title = '';

      if (_addr) {
        this.full_address = _addr.street + _addr.build
      } else if (editAddr.addressId){
        this.editId = editAddr.addressId;
        this.name = editAddr.receiveName || '';
        this.tel = editAddr.receivePhone || '';
        this.full_address = editAddr.locationAddress || '';
        this.district = editAddr.detailedAddress || '';
      }else if (clear){
        this.editId = '';
        this.name = '';
        this.tel = '';
        this.district = '';
        wx.removeStorageSync('clear')
      }

      if (editAddr) {
        title = '编辑地址';
      } else {
        title = '新增地址';
      }

      wx.setNavigationBarTitle({
        title: title
      });

    },
    mounted() {

      this.Mc = wx.createMapContext('map');
      this.myAmapFun = new amapFile.AMapWX({key: 'e11026819b6d300fda6a2c680fbd2fef'});
      console.log(this.editId);
      if (!this.editId) {
        this.getlocation();
      }

    },
    methods: {
      btn_tap(url) {
        if (url == 'save') {
          this.addAddr();
        }
      },
      page_turn(method) {
        let v = this;
        if (method == 'save') {//保存地址
          v.editAddr();
        } else if (method == 'del') {//删除
          v.delAddr();
        }
      },
      addAddr() {//添加地址
        let v = this;

          let regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
          console.log(v.name.match(regRule));
          if(v.name.match(regRule)) {
              v.name = v.name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
              wx.showToast({
                  title: '请输入合法姓名',
                  icon: 'none',
                  duration: 2000
              });
              return
          }

        if (!v.name) {
          wx.showToast({
            title: '请填写收货人姓名',
            icon: 'none',
            duration: 2000
          });
          return
        }
        if (!v.tel) {
          wx.showToast({
            title: '请填写收货人电话',
            icon: 'none',
            duration: 2000
          });
          return
        }
        if (!v.full_address) {
          wx.showToast({
            title: '请填写收货人地址',
            icon: 'none',
            duration: 2000
          });
          return
        }

        wx.showLoading();
        WXAJAX.POST({
          locationAddress: v.full_address || '',
          detailedAddress: v.district || '',
          receiveName: v.name,
          receivePhone: v.tel,

        }, '', '/personal/addAddress').then((data) => {
          wx.hideLoading();
          console.log(data);
          if (data) {
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 2000
            });
            setTimeout(function () {
              wx.navigateBack()
            },500)
          } else {
            wx.showToast({
              title: '添加失败，请重试',
              icon: 'none',
              duration: 2000
            });
          }

        }).catch((err) => {
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        })
      },
      editAddr() {//编辑地址
        let v = this;

          let regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
          console.log(v.name.match(regRule));
          if(v.name.match(regRule)) {
              v.name = v.name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
              wx.showToast({
                  title: '请填写正确格式收货人姓名，不能填写特殊字符或表情包',
                  icon: 'none',
                  duration: 2000
              });
              return
          }

        if (!v.name) {
          wx.showToast({
            title: '请填写收货人姓名',
            icon: 'none',
            duration: 2000
          });
          return
        }
        if (!v.tel) {
          wx.showToast({
            title: '请填写收货人电话',
            icon: 'none',
            duration: 2000
          });
          return
        }
        if (!v.full_address) {
          wx.showToast({
            title: '请填写收货人地址',
            icon: 'none',
            duration: 2000
          });
          return
        }

        wx.showLoading();
        WXAJAX.POST({
          addressId: v.editId,
          locationAddress: v.full_address || '',
          detailedAddress: v.district || '',
          receiveName: v.name || '',
          receivePhone: v.tel || '',

        }, '', '/personal/updAddress').then((data) => {
          wx.hideLoading();
          if (data == '修改成功') {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            });
            wx.navigateBack();
          } else {
            wx.showToast({
              title: '修改失败，请重试',
              icon: 'none',
              duration: 2000
            });
          }

        }).catch((err) => {
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        })
      },
      delAddr() {//删除地址
        let v = this;

        wx.showLoading();
        WXAJAX.POST({
          addressIds : v.editId,
        }, '', '/personal/delAddress').then((data) => {
          wx.hideLoading();
          if (data == '删除成功') {
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 2000
            });
            setTimeout(function () {
              wx.navigateBack();
            },900)
          } else {
            wx.showToast({
              title: '删除失败，请重试',
              icon: 'none',
              duration: 2000
            });
          }

        }).catch((err) => {
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        })
      },
      resetAddr() {//重新定位
        wx.navigateTo({url: '../companyAddr/main'});
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
            v.locat.lat = res.latitude;
            v.locat.lng = res.longitude;

            v.getLocal();
            wx.hideLoading();
          },
          fail: function (err) {
            wx.hideLoading({
              success(){
                wx.showToast({
                  title: '定位失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            });
          },
          complete: function () {
            wx.hideLoading();
          }
        })
      },
      getLocal(latitude, longitude) {

        let v = this;

        v.myAmapFun.getRegeo({
          location: '' + v.locat.lng + ',' + v.locat.lat + '', // location的格式为'经度,纬度'
          success: function (data) {

            let _address = data[0].regeocodeData.addressComponent,
              _neighborhood = _address.neighborhood,
              _street = _address.streetNumber;
            v.locat.province = _address.province;
            v.locat.city = _address.city;
            v.locat.district = _address.district;
            // v.adcode = _address.adcode ;

            if (_neighborhood && _neighborhood.name.length > 0) {
              v.locat.addr = _neighborhood.name;
            } else {
              v.locat.addr = _street.street + _street.number;
            }

            v.full_address = v.locat.province + v.locat.city + v.locat.district + v.locat.addr;

          },
          fail: function (info) {
            v.locat.city = '失败';
            v.locat.addr = '重新定位';
            console.log(info)
          }
        })

      },

    }
  }
</script>

<style>

</style>






























