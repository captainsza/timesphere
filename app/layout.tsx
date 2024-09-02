"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "./registry";
import { themes } from "@/styles/themes"; // Adjust this import path as needed
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ThemeProvider theme={themes.default}>
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}