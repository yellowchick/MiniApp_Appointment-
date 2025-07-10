// explore.js
Page({
  data: {
    sharedSchedule: null,
    userId: 'u123456'
  },

  onLoad(options) {
    // 从分享链接中获取参数
    if (options.scheduleId) {
      this.loadSharedSchedule(options.scheduleId);
    }
  },

  loadSharedSchedule(scheduleId) {
    // 模拟从服务器获取分享的日程数据
    const sharedSchedule = {
      id: scheduleId,
      name: "李教授",
      title: "博士生导师",
      avatar: "/images/avatar2.png",
      startDate: "2023-12-01",
      endDate: "2023-12-07",
      availableSlots: 8,
      bookedSlots: 12
    };
    
    this.setData({ sharedSchedule });
  },

  viewSharedSchedule() {
    wx.showToast({
      title: '查看分享的日程',
      icon: 'none'
    });
    // 实际项目中应跳转到分享的日程详情页
  },

  copyShareLink() {
    wx.setClipboardData({
      data: `https://schedule.app/${this.data.userId}`,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '我的预约日程',
      path: `/pages/index/index?shareId=${this.data.userId}`,
      imageUrl: '/images/share-poster.png'
    }
  }
});