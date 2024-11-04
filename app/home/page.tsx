'use server';
import HomePageClient from "@/app/home/homePageClient";
import {Button} from "@mantine/core";
import {OverrideFont} from "@/app/components/OverrideFont";

export default async function AuthenticatedHomePage() {
    try {
        const url = `${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`;
        const response = await fetch(url);
        if (response && response.ok) {
            const {guests} = await response.json();
            return (
                <div className={'flex flex-col content-center w-full justify-center inset-y-1/2 absolute'}>
                    <OverrideFont>
                        <div className={'flex flex-col justify-center align-center full-w text-center p-8 gap-4'}>
                            <h1 className={'text-white text-7xl'}>Spencer & Katie&apos;s Wedding</h1>
                            <h2 className={'text-white text-4xl'}>10.11.25</h2>
                        </div>
                    </OverrideFont>
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
