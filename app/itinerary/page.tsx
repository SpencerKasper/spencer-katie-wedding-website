'use client';
import EmailModal from "@/app/EmailModal";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";

export default function ItineraryPage() {
    const {loggedInGuest} = useLoggedInGuest();
    return (
        <div>
            <EmailModal loggedInGuest={loggedInGuest}/>
        </div>
    )
}