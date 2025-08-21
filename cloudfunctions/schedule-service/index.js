const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  
  try {
    switch (action) {
      case 'save':
        return await saveSchedule(data, wxContext.OPENID)
      case 'getByUser':
        return await getScheduleByUser(data.userId)
      case 'getByToken':
        return await getScheduleByToken(data.token)
      case 'generateToken':
        return await generateShareToken(data.scheduleId, wxContext.OPENID) // 添加scheduleId参数
      default:
        return { code: 400, message: '无效操作' }
    }
  } catch (error) {
    console.error('日程服务错误:', error)
    return { code: 500, message: '服务器错误: ' + error.message }
  }
}

// 保存或更新日程
async function saveSchedule(data, userId) {
  // 查找用户是否已有日程
  const existing = await db.collection('schedules')
    .where({ userId })
    .get()
  
  if (existing.data.length > 0) {
    // 更新现有日程
    await db.collection('schedules').doc(existing.data[0]._id).update({
      data: {
        eventDates: data.eventDates,
        name: data.name,
        title: data.title,
        avatar: data.avatar,
        updateTime: db.serverDate()
      }
    })
    return { 
      code: 200, 
      message: '日程更新成功',
      data: { _id: existing.data[0]._id } // 返回日程ID
    }
  } else {
    // 创建新日程
    const res = await db.collection('schedules').add({
      data: {
        userId,
        name: data.name,
        title: data.title,
        avatar: data.avatar,
        eventDates: data.eventDates,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    return { 
      code: 200, 
      message: '日程创建成功',
      data: { _id: res._id } // 返回新创建的日程ID
    }
  }
}

// 获取用户日程
async function getScheduleByUser(userId) {
  if (!userId) {
    return { code: 400, message: '缺少用户ID' }
  }
  
  const res = await db.collection('schedules')
    .where({ userId })
    .get()
  
  return { code: 200, data: res.data[0] || null }
}

// 通过分享令牌获取日程
async function getScheduleByToken(token) {
  if (!token) {
    return { code: 400, message: '缺少分享令牌' }
  }
  
  // 首先检查令牌是否有效
  const tokenRecord = await db.collection('schedule_tokens')
    .where({ token })
    .get()
  
  if (!tokenRecord.data || tokenRecord.data.length === 0) {
    return { code: 404, message: '无效的分享令牌' }
  }
  
  // 检查令牌是否过期
  const tokenData = tokenRecord.data[0]
  if (tokenData.expires < new Date()) {
    // 删除过期令牌
    await db.collection('schedule_tokens').doc(tokenData._id).remove()
    return { code: 410, message: '分享令牌已过期' }
  }
  
  // 获取对应的日程
  const schedule = await db.collection('schedules')
    .doc(tokenData.scheduleId)
    .get()
  
  if (!schedule.data) {
    return { code: 404, message: '未找到对应的日程' }
  }
  
  return { code: 200, data: schedule.data }
}

// 生成分享令牌
async function generateShareToken(scheduleId, userId) {
  if (!scheduleId) {
    return { code: 400, message: '缺少日程ID' }
  }
  
  // 验证用户是否有权限操作此日程
  const schedule = await db.collection('schedules')
    .doc(scheduleId)
    .get()
  
  if (!schedule.data) {
    return { code: 404, message: '日程不存在' }
  }
  
  if (schedule.data.userId !== userId) {
    return { code: 403, message: '无权操作此日程' }
  }
  
  // 生成随机令牌
  const token = Math.random().toString(36).substring(2, 10) + 
                Math.random().toString(36).substring(2, 10)
  
  // 设置有效期（7天）
  const expireTime = new Date()
  expireTime.setDate(expireTime.getDate() + 7)
  
  // 保存令牌到数据库
  await db.collection('schedule_tokens').add({
    data: {
      token,
      scheduleId,
      created: db.serverDate(),
      expires: expireTime
    }
  })
  
  return { 
    code: 200, 
    data: { 
      token, 
      expires: expireTime 
    } 
  }
}