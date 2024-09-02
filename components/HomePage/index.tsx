import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { themes } from '@/styles/themes';
import { useAudio } from '@/hooks/useAudio';
import { useUser } from '@/hooks/useUser';
import Clock3D from '../Clock3D';
import Navigation from '../Navigation';
import VirtualCompanion from '../VirtualCompanion';
import Footer from '../footer';
import { useMediaQuery } from 'react-responsive';
import { AIRecommendation, Schedule } from '@/type';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTheme, setActiveTheme] = useState(themes.default);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { playSound } = useAudio();
  const { user, updateUserPoints } = useUser();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateTheme(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateTheme = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) {
      setActiveTheme(themes.morning);
    } else if (hour >= 12 && hour < 18) {
      setActiveTheme(themes.default);
    } else if (hour >= 18 && hour < 22) {
      setActiveTheme(themes.evening);
    } else {
      setActiveTheme(themes.night);
    }
  };

  const handleClockInteraction = (hour: number) => {
    playSound('clockClick');
    console.log(`Interacted with hour: ${hour}`);
    updateUserPoints(10);
  };

  return (
    <StyledHomePage theme={activeTheme}>
      <CanvasWrapper>
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Clock3D
            time={currentTime}
            theme={activeTheme}
            onHourClick={handleClockInteraction}
            schedules={schedules}
          />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </CanvasWrapper>
      
      <Navigation theme={activeTheme} />
      
      <VirtualCompanionWrapper>
        <VirtualCompanion
          theme={activeTheme}
          recommendations={recommendations}
        />
      </VirtualCompanionWrapper>
      
      <Footer theme={activeTheme} />
    </StyledHomePage>
  );
};

const StyledHomePage = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background 0.5s ease;
`;

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const VirtualCompanionWrapper = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

export default HomePage;
