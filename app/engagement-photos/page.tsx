'use client';
import EngagementPhotos from "@/app/components/EngagementPhotos";
import {Button} from '@mantine/core';
import useSwipe from "@/app/hooks/useSwipe";
import EmailModal from "@/app/EmailModal";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";

export default function EngagementPhotosPage() {
    const {loggedInGuest} = useLoggedInGuest();
    return (
        <div className={'flex flex-col justify-center items-center min-h-screen text-white'}>
            <EmailModal loggedInGuest={loggedInGuest}/>
            <div className={'flex flex-row px-16 py-4'}>
                <p className={'font-bold'}>
                    * You can use the arrow keys on your keyboard or swipe on your phone to go through the photos. To
                    view the full quality images in full screen, just click on the picture.
                </p>
            </div>
            <EngagementPhotos />
            <div className={'flex p-8 justify-center items-center'}>
                <a className={'underline'} target={'_blank'} href={'https://wdavisphoto.com/'}>Photos by Wendy Davis Photography</a>
            </div>
        </div>
    )
}