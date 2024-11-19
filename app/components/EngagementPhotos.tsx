import Image from "next/image";
import {useState} from "react";
import {Button, ActionIcon, MantineColor, Loader} from "@mantine/core";
import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import {useHotkeys} from "@mantine/hooks";
import useSwipe from "@/app/hooks/useSwipe";
import {FullScreen, useFullScreenHandle} from "react-full-screen";

const EngagementPhotos = () => {
    const [imageIndex, setImageIndex] = useState(1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const handle = useFullScreenHandle();
    const swipeHandlers = useSwipe({onSwipedLeft: () => nextImage(), onSwipedRight: () => previousImage()});
    useHotkeys([
        ['ArrowLeft', () => previousImage()],
        ['ArrowRight', () => nextImage()],
    ]);
    const black = 'rgba(255,255,255, 1)' as MantineColor;

    function previousImage() {
        setIsImageLoaded(false);
        setImageIndex(imageIndex === 1 ? 1 : imageIndex - 1);
    }

    function nextImage() {
        setIsImageLoaded(false);
        setImageIndex(imageIndex === 88 ? 88 : imageIndex + 1);
    }

    const ENGAGEMENT_PHOTOS_BASE_PATH = `https://spencer-katie-wedding-website.s3.amazonaws.com/engagement-photos`;
    const fileName = `spencer-katie-engagement-${imageIndex}.jpg`;
    const LoadingComponent = <div className={'w-full'}>
        <div className={'absolute inset-y-1/2 inset-x-1/2'}>
            <Loader/>
        </div>
        <div className={'text-white w-full text-center absolute inset-y-3/4'}>
            <p>Please allow up to 5 seconds for image to load.</p>
        </div>
    </div>;
    return (
        <div className={'relative flex items-center'} style={{minHeight: '516px'}} {...swipeHandlers}>
            <div style={{position: 'absolute', left: '8px', top: '50%'}}>
                <ActionIcon
                    onClick={() => previousImage()}
                    aria-label={'Previous Image'}
                    color={black}
                    variant={'outline'}
                    disabled={imageIndex === 1}
                >
                    <IconArrowLeft/>
                </ActionIcon>
            </div>
            <div style={{position: 'absolute', right: '8px', top: '50%'}}>
                <ActionIcon
                    onClick={() => nextImage()}
                    aria-label={'Next Image'}
                    variant={'outline'}
                    color={black}
                    disabled={imageIndex === 88}
                >
                    <IconArrowRight/>
                </ActionIcon>
            </div>
            <FullScreen handle={handle}>
                <div className={'flex justify-center align-center'}>
                    {handle.active && !isImageLoaded ? LoadingComponent : <></>}
                    {handle.active ?
                        <Image
                            onLoad={() => {
                                setIsImageLoaded(true);
                            }}
                            layout={'fill'}
                            objectFit={'contain'}
                            onClick={handle.exit}
                            alt={`engagement-photo-${imageIndex}`}
                            className={isImageLoaded ? '' : 'opacity-0'}
                            src={`${ENGAGEMENT_PHOTOS_BASE_PATH}/compressed-hq/${fileName}`}
                        /> :
                        <img
                            onClick={handle.active ? handle.exit : handle.enter}
                            alt={`engagement-photo-${imageIndex}`}
                            sizes="100vw"
                            style={handle.active ? {
                                maxWidth: '100vw',
                                height: 'auto',
                                maxHeight: '100vh'
                            } : {maxWidth: '90vw', height: 'auto', maxHeight: '85vh'}}
                            src={handle.active ? `${ENGAGEMENT_PHOTOS_BASE_PATH}/${fileName}` : `${ENGAGEMENT_PHOTOS_BASE_PATH}/compressed/${fileName}`}
                        />}
                </div>
            </FullScreen>
        </div>
    )
};

export default EngagementPhotos;