"use client"
import Login from '@/components/login';
import GlobalStyles from '@/styles/GlobalStyles';
import { themes } from '@/styles/themes';
import React from 'react';
import { ThemeProvider } from 'styled-components';


const Page: React.FC = () => {
  return (
    <ThemeProvider theme={themes.default}>
      <GlobalStyles />
      <Login />
    </ThemeProvider>
  );
};

export default Page;