'use client';

import {Guest} from "@/app/api/guestlist/guestlist";
import EmailModal from "@/app/EmailModal";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";

export default function HomePageClient({guests}: { guests: Guest[] }) {
    const {loggedInGuest} = useLoggedInGuest();
    return (
        <div>
            <EmailModal loggedInGuest={loggedInGuest}/>
        </div>
    )
}