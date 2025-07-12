// pages/day-detail/day-detail.js
Page({
  data: {
    selectedDate: '',
    formattedDate: '',
    events: []
  },

  onLoad(options) {
    const date = options.date;
    const dateObj = new Date(date);
    const formattedDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
    
    // 模拟获取该日期的日程安排
    const events = this.getDayEvents(date);
    
    this.setData({
      selectedDate: date,
      formattedDate,
      events
    });
  },

  // 获取当日事件
  getDayEvents(date) {
    // 模拟数据
    const eventsMap = {
      '2023-12-5': [
        { id: 1, time: '09:00 - 10:30', title: '团队晨会', location: '会议室A', participants: 5 },
        { id: 2, time: '14:00 - 15:30', title: '客户演示', location: '客户公司', participants: 3 }
      ],
      '2023-12-10': [
        { id: 3, time: '10:00 - 12:00', title: '产品设计评审', location: '会议室B', participants: 7 },
        { id: 4, time: '15:00 - 16:00', title: '一对一辅导', location: '办公室', participants: 1 }
      ],
      '2023-12-15': [
        { id: 5, time: '09:30 - 11:00', title: '项目进度汇报', location: '会议室C', participants: 6 },
        { id: 6, time: '13:30 - 17:00', title: '团队建设活动', location: '公司活动室', participants: 12 }
      ],
      '2023-12-20': [
        { id: 7, time: '10:00 - 12:00', title: '产品发布会', location: '会议中心', participants: 20 }
      ],
      '2023-12-25': [
        { id: 8, time: '14:00 - 18:00', title: '圣诞派对', location: '公司大厅', participants: 30 }
      ]
    };
    
    return eventsMap[date] || [];
  },

  // 添加新事件
  addEvent() {
    wx.navigateTo({
      url: `/pages/add-event/add-event?date=${this.data.selectedDate}`
    });
  }
});