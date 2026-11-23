import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractorId') || 'user-contractor-1';

    const listings = await prisma.material.findMany({
      where: {
        supplierId: contractorId,
        isContractorListing: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, listings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractorId, name, category, price, unit, stock, condition, city, image } = body;

    const listing = await prisma.material.create({
      data: {
        name,
        category: category || 'steel',
        price: parseFloat(price),
        unit: unit || 'kg',
        stock: parseInt(stock, 10),
        supplierId: contractorId || 'user-contractor-1',
        isContractorListing: true,
        condition: condition || 'SURPLUS',
        status: 'APPROVED', // Approve demo surplus listings automatically
        city: city || 'Bengaluru',
        image: image || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
        brand: 'Surplus Stock',
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
