## 项目结构规划

```
├── client/              # 小程序前端
│   ├── pages/           # 页面目录
│   │   ├── schedule/    # 日程管理页
│   │   ├── booking/     # 预约页
│   │   └── profile/     # 个人中心页
│   ├── utils/           # 工具函数
│   ├── app.js           # 小程序入口
│   ├── app.json         # 全局配置
│   └── app.wxss         # 全局样式
│
├── server/              # Node.js后端
│   ├── controllers/     # 控制器
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── config/          # 配置文件
│   ├── app.js           # 主入口
│   └── package.json
│
└── README.md            # 项目说明
```