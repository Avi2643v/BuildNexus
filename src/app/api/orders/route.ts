import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      contractorId,
      items,
      subtotal,
      gstAmount,
      deliveryFee,
      stagingFee,
      totalAmount,
      deliveryAddress,
      deliveryDate,
      deliveryTimeSlot,
    } = body;

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        contractorId: contractorId || 'user-contractor-1',
        subtotal: parseFloat(subtotal),
        gstAmount: parseFloat(gstAmount),
        deliveryFee: parseFloat(deliveryFee),
        stagingFee: parseFloat(stagingFee),
        totalAmount: parseFloat(totalAmount),
        deliveryAddress: deliveryAddress || 'Site Plot 42, Bellandur, Bengaluru',
        deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
        deliveryTimeSlot: deliveryTimeSlot || '10:00 AM - 01:00 PM',
        status: 'PLACED',
        items: {
          create: items.map((item: any) => ({
            materialId: item.materialId,
            supplierId: item.supplierId,
            quantity: item.quantity,
            unitPrice: item.negotiatedPrice || item.price,
            isNegotiated: !!item.negotiatedPrice,
          })),
        },
        delivery: {
          create: {
            agentId: 'user-delivery-1', // Default assigned demo delivery agent
            status: 'ASSIGNED',
            otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
          },
        },
      },
      include: {
        items: true,
        delivery: true,
      },
    });

    // Auto-create entry in Digital Notebook ("khata") for M6 tracking
    await prisma.notebookEntry.create({
      data: {
        contractorId: contractorId || 'user-contractor-1',
        projectId: 'proj-1',
        projectName: 'Main Site Villa Project',
        date: deliveryDate || new Date().toISOString().split('T')[0],
        type: 'MATERIAL',
        title: `Material Order #${order.id.slice(0, 8)}`,
        amount: parseFloat(totalAmount),
        notes: `Items received via BuildNexus Express Warehouse Staging. Delivery slot: ${deliveryTimeSlot}`,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
