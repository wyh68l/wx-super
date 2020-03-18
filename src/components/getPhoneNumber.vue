<template>
    <!-- <label :for="id" @click="checkLogin">
        <view >
            <button v-if="phone" :id="id" @click="next" class="hide"></button>
            <button v-else :id="id" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="hide"></button>
        </view>
        <slot></slot>

    </label> -->
   <label :for="id" >
       <!-- <button v-if="!isLogin"
               class="user-info user-open-data"
               open-type="getUserInfo"
               @getuserinfo="GetUserInfo">
       </button> -->
       <!-- <view v-else > -->
       <view >
           <button v-if="vuexPhone" :id="id" @click="next" class="hide"></button>
           <button v-else :id="id" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="hide"></button>
       </view>
       <slot></slot>

   </label>
</template>

<script>
    import WXAJAX from '@/utils/request'
    import HandleLogin from '@/utils/handleLogin'
    import { mapMutations, mapState } from 'vuex';
    
    export default {
        name: "getPhoneNumber",
        components: {},
        props: {
            eventName: {
                type: String,
                default: 'next',
            },
            isFromUserCenter: {
                type: Boolean,
                default: false,
            }
        },
        data () {
            return {
                isLogin: HandleLogin.returnIsLogin() || '',
                id: Date.now() * Math.random(),
                phone: wx.getStorageSync('phone') || '',
            }
        },
        methods: {
            ...mapMutations(['setPhone']),
            getPhone() {
                return wx.getStorageSync('phone') || ''
            },
            checkLogin(){
                if (HandleLogin.returnIsLogin()) {
                    this.isLogin = true;
                } else {
                    this.$emit('loginGuide');
                }
            },
            next () {
                this.$emit(this.eventName);
            },
            /**
             * 获取用户信息
             * @param e
             * @constructor
             */
            GetUserInfo(e) {
                console.log("获取用户信息")
                const msg = e.target;
                if (!msg.rawData || !msg.signature || !msg.encryptedData || !msg.iv) {
                    return;
                }
                HandleLogin.login(data => {
                    HandleLogin.setLoginMessageInStorage(data, false);
                });
            },
            getPhoneNumber (e) {
                if(!HandleLogin.returnIsLogin()){
                    console.error("必须先登录才能获取电话号码");
                    return;
                }
                if (this.phone) return;

                if (!e.target.encryptedData) {
                    this.next();
                    return;
                }

                WXAJAX.POST({
                    phoneData: e.target.encryptedData,
                    phoneIv: e.target.iv,
                }, '', '/home/getWxPhone')
                    .then(res => {
                        this.phone = res;
                        wx.setStorageSync('phone', res);
                        this.setPhone(res);

                    }).catch(err => {
                        console.log("获取手机号出错：", err)
                });
                this.next(this.eventName);

            },
        },
        computed: {
            // ...mapGetters(['selfPhone']),
            ...mapState({
                vuexPhone: state=>state.phone
            })
        }
    }
</script>

<style scoped>
    .reset {
        position: static;
        padding: 0;
        text-align: left;
        line-height: 1;
        border-radius: 0;
        overflow: auto;
    }

    .reset-hover {
        background: transparent;

    }
    .login-intercept {
        width: 100%;
        height: 100%;
    }
</style>
