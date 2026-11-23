import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, senderId, materialId, price, quantity, action, offerId, counterPrice } = body;

    // Action: CREATE, COUNTER, ACCEPT_PARTY, REJECT
    if (action === 'CREATE') {
      const offer = await prisma.offer.create({
        data: {
          conversationId,
          senderId,
          materialId,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
          status: 'SENT',
        },
      });

      // System message in chat
      await prisma.message.create({
        data: {
          conversationId,
          senderId,
          text: `[OFFER CREATED] Made an offer for ${quantity} units at ₹${price}/unit. Awaiting approval.`,
          isSystem: true,
        },
      });

      return NextResponse.json({ success: true, offer });
    }

    if (action === 'COUNTER') {
      const offer = await prisma.offer.update({
        where: { id: offerId },
        data: {
          counterPrice: parseFloat(counterPrice),
          status: 'COUNTERED',
        },
      });

      await prisma.message.create({
        data: {
          conversationId,
          senderId,
          text: `[OFFER COUNTERED] Countered offer with price ₹${counterPrice}/unit.`,
          isSystem: true,
        },
      });

      return NextResponse.json({ success: true, offer });
    }

    if (action === 'ACCEPT_PARTY') {
      // Approved by party -> status becomes APPROVED_PARTY, requires BuildNexus Admin Verification
      const offer = await prisma.offer.update({
        where: { id: offerId },
        data: {
          status: 'APPROVED_PARTY',
        },
      });

      await prisma.message.create({
        data: {
          conversationId,
          senderId,
          text: `[DEAL ACCEPTED BY PARTY] Party accepted offer! Deal submitted to BuildNexus Admin for central verification.`,
          isSystem: true,
        },
      });

      return NextResponse.json({ success: true, offer });
    }

    if (action === 'REJECT') {
      const offer = await prisma.offer.update({
        where: { id: offerId },
        data: { status: 'REJECTED' },
      });

      await prisma.message.create({
        data: {
          conversationId,
          senderId,
          text: `[OFFER REJECTED] Offer was rejected.`,
          isSystem: true,
        },
      });

      return NextResponse.json({ success: true, offer });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
