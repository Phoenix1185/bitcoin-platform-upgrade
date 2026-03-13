import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Eye, Clock, Share2, Facebook, Twitter, Linkedin, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { state } = useStore();
  
  const post = state.blogPosts.find(p => p.slug === slug && p.status === 'published');
  
  // Get related posts
  const relatedPosts = state.blogPosts
    .filter(p => p.status === 'published' && p.id !== post?.id && p.category === post?.category)
    .slice(0, 3);

  useEffect(() => {
    if (!post) {
      toast.error('Article not found');
      navigate('/blog');
    }
    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [post, navigate]);

  if (!post) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const readTime = estimateReadTime(post.content);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this article: ${post.title}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-12">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8">
          <Link to="/blog">
            <Button variant="ghost" className="text-white hover:bg-crypto-card -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
            <Badge className="bg-crypto-yellow text-crypto-dark text-xs md:text-sm">{post.category}</Badge>
            {post.featured && (
              <Badge className="bg-green-500 text-white text-xs md:text-sm">Featured</Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base md:text-xl text-gray-400 mb-6 md:mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 md:py-6 border-y border-crypto-border mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              {post.authorAvatar ? (
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-crypto-yellow/20 flex items-center justify-center">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
                </div>
              )}
              <div>
                <p className="text-white font-medium text-sm md:text-base">{post.author}</p>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    {readTime} min read
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs md:text-sm text-gray-400">
                <Eye className="w-3 h-3 md:w-4 md:h-4" />
                {post.views.toLocaleString()} views
              </span>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-6 md:mb-10">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center gap-2 mb-6 md:mb-8">
            <span className="text-gray-400 text-sm mr-2">Share:</span>
            <button
              onClick={() => handleShare('twitter')}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-crypto-card flex items-center justify-center text-gray-400 hover:bg-crypto-yellow hover:text-crypto-dark transition-colors"
            >
              <Twitter className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-crypto-card flex items-center justify-center text-gray-400 hover:bg-crypto-yellow hover:text-crypto-dark transition-colors"
            >
              <Facebook className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-crypto-card flex items-center justify-center text-gray-400 hover:bg-crypto-yellow hover:text-crypto-dark transition-colors"
            >
              <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
              }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-crypto-card flex items-center justify-center text-gray-400 hover:bg-crypto-yellow hover:text-crypto-dark transition-colors"
            >
              <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none mb-10 md:mb-16
              prose-headings:text-white prose-headings:font-display
              prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-8 md:prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-6 md:prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 md:prose-p:mb-6
              prose-a:text-crypto-yellow prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-gray-300 prose-ul:mb-4 md:prose-ul:mb-6
              prose-ol:text-gray-300 prose-ol:mb-4 md:prose-ol:mb-6
              prose-li:mb-2
              prose-blockquote:border-crypto-yellow prose-blockquote:bg-crypto-card/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                className="px-3 py-1.5 rounded-full bg-crypto-card border border-crypto-border text-gray-400 text-sm hover:border-crypto-yellow hover:text-crypto-yellow transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 pt-8 md:pt-12 border-t border-crypto-border">
            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 md:mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group glass-card rounded-xl overflow-hidden hover:border-crypto-yellow/50 transition-all duration-300"
                >
                  <div className="aspect-video bg-crypto-card relative overflow-hidden">
                    {relatedPost.coverImage ? (
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-crypto-yellow/10">
                        <BookOpen className="w-8 h-8 text-crypto-yellow/50" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span className="text-crypto-yellow">{relatedPost.category}</span>
                      <span>•</span>
                      <span>{formatDate(relatedPost.publishedAt)}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-crypto-yellow transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
