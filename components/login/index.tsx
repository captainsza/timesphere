import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  padding: 2rem;
`;

const LoginForm = styled(motion.form)`
  background: rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;
  max-width: 400px;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Message = styled(motion.p)`
  color: #ffffff;
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
`;

const ErrorMessage = styled(Message)`
  color: #ff6b6b;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const { login, error, isLoading, message } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password, isNewUser ? email : undefined);
  };

  useEffect(() => {
    // Check if the user exists when the username changes
    const checkUser = async () => {
      if (username.length > 0) {
        const response = await fetch(`/api/auth/check-user?username=${username}`);
        const data = await response.json();
        setIsNewUser(!data.exists);
      }
    };
    checkUser();
  }, [username]);

  return (
    <LoginContainer>
      <LoginForm
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          whileFocus={{ scale: 1.05 }}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          whileFocus={{ scale: 1.05 }}
        />
        {isNewUser && (
          <Input
            type="email"
            placeholder="Email (required for new users)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            whileFocus={{ scale: 1.05 }}
          />
        )}
        <Button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Processing...' : isNewUser ? 'Sign Up' : 'Login'}
        </Button>

        {error && (
          <ErrorMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </ErrorMessage>
        )}
        {message && (
          <Message
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {message}
          </Message>
        )}
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;