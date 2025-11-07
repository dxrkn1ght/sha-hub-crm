import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, name, password, email, phone } = body;
    if (!username || !password) {
      return NextResponse.json({ error: 'username and password required' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: 'username exists' }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashed,
        role: 'student',
        student: {
          create: {
            phone
          }
        }
      },
      include: { student: true }
    });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
