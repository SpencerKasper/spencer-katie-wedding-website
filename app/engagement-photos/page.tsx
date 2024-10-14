'use client';
import EngagementPhotos from "@/app/components/EngagementPhotos";
import {Button} from '@mantine/core';
import useSwipe from "@/app/effects/useSwipe";

export default function EngagementPhotosPage() {
    return (
        <div className={'flex flex-col justify-center items-center min-h-screen'}>
            <div className={'flex flex-row p-4'}>
                <Button color={'white'} variant={'outline'} component={'a'} href={'/home'}>Home</Button>
            </div>
            <div className={'flex flex-row px-16 py-4'}>
                <p>
                    Note: You can use the arrow keys on your keyboard or swipe on your phone to go through the photos. To
                    view the full quality images in full screen, just click on the picture.
                </p>
            </div>
            <EngagementPhotos />
            <div className={'flex p-8 justify-center items-center'}>
                <a target={'_blank'} href={'https://wdavisphoto.com/'}>Photos by Wendy Davis Photography</a>
            </div>
        </div>
    )
}