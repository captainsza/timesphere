
// src/app/api/auth/status/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/utils/prisma/connect';
import { cookies } from 'next/headers';


export async function GET() {
        const authToken = cookies().get('auth_token')?.value;
      
        if (!authToken) {
          return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }
      
        try {
          const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET!) as { userId: string };
          const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });
      
          if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
          }
      
          return NextResponse.json({ 
            id: user.id, 
            username: user.username,
            points: user.points,
            level: user.level
          }, { status: 200 });
        } catch (error) {
          console.error('Auth status error:', error);
          return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
        }
      }