import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-contractor-1';

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        offers: {
          include: {
            material: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Fetch participant info for display
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const otherId =
          conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id;
        const otherUser = await prisma.user.findUnique({
          where: { id: otherId },
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
            rating: true,
            maskedGovtId: true,
          },
        });
        return {
          ...conv,
          otherUser,
        };
      })
    );

    return NextResponse.json({ success: true, conversations: enrichedConversations });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { participant1Id, participant2Id } = body;

    let conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id, participant2Id },
          { participant1Id: participant2Id, participant2Id: participant1Id },
        ],
      },
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          participant1Id,
          participant2Id,
        },
      });
    }

    return NextResponse.json({ success: true, conversation: conv });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
