import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MailX, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Unsubscribe() {
  const [email, setEmail] = useState('');
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  const unsubscribe = trpc.subscribers.unsubscribe.useMutation({
    onSuccess: () => {
      toast.success('取消订阅成功');
      setIsUnsubscribed(true);
      setEmail('');
    },
    onError: (error) => {
      toast.error(error.message || '取消订阅失败，请稍后重试');
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
    
    unsubscribe.mutate({ email: email.trim() });
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
            <MailX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">取消订阅</h1>
          <p className="text-muted-foreground text-lg">
            很遗憾看到您离开，输入您的邮箱地址以取消订阅
          </p>
        </div>

        {/* Unsubscribe Form */}
        {!isUnsubscribed ? (
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
                  disabled={unsubscribe.isPending}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                variant="destructive"
                className="w-full"
                disabled={unsubscribe.isPending}
              >
                {unsubscribe.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <MailX className="h-5 w-5 mr-2" />
                    确认取消订阅
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                改变主意了？
                <a href="/subscribe" className="text-primary hover:underline ml-1">
                  重新订阅
                </a>
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">取消订阅成功</h2>
            <p className="text-muted-foreground mb-6">
              您已成功取消订阅，不会再收到我们的邮件通知。
            </p>
            <div className="flex gap-3 justify-center">
              <a href="/">
                <Button variant="outline">返回首页</Button>
              </a>
              <a href="/subscribe">
                <Button>重新订阅</Button>
              </a>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
