import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const sort = searchParams.get('sort'); // price_asc, price_desc, rating

    const where: any = {
      status: 'APPROVED',
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (city) {
      where.city = city;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { category: { contains: search } },
      ];
    }

    let orderBy: any = { isBoosted: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };

    const materials = await prisma.material.findMany({
      where,
      orderBy,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            rating: true,
            city: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, materials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const material = await prisma.material.create({
      data: {
        name: body.name,
        category: body.category,
        price: parseFloat(body.price),
        unit: body.unit,
        stock: parseInt(body.stock, 10),
        supplierId: body.supplierId || 'user-supplier-1',
        brand: body.brand || 'Standard',
        image: body.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
        city: body.city || 'Bengaluru',
        isBoosted: body.isBoosted || false,
      },
    });

    return NextResponse.json({ success: true, material });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
