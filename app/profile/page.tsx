"use client"
import ProfilePage from '@/components/profile';
import GlobalStyles from '@/styles/GlobalStyles';
import { themes } from '@/styles/themes';
import React from 'react';
import { ThemeProvider } from 'styled-components';


const App: React.FC = () => {
  return (
    <ThemeProvider theme={themes.default}>
      <GlobalStyles />
      <ProfilePage />
    </ThemeProvider>
  );
};

export default App;