// trend.js
const app = getApp();

Page({
  data: {
    moodRecords: [],
    moodCounts: [],
    currentMonth: '',
    showCalendar: true,
    minDate: (() => {
      const now = new Date();
      now.setMonth(now.getMonth() - 1); // 设置为前一个月
      now.setDate(1); // 设置为月初
      return now.getTime();
    })(), // 最小日期为前一个月的1号
    maxDate: new Date().getTime(), // 今天
    defaultDate: new Date().getTime(), // 默认选中今天
    formatter: null, // 日期格式化函数
    moodMarks: {} // 心情标记数据
  },
  
  onLoad: function(options) {
    const now = new Date();
    this.setData({
      currentMonth: this.formatMonth(now),
      formatter: this.dateFormatter // 设置日期格式化函数
    });
  },
  
  onShow: function() {
    this.loadRecords();
    this.calculateMoodCounts();
    this.prepareMoodMarks();
  },
  
  // 准备心情日历标记数据
  prepareMoodMarks: function() {
    const { moodRecords } = this.data;
    const marks = {};
    
    moodRecords.forEach(record => {
      if (!record.date) return;
      
      // 获取日期的时间戳
      const dateParts = record.date.split(' ')[0].split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);
      const dateTimestamp = new Date(year, month - 1, day).getTime();
      
      const mood = app.globalData.moodList.find(m => m.id === record.moodId);
      if (!mood) return;
      
      // 设置标记
      marks[dateTimestamp] = {
        type: 'custom',
        text: mood.name.charAt(0),
        color: this.getColorFromMood(mood.id),
        topInfo: mood.name,
        bottomInfo: '',
        data: record
      };
    });
    
    this.setData({
      moodMarks: marks
    });
  },
  
  // 日期格式化函数
  dateFormatter(day) {
    const timestamp = day.date.getTime();
    const marks = this.data.moodMarks[timestamp];
    
    if (marks) {
      // 自定义标记日期
      day.topInfo = marks.topInfo;
      day.bottomInfo = marks.bottomInfo;
      day.text = marks.text;
      day.color = marks.color;
      day.data = marks.data;
    }
    
    return day;
  },
  
  // 根据心情ID获取颜色
  getColorFromMood: function(moodId) {
    // 根据心情ID返回不同的颜色
    const colorMap = {
      1: '#FFD700', // 开心-金色
      2: '#87CEEB', // 平静-天蓝色
      3: '#A9A9A9', // 低落-灰色
      4: '#FF6347', // 愤怒-番茄红
      5: '#9370DB', // 焦虑-紫色
      6: '#FF69B4'  // 惊喜-粉色
    };
    
    return colorMap[moodId] || '#58adf5';
  },
  
  // 加载心情记录
  loadRecords: function() {
    const records = app.getMoodRecords();
    this.setData({
      moodRecords: records
    });
  },
  
  // 计算不同心情的数量
  calculateMoodCounts: function() {
    const { moodRecords } = this.data;
    const moodList = app.globalData.moodList;
    
    // 初始化计数对象
    const moodCounts = moodList.map(mood => {
      return {
        id: mood.id,
        name: mood.name,
        icon: mood.icon,
        color: mood.color,
        count: 0
      };
    });
    
    // 统计每种心情的数量
    moodRecords.forEach(record => {
      const moodIndex = moodCounts.findIndex(m => m.id === record.moodId);
      if (moodIndex !== -1) {
        moodCounts[moodIndex].count++;
      }
    });
    
    // 按数量排序
    moodCounts.sort((a, b) => b.count - a.count);
    
    this.setData({
      moodCounts: moodCounts
    });
  },
  
  // 查看记录详情
  viewDetail: function(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/record/record?recordId=' + id + '&view=true'
    });
  },
  
  // 切换视图模式
  toggleView: function() {
    this.setData({
      showCalendar: !this.data.showCalendar
    });
  },
  
  // 格式化月份为 YYYY-MM
  formatMonth: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  },
  
  // 获取记录日期的格式化显示
  getRecordDateDisplay: function(record) {
    if (!record || !record.date) return '';
    
    const dateParts = record.date.split(' ')[0].split('-');
    const month = dateParts[1];
    const day = dateParts[2];
    
    return `${month}月${day}日`;
  },

  // 日历选择回调
  calendarSelect: function(e) {
    const { detail } = e;
    // 检查选中的日期是否有心情记录
    const selectedDate = new Date(detail.getTime());
    const dateString = this.formatDateYMD(selectedDate);
    const record = this.data.moodRecords.find(r => r.date.split(' ')[0] === dateString);
    
    if (record) {
      // 如果有记录，跳转到详情页
      wx.navigateTo({
        url: '/pages/record/record?recordId=' + record.id + '&view=true'
      });
    } else {
      // 如果没有记录，跳转到创建页
      wx.navigateTo({
        url: '/pages/record/record?date=' + dateString
      });
    }
  },

  // 日历确认回调
  calendarConfirm: function(e) {
    const { detail } = e;
    console.log('calendar confirm:', detail);
  },

  // 日历取消选择回调
  calendarUnselect: function(e) {
    const { detail } = e;
    console.log('calendar unselect:', detail);
  },

  // 日历月份展示回调
  calendarMonthShow: function(e) {
    const { detail } = e;
    // 更新当前选中的月份
    this.setData({
      currentMonth: this.formatMonth(detail.date)
    });
  },
  
  // 格式化日期为 YYYY-MM-DD 格式
  formatDateYMD: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}) 