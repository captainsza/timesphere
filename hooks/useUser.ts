// src/hooks/useUser.ts
import { useState, useCallback } from 'react';
import type { User } from '@/type';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  const updateUserPoints = useCallback((points: number) => {
    setUser(prevUser => {
      if (prevUser) {
        return { ...prevUser, points: prevUser.points + points };
      }
      return prevUser;
    });
  }, []);

  return { user, updateUserPoints };
};