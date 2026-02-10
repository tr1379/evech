# Evech - 高级个人博客平台

![Evech](https://img.shields.io/badge/Evech-Blog%20Platform-gold)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![License](https://img.shields.io/badge/License-MIT-green)

一个现代、优雅的个人博客平台，专为深度阅读和高质量内容创作而设计。Evech 集成了先进的内容管理、用户互动、AI 自动化等功能，为作者和读者提供卓越的体验。

**🌐 在线演示**: [https://evech.manus.space](https://evech.manus.space)  
**📦 GitHub 仓库**: [https://github.com/tr1379/evech](https://github.com/tr1379/evech)

---

## ✨ 核心特性

### 📝 内容管理
- **特色文章滑块** - 支持动态排序（按发布时间、浏览量、置顶）
- **富文本编辑** - Markdown 支持，包括脚注、引文、图片画廊
- **媒体嵌入** - 支持视频、音频、图片等多种媒体格式
- **文章分类** - 标签系统和系列管理，灵活的内容组织

### 💬 用户互动
- **线程化评论系统** - 支持嵌套回复和深度讨论
- **评论点赞** - 用户可以点赞喜欢的评论
- **评论审核** - 管理员工具用于内容审核和管理
- **用户认证** - 基于 OAuth 的安全登录系统

### 🔍 内容发现
- **归档浏览器** - 按年份、标签、系列灵活筛选
- **全文搜索** - 快速搜索文章标题和内容
- **浏览量统计** - 追踪文章热度和读者兴趣

### 📧 订阅系统
- **新闻通讯订阅** - 用户可订阅/取消订阅
- **邮件通知** - 新文章发布时自动通知订阅者
- **订阅管理** - 管理员工具查看和管理订阅者

### 🤖 AI 自动化
- **摘要生成** - 使用 LLM 自动生成文章摘要
- **封面图片生成** - AI 自动创建符合风格的文章封面
- **内容优化** - 智能化内容处理和展示

### 🎨 设计与体验
- **现代编辑风格** - 优雅的衬线字体（正文）和无衬线字体（标题）
- **响应式设计** - 完美适配桌面、平板、手机
- **精心配色** - 柔和白 (#FAFAFA)、木炭灰 (#2C2C2C)、柔和金 (#D4AF37)
- **流畅动画** - 页面过渡和交互动画

---

## 🚀 快速开始

### 系统要求

- Node.js 22.13.0 或更高版本
- pnpm 10.4.1 或更高版本
- MySQL 8.0+ 或 TiDB

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/tr1379/evech.git
cd evech
```

2. **安装依赖**
```bash
pnpm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置数据库连接等
nano .env
```

4. **初始化数据库**
```bash
# 推送数据库架构
pnpm db:push

# 创建示例数据（可选）
pnpm seed
```

5. **启动开发服务器**
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

---

## 📦 项目结构

```
evech/
├── client/                 # 前端应用 (React 19)
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   │   ├── Home.tsx           # 首页
│   │   │   ├── PostDetail.tsx     # 文章详情页
│   │   │   ├── Archive.tsx        # 归档浏览页
│   │   │   ├── Subscribe.tsx      # 订阅页
│   │   │   ├── Unsubscribe.tsx    # 取消订阅页
│   │   │   ├── About.tsx          # 关于页面
│   │   │   └── NotFound.tsx       # 404 页面
│   │   ├── components/    # 可复用组件
│   │   │   ├── Navbar.tsx         # 导航栏
│   │   │   ├── Footer.tsx         # 页脚
│   │   │   ├── FeaturedSlider.tsx # 特色文章滑块
│   │   │   ├── PostCard.tsx       # 文章卡片
│   │   │   ├── Comments.tsx       # 评论组件
│   │   │   └── ...
│   │   ├── App.tsx        # 主应用入口
│   │   ├── main.tsx       # 应用启动文件
│   │   └── index.css      # 全局样式
│   ├── public/            # 静态资源
│   └── index.html         # HTML 模板
│
├── server/                 # 后端应用 (Express + tRPC)
│   ├── routers.ts         # tRPC 路由定义
│   ├── db.ts              # 数据库查询助手
│   ├── storage.ts         # S3 存储助手
│   ├── _core/             # 核心框架代码
│   │   ├── index.ts       # 服务器入口
│   │   ├── context.ts     # tRPC 上下文
│   │   ├── trpc.ts        # tRPC 配置
│   │   ├── auth.ts        # 认证逻辑
│   │   ├── llm.ts         # LLM 集成
│   │   ├── imageGeneration.ts # 图片生成
│   │   └── ...
│   ├── auth.logout.test.ts    # 认证测试
│   └── posts.test.ts          # 文章功能测试
│
├── drizzle/               # 数据库架构 (Drizzle ORM)
│   ├── schema.ts          # 数据库表定义
│   ├── relations.ts       # 表关系定义
│   ├── migrations/        # 数据库迁移文件
│   └── meta/              # 迁移元数据
│
├── shared/                # 共享代码
│   ├── const.ts           # 常量定义
│   ├── types.ts           # 类型定义
│   └── _core/             # 共享工具
│
├── package.json           # 项目依赖配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 构建配置
├── vitest.config.ts       # 测试配置
├── drizzle.config.ts      # 数据库配置
├── README.md              # 项目文档（本文件）
├── CONTRIBUTING.md        # 贡献指南
└── todo.md                # 开发任务清单
```

---

## 🗄️ 数据库架构

### 核心表

#### `users` - 用户表
```sql
id (PK)          - 用户 ID
openId           - OAuth 标识符
name             - 用户名
email            - 邮箱
loginMethod      - 登录方式
role             - 角色 (user/admin)
createdAt        - 创建时间
updatedAt        - 更新时间
lastSignedIn     - 最后登录时间
```

#### `posts` - 文章表
```sql
id (PK)          - 文章 ID
title            - 文章标题
content          - 文章内容
summary          - 文章摘要
coverImage       - 封面图片 URL
authorId (FK)    - 作者 ID
seriesId (FK)    - 系列 ID
viewCount        - 浏览次数
isPinned         - 是否置顶
isPublished      - 是否发布
publishedAt      - 发布时间
createdAt        - 创建时间
updatedAt        - 更新时间
```

#### `comments` - 评论表
```sql
id (PK)          - 评论 ID
content          - 评论内容
postId (FK)      - 文章 ID
authorId (FK)    - 作者 ID
parentId (FK)    - 父评论 ID（用于嵌套回复）
status           - 审核状态 (pending/approved/rejected)
likeCount        - 点赞数
createdAt        - 创建时间
updatedAt        - 更新时间
```

#### `tags` - 标签表
```sql
id (PK)          - 标签 ID
name             - 标签名称
description      - 标签描述
createdAt        - 创建时间
```

#### `series` - 系列表
```sql
id (PK)          - 系列 ID
name             - 系列名称
description      - 系列描述
createdAt        - 创建时间
```

#### `subscribers` - 订阅者表
```sql
id (PK)          - 订阅者 ID
email            - 邮箱
isActive         - 是否激活
subscribedAt     - 订阅时间
unsubscribedAt   - 取消订阅时间
```

---

## 🔧 技术栈

### 前端
- **框架**: React 19
- **UI 库**: shadcn/ui
- **样式**: Tailwind CSS 4
- **状态管理**: TanStack Query (React Query)
- **路由**: Wouter
- **表单**: React Hook Form
- **动画**: Framer Motion
- **图表**: Recharts
- **Markdown**: Streamdown

### 后端
- **运行时**: Node.js
- **框架**: Express 4
- **API**: tRPC 11
- **数据库**: MySQL/TiDB + Drizzle ORM
- **认证**: OAuth (Manus)
- **存储**: AWS S3
- **LLM**: 集成 LLM 服务
- **图片生成**: AI 图片生成服务

### 开发工具
- **构建**: Vite 7
- **编译**: TypeScript 5.9
- **测试**: Vitest 2
- **包管理**: pnpm 10
- **代码格式**: Prettier
- **版本控制**: Git

---

## 📚 API 文档

### 文章相关

#### 获取特色文章
```typescript
trpc.posts.getFeatured.useQuery({
  sortBy: 'publishedAt' | 'viewCount' | 'isPinned',
  limit: number
})
```

#### 获取已发布文章
```typescript
trpc.posts.getPublished.useQuery({
  limit: number,
  offset: number
})
```

#### 搜索文章
```typescript
trpc.posts.search.useQuery({
  query: string
})
```

### 评论相关

#### 获取文章评论
```typescript
trpc.comments.getByPostId.useQuery({
  postId: number
})
```

#### 发表评论
```typescript
trpc.comments.create.useMutation({
  postId: number,
  content: string,
  parentId?: number
})
```

#### 点赞评论
```typescript
trpc.comments.like.useMutation({
  commentId: number
})
```

### 订阅相关

#### 订阅新闻通讯
```typescript
trpc.subscribers.subscribe.useMutation({
  email: string
})
```

#### 取消订阅
```typescript
trpc.subscribers.unsubscribe.useMutation({
  email: string
})
```

### AI 功能

#### 生成摘要
```typescript
trpc.ai.generateSummary.useMutation({
  title: string,
  content: string
})
```

#### 生成封面图片
```typescript
trpc.ai.generateCoverImage.useMutation({
  title: string,
  keywords?: string[]
})
```

---

## 🧪 测试

### 运行所有测试
```bash
pnpm test
```

### 运行特定测试文件
```bash
pnpm test server/posts.test.ts
```

### 监视模式
```bash
pnpm test --watch
```

### 测试覆盖率
```bash
pnpm test --coverage
```

### 现有测试
- `server/auth.logout.test.ts` - 认证登出测试
- `server/posts.test.ts` - 文章、标签、系列、评论、订阅功能测试

---

## 🚢 部署

### 构建生产版本
```bash
pnpm build
```

### 启动生产服务器
```bash
pnpm start
```

### 部署到 Manus 平台
1. 在 Manus 管理界面点击 "Publish" 按钮
2. 系统自动构建和部署应用
3. 应用将在 `https://evech.manus.space` 上线

### 自定义域名
1. 在项目设置中配置自定义域名
2. 更新 DNS 记录指向 Manus 平台
3. 配置 SSL 证书（自动）

---

## 🔐 安全性

### 认证
- 使用 OAuth 进行安全登录
- Session Cookie 用于用户会话管理
- JWT Token 用于 API 认证

### 数据保护
- 所有敏感数据都经过加密
- 数据库连接使用 SSL/TLS
- API 请求使用 HTTPS

### 权限控制
- 基于角色的访问控制 (RBAC)
- 管理员专用操作受保护
- 用户只能修改自己的数据

---

## 📝 环境变量

### 必需变量
```env
# 数据库
DATABASE_URL=mysql://user:password@localhost:3306/evech

# OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# 安全
JWT_SECRET=your_secret_key

# 存储
AWS_S3_BUCKET=your_bucket
AWS_S3_REGION=us-east-1
```

### 可选变量
```env
# LLM 服务
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key

# 图片生成
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_api_key
```

---

## 🤝 贡献

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

### 快速贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📋 开发路线图

### 已完成 ✅
- [x] 核心博客功能
- [x] 评论系统
- [x] 订阅系统
- [x] AI 自动化功能
- [x] 响应式设计

### 进行中 🚧
- [ ] 富文本编辑器
- [ ] 管理后台
- [ ] 邮件通知系统
- [ ] GitHub Actions CI/CD

### 计划中 📅
- [ ] 社交分享功能
- [ ] 阅读时间估计
- [ ] 相关文章推荐
- [ ] 多语言支持
- [ ] 暗色主题

---

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

---

## 📞 联系方式

- **问题报告**: [GitHub Issues](https://github.com/tr1379/evech/issues)
- **功能建议**: [GitHub Discussions](https://github.com/tr1379/evech/discussions)
- **邮件**: support@evech.dev

---

## 🙏 致谢

感谢所有为 Evech 做出贡献的开发者和用户！

- 感谢 [shadcn/ui](https://ui.shadcn.com/) 提供的优秀 UI 组件
- 感谢 [Tailwind CSS](https://tailwindcss.com/) 的强大样式系统
- 感谢 [tRPC](https://trpc.io/) 的类型安全 API
- 感谢 [Drizzle ORM](https://orm.drizzle.team/) 的数据库管理

---

**最后更新**: 2026-02-10  
**版本**: 1.0.0  
**维护者**: Manus Team
