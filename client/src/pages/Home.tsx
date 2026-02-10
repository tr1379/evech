import { trpc } from "@/lib/trpc";
import FeaturedSlider from "@/components/FeaturedSlider";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [page, setPage] = useState(0);
  const limit = 9;
  
  const { data: posts, isLoading } = trpc.posts.getPublished.useQuery({
    limit,
    offset: page * limit,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Featured Slider */}
      <section className="bg-gradient-to-b from-secondary to-background py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">欢迎来到 Evech</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              一个专注于长篇阅读体验的现代博客平台，分享深度思考与优质内容
            </p>
          </div>
          
          <FeaturedSlider />
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">最新文章</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={!posts || posts.length < limit}
                >
                  下一页
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              暂无文章
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">订阅我们的新闻通讯</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            订阅后，您将第一时间收到最新文章的推送通知
          </p>
          <a href="/subscribe">
            <Button size="lg" variant="default">
              立即订阅
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
