import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Application from '../../../../models/Application';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing application reference ID.' }, { status: 400 });
    }

    const cleanId = id.trim().toUpperCase();
    
    // Exact search or case-insensitive match in MongoDB
    const application = await Application.findOne({
      applicationId: cleanId
    }).lean();

    if (!application) {
      return NextResponse.json({
        success: false,
        error: `No application record found with Reference ID "${cleanId}" in the National Database.`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      application
    });
  } catch (error: any) {
    console.error(`Error querying application ${params}:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing application reference ID.' }, { status: 400 });
    }

    const cleanId = id.trim().toUpperCase();
    const body = await request.json();

    const application = await Application.findOne({ applicationId: cleanId });
    if (!application) {
      return NextResponse.json({
        success: false,
        error: `No application record found with Reference ID "${cleanId}".`
      }, { status: 404 });
    }

    // Advance stage or update specific status
    if (body.advanceStage && application.currentStageNumber < 5) {
      const nextStageNum = application.currentStageNumber + 1;
      application.currentStageNumber = nextStageNum;

      // Update stage status in stages array
      application.stages = application.stages.map((stage: any) => {
        if (stage.stepNumber < nextStageNum) {
          return {
            ...stage,
            status: 'completed',
            completedDate: stage.completedDate || new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
        }
        if (stage.stepNumber === nextStageNum) {
          return {
            ...stage,
            status: nextStageNum === 5 ? 'completed' : 'in_progress',
            completedDate: nextStageNum === 5 ? new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined
          };
        }
        return stage;
      });

      if (nextStageNum === 3) {
        application.overallStatus = 'in_progress';
      } else if (nextStageNum === 4) {
        application.overallStatus = 'approved';
        if (application.paymentDetails) {
          application.paymentDetails.pfmsStatus = 'Validated';
        }
      } else if (nextStageNum === 5) {
        application.overallStatus = 'disbursed';
        if (application.paymentDetails) {
          application.paymentDetails.pfmsStatus = 'Validated';
          application.paymentDetails.utrNumber = `RBI-DBT-${Date.now().toString().slice(-8)}`;
          application.paymentDetails.disbursementDate = new Date().toLocaleDateString('en-GB');
        }
      }
    }

    if (body.overallStatus) {
      application.overallStatus = body.overallStatus;
    }

    if (body.actionRequired !== undefined) {
      application.actionRequired = body.actionRequired;
    }

    await application.save();

    return NextResponse.json({
      success: true,
      message: 'Application updated successfully in National Database.',
      application
    });
  } catch (error: any) {
    console.error('Error updating application in DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing application reference ID.' }, { status: 400 });
    }

    const cleanId = id.trim().toUpperCase();
    const deleted = await Application.findOneAndDelete({ applicationId: cleanId });

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: `No application record found with Reference ID "${cleanId}".`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Application ${cleanId} has been successfully withdrawn and deleted from the National Database.`
    });
  } catch (error: any) {
    console.error('Error deleting application from DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

