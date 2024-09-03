// File: app/api/tasks/route.ts
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
    const tasks = await prisma.task.findMany({
      where: { schedule: { userId: user.id } },
      include: { schedule: true, uploads: true },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authToken = getAuthToken(req);
  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await verifyAuthToken(authToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const taskData = await req.json();
    const newTask = await prisma.task.create({
      data: {
        title: taskData.title,
        emoji: taskData.emoji,
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        completed: taskData.completed,
        schedule: {
          connect: {
            id: taskData.scheduleId,
          },
        },
        uploads: {
          create: taskData.uploads.map((upload: { url: string; type: string }) => ({
            url: upload.url,
            type: upload.type,
            user: { connect: { id: user.id } },
          })),
        },
      },
      include: { schedule: true, uploads: true },
    });
    return NextResponse.json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
