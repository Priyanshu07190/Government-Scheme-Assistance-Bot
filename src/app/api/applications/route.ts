import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Application from '../../../models/Application';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const aadhaar = searchParams.get('aadhaar');
    const applicantName = searchParams.get('applicantName');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const filter: Record<string, any> = {};
    if (aadhaar && aadhaar !== 'guest') {
      filter.aadhaarNumber = aadhaar;
    } else if (applicantName && applicantName !== 'Guest Citizen' && applicantName !== 'Citizen Applicant') {
      filter.applicantName = new RegExp(applicantName, 'i');
    }

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      applications: applications.map(app => ({
        applicationId: app.applicationId,
        schemeName: app.schemeName,
        schemeFullName: app.schemeFullName,
        applicantName: app.applicantName,
        aadhaarLast4: app.aadhaarLast4,
        state: app.state,
        district: app.district,
        submissionDate: app.submissionDate,
        expectedResolutionDate: app.expectedResolutionDate,
        currentStageNumber: app.currentStageNumber,
        overallStatus: app.overallStatus,
        stages: app.stages,
        paymentDetails: app.paymentDetails
      }))
    });
  } catch (error: any) {
    console.error('Error fetching applications from DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const {
      applicationId,
      schemeId,
      schemeName,
      schemeFullName,
      applicantName,
      aadhaarNumber,
      state,
      district,
      category,
      annualIncome,
      mobile,
      verifiedDocumentsAttached
    } = body;

    if (!applicationId || !schemeName || !applicantName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required application fields: applicationId, schemeName, applicantName'
      }, { status: 400 });
    }

    const cleanId = applicationId.trim().toUpperCase();
    const cleanAadhaar = aadhaarNumber && aadhaarNumber !== 'guest' ? aadhaarNumber.replace(/\D/g, '') : '';
    const last4 = cleanAadhaar ? cleanAadhaar.slice(-4) : '9012';
    const citizenState = state || 'All States';
    const citizenDistrict = district || (citizenState !== 'All States' ? `${citizenState} Central` : 'District Headquarters');

    const today = new Date();
    const subDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const expDate = new Date(today.getTime() + 14 * 24 * 3600 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const defaultStages = [
      {
        id: 's1',
        stepNumber: 1,
        titleEn: 'Application Submitted & Acknowledgement Slip Issued',
        titleHi: 'आवेदन ऑनलाइन जमा व रसीद जारी',
        departmentEn: 'Common Service Center (CSC) / Citizen Portal',
        departmentHi: 'जन सेवा केंद्र / नागरिक सेवा पोर्टल',
        status: 'completed' as const,
        completedDate: `${subDate} ${today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        officerName: 'Portal Registry Desk',
        remarksEn: 'Application successfully registered and electronic KYC recorded.',
        remarksHi: 'आवेदन पत्र सफलतापूर्वक पंजीकृत किया गया एवं ई-केवाईसी पूर्ण।'
      },
      {
        id: 's2',
        stepNumber: 2,
        titleEn: 'Field Officer Document Verification & Scrutiny',
        titleHi: 'क्षेत्रीय राजस्व निरीक्षक द्वारा दस्तावेज़ सत्यापन',
        departmentEn: 'Block Development / Revenue Office',
        departmentHi: 'प्रखंड विकास / राजस्व कार्यालय',
        status: 'in_progress' as const,
        officerName: 'District Welfare Scrutiny Officer',
        remarksEn: 'Identity, residence, income, and category eligibility certificates under verification.',
        remarksHi: 'पहचान, निवास और पात्रता प्रमाणपत्रों का सत्यापन प्रक्रियाधीन।'
      },
      {
        id: 's3',
        stepNumber: 3,
        titleEn: 'Sanction & Approval by Competent Authority',
        titleHi: 'सक्षम प्राधिकारी द्वारा वित्तीय स्वीकृति',
        departmentEn: 'Office of the Tehsildar / District Welfare Officer',
        departmentHi: 'तहसीलदार कार्यालय / जिला कल्याण प्रशासन',
        status: 'pending' as const,
        officerName: 'Designated Sanctioning Officer',
        remarksEn: 'Pending completion of Field Verification.',
        remarksHi: 'क्षेत्रीय सत्यापन पूर्ण होने के पश्चात स्वीकृति विचारार्थ।'
      },
      {
        id: 's4',
        stepNumber: 4,
        titleEn: 'PFMS Validation & Bank Account NPCI Seeding',
        titleHi: 'पीएफएमएस बैंक खाता सत्यापन व एनपीसीआई जांच',
        departmentEn: 'Public Financial Management System (PFMS)',
        departmentHi: 'सार्वजनिक वित्तीय प्रबंधन प्रणाली (PFMS)',
        status: 'pending' as const,
        remarksEn: 'Bank account validation and Aadhaar payment bridge check initiates upon sanction.',
        remarksHi: 'स्वीकृति के बाद बैंक खाता डीबीटी लिंकिंग की पुष्टि होगी।'
      },
      {
        id: 's5',
        stepNumber: 5,
        titleEn: 'Direct Benefit Transfer (DBT) Grant Disbursement',
        titleHi: 'प्रत्यक्ष लाभ अंतरण (DBT) अनुदान भुगतान',
        departmentEn: 'State / Central Treasury / Reserve Bank of India',
        departmentHi: 'सरकारी कोषालय / भारतीय रिजर्व बैंक',
        status: 'pending' as const,
        remarksEn: 'DBT funds will be transferred directly to beneficiary Aadhaar-linked bank account.',
        remarksHi: 'अनुदान राशि सीधे आधार से जुड़े बैंक खाते में जमा की जाएगी।'
      }
    ];

    const paymentDetails = {
      amount: 5000,
      installmentNumber: 'Direct Welfare Benefit #1',
      bankName: 'Public Sector Commercial Bank',
      accountLast4: last4,
      ifscCode: 'SBIN0001000',
      pfmsStatus: 'Pending' as const,
      npciAadhaarSeeding: 'Active' as const
    };

    const applicationDoc = await Application.findOneAndUpdate(
      { applicationId: cleanId },
      {
        $set: {
          applicationId: cleanId,
          schemeId,
          schemeName,
          schemeFullName: schemeFullName || `${schemeName} (${cleanId})`,
          applicantName,
          aadhaarNumber: cleanAadhaar || undefined,
          aadhaarLast4: last4,
          state: citizenState,
          district: citizenDistrict,
          category,
          annualIncome,
          mobile,
          submissionDate: subDate,
          expectedResolutionDate: expDate,
          currentStageNumber: 2,
          overallStatus: 'in_progress',
          stages: defaultStages,
          paymentDetails,
          verifiedDocumentsAttached: verifiedDocumentsAttached || []
        }
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Application recorded successfully in National Database.',
      application: applicationDoc
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving application to DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

