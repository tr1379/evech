import { eq, desc, and, or, like, sql, isNull, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  posts, InsertPost, 
  comments, InsertComment, 
  tags, InsertTag, 
  series, InsertSeries, 
  postTags, InsertPostTag,
  subscribers, InsertSubscriber,
  commentLikes, InsertCommentLike
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ========== User Functions ==========

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== Post Functions ==========

export async function createPost(post: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(posts).values(post);
  return result[0].insertId;
}

export async function updatePost(id: number, post: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(posts).set(post).where(eq(posts.id, id));
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPublishedPosts(limit?: number, offset?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(posts).where(eq(posts.isPublished, true)).orderBy(desc(posts.publishedAt));
  
  if (limit) query = query.limit(limit) as any;
  if (offset) query = query.offset(offset) as any;
  
  return await query;
}

export async function getFeaturedPosts(sortBy: 'publishedAt' | 'viewCount' | 'isPinned' = 'publishedAt', limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  let orderByClause;
  if (sortBy === 'isPinned') {
    orderByClause = [desc(posts.isPinned), desc(posts.publishedAt)];
  } else if (sortBy === 'viewCount') {
    orderByClause = [desc(posts.viewCount)];
  } else {
    orderByClause = [desc(posts.publishedAt)];
  }
  
  return await db.select().from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(...orderByClause)
    .limit(limit);
}

export async function incrementPostViewCount(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(posts).set({ 
    viewCount: sql`${posts.viewCount} + 1` 
  }).where(eq(posts.id, id));
}

export async function searchPosts(searchTerm: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(posts)
    .where(
      and(
        eq(posts.isPublished, true),
        or(
          like(posts.title, `%${searchTerm}%`),
          like(posts.content, `%${searchTerm}%`)
        )
      )
    )
    .orderBy(desc(posts.publishedAt));
}

export async function getPostsByYear(year: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(posts)
    .where(
      and(
        eq(posts.isPublished, true),
        sql`YEAR(${posts.publishedAt}) = ${year}`
      )
    )
    .orderBy(desc(posts.publishedAt));
}

export async function getPostsBySeries(seriesId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(posts)
    .where(
      and(
        eq(posts.isPublished, true),
        eq(posts.seriesId, seriesId)
      )
    )
    .orderBy(desc(posts.publishedAt));
}

export async function getPostsByTagId(tagId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const postTagResults = await db.select().from(postTags).where(eq(postTags.tagId, tagId));
  const postIds = postTagResults.map(pt => pt.postId);
  
  if (postIds.length === 0) return [];
  
  return await db.select().from(posts)
    .where(
      and(
        eq(posts.isPublished, true),
        inArray(posts.id, postIds)
      )
    )
    .orderBy(desc(posts.publishedAt));
}

// ========== Tag Functions ==========

export async function createTag(tag: InsertTag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(tags).values(tag);
  return result[0].insertId;
}

export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(tags).orderBy(tags.name);
}

export async function getTagById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTagsByPostId(postId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({ tag: tags })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, postId));
  
  return result.map(r => r.tag);
}

// ========== Series Functions ==========

export async function createSeries(s: InsertSeries) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(series).values(s);
  return result[0].insertId;
}

export async function getAllSeries() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(series).orderBy(series.name);
}

export async function getSeriesById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(series).where(eq(series.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== PostTag Functions ==========

export async function addTagToPost(postId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(postTags).values({ postId, tagId });
}

export async function removeTagFromPost(postId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(postTags).where(
    and(
      eq(postTags.postId, postId),
      eq(postTags.tagId, tagId)
    )
  );
}

// ========== Comment Functions ==========

export async function createComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(comments).values(comment);
  return result[0].insertId;
}

export async function getCommentsByPostId(postId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(comments)
    .where(
      and(
        eq(comments.postId, postId),
        eq(comments.status, "approved")
      )
    )
    .orderBy(comments.createdAt);
}

export async function getPendingComments() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(comments)
    .where(eq(comments.status, "pending"))
    .orderBy(desc(comments.createdAt));
}

export async function updateCommentStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(comments).set({ status }).where(eq(comments.id, id));
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(comments).where(eq(comments.id, id));
}

export async function getCommentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== Comment Like Functions ==========

export async function likeComment(commentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if already liked
  const existing = await db.select().from(commentLikes)
    .where(
      and(
        eq(commentLikes.commentId, commentId),
        eq(commentLikes.userId, userId)
      )
    )
    .limit(1);
  
  if (existing.length > 0) return false;
  
  await db.insert(commentLikes).values({ commentId, userId });
  await db.update(comments).set({ 
    likeCount: sql`${comments.likeCount} + 1` 
  }).where(eq(comments.id, commentId));
  
  return true;
}

export async function unlikeComment(commentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.delete(commentLikes)
    .where(
      and(
        eq(commentLikes.commentId, commentId),
        eq(commentLikes.userId, userId)
      )
    );
  
  if (result[0].affectedRows > 0) {
    await db.update(comments).set({ 
      likeCount: sql`${comments.likeCount} - 1` 
    }).where(eq(comments.id, commentId));
    return true;
  }
  
  return false;
}

export async function hasUserLikedComment(commentId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(commentLikes)
    .where(
      and(
        eq(commentLikes.commentId, commentId),
        eq(commentLikes.userId, userId)
      )
    )
    .limit(1);
  
  return result.length > 0;
}

// ========== Subscriber Functions ==========

export async function createSubscriber(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const result = await db.insert(subscribers).values({ email });
    return result[0].insertId;
  } catch (error) {
    // Handle duplicate email
    return null;
  }
}

export async function unsubscribe(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(subscribers)
    .set({ isActive: false, unsubscribedAt: new Date() })
    .where(eq(subscribers.email, email));
}

export async function getActiveSubscribers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subscribers)
    .where(eq(subscribers.isActive, true))
    .orderBy(desc(subscribers.subscribedAt));
}

export async function getSubscriberByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
