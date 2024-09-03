// File: app/api/schedules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/utils/prisma/connect';
import { getAuthToken, verifyAuthToken } from '@/lib/utils/auth';

export async function GET(req: NextRequest) {
  const authToken = getAuthToken(req);

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await verifyAuthToken(authToken);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const schedules = await prisma.schedule.findMany({
      where: { userId: user.id },
      include: { tasks: true },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}