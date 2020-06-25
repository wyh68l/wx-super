/**
 * 用户登录授权处理
 */
import WXAJAX from "./request";
import store from "@/store/index.js";
let i = 0;
let error = "";
/**
 * 开始login
 * 小程序向微信请求code，成功后向后端发起登录请求，成功后，查询存储中是否有redirectPage，如果有，则进行跳转
 * @param successCallback 登录成功回调函数
 * @param failedCallback 登录失败回调函数
 */
export function login(successCallback, failedCallback) {
  wx.showLoading();
  wx.login({
    success(res) {
      if (res.code) {
        // 登录成功，获取用户信息
        getUserInfo(res.code, successCallback);
        let url = wx.getStorageSync("redirectPage");
        redirectPage(url);
      } else {
        // 否则弹窗显示，showToast需要封装
        showToast();
      }
    },
    fail() {
      failedCallback && failedCallback();
      showToast();
    }
  });
}
/**
 * 开始login
 * 小程序向微信请求code，成功后向后端发起登录请求，成功后，查询存储中是否有redirectPage，如果有，则进行跳转
 * @param successCallback 登录成功回调函数
 * @param failedCallback 登录失败回调函数
 */
export function loginPromise() {
  wx.showLoading();
  return new Promise((resolve, reject) => {
    wx.login({
      success: async res => {
        if (res.code) {
          // 登录成功，获取用户信息
          let data = await getUserInfoByPromise(res.code);
          let url = wx.getStorageSync("redirectPage");
          redirectPage(url);
          resolve(data);
        } else {
          // 否则弹窗显示，showToast需要封装
          showToast();
        }
      },
      fail() {
        showToast();
        reject();
      }
    });
  });
}

/**
 * 页面跳转
 * @param url 待跳转的url
 */
export function redirectPage(url) {
  if (url) {
    setTimeout(() => {
      wx.removeStorageSync("redirectPage");
      wx.reLaunch({ url: url });
    }, 1000);
  }
}

/**
 * 向微信发起请求:获取用户信息
 * @param code
 * @param callback
 */
export function getUserInfo(code, callback) {
  wx.getUserInfo({
    // 获取成功，全局存储用户信息，开发者服务器登录
    success(msg) {
      postLogin(
        {
          code: code,
          rawData: msg.rawData,
          signature: msg.signature,
          encrypteData: msg.encryptedData,
          iv: msg.iv,
          phoneData: "",
          phoneIv: "",
          touristsUserId: wx.getStorageSync("userId"), // 当前游客登录人的userId
            entryType:wx.getStorageSync("environment"),//运行环境
        },
        callback
      );
    },
    // 获取失败，
    fail(err) {
      console.error(err);
      wx.hideLoading();
      showToast();
    }
  });
}

/**
 * 向微信发起请求:获取用户信息
 * @param code
 * @param callback
 */
export function getUserInfoByPromise(code) {
  return new Promise(resolve => {
    wx.getUserInfo({
      // 获取成功，全局存储用户信息，开发者服务器登录
      success: async msg => {
        let data = await postLoginByPromise({
          code: code,
          rawData: msg.rawData,
          signature: msg.signature,
          encrypteData: msg.encryptedData,
          iv: msg.iv,
          phoneData: "",
          phoneIv: "",
          touristsUserId: wx.getStorageSync("userId"), // 当前游客登录人的userId
            entryType:wx.getStorageSync("environment"),//运行环境
        });
        resolve(data);
      },
      // 获取失败，
      fail(err) {
        console.error(err);
        wx.hideLoading();
        showToast();
        resolve();
      }
    });
  });
}

/**
 * 向后端发起请求，进行登录。登录成功后调用回调函数
 * 请求参数中
 * code: 向微信登录获取的code，不能为空
 * rawData : 微信登录返回的数据，包含微信名、头像等等
 * signature : 签名
 * encrypteData : 敏感数据
 * iv :
 * touristsUserId: 游客id
 * @param params 请求参数
 * @param callback 回调函数
 */
export function postLogin(params, callback) {
    console.log(params);
  WXAJAX.POST(params, "", "/home/wxLogin")
    .then(data => {
      if (data.token) {
        wx.hideLoading();
        callback && callback(data);
      } else {
        showToast(err.message);
      }
    })
    .catch(err => {
      showToast(err.message);
    });
}

/**
 * 向后端发起请求，进行登录。登录成功后调用回调函数
 * 请求参数中
 * code: 向微信登录获取的code，不能为空
 * rawData : 微信登录返回的数据，包含微信名、头像等等
 * signature : 签名
 * encrypteData : 敏感数据
 * iv :
 * touristsUserId: 游客id
 * @param params 请求参数
 * @param callback 回调函数
 */
export function postLoginByPromise(params) {
  return new Promise(resolve => {
    WXAJAX.POST(params, "", "/home/wxLogin")
      .then(data => {
        if (data.token) {
          wx.hideLoading();
          resolve(data);
        } else {
          showToast(err.message);
          resolve();
        }
      })
      .catch(err => {
        showToast(err.message);
        resolve();
      });
  });
}

/**
 * 游客匿名登录
 * 无需任何参数，只是header中传入companyKey
 * @param callback(data) 返回的data只有userId
 */
export function postLoginByTourists(callback) {
  WXAJAX.POST({ ignore: true }, "", "/home/wxLoginTourists")
    .then(data => {
      wx.hideLoading();
      setLoginMessageInStorage(data, true);
      callback && callback(data);
    })
    .catch(err => {
      console.log("匿名登录失败：", err);
    });
}
/**
 * 游客匿名登录 Promise
 * 无需任何参数，只是header中传入companyKey
 * @param callback(data) 返回的data只有userId
 */
function postLoginPromiseByTourists() {
  return new Promise(resolve => {
    if (!error) {
      if (i !== 0 || error) {
        resolve();
        return;
      }
      i++;
    }
    WXAJAX.POST({ ignore: true }, "", "/home/wxLoginTourists")
      .then(data => {
        error = "";
        wx.hideLoading();
        setLoginMessageInStorage(data, true);
        console.log("游客登录获取到token", data);
        resolve(data);
      })
      .catch(err => {
        console.log("匿名登录失败：", err);
        error = "error";
        resolve(null);
      });
  });
}

/**
 * 返回给调用者用户是否登录
 */
function returnIsLogin() {
  let logined = false;
  // 缓存中存在 isLogin，且 isLogin=true，即为登录状态，否则为游客状态
  if (wx.getStorageSync("isLogin") === true) {
    logined = true;
  }
  return logined;
}

/**
 * 小程序端判断是否登录
 * @param callback 回调函数
 */
export function isLogin(callback) {
  if (returnIsLogin()) {
    // 如果有全局存储的登录态，暂时认为他是登录状态
    callback && callback();
  }
}

/**
 * 小程序端判断是否登录，并以 toast方式提示登录
 * @param callback 回调函数
 */
export function isLoginAndShowToast(callback) {
  if (returnIsLogin()) {
    // 如果有全局存储的登录态，暂时认为他是登录状态
    callback && callback();
  } else {
    showToast("请登录后操作");
  }
}
/**
 * 小程序端判断是否登录，如果没有登录，则弹出模态框，提示用户到个人中心中登录
 * @param callback 回调函数
 */
export function isLoginAndShowModal(callback) {
  if (returnIsLogin()) {
    // 如果有全局存储的登录态，暂时认为他是登录状态
    callback && callback();
  } else {
    // 如果没有登录态，弹窗提示一键登录
    showLoginModal();
  }
}

/**
 * 提示用户到达个人中心进行登录
 */
export function showLoginModal() {
  wx.showModal({
    title: "提示",
    content: "您还未登录，请到个人中心进行登录，登录后可获得完整体验。",
    confirmText: "确定",
    success(res) {
      // 提示用户去个人中心登录授权
      if (res.confirm) {
        wx.navigateTo({
          url: "/pages/usercenter/main"
        });
      }
    }
  });
}

/**
 * 弹框显示错误信息，默认是"用户信息获取失败"
 * @param content 错误信息内容
 */
export function showToast(content = "用户信息获取失败") {
  wx.showToast({
    title: content,
    icon: "none",
    duration: 2000
  });
}

/**
 * 设置登录状态到storage中
 * @param data 登录返回数据
 * @param tourists 是否是游客，true为游客，false为已经登录的正式用户
 */
export function setLoginMessageInStorage(data, tourists) {
  wx.setStorageSync("token", data.token);
  wx.setStorageSync("avatarUrl", data.avatarUrl);
  wx.setStorageSync("USERNAME", data.userName);
  wx.setStorageSync("phone", data.phone);
  wx.setStorageSync("userId", data.userId);
  wx.setStorageSync("roleId", data.roleId);
  wx.setStorageSync("hasCard", data.cardId ? data.cardId !== 0 : false);
  // // 不是游客
  // wx.setStorageSync("tourists", tourists);

  //不是游客，表示登录成功
  wx.setStorageSync("isLogin", !tourists);
  store.commit("set_login_status", !tourists);
  store.commit("set_user_info", {
    userName: data.userName,
    phone: data.phone,
    userId: data.userId,
    avatarUrl: data.avatarUrl
  });
  store.commit("setPhone", data.phone);
}

/**
 * 游客模拟登录
 * 请求后端，产生一个该游客的UserId，如果当前UserId在缓存中已经存在，那么不用再生成，直接使用即可
 */
export function mockTouristsLogin() {
  if (!wx.getStorageSync("userId")) {
    // 如果该游客UserId已经有值了，则不用再生成了
    postLoginByTourists();
  }
}

export default {
  login,
  loginPromise,
  getUserInfo,
  postLogin,
  isLogin,
  isLoginAndShowToast,
  isLoginAndShowModal,
  showLoginModal,
  showToast,
  returnIsLogin,
  postLoginByTourists,
  setLoginMessageInStorage,
  mockTouristsLogin,
  postLoginPromiseByTourists
};
