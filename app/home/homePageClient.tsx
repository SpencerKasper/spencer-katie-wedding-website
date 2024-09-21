'use client';

import {Guest} from "@/app/api/guestlist/guestlist";

export default function HomePageClient({guests}: {guests: Guest[]}) {
    return (
        <div>
            {guests.map((guest, i) => (
                <div key={`guest-${i}`}>
                    {guest.firstName} {guest.lastName}
                </div>
            ))}
        </div>
    )
}