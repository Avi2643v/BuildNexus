import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, deliveryId, raisedById, type, description, photos } = body;

    const newCase = await prisma.case.create({
      data: {
        orderId,
        deliveryId,
        raisedById: raisedById || 'user-contractor-1',
        type, // DAMAGED, SHORT_QUANTITY, WRONG_ITEM
        description,
        photos,
        status: 'OPEN',
      },
    });

    return NextResponse.json({ success: true, case: newCase });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
