<template>
    <div>
        <!--top-->
        <div class="disflex jsbet bgfff lh30 pl16 pr15 pt5 pb5">
            <div class="pr15" @click="chooseCity('searchChooseItem','city')">
                <span class="fs16 fbold c38 mr3">{{locat.city}}</span>
                <img
                        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down_2.png"
                        alt
                        class="w10 h10"
                />
            </div>
            <div class="bgf5f6 bradius17 disflex pl15 flex1 align-cen">
                <img
                        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/search.png"
                        alt
                        class="w16 h16 mr8"
                />
                <input type="text" v-model="key" class="pha8 fs14 lh34 h34" placeholder="地址搜索"/>
            </div>
        </div>

        <!--addr-->
        <div class="pl16 bgfff pt15 pb15 pr16" v-show="!key">
            <p class="fs12 ca8">当前定位</p>
            <div class="disflex jsbet pt10">
                <span class="fs16 fbold c38">{{locat.addr}}</span>
                <span class="cblue fs16" @click="getlocation">重新定位</span>
            </div>
        </div>

        <!--addr lists-->
        <div v-show="key">
            <div
                    class="bgfff fs14 ca8 pl16 pr16 bbf7 pt15 pb15"
                    v-for="( v,k) in search_lists"
                    :key="k"
                    @click="choose_addr(k)"
            >
                <p class="disflex jsbet pb10">
                    <span class="c38 fs18">{{v.build}}</span>
                    <span>{{v.distance}}</span>
                </p>
                <p>{{v.street}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import amapFile from "../../libs/amap-wx.js";

    export default {
        name: "",
        components: {},
        data() {
            return {
                locat: {
                    city: "成都",
                    addr: "",
                    lat: "",
                    lng: ""
                },
                key: "",
                isinput: false,
                myAmapFun: "",
                Mc: "",
                adcode: "",
                search_lists: []
            };
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: "选择地址"
            });

            this.Mc = wx.createMapContext("map");
            this.myAmapFun = new amapFile.AMapWX({
                key: "e11026819b6d300fda6a2c680fbd2fef"
            });
            this.getlocation();
        },
        onShow() {
            let _city = wx.getStorageSync("company_city");
            if (_city) {
                this.locat.city = _city;
            }
            this.search_lists = [];
        },
        onHide() {
            console.log("close---");
        },
        watch: {
            key(newVal, oldVal) {
                this.inputting();
            }
        },
        methods: {
            page_turn(url) {
                wx.navigateTo({url: "../" + url + "/main"});
            },
            chooseCity(url, type) {
                //选择城市
                wx.navigateTo({url: "../" + url + "/main?type=" + type});
            },
            getlocation() {
                //获取经纬度
                wx.showLoading({
                    title: "定位中...",
                    mask: true
                });
                var v = this;
                wx.getLocation({
                    type: "gcj02",
                    isHighAccuracy: true,
                    success: function (res) {
                        v.locat.lat = res.latitude;
                        v.locat.lng = res.longitude;

                        v.getLocal();
                        wx.hideLoading();
                    },
                    fail: function (err) {
                        wx.hideLoading({
                            success() {
                                wx.showToast({
                                    title: "定位失败",
                                    icon: "none",
                                    duration: 2000
                                });
                            }
                        });
                    },
                    complete: function () {
                        wx.hideLoading();
                    }
                });
            },
            getLocal(latitude, longitude) {
                let v = this;

                v.myAmapFun.getRegeo({
                    location: "" + v.locat.lng + "," + v.locat.lat + "", // location的格式为'经度,纬度'
                    success: function (data) {
                        console.log(data[0].regeocodeData.addressComponent);
                        let _address = data[0].regeocodeData.addressComponent,
                            _neighborhood = _address.neighborhood,
                            _street = _address.streetNumber;
                        v.locat.city = _address.city;
                        v.adcode = _address.adcode;

                        if (_neighborhood && _neighborhood.name.length > 0) {
                            v.locat.addr = _neighborhood.name;
                        } else {
                            v.locat.addr = _street.street + _street.number;
                        }

                        wx.setStorageSync("company_address", {
                            street: _address.province + _address.city + _address.district,
                            build: v.locat.addr
                        });
                    },
                    fail: function (info) {
                        v.locat.city = "失败";
                        v.locat.addr = "重新定位";
                        console.log(info);
                    }
                });
            },
            async inputting() {
                let v = this,
                    addrs = await v.getSearchAddr();

                v.search_lists = [];

                console.log(addrs);
                addrs.forEach(function (item, index) {
                    if (item.location) {
                        v.myAmapFun.getDrivingRoute({
                            origin: v.locat.lng + "," + v.locat.lat,
                            destination: item.location,
                            success: function (data) {
                                if (data.paths[0] && data.paths[0].distance) {
                                    let _distance = data.paths[0] && data.paths[0].distance;
                                    _distance = _distance * 0.001;
                                    _distance = _distance.toFixed(2);

                                    v.search_lists.push({
                                        build: item.name,
                                        street: item.district,
                                        distance: _distance + "km"
                                    });

                                    _distance = null;
                                }
                            },
                            fail: function (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            },
            getSearchAddr() {
                let v = this;

                return new Promise((resolve, reject) => {
                    v.myAmapFun.getInputtips({
                        keywords: v.key,
                        city: v.locat.city,
                        success: function (data) {
                            if (data && data.tips) {
                                resolve(data.tips);
                            }
                        },
                        fail: function (err) {
                            resolve(err);
                        }
                    });
                });
            },
            choose_addr(index) {
                console.log(this.search_lists[index]);
                let v = this;
                wx.showLoading();
                setTimeout(() => {
                    wx.navigateBack();
                    wx.setStorageSync("company_address", this.search_lists[index]);
                    wx.hideLoading();
                }, 500);
            }
        }
    };
</script>

<style>
</style>
