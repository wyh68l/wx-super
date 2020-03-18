import Vue from 'vue'
import Vuex from 'vuex'
// import mutations from './mutations.js'
const SET_LOGIN = 'set_login_status';
const SET_USER_INFO = 'set_user_info';

Vue.use(Vuex)
import msgList from './msgList'
import msgCont from './msgCont'
import jsMsg from './jsMsg'
import { stat } from 'fs';
const state = {
  currentCompany: wx.getStorageSync('CURRENT_COMPANY') || {},
  phone: wx.getStorageSync('phone') || '',
  unreadNum: 0, // 详情页面中的未读消息数量
  isLoginStatus: wx.getStorageSync('isLogin')||false, //是否是登录状态
  /* name: 'HD384483939',// 用户名
   infocount: 1,// 消息数量
   token: '123456'//token*/
   userInfo: {
     userName: wx.getStorageSync('USERNAME')|| '',
     phone: wx.getStorageSync('phone') || '',
     userId:  wx.getStorageSync('userId') || '',
     avatarUrl:  wx.getStorageSync('avatarUrl') || '',
   }
};
const mutations = {
  SET_CURRENT_COMPANY(state, data) {
    state.currentCompany = data;
    if (data) {
      wx.setStorageSync('CURRENT_COMPANY', JSON.stringify(data));
    }else{
      wx.removeStorageSync('CURRENT_COMPANY');
    }
  },
  SET_PHONE(state, data){
    state.phone = data;
  },
  SET_UNREAD_NUM(state, data){
    state.unreadNum = data;
  },
  [SET_LOGIN](state, data) {
    state.isLoginStatus = data;
  },
  [SET_USER_INFO](state, data) {
    state.userInfo = data;
  },
  setPhone(state, phone) {
    state.phone = phone;
  }
};

const actions = {
  setCurrentCompany({commit}, data) {
    commit('SET_CURRENT_COMPANY', data)
  },
  setPhone({commit}, data){
    commit('SET_PHONE', data);
  },
  setUnreadNum({commit}, data){
    commit('SET_UNREAD_NUM', data);
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules:{
    msgList,
    msgCont,
    jsMsg,
  },
  getters:{
    currentCompany: state => state.currentCompany,
    selfPhone: state=> state.phone,
    msglist: state => state.msgList.msglist,
    msgCont:state=>state.msgCont.msgCont,
    changePosition:state=>state.msgCont.status,
    unreadNum: state => state.unreadNum,
    countNum: state => state.msgCont.countNum,
    currentNum: state => state.msgCont.currentNum,
  },
  /* plugins: [
       createPersistedState({
           storage: {
               getItem: key => {
                   wx.getStorageSync(key)
               },
               setItem : (key ,value)=>{
                   wx.setStorageSync(key,value)
               },
               removeItem:key=>{
                   wx.clearStorage()
               }
           }
       })
   ]*/
})

