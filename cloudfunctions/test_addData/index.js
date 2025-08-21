// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 1. 初始化通知数据
    await db.collection('notifications').add({
      data: {
        type: 'incoming',
        title: '新预约请求',
        message: '李教授希望与您预约会议',
        time: new Date(),
        status: 'unread',
        details: {
          date: '2023-12-10',
          timeSlot: '14:00-15:00',
          purpose: '项目讨论'
        },
        senderId: 'u123',
        receiverId: 'u456',
        createTime: new Date()
      }
    })

    // 2. 初始化日程数据
    await db.collection('schedules').add({
      data: {
        userId: 'u123456',
        name: '张教授',
        title: '计算机科学教授',
        avatar: 'cloud://your-env-id/images/avatar.png', // 记得换成自己的 env-id
        eventDates: ['2023-12-05', '2023-12-07'],
        shareToken: 'abcdef123456',
        expireTime: new Date('2023-12-31')
      }
    })

    return { success: true, msg: '初始化完成' }
  } catch (e) {
    return { success: false, error: e }
  }
}