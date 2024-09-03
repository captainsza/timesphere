// src/app/api/auth/check-user/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/utils/prisma/connect';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ message: 'Username is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking user existence:', error);
    return NextResponse.json({ message: 'An error occurred while checking user existence' }, { status: 500 });
  }
}