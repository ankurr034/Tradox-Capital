import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

let newsCache: { data: any[] | null; ts: number } = { data: null, ts: 0 };
const NEWS_CACHE_TTL = 120_000; // 2 minutes

function stripHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function parseRssItems(xml: string, sourceName: string) {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
    const block = match[1];
    const getTag = (tag: string) => {
      const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const m = block.match(re);
      return m ? stripHtml(m[1]) : '';
    };

    const title = getTag('title');
    const link = getTag('link') || getTag('guid');
    const description = getTag('description');
    const pubDate = getTag('pubDate');

    // Extract image from media:content or enclosure
    let image = '';
    const mediaMatch = block.match(/url=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)/i);
    if (mediaMatch) image = mediaMatch[1];
    if (!image) {
      const encMatch = block.match(/<enclosure[^>]+url=["']([^"']+)/i);
      if (encMatch) image = encMatch[1];
    }
    if (!image) {
      const imgMatch = description ? description.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)/i) : null;
      if (imgMatch) image = imgMatch[1];
    }

    if (title) {
      items.push({
        title,
        link,
        description: stripHtml(description).substring(0, 200),
        pubDate,
        image,
        source: sourceName,
      });
    }
  }
  return items;
}

async function fetchMarketNews() {
  const now = Date.now();
  if (newsCache.data && now - newsCache.ts < NEWS_CACHE_TTL) {
    return newsCache.data;
  }

  const feeds = [
    { url: 'https://www.livemint.com/rss/markets', name: 'LiveMint' },
    { url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', name: 'Economic Times' },
    { url: 'https://www.moneycontrol.com/rss/latestnews.xml', name: 'Moneycontrol' },
    { url: 'https://www.business-standard.com/rss/markets-106.rss', name: 'Business Standard' },
    { url: 'https://feeds.feedburner.com/ndtvprofit-latest', name: 'NDTV Profit' }
  ];

  let allItems: any[] = [];

  for (const feed of feeds) {
    try {
      const resp = await axios.get(feed.url, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'application/rss+xml, application/xml, text/xml, */*',
        },
      });
      const items = parseRssItems(resp.data, feed.name);
      allItems = allItems.concat(items);
    } catch (err: any) {
      console.error(`[market-news] Failed to fetch ${feed.url}: ${err?.message}`);
    }
  }

  // Deduplicate by title and sort by date
  const seen = new Set<string>();
  allItems = allItems.filter((item) => {
    if (seen.has(item.title)) return false;
    seen.add(item.title);
    return true;
  });

  allItems.sort((a, b) => {
    const d1 = new Date(a.pubDate).getTime() || 0;
    const d2 = new Date(b.pubDate).getTime() || 0;
    return d2 - d1;
  });

  // Keep top 60 items in cache
  allItems = allItems.slice(0, 60);

  newsCache = {
    data: allItems,
    ts: Date.now(),
  };

  return allItems;
}

export async function GET() {
  try {
    const items = await fetchMarketNews();
    return NextResponse.json({ success: true, data: items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
