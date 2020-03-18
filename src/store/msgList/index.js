export default {
  state:{
    msglist:[]
  },
  // namespaced: true,
  mutations:{
    SET_MSG_LIST(state,data){
      state.msglist=data
    },

  },
   actions:{
     setMsgList({commit}, data) {
       commit('SET_MSG_LIST', data);
     },
  }
}
