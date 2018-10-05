// pages/user/user.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    comments: [], // 收藏的评论
    comments_published: [] // 发布的评论
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkSession({
      success: (userInfo) => {
        this.setData(userInfo)
        this.getFavorites()
        this.getPublished()
      }
    })
  },

  getUserInfo() {
    app.login({
      success: (userInfo) => {
        this.setData(userInfo)
      }
    })
  },

  // 获取已收藏影评的函数
  getFavorites() {
    qcloud.request({
      url: config.service.getFavorites(),
      success: ({ data }) => {
        const comments = []
        data.data.forEach(comment => {
          comments.push({
            ...comment,
            user_info: JSON.parse(comment.user_info)
          })
        })
        this.setData({ comments })
      }
    })
  },

  // 获取已发布影评的函数
  getPublished() {
    this.getCommentsPublished()
    console.log(this.data.comments_published)
    // 改进：然后筛选出其中openid为当前登录用户的评论，作为comments_published列表供user.wxml调用
  },

  // 获得评论列表函数
  /// 改进：将此函数移动到app.js中；将用户ID的筛选判定提前到forEach中的可能性
  getCommentsPublished(callback, options) {
    const { id } = this.options

    qcloud.request({
      url: config.service.getComments(id),
      success: ({ data }) => {
        const comments = []
        data.data.forEach(comment => {
          comments.push({
            ...comment,
            user_info: JSON.parse(comment.user_info)
          })
        })
        this.setData({ comments_published }) // 要抽象出来作为母函数参数
        console.log(comments_published)
      },
      complete: () => {
        typeof callback === 'function' && callback()
      }
    })
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
  
  }
})