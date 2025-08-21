// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  console.log('收到 login 请求');
  
  try {
    const wxContext = cloud.getWXContext();
    console.log('获取到微信上下文:', wxContext);
    
    return {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID
    }
  } catch (error) {
    console.error('login 函数错误:', error);
    return {
      code: 500,
      message: '服务器错误: ' + error.message
    }
  }
}