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
    console.log('Received request:', request);

    const { username, password } = await request.json();
    console.log('Parsed request body:', { username, password });

    let user = await prisma.user.findUnique({ where: { username } });
    console.log('Fetched user from database:', user);

    if (!user) {
      console.log('User not found, creating new user');
      const uniqueUsername = await generateUniqueUsername(username);
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          username: uniqueUsername,
          password: hashedPassword,
          points: 0,
          level: 1,
        },
      });
      console.log('Created new user:', user);
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password validation result:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Invalid password');
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    console.log('Generated JWT token:', token);

    const response = NextResponse.json({ 
      message: 'Login successful',
      user: { id: user.id, username: user.username }
    }, { status: 200 });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });

    console.log('Response with cookie set:', response);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}