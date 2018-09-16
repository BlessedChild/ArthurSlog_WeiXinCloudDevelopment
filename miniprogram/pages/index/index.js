// index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false, // 用来判断用户是否已经授权过了
    fileID: '',
    cloudPath: '',
    imagePath: '',
    openid: '',
    sumResult: '',
    page_iq: '',
    user_nickName: '',
    user_dbFlag: false,
  },

  // 小程序页面打开时，默认执行的函数
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    const this_ = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                user_nickName: res.userInfo.nickName,
                logged: true,
                user_dbFlag: true
              })
              app.globalData.logged = true
              app.globalData.user_dbFlag = true
              app.globalData.openid = res.userInfo.openid

              const db = wx.cloud.database()
              const _ = db.command
              // 读取用户数据，并渲染在页面上
              db.collection('Users').where({
                _openid: _.eq(app.globalData.openid)// 填入当前用户 openid
              }).get().then(res => {
                console.log(res.data)
                if (res.data != null) {
                  // 如果用户存在数据
                  // 拉取用户的IQ数据
                  this_.setData({
                    page_iq: res.data[0].IQ,
                    user_dbFlag: true
                  })
                } else {
                  console.log("拉取云端数据出错")
                }
              })
            }
          })
        }
      }
    })
  },
  // 查询数据库，获取当前用户数据
  // 修改数据库信息，更新当前用户数据
  arthurSlog_readingBook: function() {
    const this_ = this
    // 验证是否已经授权
    if (app.globalData.logged) {
      // 验证云端是否存在用户数据
      const db = wx.cloud.database()
      const _ = db.command
      // 读取用户数据，并渲染在页面上
      db.collection('Users').where({
        _openid: _.eq(app.globalData.openid) // 填入当前用户 openid
      }).get().then(res => {
        console.log("查询数据库")
        if (!res.data) {
          console.log("云端数据库没有返回数据")
          console.log("用户在数据库没有数据，现在为用户创建数据库")
          // 创建用户数据
          db.collection('Users').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                userName: app.globalData.user_nickName,
                userDate: db.serverDate(),
                IQ: '10'
              }
            })
            .then(res => {
              console.log("用户数据创建成功")
              console.log(res)
            }).catch(console.error)

          app.globalData.user_dbFlag = true
        } else if (res.data) {
          console.log("云端数据库成功返回数据")
          console.log('更新数据库')
          console.log('当前的全局_id值是： ' + app.globalData._id)
          app.globalData.IQ = res.data[0].IQ
          // 如果该用户有数据
          // 页面上IQ的值加1
          // 数据库IQ的值加1
          db.collection('Users').doc(app.globalData.id).update({
            data: {
              IQ: _.inc(1)
            }
          }).then(res => {
            console.log('成功更新数据库')
            console.log(res)
            this_.setData({
              page_iq: ++app.globalData.IQ
            })
          })
        }
      })
    } else if (!app.globalData.logged) {
      // 弹出提示框，显示“请点击头像授权”
      wx.showToast({
        icon: 'none',
        title: '请先点击左上角允许授权',
      })
    }
  },
  // 点击弹出“微信授权” 窗口
  // 用户点击“允许”，允许开发者获得用户的公开信息（昵称、头像等）
  onGetUserInfo: function(e) {
    const this_ = this
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        user_nickName: e.detail.userInfo.nickName
      })
      app.globalData.openid = e.detail.userInfo.openId
      // 需要先获得用户信息才能查询数据库
      // 验证云端是否存在用户数据
      const db = wx.cloud.database()
      // 读取用户数据，并渲染在页面上
      db.collection('Users').where({
        _openid: app.globalData.openid // 填入当前用户 openid
      }).get().then(res => {
        if (res.data[0] != null) {
          // 如果用户存在数据
          // 拉取用户的IQ数据
          this_.setData({
            page_iq: res.data[0].IQ,
            user_dbFlag: true
          })
        } else {
          // 创建用户数据
          db.collection('Users').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                userName: app.globalData.user_nickName,
                userDate: db.serverDate(),
                IQ: 10,
                id: app.globalData.openid
              }
            })
            .then(res => {
                this_.setData({
                  page_iq: '10',
                  user_dbFlag: true
                })
              // 添加新表成功之后，打印数据库的新用户信息
              console.log(res)
              app.globalData._id = res._id
            })

          this_.setData({
            user_dbFlag: true
          })
        }
      })
      app.globalData.logged = true
    }
  },
  // 添加前端代码，向后端服务发起 名为”arthurSlog_getInfo“方法的请求
  // 请求的结果会返回，并保存再 res对象中
  // 这里我们把结果在控制台打印出来
  // 返回appId 和 openId的数据，并保存在res对象中
  arthurSlog_getInfo: function() {
    const this_ = this
    wx.cloud.callFunction({
      name: 'arthurSlog_getInfo',
      complete: res => {
        console.log('callFunction test result: ', res)
        this_.setData({
          openid: res.result.openId
        })
        app.globalData.openid = res.result.openId
      }
    })
  },
  // 添加前端代码，向后端服务发起 名为”arthurSlog_methodAdd“方法的请求
  // 请求的结果会返回，并保存再 res对象中
  // 这里我们把结果在控制台打印出来
  // 返回appId 和 openId的数据，并保存在res对象中
  arthurSlog_methodAdd: function() {
    const this_ = this
    wx.cloud.callFunction({
        // 云函数名称
        name: 'arthurSlog_methodAdd',
        // 传给云函数的参数
        data: {
          a: 8,
          b: 8,
        },
      })
      .then(res => {
        console.log(res.result)
        this_.setData({
          sumResult: res.result.sum
        })
      })
      .catch(console.error)
  },
  // 添加前端代码,向云端上传图片
  arthurSlog_uploadImg: function() {
    // 选择图片
    const this_ = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths

        wx.showLoading({
          title: '上传中',
        })

        this_.setData({
          imagePath: tempFilePaths[0],
        })

        console.log(tempFilePaths[0])

        const filePath = tempFilePaths[0]
        const cloudPath = 'ArthurSlog' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath, // 小程序临时文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID) //success返回的fileID值    
          console.log(res.statusCode) //success返回的statusCode值
        }).catch(error => {
          // handle error
          console.error('[上传文件] 失败：', error)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        }).then(() => {
          wx.hideLoading()
        })
      }
    })
  },
})