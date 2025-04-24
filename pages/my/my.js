// my.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    recordCount: 0,
    hasUserInfo: false,
    remindEnabled: false
  },
  
  onLoad: function(options) {
    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    }
    
    // 获取本地存储的设置
    const remindEnabled = wx.getStorageSync('remindEnabled') || false;
    this.setData({
      remindEnabled: remindEnabled
    });
  },
  
  onShow: function() {
    // 获取记录数量
    const records = app.getMoodRecords();
    this.setData({
      recordCount: records.length
    });
  },
  
  // 获取用户信息
  getUserProfile: function() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  },
  
  // 切换提醒功能
  toggleRemind: function(e) {
    const remindEnabled = e.detail.value;
    this.setData({
      remindEnabled: remindEnabled
    });
    wx.setStorageSync('remindEnabled', remindEnabled);
    
    if (remindEnabled) {
      wx.showToast({
        title: '已开启提醒',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '已关闭提醒',
        icon: 'none'
      });
    }
  },
  
  // 清除数据
  clearData: function() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有心情记录吗？此操作不可恢复',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          // 清除所有记录
          app.globalData.moodRecords = [];
          wx.setStorageSync('moodRecords', []);
          
          this.setData({
            recordCount: 0
          });
          
          wx.showToast({
            title: '数据已清除',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 关于我们
  showAbout: function() {
    wx.showModal({
      title: '关于我们',
      content: '每日心情记录小程序旨在帮助用户记录每日的心情状态，促进自我认知和情绪管理。\n\n版本: 1.0.0',
      showCancel: false
    });
  },
  
  // 意见反馈
  feedback: function() {
    wx.showToast({
      title: '感谢您的反馈',
      icon: 'success'
    });
  }
}) 