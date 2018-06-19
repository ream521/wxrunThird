//app.js
const config = require('./config.js')
App({
    onLaunch: function () {
        var that = this;
        wx.checkSession({
            success: function () {
                // that.login();//session_key 未过期，并且在本生命周期一直有效
            },
            fail: function () {
                // session_key 已经失效，需要重新执行登录流程
                that.login(); //重新登录
            }
        })
    },
    //登陆
    login:function(){
        let that = this;
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
                            
                            var oo = that.strToJson(o)
                            
                            // console.log(oo)
                            wx.setStorageSync('sessionKey', oo.sessionKey);
                            wx.setStorageSync('openid', oo.openid);
                            that.globalData.openid = oo.openid;
                        }
                    })
                }
            },
        })
    },
    strToJson:function(o){
        let oo;
        if (wx.getStorageSync('platform') == 'devtools' || wx.getStorageSync('platform') == 'ios') {
            oo = o.data;//工具用
        } else {
            // console.log(o)
            oo = JSON.parse(o.data.trim());//线上用
        }
        return oo;
    },
    globalData: {
        userInfo: null,
        openid:'',
    }
})