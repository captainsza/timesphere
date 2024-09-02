import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import type { AIRecommendation } from '@/type';

interface VirtualCompanionProps {
  theme?: any;
  recommendations: AIRecommendation[];
  animationPath?: string;
}

const VirtualCompanion: React.FC<VirtualCompanionProps> = ({ 
  theme, 
  recommendations,
  animationPath = '/animations/companion.json'
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState<AIRecommendation | null>(null);
  const [animationData, setAnimationData] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * recommendations.length);
      setCurrentRecommendation(recommendations[randomIndex]);
    }
  }, [recommendations]);

  useEffect(() => {
    const loadAnimationData = async () => {
      try {
        const response = await fetch(animationPath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load animation:', error);
        setLoadError('Failed to load animation');
      }
    };

    loadAnimationData();
  }, [animationPath]);

  const toggleCompanion = () => {
    setIsActive(!isActive);
  };

  if (loadError) {
    return <div>Error: {loadError}</div>;
  }

  return (
    <CompanionWrapper>
      <CompanionIcon onClick={toggleCompanion}>
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: 60, height: 60 }}
          />
        ) : (
          <div>Loading...</div>
        )}
      </CompanionIcon>
      <AnimatePresence>
        {isActive && currentRecommendation && (
          <RecommendationBubble
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {currentRecommendation.message}
          </RecommendationBubble>
        )}
      </AnimatePresence>
    </CompanionWrapper>
  );
};

const CompanionWrapper = styled.div`
  position: relative;
`;

const CompanionIcon = styled(motion.div)`
  cursor: pointer;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RecommendationBubble = styled(motion.div)`
  position: absolute;
  bottom: 70px;
  right: 0;
  background-color: ${props => props.theme.companionBubble};
  color: ${props => props.theme.text};
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export default VirtualCompanion;