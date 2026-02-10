import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, Eye, User } from "lucide-react";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    summary?: string | null;
    coverImage?: string | null;
    publishedAt?: Date | null;
    viewCount?: number | null;
    author?: { id: number; name: string | null } | null;
    tags?: { id: number; name: string }[];
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/post/${post.id}`}>
      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
        {/* Cover Image */}
        {post.coverImage ? (
          <div className="h-48 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10" />
        )}

        <CardHeader className="flex-1">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold line-clamp-2 mb-2">
            {post.title}
          </h3>

          {/* Summary */}
          {post.summary && (
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
              {post.summary}
            </p>
          )}
        </CardHeader>

        <CardFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {post.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{post.author.name || '匿名'}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('zh-CN')
                    : '未发布'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{post.viewCount || 0}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
