// app/api/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name, role } = body;

  const user = await prisma.user.create({
    data: { email, password, name, role },
  });

  return NextResponse.json(user, { status: 201 });
}