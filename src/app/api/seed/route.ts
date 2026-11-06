import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Scheme from '@/models/Scheme';
import { SEED_SCHEMES } from '@/lib/schemes-seed';

export async function POST() {
  try {
    await dbConnect();

    // Drop the collection completely to clear old, cached indexes in MongoDB Atlas
    try {
      await Scheme.collection.drop();
    } catch (e) {
      // Ignore if collection doesn't exist yet
    }

    // Bulk insert the 30 schemes (Mongoose will auto-create the collection and new index)
    const inserted = await Scheme.insertMany(SEED_SCHEMES);

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded with ${inserted.length} schemes.`,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Seeding database failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown database seeding error',
    }, { status: 500 });
  }
}
