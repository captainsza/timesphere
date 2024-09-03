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
import GlassModal from '../GlassModal';
import { useMediaQuery } from 'react-responsive';
import { AIRecommendation, Schedule, Task } from '@/type';
import { motion } from 'framer-motion';
import TaskCompletionModal from '../GlassModal/CompletionModal';
import { getAuthHeader } from '@/lib/utils/auth';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTheme, setActiveTheme] = useState(themes.default);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [completedTask, setCompletedTask] = useState<Task | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { playSound } = useAudio();
  const { user, updateUserPoints } = useUser();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateTheme(new Date());
    }, 1000);

    if (user) {
      fetchTasks();
      fetchSchedules();
    }

    return () => clearInterval(timer);
  }, [user]);

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
  const handleAddSchedule = (schedule: Schedule) => {
    setSchedules([...schedules, schedule]);
  };
  const handleClockInteraction = (hour: number) => {
    playSound('clockClick');
    console.log(`Interacted with hour: ${hour}`);
    updateUserPoints(10);
    setModalOpen(true);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: getAuthHeader(),
        credentials: 'include',
      });
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'GET',
        headers: getAuthHeader(),
        credentials: 'include',
      });
      if (response.ok) {
        const schedulesData = await response.json();
        console.log('Fetched schedules:', schedulesData); // Add this line
        setSchedules(schedulesData);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleAddTask = async (task: Task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers:getAuthHeader(),
        body: JSON.stringify(task),
        credentials: 'include',
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include',
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
        if (updatedTask.completed) {
          setCompletedTask(updatedTask);
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers:getAuthHeader(),
        credentials: 'include',
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpload = async (file: File) => {
    if (!completedTask) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', completedTask.id);

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (response.ok) {
        const upload = await response.json();
        console.log('File uploaded successfully:', upload);
        // You might want to update the task or user state here
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
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

      {isModalOpen && (
  <GlassModal
    tasks={tasks}
    schedules={schedules}  // Make sure this prop is being passed
    onAddTask={handleAddTask}
    onUpdateTask={handleUpdateTask}
    onDeleteTask={handleDeleteTask}
    onAddSchedule={handleAddSchedule}
    onClose={() => setModalOpen(false)}
  />
)}

      {completedTask && (
        <TaskCompletionModal
          task={completedTask}
          onClose={() => setCompletedTask(null)}
          onUpload={handleUpload}
        />
      )}
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