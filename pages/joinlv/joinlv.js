// pages/rank/rank.js
const config = require('../../config.js')
const wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rankList:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '团队参与率',
        })
        this.getJoinLv();
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let that = this;
        return {
            title: '快来加入我们团队吧',
            path: '/pages/index/index',
            success: function () {
                wx.showToast({
                    title: "分享成功",
                    icon: 'none',
                    duration: 2000
                });
            },
            fail: function (data) {
                console.log(data)
            }
        }    
    },
    getJoinLv:function(){
        wx.showLoading({
            title: "加载中",
            mask: true,
        });
        var that = this;
        wx.request({
            url: config.service.requestUrl,
            data: {
                a: 'getJoinLv',
            },
            success: function (res) {
                var o = app.strToJson(res)
                that.setData({
                    rankList: o.data
                })
                setTimeout(function () {
                    wx.hideLoading()
                }, 500)
            }
        })
    }
})