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
    comments_published: [], // 发布的评论
    nums_movies: null,
    list_movies: null, // 为了获取发布评论的封面和电影标题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoviesNums() // 放在检查登陆外面
    // this.getUserInfo() // 问题：为什么不用再额外声明了？

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
        console.log(comments)
      }
    })
  },

  // 获取所有电影的个数
  getMoviesNums() {
    wx.request({
      url: config.service.moviesUrl,
      success: ({ data }) => {
        this.setData({
          nums_movies: data.data.length,
          list_movies: data.data
        })
        console.log(data.data)
      },
    })
  },

  // 获取已发布影评的函数
  // getPublished() {
  //   this.getCommentsPublished()
  //   console.log(this.data.comments_published)
  //   // 改进：然后筛选出其中openid为当前登录用户的评论，作为comments_published列表供user.wxml调用
  // },

  // 获得评论列表函数
  getPublished(options) {
    console.log(this.data.nums_movies)
    console.log(this.data.userInfo.openId)
    let openId = this.data.userInfo.openId

    console.log(this.data.list_movies)
    const { list_movies } = this.data
    console.log(list_movies)

    // 循环获取所有电影的评论
    let comments_published = []

    for (let i = 1; i < this.data.nums_movies+1; i++) {
      qcloud.request({
        url: config.service.getComments(i),
        success: ({ data }) => {
          console.log(data.data)
          // const comments_published = []
          for (let j = 0; j < data.data.length; j++) {
            if (openId == data.data[j].open_id) { // 判定为当前登录用户的已发布评论
              console.log('正在取出一条已发布评论。')
              comments_published.push({
                ...data.data[j],
                user_info: JSON.parse(data.data[j].user_info),
                // from movie_id to cover and title
                cover: list_movies[data.data[j].movie_id-1].cover,
                title: list_movies[data.data[j].movie_id-1].title,
              })
            console.log(comments_published)
            this.setData({ comments_published })
          }
          }}})}

          // data.data.forEach(comment_published => {
          //   if (openId == data.data[j].open_id) {
          //     comments_published.push({
          //       ...comment_published,
          //       user_info: JSON.parse(comment_published.user_info)
          //     })            
          // }})}})}        

    
    // console.log(this.data.comments_published)

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