// import request from './requestFly'
// import { createBase64 } from "./index";
//
// let extJSON = wx.getExtConfigSync();
// let base64 = createBase64();
//
// let {
//     companyKey,
//     uploadUrl,
//     baseUrl,
//     ossUrl
// } = extJSON;
//
// const imgBackUrl = ossUrl;
//
// baseUrl = baseUrl + '/userApi';
// uploadUrl = uploadUrl + '/file/uploadObjectOSS';
//
// request.config.baseURL = baseURL;
// request.config.headers = {
//     'content-type': 'application/x-www-form-urlencoded',
//     'token': gettoken(),
//     'companyKey': companyKey,
//     'cookie': 'PHPSESSID=' + getcookie(),
// };
//
// function getcookie() {
//     return wx.getStorageSync('cookies') || ''
// }
//
// function gettoken() {
//     return wx.getStorageSync('token') || ''
// }
//
//
// const api = {
//     // 登录
//     loginByWeixin: (loginData) => request.post('/home/wxLogin', loginData),
//
//     // // picture
//     // getNewIds: () => request.get(`/v1/one?${encodeURI('url=/api/hp/idlist/0?version=3.5.0&platform=android')}`),
//     // getHomeData: (id) => request.get(`/v1/one?${encodeURI('url=/api/hp/detail/' + id + '?version=3.5.0&platform=android')}`),
//     // // read
//     // getReadList: () => request.get(`/v1/one?${encodeURI('url=/api/reading/index/?version=3.5.0&platform=android')}`),
//     // getReadDetail: (type, id) => request.get(`/v1/one?${encodeURI('url=/api/' + type + '/' + id + '?version=3.5.0&platform=android')}`),
//     // getReadComment: (id) => request.get(`/v1/one?${encodeURI('url=/api/comment/praiseandtime/essay/' + id + '/0?version=3.5.0&platform=android')}`),
//     // getMovieList: () => request.post('/v1/two', {
//     //     url: '/api/channel/movie/more/0?channel=wdj&version=4.0.2&uuid=ffffffff-a90e-706a-63f7-ccf973aae5ee&platform=android'
//     // }),
//     // getMovieDetail: (id) => request.get(`/v1/one?${encodeURI('url=/api/movie/' + id + '/story/1/0?version=3.5.0&platform=android')}`),
//     // getWeather: (location) => request.get(`/v1/weather?location=${location}`),
//     // // 知乎日报
//     // getZhList: () => dailyRequest('latest'),
//     // getZhDtl: (id) => dailyRequest(id)
// }
//
// export default api