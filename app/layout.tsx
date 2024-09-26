import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '@mantine/core/styles.css';
// import '@mantine/form/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import Background from "@/app/background";

export const metadata: Metadata = {
  title: "Kasper Wedding",
  description: "This is the website for Katie and Spencer's wedding!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
          style={{fontFamily: '"Playwrite DK Uloopet", cursive'}}
          className={`text-white antialiased`}
      >
        <Background>
            <MantineProvider>{children}</MantineProvider>
        </Background>
      </body>
    </html>
  );
}
