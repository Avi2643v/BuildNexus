import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId') || 'user-delivery-1';

    const deliveries = await prisma.delivery.findMany({
      where: { agentId },
      include: {
        order: {
          include: {
            contractor: true,
            items: {
              include: { material: true },
            },
          },
        },
        cases: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, deliveries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deliveryId, status, itemMatches, quantityVerified, otpCode, deliveryNotes } = body;

    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Verify delivery OTP code if completing delivery
    if (status === 'DELIVERED' && otpCode !== delivery.otpCode) {
      return NextResponse.json(
        { error: 'Invalid Delivery OTP code. Please enter the 4-digit code provided by contractor.' },
        { status: 400 }
      );
    }

    const updated = await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        status,
        itemMatches: itemMatches !== undefined ? itemMatches : delivery.itemMatches,
        quantityVerified: quantityVerified !== undefined ? quantityVerified : delivery.quantityVerified,
        deliveryNotes,
      },
    });

    // Update parent order status
    await prisma.order.update({
      where: { id: delivery.orderId },
      data: { status },
    });

    return NextResponse.json({ success: true, delivery: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
