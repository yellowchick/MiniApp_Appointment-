// app.js
import { 
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  NOTIFICATION_ACTIONS
} from './utils/constants';

App({
  globalData: {
    // 使用常量初始化
    NOTIFICATION_TYPES,
    NOTIFICATION_STATUS,
    NOTIFICATION_ACTIONS,
    
    userInfo: null,
    notifications: []
  },

  initNotifications() {
    const savedNotifications = wx.getStorageSync('notifications');
    
    if (savedNotifications && savedNotifications.length > 0) {
      this.globalData.notifications = savedNotifications;
    } else {
      // 初始模拟数据
      this.globalData.notifications = [
        {
          id: 'n1',
          type: 'incoming',
          title: '张同学请求预约',
          message: '请求预约12月5日 14:00-15:00的时间段',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'unread',
          action: 'pending',
          details: {
            date: '2023-12-05',
            timeSlot: '14:00-15:00',
            purpose: '论文指导',
            contact: '138****1234'
          }
        },
        {
          id: 'n2',
          type: 'confirmed',
          title: '李教授已同意您的预约',
          message: '12月3日 10:00-11:00的预约已确认',
          time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'unread',
          details: {
            date: '2023-12-03',
            timeSlot: '10:00-11:00',
            purpose: '项目讨论'
          }
        }
      ];
      
      this.saveNotifications();
    }
  },

  // 保存通知到本地存储
  saveNotifications() {
    wx.setStorageSync('notifications', this.globalData.notifications);
  },
  
  // 添加新通知
  addNotification(notification) {
    this.globalData.notifications.unshift({
      id: 'n' + Date.now(),
      time: new Date().toISOString(),
      status: 'unread',
      ...notification
    });
    
    this.saveNotifications();
  },

  onLaunch() {
    wx.cloud.init({
      env: 'cloud1-1g6mhcoh0bd8da00',   // 1. 必须是字符串字面量，不能是变量
      traceUser: true,
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })

    this.initNotifications();
  },

  onLaunch: function () {
    this.globalData = {
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: ""
    };
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }
  },
});
