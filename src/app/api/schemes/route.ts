import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Scheme from '@/models/Scheme';
import { buildQueryFromProfile } from '@/lib/matcher';
import { UserProfile } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Build eligibility profile from search query params
    const profile: UserProfile = {};

    const ageParam = searchParams.get('age');
    if (ageParam) profile.age = parseInt(ageParam, 10);

    const genderParam = searchParams.get('gender');
    if (genderParam) {
      profile.gender = genderParam as any;
    }

    const categoryParam = searchParams.get('category');
    if (categoryParam) profile.category = categoryParam;

    const incomeParam = searchParams.get('income');
    if (incomeParam) profile.income = parseInt(incomeParam, 10);

    const occupationParam = searchParams.get('occupation');
    if (occupationParam) profile.occupation = occupationParam;

    const stateParam = searchParams.get('state');
    if (stateParam) profile.state = stateParam;

    await dbConnect();

    // Query schemes in MongoDB using our deterministic filters
    const query = buildQueryFromProfile(profile);
    const schemes = await Scheme.find(query).limit(50);

    return NextResponse.json({
      success: true,
      count: schemes.length,
      schemes
    }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to fetch filtered schemes list:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error occurred retrieving schemes.'
    }, { status: 500 });
  }
}
