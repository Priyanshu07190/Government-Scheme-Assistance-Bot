import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import CitizenDocument from '../../../models/CitizenDocument';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const aadhaar = searchParams.get('aadhaar');

    // If no specific citizen Aadhaar is specified, return empty list (no cross-citizen leaking)
    if (!aadhaar || aadhaar === 'guest') {
      return NextResponse.json({
        success: true,
        documents: []
      });
    }

    const cleanAadhaar = aadhaar.replace(/\D/g, '');
    const docs = await CitizenDocument.find({ aadhaarNumber: cleanAadhaar })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      documents: docs.map(d => ({
        id: d.documentId,
        type: d.type,
        titleEn: d.titleEn,
        titleHi: d.titleHi,
        fileDetails: d.fileDetails,
        extractedData: d.extractedData,
        status: d.status,
        confidence: d.confidence,
        uploadedAt: d.uploadedAt
      }))
    });
  } catch (error: any) {
    console.error('Error fetching documents from DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { document, aadhaarNumber, applicantName } = body;

    if (!document || !document.type) {
      return NextResponse.json({ success: false, error: 'Document payload is required.' }, { status: 400 });
    }

    const cleanAadhaar = aadhaarNumber && aadhaarNumber !== 'guest' ? aadhaarNumber.replace(/\D/g, '') : undefined;
    const docId = document.id || `DOC-${document.type.toUpperCase()}-${Date.now()}`;

    const savedDoc = await CitizenDocument.findOneAndUpdate(
      {
        type: document.type,
        ...(cleanAadhaar ? { aadhaarNumber: cleanAadhaar } : { documentId: docId })
      },
      {
        $set: {
          documentId: docId,
          type: document.type,
          titleEn: document.titleEn,
          titleHi: document.titleHi,
          aadhaarNumber: cleanAadhaar,
          applicantName,
          fileDetails: document.fileDetails,
          extractedData: document.extractedData,
          status: document.status || 'verified',
          confidence: document.confidence || 0.98,
          uploadedAt: document.uploadedAt || new Date().toISOString()
        }
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Document saved to Citizen Vault in National Database.',
      document: savedDoc
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving document to DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const aadhaar = searchParams.get('aadhaar');
    const clearAll = searchParams.get('all') === 'true';

    if (clearAll) {
      const filter: Record<string, any> = {};
      if (aadhaar && aadhaar !== 'guest') filter.aadhaarNumber = aadhaar;
      await CitizenDocument.deleteMany(filter);
      return NextResponse.json({ success: true, message: 'All documents cleared from Database.' });
    }

    if (!type) {
      return NextResponse.json({ success: false, error: 'Document type is required.' }, { status: 400 });
    }

    const filter: Record<string, any> = { type };
    if (aadhaar && aadhaar !== 'guest') filter.aadhaarNumber = aadhaar;
    await CitizenDocument.deleteOne(filter);

    return NextResponse.json({ success: true, message: `Document ${type} removed from Database.` });
  } catch (error: any) {
    console.error('Error deleting document from DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

