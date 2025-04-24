const app = getApp();

Page({
  data: {
    currentDate: '',
    todayMood: null,
    moodList: [],
    recentRecords: []
  },
  
  onLoad: function(options) {
    this.setData({
      moodList: app.globalData.moodList,
      currentDate: this.formatDate(new Date())
    });
    this.loadTodayMood();
    this.loadRecentRecords();
  },
  
  onShow: function() {
    this.loadTodayMood();
    this.loadRecentRecords();
  },
  
  // 加载今日心情记录
  loadTodayMood: function() {
    const records = app.getMoodRecords();
    if (records && records.length > 0) {
      const today = this.formatDate(new Date());
      // 查找今天的记录
      const todayRecord = records.find(item => item.date.split(' ')[0] === today);
      if (todayRecord) {
        this.setData({
          todayMood: todayRecord
        });
      }
    }
  },
  
  // 加载最近的记录
  loadRecentRecords: function() {
    const records = app.getMoodRecords();
    this.setData({
      recentRecords: records.slice(0, 5) // 获取最近5条记录
    });
  },
  
  // 选择心情
  chooseMood: function(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/record/record?moodId=' + id
    });
  },
  
  // 查看详情
  viewDetail: function(e) {
    const { index } = e.currentTarget.dataset;
    const record = this.data.recentRecords[index];
    wx.navigateTo({
      url: '/pages/record/record?recordId=' + record.id + '&view=true'
    });
  },
  
  // 格式化日期为 YYYY-MM-DD
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  
  // 跳转到心情趋势页
  goToTrend: function() {
    wx.switchTab({
      url: '/pages/trend/trend'
    });
  }
}) 