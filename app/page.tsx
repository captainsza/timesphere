"use client"
import HomePage from '@/components/HomePage';
import GlobalStyles from '@/styles/GlobalStyles';
import { themes } from '@/styles/themes';
import React from 'react';
import { ThemeProvider } from 'styled-components';


const App: React.FC = () => {
  return (
    <ThemeProvider theme={themes.default}>
      <GlobalStyles />
      <HomePage />
    </ThemeProvider>
  );
};

export default App;