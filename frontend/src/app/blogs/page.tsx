import React from 'react';
import Link from 'next/link';
import { Search, TrendingUp, ChevronRight, Calendar, User, Eye, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Hardcoded placeholder data matching the exact visual requirements from the mockup
const HERO_BLOG = {
  id: 'gen-z-wealth',
  title: 'Gen Z and the Gamification of Wealth',
  summary: 'Welcome to Tradox Capital! This comprehensive guide will help you understand the fundamentals of smart investing, the role of social interaction, and how trading platforms are evolving into communities.',
  author: 'Tradox Capital',
  date: '4 months ago',
  views: 16,
  category: 'consumer trends',
  imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' // Using an abstract finance image
};

const SUB_BLOGS = [
  {
    id: 'gen-z-gamification-2',
    title: 'Gen Z and the Gamification of Wealth',
    summary: 'For Generation Z, investing is social and interactive. Trading platforms are evolving into communities...',
    author: 'Tradox Capital',
    date: '5 months ago',
    views: 18,
    categories: ['consumer trends', 'design'],
    imageUrl: 'https://images.unsplash.com/photo-1579621970588-a3f5ce599827?auto=format&fit=crop&w=800&q=80' // piggy bank
  },
  {
    id: 'defi-vs-cefi',
    title: 'DeFi vs. CeFi: The Great Convergence',
    summary: 'The line between Decentralized Finance (DeFi) and Centralized Finance (CeFi) is blurring. Traditional...',
    author: 'Tradox Capital',
    date: '5 months ago',
    views: 1,
    categories: ['blockchain', 'crypto'],
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80' // bitcoin
  }
];

const CATEGORIES = [
  { name: 'All', count: null, active: true },
  { name: 'artificial intelligence', count: 1 },
  { name: 'consumer trends', count: 1 },
  { name: 'design', count: 1 }
];

const POPULAR_POSTS = [
  { rank: '01', title: 'Gen Z and the Gamification of Wealth' },
  { rank: '02', title: 'Gen Z and the Gamification of Wealth' },
  { rank: '03', title: 'Cybersecurity in the Age of Quantum' },
  { rank: '04', title: 'The Open Finance Revolution' },
  { rank: '05', title: 'Agentic AI: The New Financial Assistant' }
];

const TRENDING_TAGS = [
  'financial literacy', 'gen z', 'ai agents', 'api', 'api economy', 'automation', 'climate tech', 'cybersecurity', 'data privacy', 'embedded finance'
];

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary font-sans transition-colors duration-300">
      <Navbar />

      {/* Top Filter Bar */}
      <div className="border-b border-theme bg-theme-primary sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-end gap-4">
          <div className="relative w-64 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-theme rounded-md bg-theme-surface focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select className="text-sm border border-theme rounded-md px-3 py-2 bg-theme-surface focus:outline-none w-32">
              <option>All</option>
              <option>Finance</option>
              <option>Tech</option>
            </select>
            
            <select className="text-sm border border-theme rounded-md px-3 py-2 bg-theme-surface focus:outline-none w-32">
              <option>Latest</option>
              <option>Popular</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main 3-Column Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar: Categories */}
          <div className="w-full lg:w-64 flex-shrink-0 bg-theme-card border border-theme rounded-xl p-5 shadow-sm sticky top-36">
            <h3 className="font-bold text-theme-primary mb-4">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.name} 
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors ${cat.active ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-semibold' : 'text-theme-secondary hover:bg-theme-surface'}`}
                >
                  <span className="capitalize">{cat.name}</span>
                  {cat.count !== null && <span className="text-xs text-theme-muted">({cat.count})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Center Content: Blogs */}
          <div className="flex-1 space-y-8 min-w-0">
            
            {/* Hero Blog */}
            <Link href={`/blogs/${HERO_BLOG.id}`} className="block group">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                <img 
                  src={HERO_BLOG.imageUrl} 
                  alt={HERO_BLOG.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-3 leading-tight">{HERO_BLOG.title}</h2>
                  <p className="text-theme-secondary text-sm mb-6 line-clamp-2 max-w-2xl leading-relaxed">{HERO_BLOG.summary}</p>
                  
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-4 text-theme-secondary">
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {HERO_BLOG.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {HERO_BLOG.date}</span>
                      <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {HERO_BLOG.views}</span>
                    </div>
                    
                    <span className="flex items-center gap-1 bg-white text-black px-4 py-2 rounded-md font-bold hover:bg-slate-200 transition">
                      Read More <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Sub Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SUB_BLOGS.map(blog => (
                <Link key={blog.id} href={`/blogs/${blog.id}`} className="block group h-full">
                  <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.categories.map(cat => (
                          <span key={cat} className="px-3 py-1 rounded-full border border-theme bg-theme-surface text-theme-muted text-[10px] uppercase tracking-wider font-bold">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-theme-primary mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-theme-muted line-clamp-3 mb-6 flex-1">
                        {blog.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs font-semibold text-theme-faint border-t border-theme pt-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {blog.date}</span>
                          <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {blog.views}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-theme-muted" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[300px] flex-shrink-0 space-y-6">
            
            {/* Most Popular */}
            <div className="bg-theme-card border border-theme rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-theme-primary mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" /> Most Popular
              </h3>
              <div className="space-y-5">
                {POPULAR_POSTS.map(post => (
                  <Link key={post.rank} href="#" className="flex gap-4 group">
                    <span className="text-3xl font-black text-theme-faint group-hover:text-blue-500/30 transition-colors">{post.rank}</span>
                    <span className="text-sm font-semibold text-theme-primary group-hover:text-blue-600 transition-colors pt-1.5 leading-snug">{post.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-theme-card border border-theme rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-theme-primary mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-500" /> Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-theme-surface border border-theme text-[11px] font-semibold text-theme-secondary hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
          
        </div>

      </div>
    </div>
  );
}
