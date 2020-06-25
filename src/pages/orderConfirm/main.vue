<template>
    <div class="pb50">
        <div class="mt10 mb10">
            <AddressItem :addr="default_addr" :ismore="true"></AddressItem>
        </div>


        <!--商品-->
        <div class="mb10" v-for="(cart_item,k) in cart_lists" :key="k">
            <OrderItem :orderData="cart_item" :orderIndex="k" :key="k"
                       :index1="k"
                       :isorder="true"
            ></OrderItem>
            <!--小计-->
            <div class="textr lh44 pr15 fs14 c333 bgfff">
                <span> 共{{cart_item.allNum}}件商品</span>
                <span> 小计: <span class="corange fs16 fbold">￥{{cart_item.orderPrice}}</span></span>
            </div>
        </div>

        <!--留言-->
        <div class="pl16 pr16 fs16 c38 lh44 bgfff disflex bbf5f6">
            <label for="mark">买家留言</label>
            <input id="mark" class="fs14 phe8 lh44 h44 pl16 flex1" type="text" v-model="remark"
                   placeholder="选填:填写内容已和卖家协商确认">
        </div>

        <!--提交-->
        <div class="disflex row-reverse fix_bottom pt5 pb5 lh39 bgfff">
            <span class="bg_line_blue textc cfff fs18 fbold bradius20 w110 mr16" @click="toPay">提交订单</span>
            <div class="fs16 c38 pr26">
                <span>实付:</span>
                <span class="corange fbold">￥{{total_money}}</span>
            </div>
        </div>

    </div>
</template>

<script>
    import AddressItem from '@/components/addressItem' // 订单项
    import OrderItem from '@/components/orderItem' // 订单项
    import WXAJAX from '../../utils/request'
    import util from '../../utils/index'

    export default {
        name: '',
        components: {AddressItem, OrderItem},
        data() {
            return {
                remark: '',
                cart_lists: [],
                // count_money: [], // 这个变量没有使用
                total_money: 0 ,
                default_addr : {
                    name  : '' ,
                    tel :'',
                    address : '' ,
                } ,
                orderId:0,//订单id
                isLoading: false,
            }
        },
        onShow(){
            //获取默认地址
            this.getOrderAddr();
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: "订单确认"
            });
            let v = this;
            this.total_money = 0;
            v.orderId = this.$root.$mp.query.orderId || 0 ;
            this.cart_lists = wx.getStorageSync('orderInfo');
            this.cart_lists.map(val=>{
              v.total_money += Number(val.orderPrice) ;
            })
            v.total_money = v.total_money.toFixed(2)

        },
        methods: {
            getOrderAddr(){
                let v = this ;
                WXAJAX.POST({}, '', '/personal/getAddress').then((data) => {
                    wx.hideLoading();
                    for ( let i of data){
                        if(i.isdefault == 1){
                            v.default_addr = {
                                name : i.receiveName ,
                                tel : i.receivePhone ,
                                address : i.locationAddress + i.detailedAddress ,
                                addressId : i.addressId
                            };
                            break;
                        }
                        console.log('default_addr -- ',v.default_addr);
                    }
                }).catch((err) => {
                    wx.hideLoading();
                })
            },
            getOrderDetail(){//获取订单信息
                let v = this ;
                WXAJAX.POST({
                    ordersIds : v.orderId ,
                }, '', '/orders/getOrderInfo').then((data) => {
                    wx.hideLoading();
                    if(data){
                        v.total_money = 0 ;
                        data.forEach(function (item,index1) {
                            item.ordersModelList.forEach(function (item2, index2) {
                                item2.price /= 100 ;
                                item2.price = item2.price.toFixed(2)
                                item2.allPrice /= 100 ;
                                item2.allPrice = item2.allPrice.toFixed(2)
                                // let money = item2.price * item2.num;
                                // v.count_money.push(money); // 这个变量没有使用
                            });
                            item.shopcartModelList = item.ordersModelList ;
                            item.orderPrice /= 100 ;
                            item.orderPrice = item.orderPrice.toFixed(2)
                            v.total_money += Number(item.orderPrice) ;
                            v.total_money = v.total_money.toFixed(2)
                        });
                        v.cart_lists = data ;
                        console.log(JSON.stringify(data));
                    }
                    console.log(data)
                }).catch((err) => {
                    wx.hideLoading();
                })
            },
            toPay() {//订单支付
                if (this.isLoading) return;

                let v = this ;
                if(!v.default_addr.addressId || undefined == v.default_addr.addressId){
                    wx.showToast({
                        title: '请先添加地址！',
                        icon: 'none'
                    });
                    return;
                }

                let list = JSON.parse(JSON.stringify(v.cart_lists));

                list.map(val=>{
                  val.orderPrice = val.orderPrice*100;

                  val.shopcartModelList.map(item=>{
                    item.price = item.price*100;
                    item.allPrice = item.allPrice*100;
                  });
                });

                this.isLoading = true;
                // 拼团id  尝试获取拼团的id
                let assembleId = '';
                if (list[0].shopcartModelList && list[0].shopcartModelList.length>0) {
                    assembleId = list[0].shopcartModelList[0].assembleId;
                    list[0].shopcartModelList[0].forwardId = wx.getStorageSync('forwardId')?wx.getStorageSync('forwardId'):'';
                    //console.log(list[0].shopcartModelList[0].killEndTime);
                    if(list[0].shopcartModelList[0].killEndTime < 0){
                        wx.showToast({
                            title: '活动已过期！',
                            icon: 'none'
                        });
                        return;
                    }
                }
                //list[0].shopcartModelList[0].killId = 97;//添加秒杀id
                console.log(list[0].shopcartModelList);
                WXAJAX.ToPay({
                    orderinfoRequestList: list[0].shopcartModelList,
                    addressId:v.default_addr.addressId,
                    assembleId,
                    remark:v.remark
                }).then((data) =>{
                    console.log(data);
                }).catch( (err) =>{
                    console.log(err);
                    setTimeout(function () {
                        wx.navigateTo({url:'../orderLists/main?status=1'})
                    })
                }).catch(()=>{
                    this.isLoading = false;
                });
            }
        }
    }
</script>

<style>

</style>



























