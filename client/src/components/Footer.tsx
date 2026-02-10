import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Evech</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              一个专注于长篇阅读体验的现代博客平台，分享深度思考与优质内容。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-muted-foreground hover:text-primary transition-colors">
                  归档
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  关于
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">订阅通讯</h4>
            <p className="text-muted-foreground text-sm mb-4">
              订阅我们的新闻通讯，第一时间获取最新文章。
            </p>
            <Link href="/subscribe">
              <button className="text-sm text-primary hover:underline">
                立即订阅 →
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Evech. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}
