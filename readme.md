# 每日心情记录小程序

## 项目介绍
每日心情记录是一款微信小程序，帮助用户记录和追踪每天的情绪变化。通过简单直观的界面，用户可以选择当天的心情，记录相关活动和内容，并查看历史记录和情绪趋势分析。

## 功能特点

### 心情记录
- 支持6种不同心情状态：开心、平静、低落、愤怒、焦虑、惊喜
- 每种心情都有对应的图标和颜色标识
- 可以记录与心情相关的活动类型：工作、学习、社交、运动、娱乐、家庭
- 支持添加文字描述，记录更多细节

### 数据可视化
- 日历视图：直观展示每日心情记录
- 统计分析：展示不同心情的占比和趋势
- 历史记录浏览：查看过去的心情记录详情

### 用户体验
- 简洁清晰的界面设计
- 快速记录今日心情
- 查看最近的心情记录

## 项目架构图

```mermaid
graph TD
    A[小程序入口] --> B[全局App实例]
    B --> C1[首页]
    B --> C2[记录页]
    B --> C3[趋势页]
    B --> C4[我的页]
    
    C1 --> D1[今日心情展示]
    C1 --> D2[最近记录列表]
    C1 --> D3[快速记录入口]
    
    C2 --> E1[心情选择]
    C2 --> E2[活动选择]
    C2 --> E3[内容记录]
    C2 --> E4[保存记录]
    
    C3 --> F1[日历视图]
    C3 --> F2[心情统计]
    C3 --> F3[历史记录]
    
    B --> G[数据存储]
    G --> H[本地存储]
```

## 用户操作流程

```mermaid
flowchart LR
    A[打开小程序] --> B{有今日记录?}
    B -->|是| C[查看今日心情]
    B -->|否| D[选择记录心情]
    D --> E[选择心情类型]
    E --> F[选择相关活动]
    F --> G[添加文字描述]
    G --> H[保存记录]
    H --> I[返回首页]
    C --> J[查看心情趋势]
    I --> J
    J --> K[按日历查看历史]
    J --> L[查看心情统计]
```

## 数据流转图

```mermaid
stateDiagram-v2
    [*] --> 首页
    首页 --> 记录页: 点击记录心情
    记录页 --> 首页: 保存/取消
    首页 --> 趋势页: 点击趋势Tab
    趋势页 --> 记录页: 点击日历日期
    趋势页 --> 首页: 切换Tab
    首页 --> 我的页: 点击我的Tab
    我的页 --> 首页: 切换Tab
    
    state 记录页 {
        [*] --> 选择心情
        选择心情 --> 选择活动
        选择活动 --> 添加描述
        添加描述 --> 保存
        保存 --> [*]
    }
    
    state 趋势页 {
        [*] --> 日历视图
        日历视图 --> 统计视图: 切换
        统计视图 --> 日历视图: 切换
    }
```

## 数据模型

```mermaid
classDiagram
    class App {
        +globalData
        +onLaunch()
        +saveMoodRecord()
        +getMoodRecords()
        +getMoodById()
        +getActivityById()
    }
    
    class MoodRecord {
        +id: String
        +date: String
        +moodId: Number
        +moodInfo: Object
        +content: String
        +activities: Array
    }
    
    class Mood {
        +id: Number
        +name: String
        +icon: String
        +color: String
    }
    
    class Activity {
        +id: Number
        +name: String
        +icon: String
    }
    
    App "1" -- "n" MoodRecord: 管理
    App "1" -- "n" Mood: 包含
    App "1" -- "n" Activity: 包含
    MoodRecord "1" -- "1" Mood: 引用
    MoodRecord "1" -- "n" Activity: 引用
```

## 技术栈
- 微信小程序原生开发框架
- Vant Weapp UI组件库 (@vant/weapp)
- ECharts图表库 (echarts-for-weixin)
- 微信日历组件 (@lspriv/wx-calendar)

## 项目结构
```
├── pages                     // 页面文件
│   ├── index                 // 首页
│   ├── record                // 记录页面
│   ├── trend                 // 趋势分析页面
│   └── my                    // 个人中心页面
├── images                    // 图片资源
│   ├── mood                  // 心情图标
│   ├── activity              // 活动图标
│   └── icon                  // 应用图标
├── utils                     // 工具函数
├── app.js                    // 全局逻辑
├── app.json                  // 全局配置
└── app.wxss                  // 全局样式
```

## 安装和使用

### 开发环境
1. 安装微信开发者工具
2. 克隆项目到本地
3. 使用微信开发者工具打开项目
4. 配置AppID（如需体验完整功能）

### 项目依赖
项目依赖以下第三方库：
```json
{
  "dependencies": {
    "@lspriv/wx-calendar": "^1.8.4",
    "@vant/weapp": "^1.11.7",
    "echarts-for-weixin": "^1.0.2"
  }
}
```

### 使用说明
1. 首页：查看今日心情和最近记录，点击心情图标快速记录
2. 记录页：选择心情、活动，添加文字描述
3. 趋势页：查看心情日历和统计分析
4. 我的页：个人设置和应用信息

## 数据存储
应用使用微信小程序的本地存储功能（wx.setStorageSync/wx.getStorageSync）保存用户的心情记录数据，所有数据均保存在用户设备本地，不涉及云端存储。

## 后续开发计划
- [ ] 支持导出数据功能
- [ ] 添加更多统计分析图表
- [ ] 增加提醒功能
- [ ] 支持自定义心情和活动类型

## 项目截图

### 首页

![](./md-image/index.png)

### 记录

![](./md-image/record.png)


### 趋势

- 日历显示

![](./md-image/trend1.png)

- 列表显示

![](./md-image/trend2.png)

### 我的

![](./md-image/my.png)

## 联系方式

如有任何问题或建议，欢迎提交Issue或联系开发者。
