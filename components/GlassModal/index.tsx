// components/GlassModal.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { XCircle, PlusCircle } from 'lucide-react';
import { Task } from '@/type';
import { themes } from '@/styles/themes';

interface GlassModalProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onClose: () => void;
  theme?: typeof themes.default;
}

const GlassModal: React.FC<GlassModalProps> = ({ tasks, onAddTask, onClose, theme = themes.default }) => {
  const [newTask, setNewTask] = useState<string>('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: crypto.randomUUID(),
        title: newTask,
        startTime: new Date(),
        endTime: new Date(),
        completed: false,
        scheduleId: '',
        schedule: {
          hour: 0,
          id: '',
          title: '',
          time: new Date(),
          icon: '',
          tasks: [],
          userId: '',
          user: {} as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      onAddTask(task);
      setNewTask('');
    }
  };

  return (
    <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalContainer
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-100vh', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        <Header>
          <Title>Tasks</Title>
          <CloseIcon onClick={onClose}>
            <XCircle color={theme.text} size={24} />
          </CloseIcon>
        </Header>
        <TaskList>
          {tasks.map((task) => (
            <TaskItem key={task.id}>
              <TaskIcon src={task.schedule.icon} alt={task.title} />
              <TaskTitle>{task.title}</TaskTitle>
            </TaskItem>
          ))}
        </TaskList>
        <InputContainer>
          <TaskInput
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />
          <AddButton onClick={handleAddTask}>
            <PlusCircle color={theme.clockFace} size={24} />
          </AddButton>
        </InputContainer>
      </ModalContainer>
    </Backdrop>
  );
};

export default GlassModal;

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.clockFrame};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.text};
`;

const CloseIcon = styled.div`
  cursor: pointer;
`;

const TaskList = styled.div`
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.scheduleIndicator};
  }
`;

const TaskIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const TaskTitle = styled.span`
  color: ${({ theme }) => theme.text};
`;

const InputContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const TaskInput = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.clockFrame};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.clockFace};
  }
`;

const AddButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  margin-left: 10px;
  background-color: ${({ theme }) => theme.clockFrame};
  border-radius: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.scheduleIndicator};
  }
`;

