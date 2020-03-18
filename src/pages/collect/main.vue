<template>
    <div class="pt46">
        <!--top-->
        <div class="disflex bgfff textc jsaround fs16 lh44 c78 bbf7 fix_top zindex999 bgfff">
            <span class :class="menu_id == 1 ? 'bbblue_2 cblue fbold' : '' " @click="menu_tap(1)">收藏产品</span>
            <span class :class="menu_id == 2 ? 'bbblue_2 cblue fbold' : '' " @click="menu_tap(2)">收藏文章</span>
            <span class :class="menu_id == 3 ? 'bbblue_2 cblue fbold' : '' " @click="menu_tap(3)">收藏企业</span>
        </div>

        <!--收藏企业-->

        <div v-if="menu_id == 3">
            <div class="bgfff pt15 pl15 pr15 pb15 disflex jsbet"
                 v-for="(v,k) in prods" :key="k" @click="toIndex('index', card_msg.companyId, card_msg.cardId)">
                <img :src="v.photos" mode="aspectFill" alt class="w50 h50 bradius5 mr10" />

                <div class="flex1 disflex jsbet align-cen">
                    <span class="c38 fs16 fbold disflex align-cen">{{v.name}}</span>
                    <img
                            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/del.png"
                            alt
                            class="w20 h20"
                            @click.stop="del_tap(v.itemId,k)"
                    />
                </div>
            </div>
        </div>

        <!--收藏文章-->
        <div v-else-if="menu_id == 2">
            <div
                    class="bgfff pt10 pl9 pr16 pb15 disflex jsbet"
                    v-for="(v,k) in prods"
                    :key="k"
                    @click="toDetail(v.itemId)"
            >
                <img :src="v.photos" mode="aspectFill" alt class="w60 h60 bradius5 mr23" />
                <div class="flex1">
                    <p class="fs14 c38 over_2 pt3">{{v.name}}</p>
                    <div class="disflex jsbet pt4 row-reverse align-cen">
                        <img
                                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/del.png"
                                alt
                                class="w20 h20"
                                @click.stop="del_tap(v.itemId,k)"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!--收藏产品-->
        <div v-else-if="menu_id == 1">
            <div
                    class="bgfff pt10 pl9 pr16 pb15 disflex jsbet"
                    v-for="(v,k) in prods"
                    :key="k"
                    @click="toProdDetail(v.itemId)"
            >
                <img :src="v.photos" mode="aspectFill" alt class="w60 h60 bradius5 mr23" />
                <div class="flex1">
                    <p class="fs14 c38 over_2 pt3">{{v.name}}</p>
                    <div class="disflex jsbet pt4 row-reverse align-cen">
                        <img
                                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/del.png"
                                alt
                                class="w20 h20"
                                @click.stop="del_tap(v.itemId,k)"
                        />
                        <span class="corange fs12" v-if="menu_id == 1">￥{{v.price/100}}</span>
                    </div>
                </div>
            </div>
        </div>

        <!--bottom-->
        <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>
    </div>
</template>

<script>
    import WXAJAX from "../../utils/request";

    export default {
        name: "",
        components: {},
        data() {
            return {
                menu_id: 1, //1产品，2文章，3企业
                prods: [],
                lists: [],
                hasCard: wx.getStorageSync("hasCard") || false, //是否已经有名片
                page: 1,
                isLoading: false, //是否在加载
                nodata: false //是否已经没有数据
            };
        },
        async onPullDownRefresh() {
            // to doing..
            // 停止下拉刷新
            wx.showNavigationBarLoading();
            // 开始重新请求
            this.prods = [];
            this.page = 1;
            this.inits();
            wx.stopPullDownRefresh();
            setTimeout(function() {
                wx.hideNavigationBarLoading();
            }, 300);
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: "收藏"
            });
            this.prods = [];
            this.page = 1;
            this.inits();
        },
        methods: {
            inits() {
                //获取收藏列表
                let v = this;
                if (v.isLoading) {
                    return;
                }
                v.isLoading = true;
                wx.showLoading();
                WXAJAX.POST(
                    {
                        itemType: v.menu_id,
                        pageNum: v.page
                    },
                    "",
                    "/personal/getCollection"
                )
                    .then(data => {
                        if (data) {
                            data.forEach(function(i, k) {
                                if (i.photos) {
                                    i.photos = i.photos.split(",")[0];
                                }
                            });
                            v.prods = [...v.prods, ...data];

                            v.page++;
                            setTimeout(function() {
                                v.isLoading = false;
                            }, 500);
                        } else {
                            setTimeout(function() {
                                v.nodata = true;
                                v.isLoading = false;
                            }, 500);
                        }
                        wx.hideLoading();
                    })
                    .catch(err => {
                        wx.hideLoading();
                        console.log(err);
                        if (err.code == 204) {
                            v.nodata = true;
                        }
                        setTimeout(function() {
                            v.isLoading = false;
                        }, 500);
                    });
            },
            menu_tap(id) {
                this.menu_id = id;
                this.page = 1;
                this.nodata = false;
                this.isLoading = false;
                this.prods = [];
                this.inits();
            },
            del_tap(id, index) {
                //取消收藏

                wx.showLoading();
                let _url = "",
                    _request = {};
                _url = "/personal/delCollection";
                _request = {
                    itemType: this.menu_id,
                    itemId: id
                };

                WXAJAX.POST(_request, "", _url)
                    .then(data => {
                        wx.hideLoading();
                        if (data) {
                            wx.showToast({
                                title: "删除成功！",
                                duration: 2000,
                                icon: "none"
                            });
                            this.prods.splice(index, 1);
                        }
                    })
                    .catch(err => {
                        wx.hideLoading();
                    });
            },
            toIndex(url, companyid, cardid) {
                //进入对方名片
                console.log(companyid,cardid);
                wx.setStorageSync("COMPANYID", companyid); /*id*/
                wx.setStorageSync("CARDID", cardid); /*id*/
                wx.switchTab({
                    url: "../" + url + "/main?cardId=" + cardid + "&companyId+" + companyid
                });
            },
            toDetail(el) {
                //查看文章详情
                let url = "../dynamicDetail/main?dynamicId=" + el;
                wx.navigateTo({ url: url });
            },
            toProdDetail(id) {
                //进入详情
                wx.navigateTo({ url: "../prodDetail/main?goodId=" + id });
            }
        },
        onReachBottom() {
            let v = this;
            v.inits();
        }
    };
</script>

<style>
</style>

























