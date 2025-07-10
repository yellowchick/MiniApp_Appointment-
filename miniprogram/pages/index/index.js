// index.js
const app = getApp()

Page({
  data: {
    userInfo: {
      name: '张老师',
      title: '高级咨询师'
    },
    weekDays: [],
    scheduleData: []
  },

  onLoad() {
    // 生成最近一周日期
    this.generateWeekDays()
    // 生成模拟日程数据
    this.generateScheduleData()
  },

  // 生成最近一周日期
  generateWeekDays() {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const today = new Date()
    const weekDays = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(today.getDate() + i)
      
      weekDays.push({
        dayName: days[date.getDay()],
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        isToday: i === 0
      })
    }
    
    this.setData({ weekDays })
  },

  // 生成模拟日程数据
  generateScheduleData() {
    const scheduleData = []
    const today = new Date()
    
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(today.getDate() + i)
      
      const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`
      const dayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
      
      // 生成当天时间段
      const slots = []
      let availableSlots = 0
      
      // 从9:00到18:00，每2小时一个时间段
      for (let j = 9; j < 18; j += 2) {
        // 随机生成状态
        const statuses = ['available', 'booked', 'full']
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        
        if (status === 'available') availableSlots++
        
        slots.push({
          id: `slot-${i}-${j}`,
          startTime: `${j}:00`,
          endTime: `${j + 2}:00`,
          status: status,
          booker: status === 'booked' ? (Math.random() > 0.5 ? '王先生' : '李女士') : null
        })
      }
      
      scheduleData.push({
        date: dateStr,
        dayName: dayName,
        slots: slots,
        availableSlots: availableSlots
      })
    }
    
    this.setData({ scheduleData })
  },

  // 添加时间段
  addSchedule() {
    wx.showToast({
      title: '添加新时间段',
      icon: 'none'
    })
    // 实际项目中这里应该跳转到添加页面
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: `${this.data.userInfo.name}的预约日程`,
      path: '/pages/index/index'
    }
  }
})