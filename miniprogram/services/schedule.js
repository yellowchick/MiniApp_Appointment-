import { cloud } from '../utils/cloud'

/**
 * 保存或更新日程
 * @param {Object} scheduleData 日程数据
 * @returns {Promise}
 */
export const saveSchedule = (scheduleData) => {
  return cloud.callFunction({
    name: 'schedule-service',
    data: {
      action: 'save',
      data: scheduleData
    }
  })
}

/**
 * 获取用户日程
 * @param {string} userId 用户ID
 * @returns {Promise}
 */
export const getScheduleByUser = (userId) => {
  return cloud.callFunction({
    name: 'schedule-service',
    data: {
      action: 'getByUser',
      data: { userId }
    }
  })
}

/**
 * 通过令牌获取日程
 * @param {string} token 分享令牌
 * @returns {Promise}
 */
export const getScheduleByToken = (token) => {
  return cloud.callFunction({
    name: 'schedule-service',
    data: {
      action: 'getByToken',
      data: { token }
    }
  })
}

/**
 * 生成分享令牌
 * @returns {Promise}
 */
export const generateShareToken = () => {
  return cloud.callFunction({
    name: 'schedule-service',
    data: {
      action: 'generateToken'
    }
  })
}