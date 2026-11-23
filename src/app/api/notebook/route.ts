import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractorId') || 'user-contractor-1';
    const type = searchParams.get('type');

    const where: any = { contractorId };
    if (type && type !== 'ALL') {
      where.type = type;
    }

    const entries = await prisma.notebookEntry.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ success: true, entries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry = await prisma.notebookEntry.create({
      data: {
        contractorId: body.contractorId || 'user-contractor-1',
        projectId: body.projectId || 'proj-1',
        projectName: body.projectName || 'Main Site Villa Project',
        date: body.date || new Date().toISOString().split('T')[0],
        type: body.type, // ATTENDANCE, MATERIAL, EXPENSE, PAYMENT
        title: body.title,
        amount: parseFloat(body.amount || 0),
        workerName: body.workerName,
        wagePromised: body.wagePromised ? parseFloat(body.wagePromised) : null,
        wagePaid: body.wagePaid ? parseFloat(body.wagePaid) : null,
        notes: body.notes,
        syncStatus: 'SYNCED',
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
