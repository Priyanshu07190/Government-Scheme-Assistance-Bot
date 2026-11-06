import { NextResponse } from 'next/server';
import { findCSCCenters } from '@/lib/csc-locator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode') || undefined;
    const state = searchParams.get('state') || undefined;
    const district = searchParams.get('district') || undefined;

    const centers = findCSCCenters({ pincode, state, district });

    return NextResponse.json({
      success: true,
      count: centers.length,
      query: { pincode, state, district },
      centers
    }, { status: 200 });
  } catch (error: any) {
    console.error('CSC search API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to search CSC centers.'
    }, { status: 500 });
  }
}

