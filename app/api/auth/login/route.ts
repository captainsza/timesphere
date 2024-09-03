// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/utils/prisma/connect';

async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername;
  let counter = 1;
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  return username;
}

export async function POST(request: Request) {
  try {
    const { username, password, email } = await request.json();

    let user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      if (!email) {
        return NextResponse.json({ message: 'Email is required for new users' }, { status: 400 });
      }

      const uniqueUsername = await generateUniqueUsername(username);
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          username: uniqueUsername,
          password: hashedPassword,
          email,
          points: 0,
          level: 1,
        },
      });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    const response = NextResponse.json({ 
      message: user ? 'Login successful' : 'Account created successfully',
      user: { id: user.id, username: user.username, email: user.email }
    }, { status: 200 });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}