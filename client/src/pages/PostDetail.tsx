import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { useEffect } from "react";
import { Loader2, Calendar, Eye, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Streamdown } from "streamdown";
import Comments from "@/components/Comments";

export default function PostDetail() {
  const [, params] = useRoute("/post/:id");
  const postId = params?.id ? parseInt(params.id) : 0;

  const { data: post, isLoading, error } = trpc.posts.getById.useQuery(
    { id: postId },
    { enabled: postId > 0 }
  );

  const incrementView = trpc.posts.incrementView.useMutation();

  // Increment view count on mount
  useEffect(() => {
    if (postId > 0) {
      incrementView.mutate({ id: postId });
    }
  }, [postId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">文章未找到</h2>
          <Link href="/">
            <Button variant="outline">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-96 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Header */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{post.author.name || '匿名'}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '未发布'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span>{post.viewCount || 0} 次浏览</span>
            </div>
          </div>

          {/* Summary */}
          {post.summary && (
            <div className="bg-secondary/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="text-lg italic text-muted-foreground">{post.summary}</p>
            </div>
          )}

          {/* Series Info */}
          {post.series && (
            <div className="bg-accent/10 p-4 rounded-lg mb-8">
              <p className="text-sm text-muted-foreground">
                本文属于系列：
                <Link href={`/series/${post.series.id}`}>
                  <span className="text-primary font-semibold ml-2 hover:underline">
                    {post.series.name}
                  </span>
                </Link>
              </p>
            </div>
          )}

          {/* Article Content */}
          <div className="prose-article">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* Author Info */}
          {post.author && (
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    关于作者：{post.author.name || '匿名'}
                  </h3>
                  {post.author.email && (
                    <p className="text-muted-foreground">{post.author.email}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t">
            <Comments postId={postId} />
          </div>
        </div>
      </div>
    </article>
  );
}
