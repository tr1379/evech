import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import PostCard from "@/components/PostCard";
import { Search, Loader2, Calendar, Tag, BookOpen } from "lucide-react";
import { toast } from "sonner";

type FilterType = 'all' | 'year' | 'tag' | 'series' | 'search';

export default function Archive() {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<number | null>(null);

  // Fetch all posts by default
  const { data: allPosts, isLoading: allLoading } = trpc.posts.getPublished.useQuery(
    { limit: 100, offset: 0 },
    { enabled: filterType === 'all' }
  );

  // Search posts
  const { data: searchResults, isLoading: searchLoading } = trpc.posts.search.useQuery(
    { query: searchQuery },
    { enabled: filterType === 'search' && searchQuery.length > 0 }
  );

  // Filter by year
  const { data: yearPosts, isLoading: yearLoading } = trpc.posts.getByYear.useQuery(
    { year: selectedYear! },
    { enabled: filterType === 'year' && selectedYear !== null }
  );

  // Filter by tag
  const { data: tagPosts, isLoading: tagLoading } = trpc.posts.getByTag.useQuery(
    { tagId: selectedTag! },
    { enabled: filterType === 'tag' && selectedTag !== null }
  );

  // Filter by series
  const { data: seriesPosts, isLoading: seriesLoading } = trpc.posts.getBySeries.useQuery(
    { seriesId: selectedSeries! },
    { enabled: filterType === 'series' && selectedSeries !== null }
  );

  // Fetch tags and series for filters
  const { data: tags } = trpc.tags.getAll.useQuery();
  const { data: series } = trpc.series.getAll.useQuery();

  // Determine which posts to display
  let posts = allPosts || [];
  let isLoading = allLoading;

  if (filterType === 'search') {
    posts = searchResults || [];
    isLoading = searchLoading;
  } else if (filterType === 'year') {
    posts = yearPosts || [];
    isLoading = yearLoading;
  } else if (filterType === 'tag') {
    posts = tagPosts || [];
    isLoading = tagLoading;
  } else if (filterType === 'series') {
    posts = seriesPosts || [];
    isLoading = seriesLoading;
  }

  // Extract unique years from all posts
  const years = Array.from(
    new Set(
      allPosts
        ?.filter(p => p.publishedAt)
        .map(p => new Date(p.publishedAt!).getFullYear())
    )
  ).sort((a, b) => b - a);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('请输入搜索关键词');
      return;
    }
    setFilterType('search');
  };

  const resetFilters = () => {
    setFilterType('all');
    setSearchQuery('');
    setSelectedYear(null);
    setSelectedTag(null);
    setSelectedSeries(null);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">文章归档</h1>
          <p className="text-muted-foreground text-lg">
            浏览所有文章，按年份、标签或系列筛选
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8">
          <div className="flex gap-3">
            <Input
              placeholder="搜索文章标题或内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              搜索
            </Button>
          </div>
        </Card>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Year Filter */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">按年份</h3>
            </div>
            <div className="space-y-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedYear(year);
                    setFilterType('year');
                  }}
                >
                  {year}
                </Button>
              ))}
            </div>
          </Card>

          {/* Tag Filter */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">按标签</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tags?.map((tag) => (
                <Button
                  key={tag.id}
                  variant={selectedTag === tag.id ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedTag(tag.id);
                    setFilterType('tag');
                  }}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </Card>

          {/* Series Filter */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">按系列</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {series?.map((s) => (
                <Button
                  key={s.id}
                  variant={selectedSeries === s.id ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedSeries(s.id);
                    setFilterType('series');
                  }}
                >
                  {s.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Active Filter Display */}
        {filterType !== 'all' && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">当前筛选：</span>
            {filterType === 'search' && (
              <span className="text-sm font-semibold">搜索 "{searchQuery}"</span>
            )}
            {filterType === 'year' && (
              <span className="text-sm font-semibold">{selectedYear} 年</span>
            )}
            {filterType === 'tag' && (
              <span className="text-sm font-semibold">
                {tags?.find(t => t.id === selectedTag)?.name}
              </span>
            )}
            {filterType === 'series' && (
              <span className="text-sm font-semibold">
                {series?.find(s => s.id === selectedSeries)?.name}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              清除筛选
            </Button>
          </div>
        )}

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">未找到符合条件的文章</p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              查看所有文章
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
