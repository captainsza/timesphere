import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { User } from '@/type'; // Adjust the import path as needed

export function getAuthToken(req: NextRequest): string | null {
  const authToken = req.cookies.get('auth_token')?.value;
  return authToken || null;
}

export async function verifyAuthToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

    // Map userId to id to be compatible with your Prisma schema
    return { ...payload, id: payload.userId } as User; // Assuming the payload contains the user information
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};
