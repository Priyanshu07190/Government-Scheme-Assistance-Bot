import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Thread from '@/models/Thread';

// GET: Retrieve a single thread (if threadId provided) or all thread summaries for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const aadhaarNumber = searchParams.get('aadhaarNumber');
    const threadId = searchParams.get('threadId');

    if (!aadhaarNumber) {
      return NextResponse.json({ success: false, error: 'Aadhaar number is required.' }, { status: 400 });
    }

    await dbConnect();

    if (threadId) {
      // Fetch full details for a specific thread
      const thread = await Thread.findOne({ _id: threadId, aadhaarNumber });
      if (!thread) {
        return NextResponse.json({ success: false, error: 'Thread not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, thread }, { status: 200 });
    } else {
      // Fetch only metadata/summaries of all threads for this user to list in the sidebar
      const threads = await Thread.find(
        { aadhaarNumber },
        { _id: 1, title: 1, profile: 1, updatedAt: 1 }
      ).sort({ updatedAt: -1 });

      return NextResponse.json({ success: true, threads }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Failed to get threads:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error.' }, { status: 500 });
  }
}

// POST: Update a thread's metadata (e.g. updating profile variables or renaming title or clearing messages)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { threadId, aadhaarNumber, profile, title, messages } = body;

    if (!threadId || !aadhaarNumber) {
      return NextResponse.json({ success: false, error: 'Thread ID and Aadhaar number are required.' }, { status: 400 });
    }

    await dbConnect();

    // Verify ownership and update
    const thread = await Thread.findOne({ _id: threadId, aadhaarNumber });
    if (!thread) {
      return NextResponse.json({ success: false, error: 'Thread not found or access denied.' }, { status: 404 });
    }

    if (profile) {
      thread.profile = {
        ...thread.profile,
        ...profile
      };
    }

    if (title) {
      thread.title = title;
    }

    if (messages !== undefined) {
      thread.messages = messages;
    }

    await thread.save();

    return NextResponse.json({ success: true, message: 'Thread updated successfully.', thread }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to update thread:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error.' }, { status: 500 });
  }
}

// DELETE: Remove a thread
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const aadhaarNumber = searchParams.get('aadhaarNumber');
    const threadId = searchParams.get('threadId');

    console.log(`DELETE request received: threadId=${threadId}, aadhaarNumber=${aadhaarNumber}`);

    if (!threadId || !aadhaarNumber) {
      return NextResponse.json({ success: false, error: 'Thread ID and Aadhaar number are required.' }, { status: 400 });
    }

    await dbConnect();

    // Delete thread matching both ID and Aadhaar number for security
    const result = await Thread.deleteOne({ _id: threadId, aadhaarNumber });
    console.log(`DELETE operation result:`, result);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Thread not found or access denied.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Thread deleted successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to delete thread:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
