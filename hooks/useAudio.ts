import { useCallback } from 'react';

export const useAudio = () => {
  const playSound = useCallback((soundName: string) => {
    const audio = new Audio(`/music/relaxing-145038.mp3`);
    audio.play();
  }, []);

  return { playSound };
};