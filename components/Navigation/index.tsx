import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Home, Calendar, Settings, Award } from 'lucide-react';
import GlassModal from '../GlassModal';
import { themes } from '@/styles/themes';
import { Task } from '@/type';

interface NavigationProps {
  theme?: typeof themes.default;
}

const Navigation: React.FC<NavigationProps> = ({ theme = themes.default }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  return (
    <>
      <Nav>
        <NavItem whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Home color={theme.navIcon} />
        </NavItem>
        <NavItem
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
        >
          <Calendar color={theme.navIcon} />
        </NavItem>
        <NavItem whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Settings color={theme.navIcon} />
        </NavItem>
        <NavItem whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Award color={theme.navIcon} />
        </NavItem>
      </Nav>
      
      {isModalOpen && (
        <GlassModal
          tasks={tasks}
          onAddTask={handleAddTask}
          onClose={() => setModalOpen(false)}
          theme={theme}
        />
      )}
    </>
  );
};

const Nav = styled.nav`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 30px;
  backdrop-filter: blur(10px);
`;

const NavItem = styled(motion.div)`
  cursor: pointer;
`;

export default Navigation;
