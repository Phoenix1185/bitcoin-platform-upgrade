import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, Eye, BookOpen } from 'lucide-react';

export default function BlogPage() {
  const { state } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const posts = state.blogPosts.filter(post => post.status === 'published');
  
  const categories = ['All', ...Array.from(new Set(posts.map(post => post.category)))];
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        {/* Hero Section */}
        <div className="relative py-12 md:py-20 border-b border-crypto-border">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-crypto-yellow/5 rounded-full blur-[100px] md:blur-[150px]" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-crypto-yellow/10 mb-4 md:mb-6">
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-crypto-yellow" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 md:mb-4">
              BitWealth <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-4">
              Stay informed with the latest news, insights, and educational content about cryptocurrency investment.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-crypto-card border-crypto-border text-white h-11 md:h-12"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs md:text-sm h-9 md:h-10 ${
                    selectedCategory === category
                      ? 'bg-crypto-yellow text-crypto-dark'
                      : 'border-crypto-border text-white hover:bg-crypto-card'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && selectedCategory === 'All' && !searchQuery && (
            <div className="mb-12 md:mb-16">
              <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 md:mb-6">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group glass-card rounded-xl md:rounded-2xl overflow-hidden hover:border-crypto-yellow/50 transition-all duration-300"
                  >
                    <div className="aspect-video bg-crypto-card relative overflow-hidden">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-crypto-yellow/10">
                          <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-crypto-yellow/50" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-crypto-yellow text-crypto-dark text-xs">Featured</Badge>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400 mb-2 md:mb-3">
                        <span className="text-crypto-yellow">{post.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-crypto-yellow transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3 md:mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {post.authorAvatar && (
                            <img src={post.authorAvatar} alt={post.author} className="w-6 h-6 rounded-full" />
                          )}
                          <span className="text-xs md:text-sm text-gray-400">{post.author}</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs md:text-sm text-gray-400">
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 md:mb-6">
              {searchQuery ? 'Search Results' : selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
            </h2>
            
            {regularPosts.length === 0 && featuredPosts.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-base md:text-lg">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {regularPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group glass-card rounded-xl overflow-hidden hover:border-crypto-yellow/50 transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-video bg-crypto-card relative overflow-hidden">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-crypto-yellow/10">
                          <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-crypto-yellow/50" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <span className="text-crypto-yellow">{post.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-crypto-yellow transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-crypto-border">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                          <span className="text-xs text-gray-400">{post.author}</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Eye className="w-3 h-3" />
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-crypto-border">
            <h3 className="text-lg md:text-xl font-display font-bold text-white mb-3 md:mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(posts.flatMap(post => post.tags))).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1.5 rounded-full bg-crypto-card border border-crypto-border text-gray-400 text-xs md:text-sm hover:border-crypto-yellow hover:text-crypto-yellow transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
