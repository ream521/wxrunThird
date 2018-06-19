//index.js
//获取应用实例
const app = getApp()
const config = require('../../config.js')

Page({
    data: {
        wxrun: "0",
        openid: null,
        mymodal: false,
        ads: null,
        big_img: '',
        yibiaopan: false,
        isIos:false,
        show:false,
        objectMultiArray: null,
        index:0,
        //multiIndex: [0, 0],
        realname:'',
        phone:'',
        auth:false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        opData:null,
    },
    bindMultiPickerColumnChange: function (e) {
        // console.log(e)
        let that = this;
        that.setData({
            index: e.detail.value
        })
        
        // var data = {
        //     objectMultiArray: this.data.objectMultiArray,
        //     multiIndex: this.data.multiIndex
        // };
        // data.multiIndex[e.detail.column] = e.detail.value;
        // if (e.detail.column == 0){
        //     wx.request({
        //         url: config.service.requestUrl,
        //         data: {
        //             a: 'selectTeam',
        //             pid: data.objectMultiArray[0][e.detail.value]['id'],
        //         },
        //         success: function (res) {
        //             data.objectMultiArray[1] = res.data.data
        //             data.multiIndex[1] = 0
        //             that.setData(data);
        //         }
        //     })
        // }
        // that.setData(data);
    },
    //验证姓名
    checkrealname: function (e) {
        let that = this;
        if (e.detail.value == '') {
            wx.showToast({
                title: '姓名不能为空',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        that.setData({
            realname: e.detail.value
        })
    },
    checkphone: function (e) {
        let that = this;
        if (e.detail.value == '') {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        that.setData({
            phone: e.detail.value
        })
    },
    //提交
    formSubmit: function (e) {
        let that = this;
        if (that.data.index == 0) {
            wx.showToast({
                title: '请选择公司',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (that.data.realname == '') {
            wx.showToast({
                title: '姓名不能为空',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (that.data.phone == '') {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        wx.request({
            url: config.service.requestUrl,
            data: {
                a: 'joinTeam',
                tm_id: that.data.objectMultiArray[that.data.index]['id'],
                realname:that.data.realname,
                phone:that.data.phone,
                openid:wx.getStorageSync('openid')
            },
            success: function (res) {
                // console.log(res)
                let o = app.strToJson(res);
                wx.showToast({
                    title: o.msg,
                    icon: 'none',
                    duration: 2000
                })
                if (o.code == 'ok'){
                    that.closeForm();
                }
            }
        })
    },
    //关闭modal
    closeForm: function () {
        this.setData({
            show: false,
            yibiaopan: false,
        })
    },
    onLoad: function (option) {
        var that = this;

        wx.setNavigationBarTitle({ title: '微信运动' })
        wx.getSystemInfo({
            success: function (res) {
                wx.setStorageSync('platform', res.platform);
                wx.setStorageSync('screenWidth', res.screenWidth);
            }
        })
        // if (app.globalData.userInfo) {
        //     console.log(1)
        //     // console.log(app.globalData.userInfo)
        //     that.insertUser(app.globalData.userInfo);
        // } else if (this.data.canIUse) {
        //     console.log(2)
        //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //     // 所以此处加入 callback 以防止这种情况
        //     app.userInfoReadyCallback = res => {
        //         that.insertUser(res.userInfo);
        //     }
        // } else {
        //     console.log(3)
        //     // 在没有 open-type=getUserInfo 版本的兼容处理
        //     wx.getUserInfo({
        //         success: res => {
        //             app.globalData.userInfo = res.userInfo;
        //             that.insertUser(res.userInfo);
        //         }
        //     })
        // }
        //获取广告
        that.getAds();
        that.setData({
            opData:option,
        })
    },
    onReady: function (e) {
        //获取微信运动步数
        var that = this;
        that.getUid();
        that.getWxRunStep();

    },
    //关联索取和赠送
    linkGiftLog(option) {
        
        var that = this;
        wx.request({
            url: config.service.requestUrl,
            data: { 
                a: 'linkGiftLog', 
                uid: wx.getStorageSync('uid'), 
                fromid: option.uid, 
                logtype: option.logtype, 
                rid: option.rid, 
                keyword: option.keyword 
            },
            success: function (res) {
                var oo = app.strToJson(res);
                if (oo.data.code == 'ok' && oo.data.logtype == '1') {
                    wx.showToast({
                        title: option.keyword + '字存入账号',
                        icon: 'success',
                        image: '',
                        duration: 2000
                    })
                }
            }
        })
    },
    getUid:function(){
        var that = this;
        wx.request({
            url: config.service.requestUrl,
            data: {
                a: 'getUid',
                openid: wx.getStorageSync('openid'), 
            },
            success: function (res) {
                var oo = app.strToJson(res);
                if(oo.data.uid == 0){
                    that.setData({
                        auth:true,
                    })
                }else{
                    wx.setStorageSync('uid', oo.data.uid);
                    if (that.data.opData.uid != undefined && that.data.opData.logtype != undefined && that.data.opData.rid != undefined && that.data.opData.keyword != undefined) {
                        //索取或赠送
                        that.linkGiftLog(that.data.opData);//关联索取和赠送
                    }

                }
            }
        })
    },
    //获取微信运动步数
    getWxRunStep: function () {
        //微信步数 
        var that = this;
        wx.getWeRunData({
            success(res) {
                // console.log(res)
                wx.request({
                    url: config.service.requestUrl,
                    data: {
                        a:'wxDecode',
                        encryptedData: res.encryptedData,
                        iv: res.iv,
                        sessionKey: wx.getStorageSync('sessionKey'),
                        openid: wx.getStorageSync('openid')
                    },
                    success: function (o) {
                        console.log(o)
                        if (o.data != ''){
                            var oo = app.strToJson(o);
                            if (wx.getStorageSync('platform') == 'devtools' || wx.getStorageSync('platform') == 'ios') {
                                
                                that.setData({
                                    isIos: true,
                                    yibiaopan: true,
                                })
                            } 
                            // console.log(oo)
                            //获取当天的步数
                            if (oo.stepInfoList[30] != undefined){
                                wx.setStorageSync('wx_step', oo.stepInfoList[30].step);
                                wx.setStorageSync('wx_steplist', oo.stepInfoList);

                                that.setData({
                                    wxrun: oo.stepInfoList[30].step
                                });
                                that.canvasArc();
                                that.syncStep(oo.stepInfoList);
                                that.getFuZi(oo.stepInfoList[30].step);
                            }else{
                                wx.showToast({
                                    title: '获取步数失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        }else{
                            wx.showToast({
                                title: '获取步数失败',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    }
                })
            },
            fail(ret){
                console.log(ret)
                wx.showToast({
                    title: ret.errMsg,
                    icon:'none',
                    duration: 2000
                })
            }
        })
    },
    //获取福字
    getFuZi: function (step) {
        var that = this;
        
        wx.request({
            url: config.service.requestUrl,
            data: { 
                a: 'getRandChar', 
                rid: wx.getStorageSync('zi_rid'), 
                openid: wx.getStorageSync('openid'),
                step: step 
            },
            success: function (res) {
                // console.log(res)
                if (res.data.code == 'ok') {
                    var imgs = res.data.data;
                    if (imgs.length != 0) {
                        that.setData({
                            mymodal: true,
                            big_img: imgs[0]['img'],
                            yibiaopan: true,
                        })
                        imgs.shift();
                        wx.setStorageSync('fuzi', imgs)
                    }
                }
            }
        })
    },
    //获取广告
    getAds: function () {
        var that = this;
        wx.request({
            url: config.service.requestUrl,
            data: { a: 'getAds' },
            success: function (res) {
                // console.log(res)
                var oo = app.strToJson(res);
                wx.setStorageSync('zi_rid', oo[0].rid);
                that.setData({
                    ads: oo,
                })
            }
        })
    },
    //刻画仪表盘
    canvasArc: function () {
        // 使用 wx.createContext 获取绘图上下文 context
        var context = wx.createCanvasContext('firstCanvas');
        var step = wx.getStorageSync('wx_step');
        if (wx.getStorageSync('wx_step') == undefined){
            step = 0;
        }
        var end = (step / 20000 * 1.4 * Math.PI) + 0.8 * Math.PI;


        context.beginPath()//开始画白色的底
        context.arc(150, 120, 100, 0.8 * Math.PI, 2.2 * Math.PI, false)
        context.setStrokeStyle("#ffffff")
        context.setLineWidth(10)
        context.stroke()

        context.beginPath()//开始画进度
        context.arc(150, 120, 100, 0.8 * Math.PI, end, false)
        context.setStrokeStyle("#12B0DF")
        context.setLineWidth(10)
        context.stroke()

        context.draw()
    },

    //捐步
    giveStep: function () {
        var that = this;

        this.setData({
            mymodal: true,
        })
    },
    //获取步数
    getStep: function () {

        this.setData({
            wxrun: wx.getStorageSync('wx_step')
        })
    },
    //跳转
    redirectTo: function (e) {
        // console.log(e);
        let that = this;
        wx.request({
            url: config.service.requestUrl,
            data: { a: 'isrank', openid: wx.getStorageSync('openid') },
            success: function (res) {
                let o = app.strToJson(res)
                if (o.code == 'ok') {
                    wx.navigateTo({
                        url: e.target.dataset.link,
                    })
                } else if (o.code == 'no1') {

                    that.setData({
                        show: true,
                        yibiaopan: true,
                        objectMultiArray: o.data,
                    })
                } else {
                    wx.showToast({
                        title: o.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    //转发
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮,关闭分享
            this.cancel();
        }
        return {
            title: '天津物产健步行',
            path: '/pages/index/index',
            imageUrl: config.service.imageUrl +"wx_share.jpg",
            success: function (res) {
                // 转发成功
                //console.log('转发成功');
                wx.showToast({
                    title: '转发成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function (res) {
                // 转发失败
                console.log('转发失败');
            }
        }
    },
    //关闭modal框
    cancel: function () {
        var imgs = wx.getStorageSync('fuzi');
        //console.log(imgs);
        if (imgs.length == 0) {
            this.setData({
                mymodal: false,
                yibiaopan: false,
            })

        } else {
            this.setData({
                big_img: imgs[0]['img'],
            })
            imgs.shift();
            wx.setStorageSync('fuzi', imgs);
        }

    },
    //关闭ios提示
    close:function(){
        this.setData({
            isIos:false,
            yibiaopan: false,
        })
    },
    //置顶小程序
    setTopBarText: function () {
        wx.setTopBarText({
            text: '微信运动',
            success: function () {
                //console.log('置顶成功')
                wx.showToast({
                    title: '置顶成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function () {
                console.log('置顶失败')
            }
        })
    },
    
    //同步步数
    syncStep(step){
        //console.log(step)
        wx.request({
            url: config.service.requestUrl,
            data: { a: 'syncStep', openid: wx.getStorageSync('openid'), step: JSON.stringify(step) },
            success: function (res) {
                // console.log(res)
            }
        })
    },
    //跳转到排行榜页面
    personRank: function () {
        let that = this;
        wx.request({
            url: config.service.requestUrl,
            data: { a: 'isrank', openid: wx.getStorageSync('openid') },
            success: function (res) {
                let o = app.strToJson(res)
                if (o.code == 'ok') {
                    wx.navigateTo({
                        url: '../rank/rank?cid=1',
                    })
                } else if (o.code == 'no1') {

                    that.setData({
                        show: true,
                        yibiaopan: true,
                        objectMultiArray: o.data,
                    })
                } else {
                    wx.showToast({
                        title: o.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
        
    },
   
    //跳转到排行榜页面
    teamRank: function () {
        let that = this;
        wx.request({
            url: config.service.requestUrl,
            data: { a: 'isrank',openid: wx.getStorageSync('openid')},
            success: function (res) {
                let o = app.strToJson(res)
                if (o.code == 'ok') {
                    wx.navigateTo({
                        url: '../rank/rank?cid=2&istm=' + o.data,
                    })
                } else if (o.code == 'no1'){
                    
                    that.setData({
                        show:true,
                        yibiaopan: true,
                        objectMultiArray: o.data,
                    })
                } else {
                    wx.showToast({
                        title: o.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    //获取用户信息
    getUserInfo:function(e){

        this.insertUser(e.detail.userInfo);
    },
    //用户信息入库
    insertUser: function (user) {
        var that = this;
        wx.request({
            url: config.service.requestUrl,
            data: { 
                a: 'insertUser', 
                openid: wx.getStorageSync('openid'),
                avatar: user.avatarUrl,
                nickname: user.nickName
            },
            success: function (res) {
                let oo = app.strToJson(res);
                that.getUid();
                if(oo.code == 'ok'){
                    that.setData({
                        auth:false,
                    })
                }
            }
        })
    }, 
    //参与率
    catJoinLv:function(){
        var that = this;
        wx.navigateTo({
            url: '../joinlv/joinlv',
        })
    }
    
})
