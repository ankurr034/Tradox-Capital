import React from 'react';
import { prisma } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, BookmarkPlus, ExternalLink } from 'lucide-react';

export default async function ArticleReaderPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const article = await prisma.article.findUnique({
    where: { id }
  });

  if (!article) {
    notFound();
  }

  // Fetch related articles
  let relatedWhere: any = { id: { not: id } };
  if (article.relatedSymbol) relatedWhere.relatedSymbol = article.relatedSymbol;
  else if (article.relatedIndex) relatedWhere.relatedIndex = article.relatedIndex;
  else relatedWhere.category = article.category;

  const relatedArticles = await prisma.article.findMany({
    where: relatedWhere,
    take: 3,
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Top Navbar specifically for Reader */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/news" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition font-bold text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to News
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition">
              <BookmarkPlus className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg">
              {article.category}
            </span>
            {article.relatedSymbol && (
              <Link href={`/stocks/${article.relatedSymbol}`} className="text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition">
                {article.relatedSymbol}
              </Link>
            )}
            {article.relatedIndex && (
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                {article.relatedIndex}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                {article.author ? article.author.charAt(0) : 'S'}
              </div>
              <div>
                <div className="text-slate-900 dark:text-white">{article.author || article.source}</div>
                <div className="text-xs font-semibold">{article.source}</div>
              </div>
            </div>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {article.readTime} min read</div>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-10 border border-slate-200 dark:border-slate-800">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Summary (TLDR) */}
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-6 mb-10">
          <h3 className="font-black text-blue-800 dark:text-blue-400 mb-2">TL;DR</h3>
          <p className="font-semibold text-blue-900/80 dark:text-blue-300/80 text-lg leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Full Content */}
        <div 
          className="prose prose-lg prose-slate dark:prose-invert max-w-none font-medium leading-relaxed mb-16"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tag & Action Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-500">Market Impact:</span>
            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
              article.impact === 'POSITIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 
              article.impact === 'NEGATIVE' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 
              'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {article.impact}
            </span>
          </div>
          
          {article.relatedSymbol && (
            <Link href={`/stocks/${article.relatedSymbol}`} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition">
              Trade {article.relatedSymbol} <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Related News */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
            <h3 className="text-2xl font-black mb-8">Related News</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(rel => (
                <Link key={rel.id} href={`/news/${rel.id}`} className="group block">
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 h-full hover:shadow-md transition">
                    <div className="text-[10px] font-black text-blue-600 mb-2 uppercase">{rel.source}</div>
                    <h4 className="font-bold line-clamp-3 group-hover:text-blue-600 transition leading-snug mb-3">
                      {rel.title}
                    </h4>
                    <div className="text-xs font-semibold text-slate-500">
                      {new Date(rel.publishedAt).toLocaleDateString()} • {rel.readTime} min read
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
