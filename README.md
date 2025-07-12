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



## 新增图片资源

需要添加以下图片资源到/images目录：

text

```
arrow-left.png       左箭头图标
arrow-right.png      右箭头图标
calendar-empty.png   空状态日历图标
location.png         位置图标
participants.png     参与者图标
edit.png             编辑图标
delete.png           删除图标
add-white.png        白色添加图标
calendar-icon.png   # 日历图标
```





### 小程序页面设计

底部导航栏：首页，探索，我的

#### 我的

- 名片栏
- 