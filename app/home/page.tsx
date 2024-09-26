'use server';
import HomePageClient from "@/app/home/homePageClient";
import {useEffect} from "react";
import {ButtonGroup, Button} from "@mantine/core";

export default async function AuthenticatedHomePage() {
    try {
        const url = `${process.env.WEDDING_API_URL}/api/guestlist`;
        const response = await fetch(url);
        if (response && response.ok) {
            const {guests} = await response.json();
            return (
                <div className={'flex flex-col content-center w-full justify-center min-h-screen'}>
                    <div className={'text-center p-8'}>
                        <h1 className={'text-white text-7xl'}>Spencer & Katie</h1>
                    </div>
                    <div className={'flex justify-center align-center p-8'}>
                        <Button
                            component={'a'}
                            href={'/engagement-photos'} variant={'outline'} color={'white'}>Engagement Photos</Button>
                    </div>
                    <HomePageClient guests={guests}/>
                </div>
            )
        }
    } catch (e) {
        console.error(e);
        return (
            <div>
                Could not load guests.
            </div>
        )
    }
}
