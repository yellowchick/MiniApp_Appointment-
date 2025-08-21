const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  
  try {
    switch (action) {
      case 'create':
        return await createNotification(data, wxContext.OPENID)
      case 'update':
        return await updateNotification(data)
      case 'list':
        return await listNotifications(wxContext.OPENID, data)
      case 'get':
        return await getNotification(data.id)
      default:
        return { code: 400, message: '无效操作' }
    }
  } catch (error) {
    console.error('通知服务错误:', error)
    return { code: 500, message: '服务器错误' }
  }
}

// 创建通知
async function createNotification(data, senderId) {
  const { receiverId, ...notification } = data
  
  // 验证必填字段
  if (!receiverId || !notification.title || !notification.message) {
    return { code: 400, message: '缺少必要参数' }
  }
  
  const newNotification = {
    ...notification,
    senderId,
    receiverId,
    status: 'unread',
    createTime: db.serverDate()
  }
  
  const res = await db.collection('notifications').add({
    data: newNotification
  })
  
  return { code: 200, data: { id: res._id } }
}

// 更新通知状态
async function updateNotification(data) {
  const { id, status, type } = data
  
  if (!id) {
    return { code: 400, message: '缺少通知ID' }
  }
  
  const updateData = {}
  if (status) updateData.status = status
  if (type) updateData.type = type
  
  await db.collection('notifications').doc(id).update({
    data: updateData
  })
  
  return { code: 200, message: '更新成功' }
}

// 获取通知列表
async function listNotifications(userId, filters = {}) {
  console.log('原始查询参数 - userId:', userId);
  
  // 添加以下调试信息
  const { OPENID } = cloud.getWXContext();
  console.log('当前用户OpenID:', OPENID);

  const { type, status } = filters

  // 添加调试日志
  console.log('查询参数 - userId:', userId);
  console.log('查询参数 - filters:', filters);

  const query = db.collection('notifications')
    .where({
      receiverId: userId
    });

  
  // 添加调试日志
  console.log('基础查询条件:', { receiverId: userId });

  if (type) {
    query.where({ type });
    console.log('添加类型条件:', { type });
  }
  
  if (status) {
    query.where({ status });
    console.log('添加状态条件:', { status });
  }

  try {
    const res = await query.orderBy('createTime', 'desc').get();
    console.log('查询结果数量:', res.data.length);
    console.log('查询结果样例:', res.data.length > 0 ? res.data[0] : null);
    
    return { code: 200, data: res.data };
  } catch (error) {
    console.error('数据库查询错误:', error);
    return { code: 500, message: '数据库查询失败' };
  }
}

// 获取单个通知
async function getNotification(id) {
  if (!id) {
    return { code: 400, message: '缺少通知ID' }
  }
  
  const res = await db.collection('notifications').doc(id).get()
  return { code: 200, data: res.data }
}