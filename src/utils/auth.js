/**
 4230	67	咨询回复通知	2272	VUnzc61ALyd9-v6IBhJ4aGcDDdu-GnDaNUIMwuX7eKo	USER	pages/msg/main?goType=1	2020-03-30 09:49:53	1
 4254	67	订单状态变动通知	2205	RtEq8-0sQ9DcdbTySul4OxauEgePdvadZIAwE38_s74	USER	pages/orderLists/main?goType=1	2020-01-16 00:11:09	2
 4255	67	新评论回复通知	2578	yfM7vkIIg8W8XDeV-ghNoqc6FbvtHl2BpaVB-hBAvGg	USER	pages/Dynamic/main?goType=1	2020-01-16 00:11:09	2
 4256	67	未读私信通知	1076	GTUduzRzt6Ozkv2Pr5t4I2BoGnihsL9CzIiS3P5QxLo	USER	pages/msg/main?goType=1	2020-01-16 00:11:10	2
 * 订阅消息授权 消息部分
 */
export function authSubscribeMessage(subs) {
    console.log(subs)
    //订阅授权 信息相关
    wx.requestSubscribeMessage({
        tmplIds:filterMessage(subs),
        success(res) {
            console.log(res)
        },
        fail(error) {
            console.log("authSubscribeMessage_error:" + JSON.stringify(error))
        }
    })
}

/**
 * 消息
 * @param {Object} subs
 */
function filterMessage(subs){
    if(subs){
        const sub = new Array();
        subs.forEach(s =>{
            if(s.code == 2272 || s.code == 1076  ){
                sub.push(s.value);
            }
        })
        console.log(sub,'sss');
        return sub;
    }
    return [];
}


/**
 * 订阅消息授权 订单部分
 */
export function authSubscribeOrder(subs) {
    console.log(subs)
    wx.requestSubscribeMessage({
        tmplIds:filterOrder(subs),
        success(res) {
            console.log(res)
        },
        fail(error) {
            console.log("authSubscribeOrder_error:" + JSON.stringify(error))
        }
    })
}

/**
 * 订单
 * @param {Object} subs
 */
function filterOrder(subs){
    if(subs){
        const sub = new Array();
        subs.forEach(s =>{
            if(s.code == 2206){
                sub.push(s.value);
            }
        })
        console.log(sub,'sasas');
        return sub;
    }
    return [];
}
/**
 * 新评论回复通知
 */
export function authSubscribeComment(subs) {
    wx.requestSubscribeMessage({
        tmplIds:filterComment(subs),
        success(res) {
            console.log(res)
        },
        fail(error) {
            console.log("authSubscribeComment_error:" + error)
        }
    })
}
/**
 * 评论
 * @param {Object} subs
 */
function filterComment(subs){
    if(subs){
        const sub = new Array();
        subs.forEach(s =>{
            if(s.code == 2578   ){
                sub.push(s.value);
            }
        })
        console.log(sub,'aaa');
        return sub;
    }
    return [];
}

/**
 * 新订单回复通知
 */
export function authSubscribeOrder2(subs) {
    wx.requestSubscribeMessage({
        tmplIds:filterOrder2(subs),
        success(res) {
            console.log(res)
        },
        fail(error) {
            console.log("authSubscribeComment_error:" + error)
        }
    })
}
/**
 * 新订单
 * @param {Object} subs
 */
function filterOrder2(subs){
    if(subs){
        const sub = new Array();
        subs.forEach(s =>{
            if(s.code == 3520   ){
                sub.push(s.value);
            }
        })
        console.log(sub,'aaa');
        return sub;
    }
    return [];
}
