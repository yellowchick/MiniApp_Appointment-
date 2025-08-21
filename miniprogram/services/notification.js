import { cloud } from '../utils/cloud'

/**
 * 创建通知
 * @param {Object} data 通知数据
 * @returns {Promise}
 */
export const createNotification = (data) => {
  return cloud.callFunction({
    name: 'notification-service',
    data: {
      action: 'create',
      data
    }
  })
}

/**
 * 更新通知状态
 * @param {string} id 通知ID
 * @param {Object} updateData 更新数据
 * @returns {Promise}
 */
export const updateNotification = (id, updateData) => {
  return cloud.callFunction({
    name: 'notification-service',
    data: {
      action: 'update',
      data: { id, ...updateData }
    }
  })
}

/**
 * 获取通知列表
 * @param {Object} filters 过滤条件
 * @returns {Promise}
 */
export const listNotifications = (filters = {}) => {
  return cloud.callFunction({
    name: 'notification-service',
    data: {
      action: 'list',
      data: filters
    }
  })
}

/**
 * 获取通知详情
 * @param {string} id 通知ID
 * @returns {Promise}
 */
export const getNotification = (id) => {
  return cloud.callFunction({
    name: 'notification-service',
    data: {
      action: 'get',
      data: { id }
    }
  })
}