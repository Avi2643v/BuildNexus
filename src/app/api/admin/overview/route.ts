import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [usersCount, ordersCount, bookingsCount, materialsCount, pendingUsers, pendingOffers, cases] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.booking.count(),
      prisma.material.count(),
      prisma.user.findMany({ where: { status: 'PENDING' } }),
      prisma.offer.findMany({
        where: { status: 'APPROVED_PARTY' },
        include: { material: true, conversation: true },
      }),
      prisma.case.findMany({
        orderBy: { createdAt: 'desc' },
        include: { order: true, raisedBy: true },
      }),
    ]);

    // Financial revenue breakdown metrics
    const revenueStreams = {
      subscriptions: 45990,
      logistics: 18400,
      premiumListings: 12500,
      laborCommission: 8200,
      totalRevenue: 85090,
    };

    return NextResponse.json({
      success: true,
      stats: {
        usersCount,
        ordersCount,
        bookingsCount,
        materialsCount,
        openCasesCount: cases.length,
      },
      revenueStreams,
      pendingUsers,
      pendingOffers,
      cases,
    });
  } catch (error: any) {
    console.error('Error fetching admin overview:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
