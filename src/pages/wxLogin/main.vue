<template>
    <div class="w100p pt15p">
        <Login :isShow="isShowLogin" @loginSuccess="loginSuccess" @cancelLogin="cancelLogin"></Login>
        <div v-if="isShowNotice && noticeList.length" @click="isShowNotice=false">
            <AppNotice :noticeList="noticeList"></AppNotice>
        </div>
    </div>
</template>

<script>
    import Login from '@/components/LoginDialog' //
    import WXAJAX from '../../utils/request'
    import utils from '@/utils';
    import AppNotice from '@/components/AppNotice'
    import { mapActions } from 'vuex';
    //import StaticResources from '@/components/StaticResources';

    export default {
        name: "login",
        props: [],
        components: { AppNotice, Login},
        data () {
            return {
                logo: utils.extJSON.headImg,
                noticeList: [],
                isShowNotice: true,  //是否显示公告
                isShowLogin: true,
                redirectUrl: '/pages/index/main',
            }
        },
        mounted () {
            wx.setNavigationBarTitle({
                title: "登录"
            });

            this.getNotice();
        },
        onUnload () {
            this.noticeList = [];
            this.isShowNotice = true;
        },
        onShow () {
            const query = this.$root.$mp.query;
            if(query.unLoginRedirectUrl){
                this.redirectUrl = query.unLoginRedirectUrl;
            }
        },
        methods: {
            ...mapActions(['setCurrentCompany']),
            loginSuccess () {
                // 成功登录跳转回来的界面
                let url = wx.getStorageSync('redirectPage');
                if(this.redirectUrl){
                    url = this.redirectUrl;
                }
                setTimeout(()=>{
                    wx.reLaunch({url: url});
                }, 1000);
            },
            cancelLogin () {
                // 取消登录跳转回来的界面
                const url = this.redirectUrl;
                console.log("取消登录跳转回来的界面", url);
                setTimeout(()=>{
                    wx.reLaunch({url: url});
                }, 1000);

            },

            getNotice () {
                WXAJAX.POST({}, '', '/notice/selectEffectiveList').then(res => {
                    this.noticeList = res || [];
                });
            },
        }
    }
</script>

<style>
    page {
        background: white;
    }
</style>


































