const app = getApp();
// 引入日历工具函数
const { generateCalendar, getWeekDays } = require('../../utils/calendarUtil');

Page({
  
  data: {
    //  第一部分的通知数据
    displayNotifications: [], // 当前显示的通知（最多3条）
    unreadCount: 0,           // 未读通知总数
    MAX_DISPLAY: getApp().globalData.MAX_DISPLAY_NOTIFICATIONS,
    // 第二部分：分享的日程日历
    hasSharedSchedule: false,  // 是否有分享的日程
    sharedSchedule: null,      // 分享的日程数据
    calendarDays: [],          // 日历日期数组
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    selectedDate: new Date().toISOString().split('T')[0], // 当前选中的日期
    weekDays: getWeekDays(),   // 星期数组 ['日', '一', ...]
    formattedSelectedDate: '',  // 格式化后的选中日期
    //第三部分
    // 分享相关数据
    shareLink: '',    // 分享链接
    qrcodePath: ''    // 二维码路径
  },

  onShow() {
    const { NOTIFICATION_TYPES, NOTIFICATION_STATUS } = getApp().globalData;
    
    // 使用常量过滤通知
    const activeNotifications = this.data.notifications.filter(
      n => n.status !== NOTIFICATION_STATUS.ARCHIVED && 
          (n.status === NOTIFICATION_STATUS.UNREAD || 
          (n.type === NOTIFICATION_TYPES.INCOMING_REQUEST && 
           n.status === NOTIFICATION_STATUS.READ && 
           n.action === NOTIFICATION_ACTIONS.PENDING))
    );
    this.loadNotifications();
  },
  
  onLoad(options) {
    // 第一部分的通知加载代码...
    
    // 加载分享的日程
    this.loadSharedSchedule(options);

    // 生成分享链接
    this.generateShareLink();
  },

  generateShareLink() {
    const userId = getApp().globalData.userId;
    const shareLink = `https://yourschedule.com/share/${userId}`;
    this.setData({ shareLink });
  },
  
  // 复制分享链接
  copyShareLink() {
    wx.setClipboardData({
      data: this.data.shareLink,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        });
      }
    });
  },
  
  // 生成二维码
  generateQRCode() {
    wx.showLoading({ title: '生成中...' });
    
    // 实际项目中应调用云函数生成二维码
    // 这里使用模拟数据
    setTimeout(() => {
      this.setData({
        qrcodePath: '/images/qrcode-placeholder.png'
      });
      wx.hideLoading();
    }, 800);
  },
  
  // 保存二维码到相册
  saveQRCode() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.qrcodePath,
      success: () => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('保存失败', err);
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    });
  },
  
  // 微信分享
  onShareAppMessage() {
    return {
      title: '我的可预约时间',
      path: `/pages/explore/explore?shareId=${getApp().globalData.userId}`,
      imageUrl: '/images/share-thumb.png'
    };
  },

  // 加载通知数据
  loadNotifications() {
    // 从全局获取通知数据
    const allNotifications = app.globalData.notifications || [];
    
    // 筛选需要显示的通知：未归档且未处理或未读
    const activeNotifications = allNotifications.filter(
      n => n.status !== 'archived' && 
          (n.status === 'unread' || 
          (n.type === 'incoming' && n.status === 'read' && n.action === 'pending'))
    );
    
    // 按时间降序排序
    const sortedNotifications = activeNotifications.sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );
    
    // 只取前MAX_DISPLAY条
    const displayNotifications = sortedNotifications.slice(0, this.data.MAX_DISPLAY);
    
    // 计算未读数量
    const unreadCount = allNotifications.filter(n => n.status === 'unread').length;
    
    this.setData({ displayNotifications, unreadCount });
  },
  
  // 格式化时间显示
  formatTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return '刚刚';
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffHours < 48) {
      return '昨天';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },
  
  // 处理预约请求
  handleRequest(e) {
    const { id, action } = e.currentTarget.dataset;
    
    // 更新全局通知状态
    const updatedNotifications = app.globalData.notifications.map(n => {
      if (n.id === id) {
        return {
          ...n,
          status: 'read',
          action: action, // 'confirm' 或 'reject'
          handledTime: new Date().toISOString()
        };
      }
      return n;
    });
    
    // 保存到全局
    app.globalData.notifications = updatedNotifications;
    
    // 刷新显示
    this.loadNotifications();
    
    // 显示操作反馈
    wx.showToast({
      title: action === 'confirm' ? '已同意预约' : '已拒绝预约',
      icon: 'success'
    });
    
    // 阻止事件冒泡
    e.stopPropagation();
  },
  
  // 确认了解通知
  acknowledgeNotification(e) {
    const id = e.currentTarget.dataset.id;
    
    // 更新全局通知状态
    const updatedNotifications = app.globalData.notifications.map(n => {
      if (n.id === id) {
        return { ...n, status: 'read' };
      }
      return n;
    });
    
    // 保存到全局
    app.globalData.notifications = updatedNotifications;
    
    // 刷新显示
    this.loadNotifications();
    
    // 阻止事件冒泡
    e.stopPropagation();
  },
  
  // 打开通知详情
  openNotificationDetail(e) {
    const id = e.currentTarget.dataset.id;
    const notification = app.globalData.notifications.find(n => n.id === id);
    
    if (!notification) return;
    
    // 标记为已读
    if (notification.status === 'unread') {
      const updatedNotifications = app.globalData.notifications.map(n => 
        n.id === id ? {...n, status: 'read'} : n
      );
      
      app.globalData.notifications = updatedNotifications;
      this.loadNotifications();
    }
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/notification-detail/notification-detail?id=${id}`
    });
  },

  //第二部分
  // 加载分享的日程
  loadSharedSchedule(options) {
    let scheduleId = options.scheduleId;
    
    // 1. 优先使用URL参数中的scheduleId
    if (!scheduleId) {
      // 2. 尝试从本地缓存获取上次查看的scheduleId
      const lastScheduleId = wx.getStorageSync('lastSharedScheduleId');
      if (lastScheduleId) {
        scheduleId = lastScheduleId;
      }
    }
    
    if (scheduleId) {
      // 保存为最后一次查看的日程
      wx.setStorageSync('lastSharedScheduleId', scheduleId);
      
      // 从云函数加载日程数据
      this.fetchSharedSchedule(scheduleId);
    } else {
      // 没有分享的日程
      this.setData({ 
        hasSharedSchedule: false,
        formattedSelectedDate: this.formatDate(new Date())
      });
    }
  },
  
  // 从云函数获取分享的日程数据
  fetchSharedSchedule(scheduleId) {
    wx.showLoading({ title: '加载日程中' });
    
    // 实际项目中应调用云函数
    wx.cloud.callFunction({
      name: 'getSharedSchedule',
      data: { scheduleId }
    }).then(res => {
      const sharedSchedule = res.result;
      
      // 生成日历
      this.generateCalendarForSchedule(sharedSchedule);
      
      this.setData({ 
        sharedSchedule,
        hasSharedSchedule: true
      });
      wx.hideLoading();
    }).catch(err => {
      console.error('加载分享日程失败', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      
      // 回退到无分享状态
      this.setData({ hasSharedSchedule: false });
    });
  },
  
  // 为分享的日程生成日历
  generateCalendarForSchedule(schedule) {
    const now = new Date();
    const year = this.data.currentYear;
    const month = this.data.currentMonth;
    
    // 生成日历数据
    const calendarDays = generateCalendar(year, month, schedule.eventDates);
    
    // 格式化选中的日期
    const formattedDate = this.formatDate(new Date(this.data.selectedDate));
    
    this.setData({
      calendarDays,
      formattedSelectedDate: formattedDate
    });
  },
  
  // 格式化日期
  formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  },
  
  // 选择日期
  selectDate(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({
      selectedDate: date,
      formattedSelectedDate: this.formatDate(new Date(date))
    });
  },
  
  // 切换到上个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 1) {
      currentYear--;
      currentMonth = 12;
    } else {
      currentMonth--;
    }
    
    this.setData({ currentYear, currentMonth }, () => {
      this.generateCalendarForSchedule(this.data.sharedSchedule);
    });
  },
  
  // 切换到下个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 12) {
      currentYear++;
      currentMonth = 1;
    } else {
      currentMonth++;
    }
    
    this.setData({ currentYear, currentMonth }, () => {
      this.generateCalendarForSchedule(this.data.sharedSchedule);
    });
  },
  
  // 查看当日详情
  viewSharedDayDetail() {
    const { selectedDate, sharedSchedule } = this.data;
    
    wx.navigateTo({
      url: `/pages/shared-day-detail/shared-day-detail?date=${selectedDate}&userId=${sharedSchedule.userId}`
    });
  },
  


});