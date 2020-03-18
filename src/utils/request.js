import { clearLoginInfo, createBase64 } from "./index";
// import CryptoJS from 'crypto-js';
import HandleLogin from "@/utils/handleLogin";

// var baseUrl = 'http://192.168.5.25:8766/userApi';
// var baseUrl = 'https://api.youdomain.com/userApi';
// var baseUrl = 'https://192.168.5.33/userApi';
let extJSON = wx.getExtConfigSync();
let base64 = createBase64();

let { companyKey, uploadUrl, baseUrl, ossUrl } = extJSON;
var imgBackUrl = ossUrl;

baseUrl = baseUrl + "/userApi";
uploadUrl = uploadUrl + "/file/uploadObjectOSS";
let token = "";
let cacheRequestMap = new Map();
let isRefreshToken = false;
let tempToken = null;
function gettoken() {
  return wx.getStorageSync("token") || "";
}

function getcookie() {
  // var cookie = wx.getStorageSync('cookies') || '';
  return wx.getStorageSync("cookies") || "";
}
async function requestUrl(request, method, service) {
  return new Promise((resolve, reject) => {
    var contentType = "",
      url = "";
    if (method == "json") {
      contentType = "multipart/form-data";
      url = baseUrl + service;
    } else {
      contentType = "application/x-www-form-urlencoded";
      url = baseUrl + service;
    }

    let data = request;

    if (Object.keys(request).length) {
      data = {
        data: base64.encode(JSON.stringify(request))
      };
    }
    wx.request({
      url: url,
      data: data,
      method: "POST",
      header: {
        "content-type": contentType,
        token: gettoken() || token,
        companyKey: companyKey,
        cookie: "PHPSESSID=" + getcookie()
      },
      success: function(data) {
        /*
        *   SUCCESS(200,"成功"),
            ERROR(500,"系统异常"),
            FAULT_TOLERANT(501,"容错"),
            FAIL(201,"操作失败"),
            NO_LOGIN(401,"未登陆"),
            NO_ROLE(403,"无权限"),
            NO_PARAM(202,"参数缺失"),
            PARAM_CHECK(203,"参数校验失败"),
            NO_DATA(204,"无数据"),
            TEST(999999,"TEST")
        * */
        if (
          data.data.code == 200 ||
          data.data.code == 209 ||
          data.data.code == 204
        ) {
          resolve(data.data.data, data.data.code);
        } else if (data.data.code == 401) {
            console.log('sasa');
          tempToken = null;
          clearLoginInfo();
          reject(data.data);
        } else {
          reject(data.data);
          let { message } = data.data;
          message = message
            ? message === "GENERAL"
              ? "网络异常"
              : message
            : "网络异常";
          wx.showToast({
            title: message,
            duration: 2000,
            icon: "none"
          });
        }
      },
      fail: function(err) {
        console.log("fail", service, err);

        reject(err);
        wx.showToast({
          title: "网络异常",
          duration: 2000,
          icon: "none"
        });
      }
    });
  });
}
async function POST(request, method, service) {
  // let res = await interceptorRequest(service);
  // console.log("interceptorRequest", res);
  //把请求都先缓存起来,非401的请求都视为正常请求,放行,401类的请求需要缓存,等游客登录以后,再重新请求缓存起来的请求,把url试为key存起来
  cacheRequestMap.set(service, { request, method, service });
  try {
    let res = await requestUrl(request, method, service);
    cacheRequestMap.delete(service);
    return Promise.resolve(res);
  } catch (error) {
    if (error.code === 401) {
      if (!isRefreshToken && !gettoken()) {
        isRefreshToken = true;
        try {
          tempToken = await postLoginPromiseByTourists();
          let params = cacheRequestMap.get(service);
          cacheRequestMap.delete(service);
          return requestUrl(params.request, params.method, params.service).then(
            res => {
              return Promise.resolve(res);
            },
            err => {
              return Promise.reject(err);
            }
          );
        } catch (error) {
          // eslint-disable-next-line require-atomic-updates
          isRefreshToken = false;
          return Promise.reject(error);
        }
      } else if (isRefreshToken && !gettoken()) {
        //如果已经有个接口因为401的原因在请求游客登录了,那么异步发起的其他请求需要等待在这里, 一直等到游客登录有数据了,
        return await new Promise((resolve, reject) => {
          let interver = setInterval(() => {
            // if (tempToken) {
            if (gettoken()) {
              let params = cacheRequestMap.get(service);
              cacheRequestMap.delete(service);
              clearInterval(interver);
              return requestUrl(
                params.request,
                params.method,
                params.service
              ).then(
                res => {
                  resolve(res);
                },
                err => {
                  reject(err);
                }
              );
            }
          }, 500);
        });
      }

      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
}
//游客登录
async function postLoginPromiseByTourists() {
  return requestUrl({ ignore: true }, "", "/home/wxLoginTourists").then(
    res => {
      HandleLogin.setLoginMessageInStorage(res, true);
      isRefreshToken = false;
      return Promise.resolve(res);
    },
    error => {
      return Promise.reject(error);
    }
  );
}

export function GET(request, successed, failed) {
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        "content-type": "application/json", // 默认值
        token: gettoken() || token,
        companyKey: companyKey,
        cookie: "PHPSESSID=" + getcookie()
      },
      url: baseUrl,
      data: request,
      success: function(data) {
        if (data.data.code == 200 || data.data.code == 209) {
          resolve(data.data.data);
        } else if (data.data.code == 401) {
          clearLoginInfo();
        } else {
          wx.showToast({
            title: data.data.msg || "网络异常",
            duration: 2000,
            icon: "none"
          });
        }
      },
      fail: function(err) {
        reject(err);
        wx.showToast({
          title: "网络异常",
          duration: 2000,
          icon: "none"
        });
      }
    });
  });
}

export function DELETE(request, successed, service) {
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        "content-type": "application/x-www-form-urlencoded", // 默认值
        token: gettoken() || token,
        companyKey: companyKey,
        cookie: "PHPSESSID=" + getcookie()
      },
      method: "DELETE",
      url: baseUrl + service,
      data: request,
      success: function(data) {
        if (data.data.code == 200 || data.data.code == 209) {
          resolve(data.data.data);
        } else {
          wx.showToast({
            title: data.data.msg || "网络异常",
            duration: 2000,
            icon: "none"
          });
        }
      },
      fail: function(err) {
        reject(err);
        wx.showToast({
          title: "网络异常",
          duration: 2000,
          icon: "none"
        });
      }
    });
  });
}

export function UploadImage(imgPath, method, service) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: uploadUrl,
      // url: 'https://api.youdomain.com/file/uploadObjectOSS', // 仅为示例，非真实的接口地址
      // https://api.youdomain.com/file/uploadObjectOSS
      //https://192.168.1.130/file/uploadObjectOSS
      filePath: imgPath,
      name: "file",
      header: {
        "content-type": "multipart/form-data"
      },
      success(data) {
        if (data.statusCode == 200 || data.data.code == 209) {
          resolve(data.data);
        } else {
          wx.showToast({
            title: data.data.msg || "网络异常",
            duration: 2000,
            icon: "none"
          });
        }
      },
      fail(err) {
        console.log(err);
        reject(err);
        wx.showToast({
          title: "网络异常",
          duration: 2000,
          icon: "none"
        });
      }
    });
  });
}

export async function checkCollect(request, service) {
  // return new Promise((resolve, reject) => {
  //   POST(request, "", "/personal/getIsCollection").then(res => {
  //     console.log("checke");
  //   });
  // });
  let data = request;

  if (Object.keys(request).length) {
    data = {
      data: base64.encode(JSON.stringify(request))
    };
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + "/personal/getIsCollection",
      data: data,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: gettoken() || token,
        companyKey: companyKey
      },
      success: function(data) {
        /*
        *   SUCCESS(200,"成功"),
            ERROR(500,"系统异常"),
            FAULT_TOLERANT(501,"容错"),
            FAIL(201,"操作失败"),
            NO_LOGIN(401,"未登陆"),
            NO_ROLE(403,"无权限"),
            NO_PARAM(202,"参数缺失"),
            PARAM_CHECK(203,"参数校验失败"),
            NO_DATA(204,"无数据"),
            TEST(999999,"TEST")
        * */
        if (data.data.code == 200 || data.data.code == 209) {
          if (data.data.data) {
            if (data.data.data) {
              resolve({
                status: true,
                collectionId: data.data.data.collectionId
              });
            } else {
              resolve({
                status: false
              });
            }
          } else {
            resolve({
              status: false
            });
          }
        } else if (data.data.code == 401) {
          clearLoginInfo();
          // wx.removeStorageSync('token')
          // wx.showToast({
          //   title: '请登录',
          //   duration: 1000,
          //   icon: 'none'
          // });
          // setTimeout(function() {
          //   var url = '/pages/cardCase/main';
          //   wx.reLaunch({
          //     url: url
          //   });
          // }, 1000)
        } else {
          resolve({
            status: false
          });
          // console.log('data--',data);
          /*  wx.showToast({
                title: data.data.message ||  '网络异常',
                duration: 2000,
                icon: 'none'
            })*/
        }
      },
      fail: function(err) {
        reject(false);
        wx.showModal({
          title: "提示",
          content: JSON.stringify(err),
          success(res) {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
    });
  });
}

export function changeCollect(request, service) {
  let data = request;

  if (Object.keys(request).length) {
    data = {
      data: base64.encode(JSON.stringify(request))
    };
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + service,
      data: data,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: gettoken() || token,
        companyKey: companyKey,
        cookie: "PHPSESSID=" + getcookie()
      },
      success: function(data) {
        /*
        *   SUCCESS(200,"成功"),
            ERROR(500,"系统异常"),
            FAULT_TOLERANT(501,"容错"),
            FAIL(201,"操作失败"),
            NO_LOGIN(401,"未登陆"),
            NO_ROLE(403,"无权限"),
            NO_PARAM(202,"参数缺失"),
            PARAM_CHECK(203,"参数校验失败"),
            NO_DATA(204,"无数据"),
            TEST(999999,"TEST")
        * */
        if (data.data.code == 200 || data.data.code == 209) {
          resolve(true);
        } else if (data.data.code == 401) {
          clearLoginInfo();
          // // 登录改版 遇到401时，提示用户到个人中心中进行登录
          // wx.showToast({
          //     title: '请到个人中心登录后，解锁更多操作',
          //     duration: 1000,
          //     icon: 'none'
          // });
          // wx.removeStorageSync('token')
          //
          //   wx.showToast({
          //   title: '请登录',
          //   duration: 1000,
          //   icon: 'none'
          // });
          // setTimeout(function() {
          //   var url = '/pages/cardCase/main';
          //   wx.reLaunch({
          //     url: url
          //   });
          // }, 1000)
        } else {
          resolve(false);
          // console.log('data--',data);
          wx.showToast({
            title: data.data.message || "网络异常",
            duration: 2000,
            icon: "none"
          });
        }
      },
      fail: function(err) {
        resolve(true);
        wx.showModal({
          title: "提示",
          content: JSON.stringify(err),
          success(res) {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
    });
  });
}

export function ToPay(request, service) {
  let data = request;

  if (Object.keys(request).length) {
    data = {
      data: base64.encode(JSON.stringify(request))
    };
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + (service || "/orders/goPayNew"),
      data: data,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: gettoken() || token,
        companyKey: companyKey,
        cookie: "PHPSESSID=" + getcookie()
      },
      success: function(data) {
        /*
        *   SUCCESS(200,"成功"),
            ERROR(500,"系统异常"),
            FAULT_TOLERANT(501,"容错"),
            FAIL(201,"操作失败"),
            NO_LOGIN(401,"未登陆"),
            NO_ROLE(403,"无权限"),
            NO_PARAM(202,"参数缺失"),
            PARAM_CHECK(203,"参数校验失败"),
            NO_DATA(204,"无数据"),
            TEST(999999,"TEST")
        * */
        if (data.data.code == 200 || data.data.code == 209) {
          //data.data.data
          if (data.data.data) {
            let _data = data.data.data;
            wx.requestPayment({
              timeStamp: _data.timeStamp,
              nonceStr: _data.nonce_str,
              package: "prepay_id=" + _data.prepay_id,
              signType: "MD5",
              paySign: _data.paySign,
              success(res) {
                console.log(res);
                wx.showToast({
                  title: "支付成功",
                  icon: "success"
                });
                resolve(true);
                setTimeout(() => {
                  let url = "../orderLists/main?status=2";
                  wx.navigateTo({
                    url: url
                  });
                }, 800);
              },
              fail(err) {
                console.log(err);
                reject(false);
                if (err.errMsg === "requestPayment:fail cancel") {
                  wx.showToast({
                    title: "支付已取消",
                    icon: "none"
                  });
                } else {
                  wx.showToast({
                    title: "支付失败",
                    icon: "none"
                  });
                }
              }
            });
          } else {
            reject(false);
          }
        } else if (data.data.code == 401) {
          reject(false);
          wx.removeStorageSync("token");
          wx.showToast({
            title: "请登录",
            duration: 1000,
            icon: "none"
          });
          setTimeout(function() {
            var url = "/pages/cardCase/main";
            wx.reLaunch({
              url: url
            });
          }, 1000);
        } else {
          resolve(false);
          // console.log('data--',data);
          wx.showToast({
            title: data.data.message || "网络异常",
            duration: 2000,
            icon: "none"
          });
        }
      },
      fail: function(err) {
        resolve(false);
        wx.showModal({
          title: "提示",
          content: JSON.stringify(err),
          success(res) {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
    });
  });
}

/**
 * 到达消息页面，查询企业配置，消息模块是否开启。
 */
export function ToIMPage(company, type, specId) {
  isMessageCanUse(company.companyId, () => {
    wx.navigateTo({
      url:
        "/pages/IM/main?type=" +
        type +
        "&cardId=" +
        company.cardId +
        "&userId=" +
        company.userId +
        "&logo=" +
        (company.logo || "") +
        "&wxCode=" +
        (company.personalWx || "") +
        "&phone=" +
        (company.phone || "") +
        "&specId=" +
        (specId || "") +
        "&name=" +
        (company.name || "")
    });
  });

  // const companyModuleConfig = wx.getStorageSync("companyModuleConfig");
  // if(companyModuleConfig && companyModuleConfig.message === true) {
  //     showToastWithModuleIsClose();
  // } else {
  //     wx.navigateTo({
  //         url: '/pages/IM/main?type=' + type +
  //             '&cardId=' + company.cardId +
  //             '&userId=' + company.userId +
  //             '&logo=' + (company.logo || '') +
  //             '&wxCode=' + (company.personalWx || '') +
  //             '&phone=' + (company.phone || '') +
  //             '&specId=' + (specId || '') +
  //             '&name=' + (company.name || '')
  //     });
  // }
}

/**
 * 到达消息列表页面，查询企业配置，消息模块是否开启。
 */
export function ToMSGPage(companyId) {
  isMessageCanUse(companyId, () => {
    wx.navigateTo({ url: "/pages/msg/main" });
  });
}

/**
 * 当前企业的 咨询模块是否能使用
 */
export function isMessageCanUse(companyId, callback) {
  POST(
    {
      companyId: companyId
    },
    "",
    "/companyModuleConfig/findCompanyModuleConfigs"
  )
    .then(data => {
      if (data && data.message === true) {
        // 关闭了不能使用
        showToastWithModuleIsClose();
      } else {
        callback && callback();
      }
    })
    .catch(err => {});
}

/**
 * 功能未开放的模态框提示
 */
export function showToastWithModuleIsClose() {
  wx.showToast({
    title: "该功能暂时未开放",
    duration: 2000,
    icon: "none"
  });
}

/**
 * 暂时不使用
 *
 * 获取企业模块的配置信息
 * 将获取到的企业模块配置放入本地缓存中
 * @param companyId 企业id
 */
export function findCompanyModuleConfig(companyId) {
  this.POST(
    {
      companyId: companyId
    },
    "",
    "/companyModuleConfig/findCompanyModuleConfigs"
  )
    .then(data => {
      let config = initCompanyModuleConfig();
      if (data) {
        data.forEach(function(i, k) {
          config[i.moduleName] = i.close;
        });
      }
      let CompanyModuleConfig = wx.getStorageSync("companyModuleConfig");
      if (CompanyModuleConfig === undefined) {
        CompanyModuleConfig = {
          companyId: companyId
        };
      }
      CompanyModuleConfig.config = config;

      wx.setStorageSync("companyModuleConfig", CompanyModuleConfig);
    })
    .catch(err => {});
}

/**
 * 企业模块配置初始化
 * false表示没有关闭，也就是开启状态
 * message：IM咨询消息
 * @returns {{message: boolean}}
 */
export function initCompanyModuleConfig() {
  return {
    message: false
  };
}

async function interceptorRequest(url) {
  if (url !== "/home/wxLoginTourists") {
    if (
      wx.getStorageSync("isLogin") ||
      wx.getStorageSync("isLogin") === false
    ) {
      // 缓存中有isLogin，则已经登录过了，不管是匿名还是授权登录
      return;
    } else {
      // 缓存中没有isLogin，则没有进行过任何登录，是首次访问
      let res = await HandleLogin.postLoginPromiseByTourists();
      console.log("else", res);
      return res;
    }
  }
}

export default {
  POST,
  GET,
  DELETE,
  UploadImage,
  imgBackUrl,
  checkCollect,
  changeCollect,
  ToPay,
  ToIMPage,
  ToMSGPage
};
