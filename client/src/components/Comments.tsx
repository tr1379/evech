import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Heart, MessageCircle, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CommentsProps {
  postId: number;
}

interface CommentItemProps {
  comment: {
    id: number;
    content: string;
    createdAt: Date;
    likeCount: number;
    hasLiked: boolean;
    parentId: number | null;
    author: { id: number; name: string | null } | null;
  };
  onReply: (commentId: number) => void;
  onLike: (commentId: number) => void;
  onUnlike: (commentId: number) => void;
  isAuthenticated: boolean;
}

function CommentItem({ comment, onReply, onLike, onUnlike, isAuthenticated }: CommentItemProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">{comment.author?.name || '匿名用户'}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
          
          <p className="text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => comment.hasLiked ? onUnlike(comment.id) : onLike(comment.id)}
              disabled={!isAuthenticated}
              className={`flex items-center gap-1 text-sm transition-colors ${
                comment.hasLiked
                  ? 'text-red-500'
                  : 'text-muted-foreground hover:text-red-500'
              } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`h-4 w-4 ${comment.hasLiked ? 'fill-current' : ''}`} />
              <span>{comment.likeCount || 0}</span>
            </button>
            
            {isAuthenticated && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>回复</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function Comments({ postId }: CommentsProps) {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  
  const utils = trpc.useUtils();
  
  const { data: comments, isLoading } = trpc.comments.getByPostId.useQuery({ postId });
  
  const createComment = trpc.comments.create.useMutation({
    onSuccess: () => {
      setContent('');
      setReplyTo(null);
      utils.comments.getByPostId.invalidate({ postId });
      toast.success('评论发表成功');
    },
    onError: (error) => {
      toast.error('评论发表失败：' + error.message);
    },
  });
  
  const likeComment = trpc.comments.like.useMutation({
    onSuccess: () => {
      utils.comments.getByPostId.invalidate({ postId });
    },
  });
  
  const unlikeComment = trpc.comments.unlike.useMutation({
    onSuccess: () => {
      utils.comments.getByPostId.invalidate({ postId });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('请输入评论内容');
      return;
    }
    
    createComment.mutate({
      postId,
      content: content.trim(),
      parentId: replyTo || undefined,
    });
  };

  const handleReply = (commentId: number) => {
    setReplyTo(commentId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Organize comments into threads
  const topLevelComments = comments?.filter(c => !c.parentId) || [];
  const replies = comments?.filter(c => c.parentId) || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">评论区</h2>

      {/* Comment Form */}
      {isAuthenticated ? (
        <Card className="p-4">
          {replyTo && (
            <div className="mb-2 text-sm text-muted-foreground">
              回复评论 #{replyTo}
              <button
                onClick={() => setReplyTo(null)}
                className="ml-2 text-primary hover:underline"
              >
                取消
              </button>
            </div>
          )}
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的评论..."
            className="mb-3 min-h-24"
          />
          
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={createComment.isPending || !content.trim()}
            >
              {createComment.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  发表中...
                </>
              ) : (
                '发表评论'
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">登录后即可发表评论</p>
          <a href={getLoginUrl()}>
            <Button>登录</Button>
          </a>
        </Card>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <CommentItem
                comment={comment}
                onReply={handleReply}
                onLike={(id) => likeComment.mutate({ commentId: id })}
                onUnlike={(id) => unlikeComment.mutate({ commentId: id })}
                isAuthenticated={isAuthenticated}
              />
              
              {/* Nested Replies */}
              {replies
                .filter(r => r.parentId === comment.id)
                .map((reply) => (
                  <div key={reply.id} className="ml-12">
                    <CommentItem
                      comment={reply}
                      onReply={handleReply}
                      onLike={(id) => likeComment.mutate({ commentId: id })}
                      onUnlike={(id) => unlikeComment.mutate({ commentId: id })}
                      isAuthenticated={isAuthenticated}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          暂无评论，快来发表第一条评论吧！
        </div>
      )}
    </div>
  );
}
