import type {Metadata} from "next";
import "./globals.css";
import '@mantine/core/styles.css';
// import '@mantine/form/styles.css';
import {ColorSchemeScript, MantineProvider} from '@mantine/core';
import Background from "@/app/background";
import {WebsiteHeader} from "@/app/WebsiteHeader";
import SaveTheDate from '@/app/SaveTheDate';

const APP_MODE = 'SAVE_THE_DATE2';

export const metadata: Metadata = {
    title: "Riek + Kasper Wedding",
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
            style={{fontFamily: 'Montserrat'}}
            className={`antialiased`}
        >
        <Background>
            <MantineProvider>
                <div className={'min-h-screen fit-content'}>
                    <WebsiteHeader/>
                    {APP_MODE === 'SAVE_THE_DATE' ?
                        <SaveTheDate /> :
                        <div>
                            {children}
                        </div>
                    }
                </div>
            </MantineProvider>
        </Background>
        </body>
        </html>
    );
}
