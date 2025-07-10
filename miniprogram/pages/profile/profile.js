// profile.js
Page({
  data: {
    userInfo: {
      name: "张老师",
      title: "高级咨询师",
      avatar: "/images/avatar.png"
    },
    stats: {
      totalBookings: 24,
      upcoming: 3
    },
    bookings: [
      {
        id: 1,
        day: "周三",
        date: "12月6日",
        time: "10:00 - 11:30",
        with: "王先生",
        topic: "项目咨询会议",
        status: "confirmed"
      },
      {
        id: 2,
        day: "周五",
        date: "12月8日",
        time: "14:00 - 15:00",
        with: "李女士",
        topic: "产品演示",
        status: "pending"
      },
      {
        id: 3,
        day: "下周一",
        date: "12月11日",
        time: "09:30 - 10:30",
        with: "赵总监",
        topic: "合作洽谈",
        status: "confirmed"
      }
    ],
    scheduleStats: {
      availableSlots: 8,
      bookedSlots: 12,
      upcoming: 3
    }
  },

  viewAllBookings() {
    wx.showToast({
      title: '查看所有预约',
      icon: 'none'
    });
    // 实际项目中应跳转到预约列表页
  },

  manageSchedule() {
    wx.showToast({
      title: '管理日程',
      icon: 'none'
    });
    // 实际项目中应跳转到日程管理页
  },

  addTimeSlot() {
    wx.showToast({
      title: '添加时间段',
      icon: 'none'
    });
    // 实际项目中应跳转到添加时间段页
  },

  shareSchedule() {
    wx.showToast({
      title: '分享日程',
      icon: 'none'
    });
    // 实际项目中应跳转到分享设置页
  },

  notificationSettings() {
    wx.navigateTo({
      url: '/pages/settings/notification'
    });
  },

  privacySettings() {
    wx.navigateTo({
      url: '/pages/settings/privacy'
    });
  },

  helpCenter() {
    wx.navigateTo({
      url: '/pages/help/index'
    });
  }
});