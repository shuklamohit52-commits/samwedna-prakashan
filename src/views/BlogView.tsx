import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  ChevronLeft, 
  Share2, 
  Bookmark, 
  Tag 
} from 'lucide-react';
import { BLOG_POSTS } from '../data/mockData';
import { BlogPost } from '../types';

export const BlogView: React.FC = () => {
  const { setCurrentView, showToast } = useApp();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [blogSearch, setBlogSearch] = useState<string>('');

  const categories = ['All', 'Exam Strategy', 'Current Affairs', 'Subject Guide'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    if (filterCategory !== 'All' && post.category !== filterCategory) return false;
    if (blogSearch.trim()) {
      const q = blogSearch.toLowerCase();
      return post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q) || post.author.toLowerCase().includes(q);
    }
    return true;
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {!selectedPost ? (
        <>
          {/* Blog Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
                Samvedna Editorial Insights
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
                Exam Strategy, Current Affairs & Prep Guides
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
                Authored by senior academic mentors, ex-bureaucrats, and examination toppers. Master time allocation, previous year question trends, and high-yield topics.
              </p>
            </div>

            {/* Search within blog */}
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                value={blogSearch}
                onChange={(e) => setBlogSearch(e.target.value)}
                placeholder="Search articles & topics..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post Card */}
          {filteredPosts.length > 0 && (
            <div 
              onClick={() => setSelectedPost(filteredPosts[0])}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="text-indigo-600 font-bold uppercase">{filteredPosts[0].category}</span>
                    <span>·</span>
                    <span>{filteredPosts[0].date}</span>
                    <span>·</span>
                    <span>{filteredPosts[0].readTime}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display group-hover:text-indigo-600 transition-colors leading-tight">
                    {filteredPosts[0].title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{filteredPosts[0].author}</p>
                    <p className="text-slate-500 text-[11px]">{filteredPosts[0].authorRole}</p>
                  </div>

                  <span className="text-xs font-bold text-indigo-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Complete Guide <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 flex flex-col justify-between text-white relative">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 bg-white/10 px-2.5 py-1 rounded">
                    Staff Selection Commission Special
                  </span>
                  <h3 className="text-lg font-bold font-display mt-2">
                    90-Day Execution Blueprint
                  </h3>
                </div>
                <div className="my-auto py-6">
                  <BookOpen className="w-16 h-16 text-cyan-400/80 mx-auto" />
                </div>
                <p className="text-[11px] text-slate-300 italic text-center">
                  &quot;Time management accounts for over 40% of the final merit variance.&quot;
                </p>
              </div>
            </div>
          )}

          {/* Remaining Blog Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredPosts.slice(1).map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="text-indigo-600 font-bold uppercase">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-6">
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900 truncate max-w-[140px]">{post.author}</p>
                    <p className="text-slate-400 text-[10px]">{post.date}</p>
                  </div>

                  <span className="text-xs font-semibold text-indigo-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Detailed Article Reader View */
        <article className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <div className="space-y-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-indigo-600 font-bold uppercase">{selectedPost.category}</span>
              <span>·</span>
              <span>{selectedPost.date}</span>
              <span>·</span>
              <span>{selectedPost.readTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
              {selectedPost.title}
            </h1>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {selectedPost.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{selectedPost.author}</p>
                  <p className="text-[11px] text-slate-500">{selectedPost.authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Share Article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Article Prose */}
          <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-5">
            {selectedPost.content.split('\n\n').map((para: string, idx: number) => {
              if (para.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-slate-900 font-display pt-2">
                    {para.replace('### ', '')}
                  </h3>
                );
              }
              return <p key={idx} className="leading-relaxed">{para}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Topic Tags:</span>
            {selectedPost.tags.map((t: string, i: number) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                #{t}
              </span>
            ))}
          </div>

          {/* Promo CTA box inside article */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-cyan-300 uppercase">Recommended Study Material</p>
              <h4 className="text-base font-bold font-display mt-0.5">
                Practice with 2026 Latest Pattern Test Series
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Full-length mock tests strictly aligned with the strategy discussed above.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('product')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              Browse Books →
            </button>
          </div>
        </article>
      )}

    </div>
  );
};
