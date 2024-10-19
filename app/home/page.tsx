'use server';
import HomePageClient from "@/app/home/homePageClient";
import {Button} from "@mantine/core";

export default async function AuthenticatedHomePage() {
    try {
        const url = `${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`;
        const response = await fetch(url);
        if (response && response.ok) {
            const {guests} = await response.json();
            return (
                <div className={'flex flex-col content-center w-full justify-center min-h-screen'}>
                    <div className={'text-center p-8'}>
                        <h1 className={'text-white text-7xl'}>Spencer & Katie</h1>
                    </div>
                    <div className={'flex justify-center align-center p-8 gap-4'}>
                        <Button component={'a'} href={'/rsvp'} variant={'outline'} color={'white'}>RSVP&nbsp; </Button>
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
