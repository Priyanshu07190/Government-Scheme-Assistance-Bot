import { NextResponse } from 'next/server';
import { batchCrawlAllOpenSchemes } from '@/lib/dynamic-crawler';

export async function POST() {
  try {
    const results = await batchCrawlAllOpenSchemes();
    return NextResponse.json({
      success: true,
      message: 'Crawler cycle completed. New open schemes saved to database permanently.',
      results: {
        source: 'myScheme.gov.in & National Portal of India',
        schemesProcessed: results.schemesProcessed,
        schemesUpdated: results.schemesUpdated,
        totalSchemesInDatabase: results.totalSchemesInDatabase
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Crawl API route error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Scraper endpoint execution failed.'
    }, { status: 500 });
  }
}
