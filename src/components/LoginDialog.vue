<template>
    <div class="w100p h100p bggray_5 fix_top login-dialog" v-if="isShow">
        <div class="login-content" >
            <div class="login-top">
                <img class="login-top-img" src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/login/BG.png" alt="">
            </div>
            <div class="login-bottom">
                <p class="fs19 login-title">您还没登录</p>
                <p class="fs14 ca8 textc pt10">请先登录再进行此操作</p>
                <div class="textc pt25">
                    <button class="login-button fs18 cfff" open-type="getUserInfo" @getuserinfo="GetUserInfo" >立即登录</button>
                </div>
                <div class="textc pt12">
                    <span class="fs14 cblue" @click="cancel">暂不登录</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import utils from '@/utils'
    import HandleLogin from '@/utils/handleLogin'
    import websocket from '@/utils/websocket'

    export default {
        name: "login",
        props: ['phoneMsg', 'isShow'],
        data () {
            return {
                logo: utils.extJSON.headImg
            }
        },
        mounted() {
        },
        methods: {
            /**
             * 取消登录
             */
            cancel () {
                this.$emit('cancelLogin');
            },

            /**
             * 获取用户信息
             * @param e
             * @constructor
             */
            GetUserInfo (e) {
                const msg = e.target;
                if (!msg.rawData || !msg.signature || !msg.encryptedData || !msg.iv) {
                    return;
                }
                HandleLogin.login(data => {
                    HandleLogin.setLoginMessageInStorage(data, false);
                    // 进入首页，则需要连接websocket
                    websocket.connectWebsocket();

                    this.$emit("loginSuccess");
                });
            },
        }
    }
</script>

<style>
    .ml5{margin-left: 5upx;}
    .login-dialog{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0,0,0, 0.5);
    }
    .login-content{
        width: 580upx;
        height: 671upx; 
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .login-top{
        width:580upx;
        height: 262upx;
    }
    .login-top-img{
        width:580upx;
        height: 262upx;
    }
    .login-bottom {
        width:580upx;
        height: 330upx;
        padding: 40upx 0;
        background: #ffffff;
        border-bottom-left-radius: 10upx;
        border-bottom-right-radius: 10upx;
    }
    .login-bottom .login-title{
        font-weight: bold;
        text-align: center;
    }
    .login-bottom .login-button{
        display: inline-block;
        width: 374upx;
        height: 88upx;
        background: linear-gradient(90deg,#00a0e9,#00a0e9);
        border-radius: 10upx;
        line-height: 88upx;
    }
</style>
