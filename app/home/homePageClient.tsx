'use client';

import {Guest} from "@/app/api/guestlist/guestlist";
import Image from "next/image";

export default function HomePageClient({guests}: { guests: Guest[] }) {
    return (
        <div className={'py-4 flex flex-col gap-16'}>
            <div className={'flex justify-center'}>
                <img
                    width={'50%'}
                    height={'auto'}
                    src={'https://spencer-katie-wedding-website.s3.amazonaws.com/engagement-shoot/ChicagoEngagementSession_K%2BS_BEP_2025-52.jpg'}
                />
            </div>
            <div className={'text-white flex flex-col items-center gap-2 text-center p-2'}>
                <p className={'text-4xl uppercase tracking-widest'}>Wedding Ceremony & Reception</p>
                <p className={'text-2xl uppercase tracking-wide'}>Saturday, October 11, 2025</p>
                <p className={'text-xl uppercase'}>5:30 PM</p>
                <p className={'text-xl'}>Hilton Chicago / Oak Brook Hills Resort & Conference Center</p>
                <p className={'text-xl'}>3500 Midwest Road, Oak Brook, IL 60523 US</p>
            </div>
        </div>
    )
}