// /middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!));
    
    // You can add additional checks here if needed
    // For example, checking if the user still exists in the database

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware auth error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/:path*', '/profile/:path*'],
};