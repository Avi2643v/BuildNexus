import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { maskGovtId } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, role, govtIdType, govtIdNumber, otp } = body;

    // Validate simulated OTP (must be 123456)
    if (otp !== '123456') {
      return NextResponse.json(
        { error: 'Invalid OTP code. Please enter 123456 for demo verification.' },
        { status: 400 }
      );
    }

    if (!mobile || mobile.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const maskedId = maskGovtId(govtIdNumber || '123456781234');

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { mobile },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || 'New Construction User',
          mobile,
          role: role || 'CONTRACTOR',
          govtIdType: govtIdType || 'AADHAAR',
          maskedGovtId: maskedId,
          isVerified: true,
          status: 'APPROVED', // Approve demo accounts automatically
          city: 'Bengaluru',
        },
      });

      // If user is LABORER, create labor profile
      if (role === 'LABORER') {
        await prisma.laborProfile.create({
          data: {
            userId: user.id,
            dailyWage: 650,
            experienceYears: 3,
            fairWageGuarantee: true,
            skills: {
              create: [{ name: 'Brick Jointer' }, { name: 'Masala Mixer' }],
            },
          },
        });
      }
    } else {
      // Update masked ID & verification status
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          maskedGovtId: maskedId,
          isVerified: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Government ID simulation verification successful!',
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        maskedGovtId: user.maskedGovtId,
        isVerified: user.isVerified,
        status: user.status,
        city: user.city,
      },
    });
  } catch (error: any) {
    console.error('Error in verify-id API:', error);
    return NextResponse.json(
      { error: error.message || 'Verification failed.' },
      { status: 500 }
    );
  }
}
