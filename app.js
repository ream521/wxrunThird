//app.js
const config = require('./config.js')
App({
    onLaunch: function () {
        var that = this;
        wx.checkSession({
            success: function () {
                that.login();//session_key 未过期，并且在本生命周期一直有效
            },
            fail: function () {
                // session_key 已经失效，需要重新执行登录流程
                that.login(); //重新登录
            }
        })
    },
    //登陆
    login:function(){
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    wx.request({
                        url: config.service.requestUrl,
                        data: {
                            a: 'getSessionKey',
                            code: res.code,
                        },
                        dataType: "json",
                        success: function (o) {
                            //console.log(o)
                            wx.setStorageSync('sessionKey', o.data.sessionKey);
                            wx.setStorageSync('openid', o.data.openid);
                        }
                    })
                }
            },
        })
    },
    
    globalData: {
        userInfo: null,
    }
})