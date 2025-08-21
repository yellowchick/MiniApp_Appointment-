Page({
  data: {
    notification: {
      id: 'n123',
      type: 'incoming', // incoming/outgoing/confirmed/rejected
      title: '新预约请求',
      message: '李教授希望与您预约一次项目讨论会议，讨论关于人工智能研究项目的进展和下一步计划，预计时长1小时。',
      time: '2023-12-01T10:00:00Z',
      status: 'unread', // unread/read/archived
      details: { 
        date: '2023年12月5日', 
        timeSlot: '14:00 - 15:00', 
        purpose: '项目会议',
        initiator: '李明教授',
        action: '' // confirm/reject
      }
    }
  },

  onLoad(options) {
    // 实际开发中，这里应该根据传递的id获取通知详情
    if (options.id) {
      // 模拟根据ID获取通知详情
      this.getNotificationDetail(options.id);
    }
    
    // 如果是已读通知，更新状态
    if (this.data.notification.status === 'unread') {
      this.markAsRead();
    }
  },

  // 获取通知详情（模拟）
  getNotificationDetail(id) {
    // 实际开发中这里应调用云函数或从全局数据获取
    console.log('获取通知详情:', id);
    // 这里简单模拟，实际应替换为真实数据获取
    const notification = {
      id: id,
      type: 'incoming',
      title: '会议预约请求',
      message: '张工程师希望预约一次技术评审会议，讨论新版本API的设计方案和技术实现细节。',
      time: '2023-12-02T14:30:00Z',
      status: 'unread',
      details: { 
        date: '2023年12月8日', 
        timeSlot: '10:00 - 11:30', 
        purpose: '技术评审',
        initiator: '张工程师',
        action: ''
      }
    };
    
    this.setData({ notification });
  },

  // 标记为已读
  markAsRead() {
    if (this.data.notification.status === 'unread') {
      const notification = this.data.notification;
      notification.status = 'read';
      this.setData({ notification });
      
      // 实际开发中这里应更新服务器状态
      console.log('通知标记为已读:', notification.id);
    }
  },

  // 处理用户操作
  handleAction(e) {
    const action = e.currentTarget.dataset.action;
    const notification = this.data.notification;
    
    // 更新通知状态
    notification.details.action = action;
    
    if (action === 'confirm') {
      notification.type = 'confirmed';
      wx.showToast({ title: '预约已同意！', icon: 'success' });
    } else {
      notification.type = 'rejected';
      wx.showToast({ title: '预约已拒绝', icon: 'none' });
    }
    
    notification.status = 'read';
    this.setData({ notification });
    
    // 实际开发中这里应调用云函数更新状态
    console.log('处理通知:', action);
  },

  // 格式化时间
  formatTime(timeStr) {
    const date = new Date(timeStr);
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  },

  // 返回上一页
  navigateBack() {
    wx.navigateBack();
  }
});