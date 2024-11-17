'use server';
import HomePageClient from "@/app/home/homePageClient";
import {Button} from "@mantine/core";
import {OverrideFont} from "@/app/components/OverrideFont";
import {APP_MODE} from "@/constants/app-constants";
import SaveTheDate from "@/app/SaveTheDate";
import KatieAndSpencersWeddingTitle from "@/app/KatieAndSpencersWeddingTitle";

export default async function AuthenticatedHomePage() {
    try {
        if (APP_MODE === 'SAVE_THE_DATE') {
            return <SaveTheDate/>;
        }
        const url = `${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`;
        const response = await fetch(url);
        if (response && response.ok) {
            const {guests} = await response.json();
            return (
                <div className={'flex flex-col w-full justify-center '}>
                    <KatieAndSpencersWeddingTitle/>
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
