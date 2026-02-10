import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "wouter";
import { Calendar, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type SortOption = 'publishedAt' | 'viewCount' | 'isPinned';

export default function FeaturedSlider() {
  const [sortBy, setSortBy] = useState<SortOption>('isPinned');
  
  const { data: posts, isLoading } = trpc.posts.getFeatured.useQuery({
    sortBy,
    limit: 5,
  });

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-secondary animate-pulse rounded-lg" />
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        暂无特色文章
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant={sortBy === 'isPinned' ? 'default' : 'outline'}
          onClick={() => setSortBy('isPinned')}
        >
          置顶优先
        </Button>
        <Button
          size="sm"
          variant={sortBy === 'publishedAt' ? 'default' : 'outline'}
          onClick={() => setSortBy('publishedAt')}
        >
          最新发布
        </Button>
        <Button
          size="sm"
          variant={sortBy === 'viewCount' ? 'default' : 'outline'}
          onClick={() => setSortBy('viewCount')}
        >
          最多浏览
        </Button>
      </div>

      {/* Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem key={post.id}>
              <Link href={`/post/${post.id}`}>
                <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
                  <div className="relative h-96">
                    {/* Cover Image */}
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                    )}
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                      {post.isPinned && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                            置顶
                          </span>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag.id}
                                className="text-xs bg-white/20 text-white px-2 py-1 rounded"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Title */}
                        <h2 className="text-3xl font-bold text-white line-clamp-2">
                          {post.title}
                        </h2>
                        
                        {/* Summary */}
                        {post.summary && (
                          <p className="text-white/90 line-clamp-2 text-lg">
                            {post.summary}
                          </p>
                        )}
                        
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString('zh-CN')
                                : '未发布'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.viewCount || 0} 次浏览</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
