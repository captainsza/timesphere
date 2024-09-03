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

export async function POST(req: NextRequest) {
  console.log('POST request received');

  const authToken = getAuthToken(req);
  console.log('Auth token:', authToken);

  if (!authToken) {
    console.log('No auth token found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await verifyAuthToken(authToken);
  console.log('Verified user:', user);

  if (!user || !user.id) {
    console.log('Unauthorized or invalid user');
    return NextResponse.json({ error: 'Unauthorized or Invalid User' }, { status: 401 });
  }

  try {
    const scheduleData = await req.json();
    console.log('Schedule data received:', scheduleData);

    // Ensure required fields are present
    if (!scheduleData.title || !scheduleData.time || !scheduleData.icon) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newSchedule = await prisma.schedule.create({
      data: {
        title: scheduleData.title,
        description: scheduleData.description,
        time: new Date(scheduleData.time),
        icon: scheduleData.icon,
        user: {
          connect: { id: user.id },  // Ensure user.id is defined and passed correctly
        },
      },
    });

    console.log('New schedule created:', newSchedule);
    return NextResponse.json(newSchedule, { status: 201 });

  } catch (error) {
    console.error('Error creating schedule:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
