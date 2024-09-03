// File: app/api/tasks/[taskId]/route.ts (continued)

import { getAuthToken, verifyAuthToken } from "@/lib/utils/auth";
import prisma from "@/lib/utils/prisma/connect";
import { NextRequest, NextResponse } from "next/server";

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
      data: {
        title: updates.title,
        emoji: updates.emoji,
        startTime: updates.startTime,
        endTime: updates.endTime,
        completed: updates.completed,
        schedule: updates.scheduleId ? {
          connect: { id: updates.scheduleId }
        } : undefined,
        uploads: {
          deleteMany: {}, // Remove existing uploads
          create: updates.uploads?.map((upload: { url: string; type: string }) => ({
            url: upload.url,
            type: upload.type,
            user: { connect: { id: user.id } },
          })) || [],
        },
      },
      include: { schedule: true, uploads: true },
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
    // First, delete associated uploads
    await prisma.upload.deleteMany({
      where: {
        taskId: taskId,
        task: { schedule: { userId: user.id } }
      }
    });

    // Then, delete the task
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