'use server';
import HomePageClient from "@/app/home/homePageClient";

export default async function AuthenticatedHomePage() {
    try {
        const url = `${process.env.WEDDING_API_URL}/api/guestlist`;
        console.error(`Making request to url: ${url}`);
        const response = await fetch(url);
        if (response && response.ok) {
            const {guests} = await response.json();
            return (
                <div className={'flex flex-row content-center w-full justify-center min-h-screen flex-wrap'}>
                    <h1 className={'text-black text-6xl'}>Welcome to Our Wedding Website!</h1>
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
