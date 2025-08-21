// 云函数: test-cleanup (更新版)
const cloud = require('wx-server-sdk')
cloud.init({ 
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true // 启用用户追踪
})

exports.main = async (event) => {
  const { collection, id } = event
  console.log('清理请求:', { collection, id })
  
  try {
    // 验证输入参数
    if (!collection || !id) {
      throw new Error('缺少必要参数: collection或id')
    }
    
    const db = cloud.database()
    const cmd = db.command
    
    // 尝试删除文档
    const res = await db.collection(collection).doc(id).remove()
    console.log('删除结果:', res)
    
    // 检查删除结果
    if (res.stats.removed === 1) {
      return { code: 200, message: '删除成功' }
    } else {
      return { code: 404, message: '文档不存在或已被删除' }
    }
    
  } catch (e) {
    console.error('清理失败:', e)
    // 返回结构化错误信息
    return {
      code: 500,
      message: `清理失败: ${e.errMsg || e.message}`,
      error: e
    }
  }
}