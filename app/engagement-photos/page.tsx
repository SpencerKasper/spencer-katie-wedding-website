'use client';
import EngagementPhotos from "@/app/components/EngagementPhotos";
import {Button} from '@mantine/core';

export default function EngagementPhotosPage() {
    return (
        <div className={'flex flex-col justify-center items-center min-h-screen'}>
            <div className={'flex flex-row p-4'}>
                <Button color={'white'} variant={'outline'} component={'a'} href={'/home'}>Home</Button>
            </div>
            <EngagementPhotos />
        </div>
    )
}