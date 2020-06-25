import WXAJAX from '@/utils/request'
import utils from '@/utils';

export default {
  methods:{
    formatDate(fmt, date){
      date = date instanceof Date ? date : new Date(date);

      let o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
      };
      if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(let k in o)
        if(new RegExp("("+ k +")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      return fmt;
    },
    // 添加拨打电话记录
    addCallsPhoneRecord(cardId=''){
      WXAJAX.POST({cardId}, '','/record/addCallsPhoneRecord');
    },
    // 添加文章转发记录
    addDynamicForwardRecord(cardId='', dynamicId='') {
      WXAJAX.POST({cardId, dynamicId}, '','/record/addDynamicForwardRecord');
    },
    // 添加商品转发记录
    addGoodsForwardRecord(cardId='', goodsId='') {
      return WXAJAX.POST({cardId, goodsId}, '','/record/addGoodsForwardRecord').then(data=>data);
    },
    toCreatePage(){
      let isBoss = wx.getStorageSync('roleId');
      let url = isBoss
        ? '/pages/editCard/main?type=add&goType=1'
        : '/pages/chooseIdentity/main?goType=1';
      utils.toMiniProgram(url);

    },
    // 获取广告图片
    getPlateAds(type,time){
      return WXAJAX.POST({
        type: type,
          timeQuantum:time,
        companyId: wx.getStorageSync('COMPANYID')
      }, '', '/record/selectCompanyPhoto');
    },
    // 预览图片
    previewImages(photos, url){
      wx.previewImage({
        current: url,
        urls: photos,
      })
    },
    // 校验图片名称是否是数字，主要为区别增加的缩略图
    checkImgNameIsNumber(imgUrl){
      let urlImg = imgUrl.split(/\/|\./g);

      if (/^-?\d+$/.test(urlImg[urlImg.length - 2])) {
        return true;
      }else {
        return false;
      }
    },
    // 开发中功能，暂无跳转使用
    showDevelopingTips(){
      wx.showToast({
        title: '功能尚在更新中，敬请期待！',
        icon: 'none',
        duration: 2000
      });
    },
  },
  filters:{
    formatMoney(money){
      return (money/100).toFixed(2);
    },
  }
}
