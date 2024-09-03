import { Schedule } from '@/type';
import { useState, useEffect } from 'react';

const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const schedulesData = await response.json();
        setSchedules(schedulesData);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return { schedules, setSchedules, fetchSchedules };
};

export default useSchedules;
