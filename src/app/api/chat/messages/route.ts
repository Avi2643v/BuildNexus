import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { maskSensitiveText } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, senderId, text, imageUrl } = body;

    // Apply strict privacy masking to auto-hide phone numbers and email addresses
    const maskedText = maskSensitiveText(text || '');

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        text: maskedText,
        imageUrl,
      },
    });

    // Update conversation lastMessageAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
