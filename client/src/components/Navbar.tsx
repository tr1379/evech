import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">Evech</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              首页
            </Link>
            <Link href="/archive" className="text-foreground hover:text-primary transition-colors">
              归档
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              关于
            </Link>
            
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
                管理
              </Link>
            )}
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">你好，{user?.name || "用户"}</span>
                {user?.role === "admin" && (
                  <Link href="/admin/new-post">
                    <Button size="sm" variant="default">
                      写文章
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm" variant="outline">
                  登录
                </Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                首页
              </Link>
              <Link href="/archive" className="text-foreground hover:text-primary transition-colors">
                归档
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                关于
              </Link>
              
              {isAuthenticated && user?.role === "admin" && (
                <>
                  <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
                    管理
                  </Link>
                  <Link href="/admin/new-post">
                    <Button size="sm" variant="default" className="w-full">
                      写文章
                    </Button>
                  </Link>
                </>
              )}
              
              {!isAuthenticated && (
                <a href={getLoginUrl()}>
                  <Button size="sm" variant="outline" className="w-full">
                    登录
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
