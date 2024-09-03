import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Home, Calendar, Settings, Award, LogIn, LogOut, User } from 'lucide-react';
import GlassModal from '../GlassModal';
import { themes } from '@/styles/themes';
import { Task } from '@/type';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  theme?: typeof themes.default;
}

const Navigation: React.FC<NavigationProps> = ({ theme = themes.default }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <Nav>
        <NavItem whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/">
            <Home color={theme.navIcon} />
          </Link>
        </NavItem>
        {user && (
          <>
            <NavItem
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen(true)}
            >
              <Calendar color={theme.navIcon} />
            </NavItem>
            <NavItem whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/settings">
                <Settings color={theme.navIcon} />
              </Link>
            </NavItem>
            <NavItem whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/achievements">
                <Award color={theme.navIcon} />
              </Link>
            </NavItem>
            <NavItem whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/profile">
                <User color={theme.navIcon} />
              </Link>
            </NavItem>
            <NavItem whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}>
              <LogOut color={theme.navIcon} />
            </NavItem>
          </>
        )}
        {!user && (
          <NavItem whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link href="/login">
              <LogIn color={theme.navIcon} />
            </Link>
          </NavItem>
        )}
      </Nav>
      
      {isModalOpen && (
        <GlassModal
          tasks={tasks}
          onAddTask={handleAddTask}
          onClose={() => setModalOpen(false)}
          theme={theme}
        />
      )}

      {user && (
        <UserInfo>
          <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
          <UserName>{user.username}</UserName>
          <UserLevel>Level {user.level}</UserLevel>
        </UserInfo>
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

const UserInfo = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
`;

const UserName = styled.span`
  color: ${props => props.theme.text};
  margin-right: 10px;
`;

const UserLevel = styled.span`
  color: ${props => props.theme.secondary};
  font-size: 0.8em;
`;

export default Navigation;