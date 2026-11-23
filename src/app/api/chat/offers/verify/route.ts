import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { offerId, adminId } = body;

    const offer = await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: 'VERIFIED_BUILDNEXUS',
      },
      include: {
        material: true,
      },
    });

    await prisma.message.create({
      data: {
        conversationId: offer.conversationId,
        senderId: adminId || 'user-admin-1',
        text: `[DEAL VERIFIED BY BUILDNEXUS] Negotiated rate of ₹${offer.counterPrice || offer.price}/${offer.material.unit} verified & locked. You can now checkout at negotiated price.`,
        isSystem: true,
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
