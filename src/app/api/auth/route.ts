import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();

    await dbConnect();

    // 1. REGISTER CITIZEN PROFILE LINKED TO AADHAAR
    if (action === 'register') {
      const { aadhaarNumber, name, age, gender, state, category, income, occupation } = body;

      if (!/^\d{12}$/.test(aadhaarNumber)) {
        return NextResponse.json({ success: false, error: 'Aadhaar number must be exactly 12 digits.' }, { status: 400 });
      }

      if (!name || !age || !gender || !state || !category || income === undefined || !occupation) {
        return NextResponse.json({ success: false, error: 'All registration profile fields are compulsory.' }, { status: 400 });
      }

      const existingUser = await User.findOne({ aadhaarNumber });
      if (existingUser) {
        return NextResponse.json({ success: false, error: 'User with this Aadhaar number already exists. Please login instead.' }, { status: 400 });
      }

      const newUser = await User.create({
        aadhaarNumber,
        name,
        age: parseInt(age, 10),
        gender,
        state,
        category,
        income: parseInt(income, 10),
        occupation,
      });

      return NextResponse.json({
        success: true,
        message: 'Registration successful! Proceed to login.',
        user: {
          aadhaarNumber: newUser.aadhaarNumber,
          name: newUser.name,
          age: newUser.age,
          gender: newUser.gender,
          state: newUser.state,
          category: newUser.category,
          income: newUser.income,
          occupation: newUser.occupation,
        }
      }, { status: 201 });
    }

    // 2. LOGIN (Verifies Aadhaar and triggers simulated OTP)
    if (action === 'login') {
      const { aadhaarNumber } = body;

      if (!/^\d{12}$/.test(aadhaarNumber)) {
        return NextResponse.json({ success: false, error: 'Aadhaar number must be exactly 12 digits.' }, { status: 400 });
      }

      const user = await User.findOne({ aadhaarNumber });
      if (!user) {
        return NextResponse.json({ success: false, error: 'Aadhaar number not registered. Please register first.' }, { status: 404 });
      }

      // Generate 6-digit OTP code for portal verification
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      return NextResponse.json({
        success: true,
        message: 'OTP sent to mobile linked to this Aadhaar.',
        otp: generatedOtp // Delivered via SMS gateway
      }, { status: 200 });
    }

    // 3. VERIFY SIMULATED OTP CODE
    if (action === 'verify-otp') {
      const { aadhaarNumber, otp, expectedOtp } = body;

      if (otp !== expectedOtp) {
        return NextResponse.json({ success: false, error: 'Invalid OTP code. Please enter the correct code.' }, { status: 400 });
      }

      const user = await User.findOne({ aadhaarNumber });
      if (!user) {
        return NextResponse.json({ success: false, error: 'Aadhaar user record not found.' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Aadhaar linked profile synced successfully!',
        user: {
          aadhaarNumber: user.aadhaarNumber,
          name: user.name,
          age: user.age,
          gender: user.gender,
          state: user.state,
          category: user.category,
          income: user.income,
          occupation: user.occupation,
        }
      }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: 'Invalid request action.' }, { status: 400 });

  } catch (error: any) {
    console.error('Auth handler exception:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal authentication service error.' }, { status: 500 });
  }
}
