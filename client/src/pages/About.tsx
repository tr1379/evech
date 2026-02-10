import { Card } from "@/components/ui/card";
import { BookOpen, Heart, Users, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen py-16">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">关于 Evech</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            一个专注于长篇阅读体验的现代博客平台
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="p-8 mb-12">
          <div className="prose-article">
            <h2 className="mb-6">我们的使命</h2>
            <p>
              在这个信息碎片化的时代，Evech 致力于为深度思考和优质内容创造一个宁静的空间。
              我们相信，真正有价值的内容需要时间去沉淀，需要空间去展开，更需要读者用心去品味。
            </p>
            <p>
              Evech 不仅是一个博客平台，更是一个思想交流的社区。在这里，作者可以自由地表达观点，
              读者可以深入地参与讨论，每一篇文章都是一次思想的碰撞，每一条评论都是一次心灵的共鸣。
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">优质内容</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  精心策划的长篇文章，深度剖析各类话题，为读者提供有价值的思考和见解。
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">用心设计</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  优雅的排版、舒适的阅读体验，让每一次阅读都成为一种享受。
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">社区互动</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  活跃的评论系统，让读者与作者、读者与读者之间建立深度连接。
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI 赋能</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  智能摘要生成、自动封面创作，让内容创作更加高效和专业。
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact */}
        <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <h2 className="text-2xl font-bold mb-4">加入我们</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            如果您对 Evech 感兴趣，欢迎订阅我们的新闻通讯，
            第一时间获取最新文章和平台动态。
          </p>
          <a href="/subscribe">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              立即订阅
            </button>
          </a>
        </Card>
      </div>
    </div>
  );
}
