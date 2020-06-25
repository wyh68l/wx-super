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
    initTabar: [
        {
            "name": "名片",
            "iconPath": "../static/tabs/card.png",
            "selectedIconPath": "../static/tabs/card_select.png",
            'route':'../index/main'
        },
        {
            "name": "预约",
            "iconPath": "../static/tabs/appointment.png",
            "selectedIconPath": "../static/tabs/appointment_select.png",
            'route':'../appointment/main'
        },
        {
            "name": "商城",
            "iconPath": "../static/tabs/prod_gray.png",
            "selectedIconPath": "../static/tabs/prod_select.png",
            'route':'../Product/main'
        },
        {
            "name": "动态",
            "iconPath": "../static/tabs/browser.png",
            "selectedIconPath": "../static/tabs/browser_select.png",
            'route':'../Dynamic/main'
        },
        {
            "name": "官网",
            "iconPath": "../static/tabs/computer.png",
            "selectedIconPath": "../static/tabs/computer_select.png",
            'route':'../WebSite/main'
        }
    ],//默认底部栏
    currentTab:0,//底部导航栏点击角标
    tabList:wx.getStorageSync('tabList') || [],//底部栏
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
   },
    subscriptionNew: [] //订阅消息
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
    setCurrentTab(state,data){
        state.tabList.forEach((item,index) =>{
            if(Number(item.type) === Number(data)){
                //console.log(data,index);
                state.currentTab = index;
            }
        })
    },
    SET_TABBAR(state,data){
        if (data) {
            state.tabList = data;
            wx.setStorageSync('tabList', JSON.stringify(data));
        }else{
            let temp = wx.getStorageSync('tabList')?JSON.parse(wx.getStorageSync('tabList')) : state.initTabar;
            state.tabList = temp
        }
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
  },
    SET_SUBSCRIPTION_NEW(state,subscriptionNew){
        state.subscriptionNew = subscriptionNew;
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
    setSubscriptionNew({commit}, data) {
        commit('SET_SUBSCRIPTION_NEW', data);
    },
    setTabbar({commit}, data){
        commit('SET_TABBAR', data);
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
      subscriptionNew: state => state.subscriptionNew,
      currentTab: state => state.currentTab,
      tabList: state => state.tabList,
      // currentUserId:state => state.msgCont.currentUserId,
      // currentSum:state => state.msgCont.currentSum
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

