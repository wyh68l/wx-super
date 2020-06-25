export default {
  state:{
    msgCont:{data:[]},
    status: 1,
    countNum: 0,
    currentNum: 0,
      currentUserId:0,
      currentSum:0
  },
  mutations:{
    GET_MSG_CONT(state,data){
      state.msgCont=data
      //console.log("state",state.msgCont);
    },
    ADD(state, data) {
      if (!state.msgCont.data) state.msgCont.data = [];
      state.msgCont.data.push(data)
        // state.currentUserId = data.companyId;
        // state.currentSum++;
    },
    ADD_LIST(state, data){
      if (!state.msgCont.data) state.msgCont.data = [];
      state.msgCont.data.unshift(...data.data);
    },
    CHANGE_STATUE(state){
      state.status++;
    },
    READ_MSG(state){
      if (!state.msgCont.data) return;
      let userId = wx.getStorageSync('userId');

      state.msgCont.data.map(val=>{
        if (val.sendId == userId) {
          val.type = 1;
        }
      });
    },
    SET_COUNT_NUM(state, data){
      state.countNum = data;
    },
    SET_CURRENT_NUM(state, data){
      state.currentNum = data;
    },
  },
  actions:{
    getMsgCont({commit},data){
      commit('GET_MSG_CONT',data)
    },
    add({commit}, data){
      commit('ADD', data);
      commit('CHANGE_STATUE')
    },
    addList({commit}, data){
      commit('ADD_LIST', data);
    },
    change({commit},data){
      commit('CHANGE_STATUE')
    },
    readMsg({commit}){
      commit('READ_MSG');
    },
    setCountNum({commit}, data){
      commit('SET_COUNT_NUM', data);
    },
    setCurrentNum({commit}, data){
      commit('SET_CURRENT_NUM', data);
    },
  }
}
