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
      include: { schedule: true },
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
              id: taskData.id,
              title: taskData.title,
              startTime: taskData.startTime,
              endTime: taskData.endTime,
              completed: taskData.completed,
              createdAt: taskData.createdAt,
              updatedAt: taskData.updatedAt,
              schedule: {
                connect: {
                  id: taskData.scheduleId,
                },
              },
              uploads: {
                connect: taskData.uploads,  // If you are linking existing uploads, ensure this is correctly structured
              },
            },
            include: { schedule: true },
          });
          return NextResponse.json(newTask);
        } catch (error) {
          console.error('Error creating task:', error);
          return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
      }
      