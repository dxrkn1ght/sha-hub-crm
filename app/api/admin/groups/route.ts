import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        students: { include: { user: true } },
        attendance: true,
      }
    });
    return NextResponse.json({ groups });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
