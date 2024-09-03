// File: app/api/tasks/[taskId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/utils/prisma/connect';
import { getAuthToken, verifyAuthToken } from '@/lib/utils/auth';

export async function PATCH(req: NextRequest, { params }: { params: { taskId: string } }) {
  const authToken = getAuthToken(req);

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await verifyAuthToken(authToken);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { taskId } = params;

  try {
    const updates = await req.json();
    const updatedTask = await prisma.task.update({
      where: { 
        id: taskId,
        schedule: { userId: user.id }
      },
      data: updates,
      include: { schedule: true },
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
  const authToken = getAuthToken(req);

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await verifyAuthToken(authToken);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { taskId } = params;

  try {
    await prisma.task.delete({
      where: { 
        id: taskId,
        schedule: { userId: user.id }
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}