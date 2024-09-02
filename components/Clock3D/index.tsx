import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Schedule } from '@/type';

interface Clock3DProps {
  time: Date;
  theme: any;
  onHourClick: (hour: number) => void;
  schedules: Schedule[];
}

const Clock3D: React.FC<Clock3DProps> = ({ time, theme, onHourClick, schedules }) => {
  const clockRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Group>(null);
  const centerPointRef = useRef<THREE.Group>(null);
  const { size } = useThree();

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

  return (
    <group ref={clockRef} scale={[scale, scale, scale]}>
      {/* Clock face */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial
          map={clockFaceTexture}
          metalness={0.3}
          roughness={0.7}
          color={theme.clockFace}
        />
      </mesh>

      {/* Clock frame */}
      <mesh position={[0, 0, -0.1]}>
        <ringGeometry args={[4, 4.3, 64]} />
        <meshStandardMaterial
          color={theme.clockFrame}
          metalness={0.8}
          roughness={0.2}
          map={metalTexture}
        />
      </mesh>

      {/* Outer ring with glow effect */}
      <mesh position={[0, 0, 0.1]}>
        <ringGeometry args={[4.1, 4.3, 64]} />
        <meshBasicMaterial color={theme.clockFrame} transparent opacity={0.5} />
      </mesh>

      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.sin(angle) * 3.5;
        const y = Math.cos(angle) * 3.5;
        return (
          <group key={i} position={[x, y, 0.2]} onClick={() => onHourClick(i + 1)}>
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
              {i + 1}
            </Text>
          </group>
        );
      })}

      {/* Hour hand */}
      {createClockHand()}

      {/* Center point */}
      <group ref={centerPointRef} position={[0, 0, 0.5]}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={theme.centerPoint} metalness={1} roughness={0} />
        </mesh>
        <pointLight color={theme.centerPoint} intensity={1} distance={1} />
      </group>

      {/* Schedule indicators */}
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

      {/* Holographic effect */}
      <mesh position={[0, 0, -0.2]}>
        <circleGeometry args={[4.5, 64]} />
        <meshBasicMaterial
          color={theme.clockFace}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default Clock3D;