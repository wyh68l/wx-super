import Vue from 'vue'
import orderLists from './index'

const app = new Vue(orderLists)
app.$mount()
export default {
    config: {
        "enablePullDownRefresh": true,
    }
}
