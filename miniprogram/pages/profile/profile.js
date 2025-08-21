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

    // 即将进行的任务数据
    upcomingTask: {
      id: 1,
      day: "周三",
      date: "12月6日",
      weekday: "星期三",
      time: "10:00 - 11:30",
      with: "王先生",
      topic: "项目咨询会议",
      location: "会议室A",
      status: "confirmed",
      progress: 75,
      countdown: "2天3小时"
    },

    currentDate: new Date(), // 当前显示的月份
    selectedDate: null,     // 用户选择的日期
    calendarDays: [],        // 日历数据
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    events: [],              // 日程事件数据
    formattedSelectedDate: '当日' // 格式化后的日期
  },

  onLoad() {
    // 获取当前日期
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    
    // 设置初始选中日期为今天
    this.setData({
      selectedDate: `${year}-${month + 1}-${day}`
    });
    
    // 生成日历
    this.generateCalendar(year, month);
    
    // 获取日程事件数据
    this.fetchEvents();

    // 设置格式化日期
    this.setFormattedDate();
    
  },

  // 设置格式化日期
  setFormattedDate() {
    if (!this.data.selectedDate) {
      this.setData({ formattedSelectedDate: '今日' });
      return;
    }
    
    const [year, month, day] = this.data.selectedDate.split('-');
    
    // 格式化为两位数的月份和日期 (07.12)
    const formattedMonth = month.padStart(2, '0');
    const formattedDay = day.padStart(2, '0');
    
    this.setData({ 
      formattedSelectedDate: `${formattedMonth}.${formattedDay}`
    });
  },

  // 选择日期
  selectDate(e) {
    const selectedDate = e.currentTarget.dataset.date;
    this.setData({ selectedDate });
    
    // 更新日历中的选中状态
    const { calendarDays } = this.data;
    const updatedDays = calendarDays.map(day => ({
      ...day,
      isSelected: day.date === selectedDate
    }));
    
    // 更新格式化日期
    this.setFormattedDate();
    
    this.setData({ calendarDays: updatedDays });
  },


  // 获取日程事件数据
  fetchEvents() {
    // 模拟从服务器获取数据
    const events = [
      { date: '2023-12-5', title: '项目会议' },
      { date: '2023-12-10', title: '客户拜访' },
      { date: '2023-12-15', title: '团队建设' },
      { date: '2023-12-20', title: '产品发布' },
      { date: '2023-12-25', title: '圣诞活动' }
    ];
    
    this.setData({ events });
    this.updateCalendarWithEvents();
  },

  // 更新日历中的事件标记
  updateCalendarWithEvents() {
    const { calendarDays, events } = this.data;
    const updatedDays = calendarDays.map(day => {
      // 检查该日期是否有事件
      const hasEvent = events.some(event => event.date === day.date);
      return { ...day, hasEvent };
    });
    
    this.setData({ calendarDays: updatedDays });
  },

  // 生成日历
  generateCalendar(year, month) {
    // 获取当月第一天是星期几（0-6，0代表星期日）
    const firstDay = new Date(year, month, 1).getDay();
    
    // 获取当月的天数
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // 获取上个月的天数
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // 创建日历数组
    const calendarDays = [];
    
    // 添加上个月末尾的几天
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      calendarDays.push({
        day: day,
        date: `${month === 0 ? year - 1 : year}-${month === 0 ? 12 : month}-${day}`,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // 添加当前月的所有天
    const today = new Date();
    const isToday = (day) => {
      return day === today.getDate() && 
             month === today.getMonth() && 
             year === today.getFullYear();
    };
    
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        day: day,
        date: `${year}-${month + 1}-${day}`,
        isCurrentMonth: true,
        isToday: isToday(day)
      });
    }
    
    // 添加下个月开头的几天，使日历完整（6行7列=42天）
    const totalCells = 42; // 6行 * 7列
    const nextMonthDays = totalCells - calendarDays.length;
    for (let day = 1; day <= nextMonthDays; day++) {
      calendarDays.push({
        day: day,
        date: `${month === 11 ? year + 1 : year}-${month === 11 ? 1 : month + 2}-${day}`,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // 更新数据
    this.setData({
      calendarDays,
      currentMonth: `${year}年${month + 1}月`
    });
  },

  // 选择日期
  selectDate(e) {
    const selectedDate = e.currentTarget.dataset.date;
    this.setData({ selectedDate });
    
    // 更新日历中的选中状态
    const { calendarDays } = this.data;
    const updatedDays = calendarDays.map(day => ({
      ...day,
      isSelected: day.date === selectedDate
    }));
    
    this.setData({ calendarDays: updatedDays });
  },

  // 查看当日详情
  viewDayDetail() {
    if (!this.data.selectedDate) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/day-detail/day-detail?date=${this.data.selectedDate}`
    });
  },

  // 上个月
  prevMonth() {
    const currentDate = new Date(this.data.currentDate);
    currentDate.setMonth(currentDate.getMonth() - 1);
    
    this.setData({ currentDate });
    this.generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    this.updateCalendarWithEvents();
  },

  // 下个月
  nextMonth() {
    const currentDate = new Date(this.data.currentDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
    
    this.setData({ currentDate });
    this.generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    this.updateCalendarWithEvents();
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
  },

  // 联系用户
  contactUser() {
    wx.showToast({
      title: '联系用户',
      icon: 'none'
    });
    // 实际项目中应跳转到聊天页面
  },

  // 修改任务
  modifyTask() {
    wx.navigateTo({
      url: '/pages/edit-task/edit-task?id=' + this.data.upcomingTask.id
    });
  },

  // 取消任务
  cancelTask() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '任务已取消',
            icon: 'success'
          });
          // 实际项目中应调用API取消任务
          this.setData({ upcomingTask: null });
        }
      }
    });
  },

  // 查看全部任务
  viewAllBookings() {
    wx.navigateTo({
      url: '/pages/tasks/index'
    });
  }

});