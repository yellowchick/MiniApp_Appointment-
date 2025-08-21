// utils/constants.js

// 通知类型
export const NOTIFICATION_TYPES = {
  INCOMING_REQUEST: 'incoming',     // 收到预约请求
  OUTGOING_CONFIRMED: 'confirmed',  // 对方同意预约
  OUTGOING_REJECTED: 'rejected'     // 对方拒绝预约
};

// 通知状态
export const NOTIFICATION_STATUS = {
  UNREAD: 'unread',     // 未读
  READ: 'read',         // 已读
  ARCHIVED: 'archived'  // 已归档
};

// 通知操作
export const NOTIFICATION_ACTIONS = {
  PENDING: 'pending',   // 待处理
  CONFIRMED: 'confirm', // 已同意
  REJECTED: 'reject'    // 已拒绝
};

// 最大显示数量
export const MAX_DISPLAY_NOTIFICATIONS = 3;