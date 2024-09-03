// /components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styled from 'styled-components';
const Message = styled.p`
  color: #4caf50;
  margin-top: 1rem;
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e2f 0%, #2c2c54 100%);
`;

const LoginForm = styled.form`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background: #4a69bd;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #1e3799;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  margin-top: 1rem;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading,message  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <Message>{message}</Message>}
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;