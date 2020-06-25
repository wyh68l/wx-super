<template>
    <div class="page">
        <!-- 自定义 tabbar -->
        <view class="nav-tabs">
            <view class="tab-list" :class="currentTab == idx ? 'active' : 'default'" v-for="(item,idx) in tabList" :key="idx" @click="swichNav(idx,item.type)">
                <text class="tab-text" :class="currentTab == idx ? 'txtactive' : 'tab-text'">{{item.name}}</text>
                <image class="iconPath"  :src="currentTab == idx ? item.selectedIconPath : item.iconPath"></image>
            </view>
        </view>
    </div>
</template>

<script>
    import store from "../store/index";
    import { mapGetters } from "vuex";
    export default {
        name: "Tabbar",
        data(){
            return {
            }
        },
        computed:{
        ...mapGetters(["currentTab",'tabList']),
        },
        methods:{
            swichNav(index,type) {
                if (this.currentTab === index) {
                    return false;
                } else {
                    store.commit('setCurrentTab',type);
                    //console.log(index,type);
                     let url = this.tabList[index].route;
                     wx.switchTab({url});
                }
            },
        },
    }
</script>


<style scoped>
    .page {
        display: flex;
        flex-direction: column;
        background-color: #fff;
    }

    .nav-tabs {
        width: 100%;
        display: flex;
        position: fixed;
        bottom: 0;
        z-index: 9999;
    }

    .tab-list {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column-reverse;
        background: #fff;
        height: 85rpx;
    }

    .tab-text {
        font-size: 20rpx;
        line-height: 20rpx;
        color: #A8A8A8;
        font-weight: 100;
    }

    .iconPath {
        width:54rpx;
        height: 54rpx;
    }

    .tab-content {
        flex: 1;
    }


    .default {
        line-height: 75rpx;
        text-align: center;
        flex: 1;
        /* border-bottom: 1px solid #eee; */
        color: #A8A8A8;
        font-weight: bold;
        font-size: 28rpx;
    }
    .txtactive{
        color: #00a0e9;

    }
    .active {
        color: #00a0e9;
        line-height: 75rpx;
        text-align: center;
        color: black;
        flex: 1;
        /* border-bottom: 1px solid red; */
        font-weight: bold;
        font-size: 28rpx;
    }

    .show {
        display: block;
        flex: 1;
    }

    .hidden {
        display: none;
        flex: 1;
    }
</style>