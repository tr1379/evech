import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  posts: router({
    // Get featured posts for slider
    getFeatured: publicProcedure
      .input(z.object({
        sortBy: z.enum(['publishedAt', 'viewCount', 'isPinned']).default('publishedAt'),
        limit: z.number().default(5),
      }))
      .query(async ({ input }) => {
        const posts = await db.getFeaturedPosts(input.sortBy, input.limit);
        
        // Get authors and tags for each post
        const postsWithDetails = await Promise.all(
          posts.map(async (post) => {
            const author = await db.getUserById(post.authorId);
            const tags = await db.getTagsByPostId(post.id);
            const series = post.seriesId ? await db.getSeriesById(post.seriesId) : null;
            
            return {
              ...post,
              author: author ? { id: author.id, name: author.name } : null,
              tags,
              series,
            };
          })
        );
        
        return postsWithDetails;
      }),

    // Get published posts with pagination
    getPublished: publicProcedure
      .input(z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const posts = await db.getPublishedPosts(input.limit, input.offset);
        
        const postsWithDetails = await Promise.all(
          posts.map(async (post) => {
            const author = await db.getUserById(post.authorId);
            const tags = await db.getTagsByPostId(post.id);
            
            return {
              ...post,
              author: author ? { id: author.id, name: author.name } : null,
              tags,
            };
          })
        );
        
        return postsWithDetails;
      }),

    // Get single post by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const post = await db.getPostById(input.id);
        
        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
        }
        
        // Only return published posts to non-admin users
        if (!post.isPublished) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
        }
        
        const author = await db.getUserById(post.authorId);
        const tags = await db.getTagsByPostId(post.id);
        const series = post.seriesId ? await db.getSeriesById(post.seriesId) : null;
        
        return {
          ...post,
          author: author ? { id: author.id, name: author.name, email: author.email } : null,
          tags,
          series,
        };
      }),

    // Increment view count
    incrementView: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.incrementPostViewCount(input.id);
        return { success: true };
      }),

    // Create new post (admin only)
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(500),
        content: z.string().min(1),
        summary: z.string().optional(),
        coverImage: z.string().optional(),
        seriesId: z.number().optional(),
        tagIds: z.array(z.number()).optional(),
        isPinned: z.boolean().default(false),
        isPublished: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const { tagIds, ...postData } = input;
        
        const postId = await db.createPost({
          ...postData,
          authorId: ctx.user.id,
          publishedAt: input.isPublished ? new Date() : null,
        });
        
        // Add tags if provided
        if (tagIds && tagIds.length > 0) {
          for (const tagId of tagIds) {
            await db.addTagToPost(postId, tagId);
          }
        }
        
        return { id: postId };
      }),

    // Update post (admin only)
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(500).optional(),
        content: z.string().min(1).optional(),
        summary: z.string().optional(),
        coverImage: z.string().optional(),
        seriesId: z.number().optional(),
        tagIds: z.array(z.number()).optional(),
        isPinned: z.boolean().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, tagIds, ...updateData } = input;
        
        // If publishing for the first time, set publishedAt
        if (input.isPublished) {
          const existingPost = await db.getPostById(id);
          if (existingPost && !existingPost.isPublished && !existingPost.publishedAt) {
            (updateData as any).publishedAt = new Date();
          }
        }
        
        await db.updatePost(id, updateData);
        
        // Update tags if provided
        if (tagIds !== undefined) {
          // Remove existing tags
          const existingTags = await db.getTagsByPostId(id);
          for (const tag of existingTags) {
            await db.removeTagFromPost(id, tag.id);
          }
          
          // Add new tags
          for (const tagId of tagIds) {
            await db.addTagToPost(id, tagId);
          }
        }
        
        return { success: true };
      }),

    // Search posts
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const posts = await db.searchPosts(input.query);
        
        const postsWithDetails = await Promise.all(
          posts.map(async (post) => {
            const author = await db.getUserById(post.authorId);
            const tags = await db.getTagsByPostId(post.id);
            
            return {
              ...post,
              author: author ? { id: author.id, name: author.name } : null,
              tags,
            };
          })
        );
        
        return postsWithDetails;
      }),

    // Get posts by year
    getByYear: publicProcedure
      .input(z.object({ year: z.number() }))
      .query(async ({ input }) => {
        const posts = await db.getPostsByYear(input.year);
        
        const postsWithDetails = await Promise.all(
          posts.map(async (post) => {
            const author = await db.getUserById(post.authorId);
            const tags = await db.getTagsByPostId(post.id);
            
            return {
              ...post,
              author: author ? { id: author.id, name: author.name } : null,
              tags,
            };
          })
        );
        
        return postsWithDetails;
      }),

    // Get posts by series
    getBySeries: publicProcedure
      .input(z.object({ seriesId: z.number() }))
      .query(async ({ input }) => {
        const posts = await db.getPostsBySeries(input.seriesId);
        
        const postsWithDetails = await Promise.all(
          posts.map(async (post) => {
            const author = await db.getUserById(post.authorId);
            const tags = await db.getTagsByPostId(post.id);
            
            return {
              ...post,
              author: author ? { id: author.id, name: author.name } : null,
              tags,
            };
          })
        );
        
        return postsWithDetails;
      }),

    // Get posts by tag
    getByTag: publicProcedure
      .input(z.object({ tagId: z.number() }))
      .query(async ({ input }) => {
        const posts = await db.getPostsByTagId(input.tagId);
        
        const postsWithDetails = await Promise.all(
          posts.map(async (post) => {
            const author = await db.getUserById(post.authorId);
            const tags = await db.getTagsByPostId(post.id);
            
            return {
              ...post,
              author: author ? { id: author.id, name: author.name } : null,
              tags,
            };
          })
        );
        
        return postsWithDetails;
      }),
  }),

  tags: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllTags();
    }),

    create: adminProcedure
      .input(z.object({ name: z.string().min(1).max(100) }))
      .mutation(async ({ input }) => {
        const id = await db.createTag(input);
        return { id };
      }),
  }),

  series: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllSeries();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createSeries(input);
        return { id };
      }),
  }),

  comments: router({
    // Get comments by post ID
    getByPostId: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input, ctx }) => {
        const comments = await db.getCommentsByPostId(input.postId);
        
        // Get author info and check if current user liked each comment
        const commentsWithDetails = await Promise.all(
          comments.map(async (comment) => {
            const author = await db.getUserById(comment.authorId);
            const hasLiked = ctx.user ? await db.hasUserLikedComment(comment.id, ctx.user.id) : false;
            
            return {
              ...comment,
              author: author ? { id: author.id, name: author.name } : null,
              hasLiked,
            };
          })
        );
        
        return commentsWithDetails;
      }),

    // Create comment
    create: protectedProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string().min(1),
        parentId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createComment({
          ...input,
          authorId: ctx.user.id,
          status: 'approved', // Auto-approve for now, can be changed to 'pending'
        });
        
        return { id };
      }),

    // Like comment
    like: protectedProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const success = await db.likeComment(input.commentId, ctx.user.id);
        return { success };
      }),

    // Unlike comment
    unlike: protectedProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const success = await db.unlikeComment(input.commentId, ctx.user.id);
        return { success };
      }),

    // Get pending comments (admin only)
    getPending: adminProcedure.query(async () => {
      const comments = await db.getPendingComments();
      
      const commentsWithDetails = await Promise.all(
        comments.map(async (comment) => {
          const author = await db.getUserById(comment.authorId);
          const post = await db.getPostById(comment.postId);
          
          return {
            ...comment,
            author: author ? { id: author.id, name: author.name } : null,
            post: post ? { id: post.id, title: post.title } : null,
          };
        })
      );
      
      return commentsWithDetails;
    }),

    // Update comment status (admin only)
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected']),
      }))
      .mutation(async ({ input }) => {
        await db.updateCommentStatus(input.id, input.status);
        return { success: true };
      }),

    // Delete comment (admin only)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteComment(input.id);
        return { success: true };
      }),
  }),

  subscribers: router({
    // Subscribe to newsletter
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const existing = await db.getSubscriberByEmail(input.email);
        
        if (existing) {
          if (existing.isActive) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: '该邮箱已订阅' });
          } else {
            // Reactivate subscription
            await db.createSubscriber(input.email);
            return { success: true, message: '重新订阅成功' };
          }
        }
        
        const id = await db.createSubscriber(input.email);
        
        if (!id) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '订阅失败' });
        }
        
        return { success: true, message: '订阅成功' };
      }),

    // Unsubscribe from newsletter
    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await db.unsubscribe(input.email);
        return { success: true };
      }),

    // Get all active subscribers (admin only)
    getActive: adminProcedure.query(async () => {
      return await db.getActiveSubscribers();
    }),
  }),

  ai: router({
    // Generate summary from content
    generateSummary: adminProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: 'system',
                content: '你是一个专业的文章摘要生成助手。请根据给定的文章标题和内容，生成一个简洁、吸引人的摘要，长度在100-200字之间。摘要应该概括文章的核心要点，并能够吸引读者继续阅读。',
              },
              {
                role: 'user',
                content: `文章标题：${input.title}\n\n文章内容：${input.content.slice(0, 2000)}`,
              },
            ],
          });
          
          const summary = response.choices[0]?.message?.content || '';
          return { summary };
        } catch (error) {
          console.error('Failed to generate summary:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '生成摘要失败' });
        }
      }),

    // Generate cover image from title and keywords
    generateCoverImage: adminProcedure
      .input(z.object({
        title: z.string(),
        keywords: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const keywordsText = input.keywords && input.keywords.length > 0
            ? `, 关键词：${input.keywords.join(', ')}`
            : '';
          
          const prompt = `为博客文章创建一个现代、优雅的封面图片。文章标题："${input.title}"${keywordsText}。图片风格应该符合高端博客的美学，使用柔和的颜色，具有艺术感和现代感。`;
          
          const result = await generateImage({ prompt });
          
          return { coverImage: result.url };
        } catch (error) {
          console.error('Failed to generate cover image:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '生成封面图片失败' });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
