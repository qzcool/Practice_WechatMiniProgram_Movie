// pages/detail/detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: null,
    comments:null,
    userInfo:null,
    // user_openId:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id

    qcloud.request({
      url: config.service.movieDetailUrl + id,
      success: ({ data }) => {
        console.log(data)
        const movie = {
          ...data.data
        }
        this.setData({ movie })
      }
    })
    // console.log(id)
    this.getComments()
    this.getUserInfo()
  },

  handleAddComment() {
    const { movie } = this.data
    const { comments } = this.data
    const { userInfo} = this.data

    console.log(comments)
    console.log(movie)
    console.log(userInfo)

    // 登陆检查
    if (app.login() != 'success') { //userInfo
      console.log('您尚未登陆。')
      wx.showToast({
        title: '您尚未登陆。',
      })
      wx.switchTab({
        url: '/pages/user/user',
      })
    }

    // 检查用户是否已经评论过该电影
    let reviewed = false
    // let comments = this.data.comments
    let review = {}
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].open_id == userInfo.userInfo.openId) {
        review = comments[i]
        reviewed = true
        break
      } 
    }
    if (reviewed) {//评论过 跳转到影评详情页面
      wx.showToast({
        title: '您已评论过该电影。'
      })
      console.log('您已评论过该电影。')
      wx.navigateTo({
        url: '/pages/comment/comment?id=' + review.id,
      })
    } 
    else {// 添加影评
      wx.showActionSheet({
        itemList: ['文字', '音频'],
        success: (res) => {
          wx.setStorage({
            key: 'movie',
            data: movie,
            success: () => {
              wx.navigateTo({
                url: `/pages/add-comment/add-comment?type=${res.tapIndex}`
              })
            }
          })
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  

  // 获得评论列表函数
  getComments(callback, options) {
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
        this.setData({ comments })
        console.log(comments)
      },
      complete: () => {
        typeof callback === 'function' && callback()
      }
    })
  },

  getUserInfo() {
    app.getUserInfo({
      success: (userInfo) => {
        this.setData({ userInfo: userInfo })
        console.log(this.data.userInfo)
      }
    })
  },

  handleShowComments() {
    wx.navigateTo({
      url: `/pages/comments/comments?id=${this.data.movie.id}`
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