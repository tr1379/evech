import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = trpc.subscribers.subscribe.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || '订阅成功！');
      setIsSubscribed(true);
      setEmail('');
    },
    onError: (error) => {
      toast.error(error.message || '订阅失败，请稍后重试');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('请输入邮箱地址');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }
    
    subscribe.mutate({ email: email.trim() });
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">订阅新闻通讯</h1>
          <p className="text-muted-foreground text-lg">
            订阅 Evech 的新闻通讯，第一时间获取最新文章推送
          </p>
        </div>

        {/* Subscription Form */}
        {!isSubscribed ? (
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  邮箱地址
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg"
                  disabled={subscribe.isPending}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={subscribe.isPending}
              >
                {subscribe.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    订阅中...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-2" />
                    立即订阅
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">订阅后您将获得：</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>新文章发布时的即时邮件通知</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>文章摘要和阅读链接，方便快速浏览</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>随时可以取消订阅，不会收到垃圾邮件</span>
                </li>
              </ul>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">订阅成功！</h2>
            <p className="text-muted-foreground mb-6">
              感谢您的订阅！我们会在有新文章发布时第一时间通知您。
            </p>
            <a href="/">
              <Button variant="outline">返回首页</Button>
            </a>
          </Card>
        )}

        {/* Unsubscribe Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            已经订阅？
            <a href="/unsubscribe" className="text-primary hover:underline ml-1">
              取消订阅
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
