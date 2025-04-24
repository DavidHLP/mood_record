App({
  globalData: {
    userInfo: null,
    moodList: [
      { id: 1, name: '开心', icon: '/images/mood/happy.png', color: '#FFD700' },
      { id: 2, name: '平静', icon: '/images/mood/calm.png', color: '#87CEEB' },
      { id: 3, name: '低落', icon: '/images/mood/sad.png', color: '#A9A9A9' },
      { id: 4, name: '愤怒', icon: '/images/mood/angry.png', color: '#FF6347' },
      { id: 5, name: '焦虑', icon: '/images/mood/anxious.png', color: '#9370DB' },
      { id: 6, name: '惊喜', icon: '/images/mood/surprised.png', color: '#FF69B4' }
    ],
    activities: [
      { id: 1, name: '工作', icon: '/images/activity/work.png' },
      { id: 2, name: '学习', icon: '/images/activity/study.png' },
      { id: 3, name: '社交', icon: '/images/activity/social.png' },
      { id: 4, name: '运动', icon: '/images/activity/sports.png' },
      { id: 5, name: '娱乐', icon: '/images/activity/entertainment.png' },
      { id: 6, name: '家庭', icon: '/images/activity/family.png' }
    ],
    moodRecords: []
  },
  
  onLaunch: function() {
    // 从本地存储获取已保存的心情记录
    const records = wx.getStorageSync('moodRecords');
    if (records) {
      this.globalData.moodRecords = records;
    }
  },
  
  // 保存心情记录
  saveMoodRecord: function(record) {
    const records = this.globalData.moodRecords;
    records.unshift(record); // 将新记录添加到数组开头
    this.globalData.moodRecords = records;
    wx.setStorageSync('moodRecords', records);
    return records;
  },
  
  // 获取所有心情记录
  getMoodRecords: function() {
    return this.globalData.moodRecords;
  },
  
  // 根据ID获取心情信息
  getMoodById: function(id) {
    return this.globalData.moodList.find(item => item.id === id);
  },
  
  // 根据ID获取活动信息
  getActivityById: function(id) {
    return this.globalData.activities.find(item => item.id === id);
  }
})