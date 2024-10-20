import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import '@mantine/core/styles.css';
// import '@mantine/form/styles.css';

import {ColorSchemeScript, MantineProvider} from '@mantine/core';
import Background from "@/app/background";
import {Button} from "@mantine/core";

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
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            <ColorSchemeScript/>
        </head>
        <body
            style={{fontFamily: '"Playwrite DK Uloopet", cursive'}}
            className={`antialiased`}
        >
        <Background>
            <MantineProvider>
                <div className={'min-h-screen'}>
                    <div className={'flex justify-center align-center p-8 gap-4 flex-wrap'}>
                        <Button component={'a'} href={'/home'} variant={'outline'} color={'white'}>Home</Button>
                        <Button component={'a'} href={'/rsvp'} variant={'outline'} color={'white'}>RSVP&nbsp; </Button>
                        <Button component={'a'} href={'/engagement-photos'} variant={'outline'} color={'white'}>Engagement
                            Photos</Button>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </MantineProvider>
        </Background>
        </body>
        </html>
    );
}
