# MIT 许可证合规指南

本文档提供了在使用 Evech 时如何遵守 MIT 许可证的实用指南。

---

## 📋 快速检查清单

### 如果您使用 Evech（不修改）

- [ ] 在您的项目中包含 `LICENSE` 文件副本
- [ ] 在 `README.md` 中提及 Evech 和 MIT 许可证
- [ ] 在源代码中添加归属注释

### 如果您修改 Evech

- [ ] 包含原始 `LICENSE` 文件
- [ ] 在 `README.md` 中说明修改内容
- [ ] 在修改的文件中添加注释
- [ ] 保留原始版权声明

### 如果您分发 Evech（原始或修改）

- [ ] 包含完整的 `LICENSE` 文件
- [ ] 包含 `NOTICE` 文件（如果适用）
- [ ] 在文档中明确说明许可证
- [ ] 提供源代码访问方式

---

## 🎯 使用场景指南

### 场景 1: 在 Web 应用中使用 Evech

**项目结构**:
```
my-blog/
├── LICENSE              # 包含 MIT 许可证副本
├── README.md            # 提及 Evech
├── NOTICE.md            # 列出依赖项
└── src/
    └── ...
```

**LICENSE 文件内容**:
```
MIT License

Copyright (c) 2026 My Blog Contributors

本项目基于 Evech (https://github.com/tr1379/evech) 创建
Evech 的版权归 Evech Contributors 所有

Permission is hereby granted...
```

**README.md 中的声明**:
```markdown
## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

本项目基于 [Evech](https://github.com/tr1379/evech) 创建，
Evech 也采用 MIT 许可证。
```

### 场景 2: 修改 Evech 并发布新版本

**步骤**:

1. **创建 Fork**
   ```bash
   git clone https://github.com/tr1379/evech.git
   cd evech
   ```

2. **进行修改**
   ```bash
   # 修改代码
   git add .
   git commit -m "feat: add new feature"
   ```

3. **创建 CHANGES.md**
   ```markdown
   # 修改说明

   本项目是 Evech 的修改版本。

   ## 主要修改

   - 添加了功能 X
   - 修复了 Bug Y
   - 优化了性能 Z

   ## 原始项目

   - 项目: Evech
   - 链接: https://github.com/tr1379/evech
   - 许可证: MIT

   ## 许可证

   本项目保持 MIT 许可证，与原始项目一致。
   ```

4. **发布**
   ```bash
   # 在 GitHub 上创建新仓库
   git remote add origin https://github.com/your-username/evech-fork.git
   git push -u origin main
   ```

### 场景 3: 在商业产品中使用 Evech

**合规步骤**:

1. **在产品中包含许可证**
   ```
   Your Product
   ├── licenses/
   │   ├── LICENSE                    # 您的产品许可证
   │   └── LICENSE-EVECH              # Evech 的 MIT 许可证
   └── README.md
   ```

2. **在关于页面中声明**
   ```
   本产品使用以下开源软件：
   
   - Evech (MIT License)
     https://github.com/tr1379/evech
   ```

3. **在文档中说明**
   ```markdown
   ## 开源软件

   本产品包含以下开源软件：

   ### Evech
   - 许可证: MIT
   - 链接: https://github.com/tr1379/evech
   - 用途: 博客平台
   ```

---

## 📝 代码中的归属注释

### 如果您使用了 Evech 的代码

在相关文件顶部添加注释：

```typescript
/**
 * 本文件包含来自 Evech 的代码
 * Evech: https://github.com/tr1379/evech
 * 许可证: MIT
 * 
 * 原始代码: src/components/PostCard.tsx
 * 修改: 添加了新的样式和功能
 */

import React from 'react';
// ... 代码内容
```

### 如果您修改了 Evech 的代码

```typescript
/**
 * 基于 Evech 的代码修改
 * 原始项目: https://github.com/tr1379/evech
 * 许可证: MIT
 * 
 * 修改内容:
 * - 添加了新的评论功能
 * - 优化了性能
 * - 修复了 Bug #123
 */

// 修改后的代码...
```

---

## 📦 NPM 包中的许可证声明

### package.json 配置

```json
{
  "name": "my-evech-fork",
  "version": "1.0.0",
  "description": "基于 Evech 的修改版本",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/my-evech-fork.git"
  },
  "keywords": [
    "evech",
    "blog",
    "platform"
  ],
  "author": "Your Name",
  "contributors": [
    {
      "name": "Evech Contributors",
      "url": "https://github.com/tr1379/evech/graphs/contributors"
    }
  ]
}
```

### 发布前检查

```bash
# 验证许可证字段
npm view my-evech-fork license

# 检查许可证文件
ls -la LICENSE

# 验证 README 中的许可证说明
grep -i "license\|evech" README.md
```

---

## 🔄 依赖项管理

### 生成许可证报告

```bash
# 使用 license-checker
npm install -g license-checker
license-checker --json > licenses.json

# 使用 licensee
npm install -g licensee
licensee --json
```

### NOTICE 文件模板

创建 `NOTICE` 文件列出所有依赖项：

```
NOTICE

This product includes software developed by the following projects:

1. Evech
   - URL: https://github.com/tr1379/evech
   - License: MIT
   - Copyright: (c) 2026 Evech Contributors

2. React
   - URL: https://github.com/facebook/react
   - License: MIT
   - Copyright: (c) Meta Platforms, Inc. and affiliates

3. Tailwind CSS
   - URL: https://github.com/tailwindlabs/tailwindcss
   - License: MIT
   - Copyright: (c) Tailwind Labs

... 其他依赖项 ...
```

---

## ✅ 合规检查清单

### 代码级别

- [ ] 保留了原始版权声明
- [ ] 添加了修改说明（如果有修改）
- [ ] 在关键文件中添加了归属注释
- [ ] 没有移除或隐藏许可证信息

### 项目级别

- [ ] 包含了 LICENSE 文件副本
- [ ] README.md 中提及了 Evech
- [ ] 创建了 NOTICE 文件（如果有多个依赖项）
- [ ] 说明了如何获取源代码

### 分发级别

- [ ] 分发包中包含了许可证文件
- [ ] 文档中清晰说明了许可证
- [ ] 提供了原始项目的链接
- [ ] 说明了做了哪些修改

### 商业产品

- [ ] 产品中包含了许可证副本
- [ ] 关于页面中列出了开源软件
- [ ] 提供了所有依赖项的许可证信息
- [ ] 法律团队审查了合规性

---

## 🚨 常见的合规错误

### ❌ 错误 1: 移除版权声明

```typescript
// ❌ 错误
export const PostCard = () => {
  // 代码...
};

// ✅ 正确
/**
 * PostCard 组件
 * 基于 Evech 的代码
 * 许可证: MIT
 * 原始项目: https://github.com/tr1379/evech
 */
export const PostCard = () => {
  // 代码...
};
```

### ❌ 错误 2: 不包含许可证文件

```
❌ 错误的项目结构
my-project/
├── src/
├── README.md
└── package.json
# 缺少 LICENSE 文件

✅ 正确的项目结构
my-project/
├── src/
├── LICENSE              # 必须包含
├── README.md
└── package.json
```

### ❌ 错误 3: 隐瞒修改

```markdown
❌ 错误的 README
# My Blog

基于 Evech 创建的博客平台。

✅ 正确的 README
# My Blog

基于 Evech 创建的博客平台。

## 修改说明

本项目对 Evech 进行了以下修改：
- 添加了评论审核功能
- 优化了文章搜索性能
- 修复了移动端显示问题

## 许可证

本项目采用 MIT 许可证。
原始项目 (Evech) 也采用 MIT 许可证。
```

### ❌ 错误 4: 声称所有权

```markdown
❌ 错误
# Evech - 我创建的博客平台

✅ 正确
# My Blog - 基于 Evech 创建

本项目基于开源项目 Evech 创建。
```

---

## 📞 获取帮助

### 许可证相关问题

- **MIT 许可证官方**: https://opensource.org/licenses/MIT
- **开源倡议**: https://opensource.org/
- **选择许可证**: https://choosealicense.com/

### Evech 相关问题

- **GitHub Issues**: https://github.com/tr1379/evech/issues
- **GitHub Discussions**: https://github.com/tr1379/evech/discussions
- **邮件**: support@evech.dev

### 法律咨询

对于复杂的法律问题，建议咨询专业律师。

---

## 📋 许可证合规工具

### 自动化工具

```bash
# 检查许可证兼容性
npm install -g licensee
licensee

# 生成许可证报告
npm install -g license-checker
license-checker --json

# 检查代码中的许可证
npm install -g reuse
reuse lint
```

### GitHub 工具

- **Dependabot**: 自动检查依赖项许可证
- **GitHub License Detection**: 自动检测仓库许可证
- **REUSE Compliance**: 检查许可证合规性

---

## 🎓 学习资源

### 推荐阅读

1. **MIT 许可证解释**: https://tldrlegal.com/license/mit-license
2. **开源许可证比较**: https://choosealicense.com/licenses/
3. **开源合规最佳实践**: https://www.linuxfoundation.org/compliance/

### 视频教程

- YouTube: "Understanding Open Source Licenses"
- Coursera: "Open Source Software Development"

---

## 总结

遵守 MIT 许可证很简单：

1. ✅ **保留版权声明** - 不要移除或隐藏
2. ✅ **包含许可证副本** - 在分发时提供
3. ✅ **说明修改** - 如果修改了代码
4. ✅ **提供源代码** - 允许他人访问

**最重要的是**: 尊重原始作者的工作，并让他人知道您使用了开源软件。

---

**最后更新**: 2026-02-10  
**版本**: 1.0.0  
**许可证**: MIT
