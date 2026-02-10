import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { posts, tags, series, postTags, users } from './drizzle/schema.js';

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log('Starting seed...');

  try {
    // Create series
    console.log('Creating series...');
    const [seriesResult1] = await db.insert(series).values({
      name: '技术深度解析',
      description: '深入探讨各类技术话题',
    });
    const [seriesResult2] = await db.insert(series).values({
      name: '人文思考',
      description: '关于生活、哲学与人文的思考',
    });

    const seriesId1 = seriesResult1.insertId;
    const seriesId2 = seriesResult2.insertId;

    // Create tags
    console.log('Creating tags...');
    const [tagResult1] = await db.insert(tags).values({ name: '技术' });
    const [tagResult2] = await db.insert(tags).values({ name: '编程' });
    const [tagResult3] = await db.insert(tags).values({ name: '人文' });
    const [tagResult4] = await db.insert(tags).values({ name: '思考' });
    const [tagResult5] = await db.insert(tags).values({ name: 'AI' });

    const tagId1 = tagResult1.insertId;
    const tagId2 = tagResult2.insertId;
    const tagId3 = tagResult3.insertId;
    const tagId4 = tagResult4.insertId;
    const tagId5 = tagResult5.insertId;

    // Get the first admin user (owner)
    const adminUsers = await db.select().from(users).where(eq(users.role, 'admin')).limit(1);
    const authorId = adminUsers.length > 0 ? adminUsers[0].id : 1;

    // Create posts
    console.log('Creating posts...');
    
    const post1Content = `# 人工智能的未来展望

人工智能技术正在以前所未有的速度发展。从ChatGPT到各类生成式AI工具，我们正在见证一个新时代的到来。

## 技术突破

近年来，大语言模型的突破性进展让我们看到了AI的巨大潜力。这些模型不仅能够理解和生成自然语言，还能够进行复杂的推理和创作。

## 应用场景

AI技术已经渗透到我们生活的方方面面：

- **内容创作**：自动生成文章、图片、视频
- **编程辅助**：代码补全、bug修复、架构设计
- **数据分析**：从海量数据中提取有价值的洞察
- **个性化推荐**：精准匹配用户需求

## 未来挑战

尽管AI技术发展迅速，但我们仍面临诸多挑战：

1. **伦理问题**：如何确保AI的公平性和透明度
2. **隐私保护**：在利用数据的同时保护用户隐私
3. **就业影响**：AI可能取代部分传统工作岗位
4. **技术安全**：防止AI被恶意使用

> "技术本身是中性的，关键在于我们如何使用它。" —— 某位智者

## 结语

AI的未来充满无限可能，我们需要在拥抱技术进步的同时，保持理性思考和人文关怀。`;

    const [postResult1] = await db.insert(posts).values({
      title: '人工智能的未来展望：机遇与挑战并存',
      content: post1Content,
      summary: '探讨人工智能技术的最新发展趋势，分析其带来的机遇和挑战，以及我们应该如何理性看待AI技术的未来。',
      authorId,
      seriesId: seriesId1,
      isPinned: true,
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
      viewCount: 1250,
    });

    await db.insert(postTags).values([
      { postId: postResult1.insertId, tagId: tagId1 },
      { postId: postResult1.insertId, tagId: tagId5 },
    ]);

    const post2Content = `# 深度思考：什么是真正的成功

在这个快节奏的时代，我们常常被各种成功学所包围。但什么才是真正的成功？

## 重新定义成功

成功不应该只是财富的积累或地位的提升。真正的成功应该包括：

- 内心的平静与满足
- 与他人建立深刻的连接
- 对社会产生积极的影响
- 持续的个人成长

## 慢下来的智慧

在追求目标的过程中，我们往往忘记了享受当下。慢下来，感受生活的美好，也许才是通往幸福的捷径。

## 平衡的艺术

工作与生活的平衡、理想与现实的平衡、个人与集体的平衡——这些都是我们需要不断探索的课题。

生活不是一场竞赛，而是一段旅程。重要的不是终点，而是沿途的风景和成长。`;

    const [postResult2] = await db.insert(posts).values({
      title: '深度思考：什么是真正的成功？',
      content: post2Content,
      summary: '在这个快节奏的时代，重新审视成功的定义。真正的成功不仅仅是物质的积累，更是内心的富足和人生的平衡。',
      authorId,
      seriesId: seriesId2,
      isPublished: true,
      publishedAt: new Date('2024-01-10'),
      viewCount: 890,
    });

    await db.insert(postTags).values([
      { postId: postResult2.insertId, tagId: tagId3 },
      { postId: postResult2.insertId, tagId: tagId4 },
    ]);

    const post3Content = `# 现代Web开发最佳实践

Web开发技术日新月异，掌握最佳实践能让我们的开发更加高效和可维护。

## 前端架构

选择合适的前端框架和架构模式是成功的关键。React、Vue、Svelte各有特点，需要根据项目需求选择。

## 性能优化

- 代码分割和懒加载
- 图片优化和CDN使用
- 缓存策略
- 服务端渲染（SSR）

## 开发工具

现代化的开发工具链能大幅提升开发效率：

\`\`\`bash
# 使用 Vite 创建项目
npm create vite@latest my-app
cd my-app
npm install
npm run dev
\`\`\`

## 测试策略

完善的测试是代码质量的保证。单元测试、集成测试、E2E测试缺一不可。

## 持续学习

技术更新快，保持学习的热情和好奇心是每个开发者必备的素质。`;

    const [postResult3] = await db.insert(posts).values({
      title: '现代Web开发最佳实践指南',
      content: post3Content,
      summary: '全面介绍现代Web开发的最佳实践，包括前端架构选择、性能优化技巧、开发工具使用和测试策略，帮助开发者构建高质量的Web应用。',
      authorId,
      seriesId: seriesId1,
      isPublished: true,
      publishedAt: new Date('2024-01-05'),
      viewCount: 1520,
    });

    await db.insert(postTags).values([
      { postId: postResult3.insertId, tagId: tagId1 },
      { postId: postResult3.insertId, tagId: tagId2 },
    ]);

    console.log('Seed completed successfully!');
    console.log(`Created ${3} posts, ${5} tags, and ${2} series`);
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
