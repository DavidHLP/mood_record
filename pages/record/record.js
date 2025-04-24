// record.js
const app = getApp();

Page({
  data: {
    isViewMode: false,
    recordId: null,
    date: '',
    time: '',
    moodList: [],
    activities: [],
    selectedMoodId: null,
    selectedActivities: [],
    content: '',
    record: null
  },
  
  onLoad: function(options) {
    const { moodId, recordId, view } = options;
    
    // 设置当前日期和时间
    const now = new Date();
    const date = this.formatDate(now);
    const time = this.formatTime(now);
    
    this.setData({
      date: date,
      time: time,
      moodList: app.globalData.moodList,
      activities: app.globalData.activities,
      isViewMode: view === 'true'
    });
    
    // 如果是查看已有记录
    if (recordId) {
      this.setData({
        recordId: recordId
      });
      this.loadRecord(recordId);
    } 
    // 如果是从首页选择心情跳转过来
    else if (moodId) {
      this.setData({
        selectedMoodId: parseInt(moodId)
      });
    }
  },
  
  // 加载已有记录
  loadRecord: function(recordId) {
    const records = app.getMoodRecords();
    const record = records.find(item => item.id === recordId);
    
    if (record) {
      this.setData({
        record: record,
        selectedMoodId: record.moodId,
        content: record.content || '',
        date: record.date.split(' ')[0],
        time: record.date.split(' ')[1],
        selectedActivities: record.activities ? record.activities.map(a => a.id) : []
      });
    }
  },
  
  // 选择心情
  selectMood: function(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({
      selectedMoodId: id
    });
  },
  
  // 选择活动
  toggleActivity: function(e) {
    const { id } = e.currentTarget.dataset;
    const { selectedActivities } = this.data;
    
    if (selectedActivities.includes(id)) {
      // 如果已经选择，则取消选择
      this.setData({
        selectedActivities: selectedActivities.filter(item => item !== id)
      });
    } else {
      // 如果没有选择，则添加选择
      this.setData({
        selectedActivities: [...selectedActivities, id]
      });
    }
  },
  
  // 输入内容
  inputContent: function(e) {
    this.setData({
      content: e.detail.value
    });
  },
  
  // 保存记录
  saveRecord: function() {
    const { selectedMoodId, content, date, time, selectedActivities } = this.data;
    
    if (!selectedMoodId) {
      wx.showToast({
        title: '请选择心情',
        icon: 'none'
      });
      return;
    }
    
    // 获取心情信息
    const moodInfo = app.getMoodById(selectedMoodId);
    
    // 获取选中的活动信息
    const activityInfos = selectedActivities.map(id => app.getActivityById(id));
    
    // 创建记录对象
    const record = {
      id: Date.now().toString(), // 使用时间戳作为ID
      date: `${date} ${time}`,
      moodId: selectedMoodId,
      moodInfo: moodInfo,
      content: content,
      activities: activityInfos
    };
    
    // 保存记录
    app.saveMoodRecord(record);
    
    wx.showToast({
      title: '记录成功',
      icon: 'success',
      success: function() {
        // 返回首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      }
    });
  },
  
  // 返回首页
  cancel: function() {
    wx.navigateBack();
  },
  
  // 格式化日期为 YYYY-MM-DD
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  
  // 格式化时间为 HH:MM
  formatTime: function(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}) 