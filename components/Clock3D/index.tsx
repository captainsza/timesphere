import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Lottie from 'react-lottie-player';
import type { Schedule } from '@/type';
import { Theme } from '@/styles/themes';

import morningAnimation from '@/public/assets/lottie/morning.json';
import dayAnimation from '@/public/assets/lottie/day.json';
import eveningAnimation from '@/public/assets/lottie/evening.json';
import nightAnimation from '@/public/assets/lottie/night.json';

interface Clock3DProps {
  time: Date;
  theme: Theme;
  onHourClick: (hour: number) => void;
  schedules: Schedule[];
}

const Clock3D: React.FC<Clock3DProps> = ({ time, theme, onHourClick, schedules }) => {
  const clockRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Group>(null);
  const centerPointRef = useRef<THREE.Group>(null);
  const { size, camera } = useThree();
  const scale = useMemo(() => Math.min(size.width, size.height) / 1000, [size]);

  // Load textures
  const clockFaceTexture = useTexture('/assets/images/3px-tile.png');
  const metalTexture = useTexture('/assets/images/metallic-surface-texture.jpg');

  useEffect(() => {
    if (clockFaceTexture) {
      clockFaceTexture.wrapS = clockFaceTexture.wrapT = THREE.RepeatWrapping;
      clockFaceTexture.repeat.set(1, 1);
    }
    if (metalTexture) {
      metalTexture.wrapS = metalTexture.wrapT = THREE.RepeatWrapping;
      metalTexture.repeat.set(4, 4);
    }
  }, [clockFaceTexture, metalTexture]);

  useFrame(() => {
    if (clockRef.current && hourHandRef.current && centerPointRef.current) {
      const elapsedTime = time.getTime() / 1000;
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();

      hourHandRef.current.rotation.z = -((hours % 12) / 12) * Math.PI * 2 - (minutes / 60 / 12) * Math.PI * 2 - (seconds / 3600 / 12) * Math.PI * 2;

      clockRef.current.rotation.y = Math.sin(elapsedTime * 0.1) * 0.05;
      clockRef.current.rotation.x = Math.cos(elapsedTime * 0.1) * 0.05;

      centerPointRef.current.rotation.z += 0.01;
    }
  });

  const createClockHand = () => (
    <group ref={hourHandRef} position={[0, 0, 0.4]}>
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[0.1, 2.5, 0.05]} />
        <meshStandardMaterial color={theme.hourHand} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <coneGeometry args={[0.2, 0.4, 32]} />
        <meshStandardMaterial color={theme.hourHand} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );

  const getLottieAnimationForCurrentTime = () => {
    const currentHour = time.getHours();
    if (currentHour >= 6 && currentHour < 12) {
      return morningAnimation;
    } else if (currentHour >= 12 && currentHour < 18) {
      return dayAnimation;
    } else if (currentHour >= 18 && currentHour < 22) {
      return eveningAnimation;
    } else {
      return nightAnimation;
    }
  };

  const createLottieAnimation = () => {
    const lottieAnimation = getLottieAnimationForCurrentTime();
    const lottieSize = Math.min(size.width, size.height) * 0.25; // Increased size by 20%
  
    return (
      <Html
        position={[-2, 3, 0.2]} // Moved slightly right and lower
        style={{
          width: `${lottieSize}px`,
          height: `${lottieSize}px`,
          transform: 'translate(50%, -50%)', // Adjust position relative to its center
        }}
      >
        <Lottie
          loop
          animationData={lottieAnimation}
          play
          style={{ width: '100%', height: '100%' }}
        />
      </Html>
    );
  };
  return (
    <group ref={clockRef} scale={[scale, scale, scale]}>
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial
          map={clockFaceTexture}
          metalness={0.3}
          roughness={0.7}
          color={theme.clockFace}
        />
      </mesh>

      <mesh position={[0, 0, -0.1]}>
        <ringGeometry args={[4, 4.3, 64]} />
        <meshStandardMaterial
          color={theme.clockFrame}
          metalness={0.8}
          roughness={0.2}
          map={metalTexture}
        />
      </mesh>

      <mesh position={[0, 0, 0.1]}>
        <ringGeometry args={[4.1, 4.3, 64]} />
        <meshBasicMaterial color={theme.clockFrame} transparent opacity={0.5} />
      </mesh>

      {/* Restore hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = ((i + 1) / 12) * Math.PI * 2;
        const x = Math.sin(angle) * 3.5;
        const y = Math.cos(angle) * 3.5;
        const position = new THREE.Vector3(x, y, 0.2);
        
        return (
          <group key={i} position={position} onClick={() => onHourClick((i + 1) % 12 || 12)}>
            <mesh>
              <boxGeometry args={[0.1, 0.5, 0.1]} />
              <meshStandardMaterial color={theme.hourMarker} metalness={0.8} roughness={0.2} />
            </mesh>
            <Text
              position={[0, 0.4, 0]}
              fontSize={0.4}
              color={theme.text}
              anchorX="center"
              anchorY="middle"
              font="/assets/fonts/NEON ABSOLUTE SANS1.ttf"
            >
              {(i + 1) % 12 || 12}
            </Text>
          </group>
        );
      })}

      {createClockHand()}

      <group ref={centerPointRef} position={[0, 0, 0.5]}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={theme.centerPoint} metalness={1} roughness={0} />
        </mesh>
        <pointLight color={theme.centerPoint} intensity={1} distance={1} />
      </group>

      {schedules.map((schedule, index) => {
        const angle = (schedule.hour / 12) * Math.PI * 2;
        const x = Math.sin(angle) * 3.8;
        const y = Math.cos(angle) * 3.8;
        return (
          <group key={index} position={[x, y, 0.3]}>
            <mesh>
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshStandardMaterial
                color={theme.scheduleIndicator}
                emissive={theme.scheduleIndicator}
                emissiveIntensity={0.5}
              />
            </mesh>
            <Text
              position={[0, 0.3, 0]}
              fontSize={0.2}
              color={theme.text}
              anchorX="center"
              anchorY="middle"
            >
              {schedule.title}
            </Text>
          </group>
        );
      })}

      <mesh position={[0, 0, -0.2]}>
        <circleGeometry args={[4.5, 64]} />
        <meshBasicMaterial
          color={theme.clockFace}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {createLottieAnimation()}
    </group>
  );
};

export default Clock3D;