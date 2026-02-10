# 开发环境设置指南

本指南将帮助您快速设置 Evech 开发环境。

---

## 📋 系统要求

- **Node.js**: 22.13.0 或更高版本
- **pnpm**: 10.4.1 或更高版本
- **Git**: 最新版本
- **数据库**: MySQL 8.0+ 或 TiDB
- **操作系统**: macOS、Linux 或 Windows（WSL2）

### 版本检查

```bash
# 检查 Node.js 版本
node --version

# 检查 pnpm 版本
pnpm --version

# 检查 Git 版本
git --version
```

---

## 🚀 快速开始

### 1. 克隆仓库

```bash
# 使用 HTTPS
git clone https://github.com/tr1379/evech.git

# 或使用 SSH
git clone git@github.com:tr1379/evech.git

# 进入项目目录
cd evech
```

### 2. 安装依赖

```bash
# 使用 pnpm 安装所有依赖
pnpm install

# 或者使用 pnpm 的简写
pnpm i
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件（使用您喜欢的编辑器）
nano .env
# 或
vim .env
# 或
code .env
```

### 4. 初始化数据库

```bash
# 推送数据库架构
pnpm db:push

# 创建示例数据（可选）
pnpm seed
```

### 5. 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 服务器将在 http://localhost:3000 启动
```

---

## 🔧 详细配置

### 数据库配置

#### MySQL 本地设置

```bash
# 使用 Homebrew 安装 MySQL（macOS）
brew install mysql

# 启动 MySQL 服务
brew services start mysql

# 连接到 MySQL
mysql -u root

# 创建数据库
CREATE DATABASE evech;
CREATE USER 'evech'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON evech.* TO 'evech'@'localhost';
FLUSH PRIVILEGES;
```

#### 环境变量配置

在 `.env` 文件中设置数据库连接字符串：

```env
DATABASE_URL=mysql://evech:password@localhost:3306/evech
```

### OAuth 配置

1. **访问 Manus 平台**
   - 登录 https://manus.im
   - 进入应用管理

2. **创建应用**
   - 点击 "创建新应用"
   - 填入应用信息
   - 获取 App ID

3. **配置环境变量**
   ```env
   VITE_APP_ID=your_app_id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
   ```

### 存储配置

#### AWS S3 设置

1. **创建 S3 存储桶**
   ```bash
   # 使用 AWS CLI
   aws s3 mb s3://evech-storage --region us-east-1
   ```

2. **创建 IAM 用户**
   - 访问 AWS IAM 控制台
   - 创建新用户
   - 附加 S3 权限策略

3. **配置环境变量**
   ```env
   AWS_S3_BUCKET=evech-storage
   AWS_S3_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

---

## 📝 常用命令

### 开发命令

```bash
# 启动开发服务器（热重载）
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 类型检查
pnpm check

# 格式化代码
pnpm format
```

### 数据库命令

```bash
# 推送数据库架构
pnpm db:push

# 生成数据库迁移
pnpm db:generate

# 打开数据库 Studio
pnpm db:studio

# 创建示例数据
pnpm seed
```

### 测试命令

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test server/posts.test.ts

# 监视模式
pnpm test --watch

# 生成覆盖率报告
pnpm test --coverage
```

---

## 🛠️ IDE 配置

### VS Code 推荐配置

1. **安装扩展**
   - ESLint
   - Prettier - Code formatter
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin
   - Thunder Client（可选，用于 API 测试）

2. **创建 `.vscode/settings.json`**
   ```json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "typescript.tsdk": "node_modules/typescript/lib",
     "typescript.enablePromptUseWorkspaceTsdk": true
   }
   ```

3. **创建 `.vscode/launch.json`**
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Launch Server",
         "runtimeExecutable": "pnpm",
         "runtimeArgs": ["dev"],
         "console": "integratedTerminal",
         "internalConsoleOptions": "neverOpen"
       }
     ]
   }
   ```

### 其他 IDE

- **WebStorm**: 内置 TypeScript 和 React 支持
- **Vim/Neovim**: 使用 LSP 配置（coc.nvim 或 nvim-lspconfig）

---

## 🔍 调试

### 浏览器调试

1. **打开 Chrome DevTools**
   - 按 `F12` 或 `Cmd+Option+I`（macOS）

2. **调试技巧**
   - 使用 React DevTools 扩展
   - 检查网络请求
   - 查看控制台日志

### 服务器调试

```bash
# 使用 Node 调试器
node --inspect-brk server/_core/index.ts

# 在 Chrome 中打开 chrome://inspect
```

### 日志查看

```bash
# 查看开发服务器日志
pnpm dev 2>&1 | tee dev.log

# 查看特定日志
tail -f .manus-logs/devserver.log
tail -f .manus-logs/browserConsole.log
```

---

## 🧪 测试

### 编写测试

在 `server/` 目录中创建 `.test.ts` 文件：

```typescript
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("my feature", () => {
  it("should work", async () => {
    const result = await appRouter.createCaller({}).myFeature.query();
    expect(result).toBeDefined();
  });
});
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定文件
pnpm test server/posts.test.ts

# 监视模式
pnpm test --watch

# 调试测试
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

---

## 📦 依赖管理

### 添加依赖

```bash
# 添加生产依赖
pnpm add package-name

# 添加开发依赖
pnpm add -D package-name

# 添加特定版本
pnpm add package-name@1.2.3
```

### 更新依赖

```bash
# 更新所有依赖
pnpm update

# 更新特定依赖
pnpm update package-name

# 检查过时的依赖
pnpm outdated
```

### 移除依赖

```bash
# 移除依赖
pnpm remove package-name
```

---

## 🔐 安全性

### 环境变量安全

- ✅ 将 `.env` 添加到 `.gitignore`
- ✅ 使用强密钥生成 JWT_SECRET
- ✅ 定期轮换 API 密钥
- ❌ 不要在代码中硬编码密钥
- ❌ 不要将 `.env` 提交到 Git

### 依赖安全

```bash
# 检查已知漏洞
pnpm audit

# 修复漏洞
pnpm audit --fix
```

---

## 🐛 常见问题

### Q: 数据库连接失败

**A**: 检查以下内容：
```bash
# 1. 确保 MySQL 正在运行
mysql -u root -p

# 2. 检查 DATABASE_URL 格式
# 应该是: mysql://user:password@host:port/database

# 3. 检查数据库是否存在
mysql -u user -p -e "SHOW DATABASES;"
```

### Q: 端口 3000 已被占用

**A**: 使用不同的端口：
```bash
# 设置 PORT 环境变量
PORT=3001 pnpm dev
```

### Q: 依赖安装失败

**A**: 清除缓存并重新安装：
```bash
# 清除 pnpm 缓存
pnpm store prune

# 删除 node_modules
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

### Q: 类型错误

**A**: 运行类型检查：
```bash
# 检查 TypeScript 错误
pnpm check

# 生成类型定义
pnpm db:generate
```

### Q: 热重载不工作

**A**: 重启开发服务器：
```bash
# 停止服务器（Ctrl+C）
# 然后重新启动
pnpm dev
```

---

## 📚 进阶配置

### 数据库 Studio

```bash
# 打开 Drizzle Studio
pnpm db:studio

# 访问 https://local.drizzle.studio
```

### 代码生成

```bash
# 生成 Drizzle 迁移
pnpm db:generate

# 生成 tRPC 类型
pnpm type-check
```

### 性能优化

```bash
# 分析构建大小
pnpm build --analyze

# 生成性能报告
pnpm build --report
```

---

## 🚀 下一步

1. **阅读文档**
   - [README.md](./README.md) - 项目概览
   - [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南

2. **探索代码**
   - 查看 `client/src/pages/Home.tsx` 了解页面结构
   - 查看 `server/routers.ts` 了解 API 定义
   - 查看 `drizzle/schema.ts` 了解数据库架构

3. **开始开发**
   - 创建新分支：`git checkout -b feature/your-feature`
   - 进行更改并测试
   - 提交 Pull Request

---

## 📞 获取帮助

- **文档**: 查看 [README.md](./README.md) 和 [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Issues**: 在 [GitHub Issues](https://github.com/tr1379/evech/issues) 提问
- **讨论**: 在 [GitHub Discussions](https://github.com/tr1379/evech/discussions) 讨论
- **邮件**: support@evech.dev

---

**最后更新**: 2026-02-10  
**版本**: 1.0.0
