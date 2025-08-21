Page({
  data: {
    activeTab: 0, // 0:全部, 1:未读, 2:已处理
    notifications: [], // 所有通知数据
    displayNotifications: [], // 当前显示的通知
    totalCount: 0, // 总通知数
    unreadCount: 0 // 未读通知数
  },

  onLoad() {
    // 模拟加载通知数据
    this.loadNotifications();
  },

  // 加载通知数据
  loadNotifications() {
    // 模拟数据 - 实际开发中应从服务器获取
    const notifications = [
      {
        id: 'n101',
        type: 'incoming',
        title: '新预约请求',
        message: '李教授希望与您预约一次项目讨论会议，讨论人工智能研究项目进展',
        time: '2023-12-01T10:30:00Z',
        status: 'unread',
        details: { date: '12月5日', timeSlot: '14:00-15:00' }
      },
      {
        id: 'n102',
        type: 'incoming',
        title: '会议邀请',
        message: '张工程师邀请您参加下周三的技术评审会议',
        time: '2023-11-30T14:20:00Z',
        status: 'read',
        details: { date: '12月6日', timeSlot: '10:00-11:30' }
      },
      {
        id: 'n103',
        type: 'confirmed',
        title: '预约已确认',
        message: '您已同意王博士的预约请求，会议时间已确定',
        time: '2023-11-29T09:15:00Z',
        status: 'read',
        details: { date: '12月4日', timeSlot: '15:30-16:30' }
      },
      {
        id: 'n104',
        type: 'incoming',
        title: '课程咨询',
        message: '刘同学希望预约一次关于机器学习课程的咨询',
        time: '2023-11-28T16:45:00Z',
        status: 'unread',
        details: { date: '12月3日', timeSlot: '09:00-10:00' }
      },
      {
        id: 'n105',
        type: 'rejected',
        title: '预约已拒绝',
        message: '您已拒绝陈经理的会议预约请求',
        time: '2023-11-27T11:20:00Z',
        status: 'read',
        details: { date: '12月2日', timeSlot: '14:00-15:00' }
      },
      {
        id: 'n106',
        type: 'outgoing',
        title: '预约已发送',
        message: '您向赵教授发送的预约请求已送达',
        time: '2023-11-26T13:10:00Z',
        status: 'read',
        details: { date: '12月8日', timeSlot: '10:30-11:30' }
      },
      {
        id: 'n107',
        type: 'confirmed',
        title: '预约成功',
        message: '钱教授已接受您的预约请求，会议时间已确定',
        time: '2023-11-25T15:40:00Z',
        status: 'read',
        details: { date: '12月7日', timeSlot: '13:00-14:00' }
      },
      {
        id: 'n108',
        type: 'incoming',
        title: '新预约请求',
        message: '孙博士希望与您讨论合作研究事宜',
        time: '2023-11-24T17:25:00Z',
        status: 'unread',
        details: { date: '12月9日', timeSlot: '16:00-17:00' }
      }
    ];

    // 计算未读数量
    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    this.setData({
      notifications,
      totalCount: notifications.length,
      unreadCount,
      displayNotifications: this.filterNotifications(0, notifications)
    });
  },

  // 切换标签
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      activeTab: index,
      displayNotifications: this.filterNotifications(index, this.data.notifications)
    });
  },

  // 根据标签过滤通知
  filterNotifications(tabIndex, notifications) {
    if (tabIndex === 0) { // 全部
      return [...notifications];
    } else if (tabIndex === 1) { // 未读
      return notifications.filter(n => n.status === 'unread');
    } else if (tabIndex === 2) { // 已处理
      return notifications.filter(n => n.status === 'read');
    }
    return [];
  },

  // 获取类型文本
  getTypeText(type) {
    const typeMap = {
      'incoming': '收到请求',
      'outgoing': '已发送',
      'confirmed': '已确认',
      'rejected': '已拒绝'
    };
    return typeMap[type] || type;
  },

  // 获取状态文本
  getStatusText(item) {
    if (item.status === 'unread') {
      return '未读';
    } else if (item.type === 'confirmed') {
      return '已同意';
    } else if (item.type === 'rejected') {
      return '已拒绝';
    }
    return '已处理';
  },

  // 获取状态类名
  getStatusClass(item) {
    if (item.status === 'unread') {
      return 'unread';
    } else if (item.type === 'confirmed') {
      return 'confirmed';
    } else if (item.type === 'rejected') {
      return 'rejected';
    }
    return '';
  },

  // 格式化时间
  formatTime(timeStr) {
    const date = new Date(timeStr);
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  },

  // 打开通知详情
  openNotificationDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/notification-detail/notification-detail?id=${id}`
    });
  },

  // 清空已处理通知
  clearProcessed() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有已处理通知吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          // 在实际应用中，这里会调用API删除通知
          // 这里模拟删除已处理通知
          const processedIds = this.data.notifications
            .filter(n => n.status === 'read')
            .map(n => n.id);
          
          const remaining = this.data.notifications.filter(n => n.status !== 'read');
          const unreadCount = remaining.filter(n => n.status === 'unread').length;
          
          this.setData({
            notifications: remaining,
            totalCount: remaining.length,
            unreadCount,
            displayNotifications: this.filterNotifications(this.data.activeTab, remaining)
          });
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  }
});