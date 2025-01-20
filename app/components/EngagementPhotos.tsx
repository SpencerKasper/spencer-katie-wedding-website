import Image from "next/image";
import {useState} from "react";
import {Button, ActionIcon, MantineColor, Loader, Switch, SegmentedControl} from "@mantine/core";
import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import {useHotkeys} from "@mantine/hooks";
import useSwipe from "@/app/hooks/useSwipe";
import {FullScreen, useFullScreenHandle} from "react-full-screen";

const PROPOSAL_PHOTOS_GROUP = 'Proposal';
const ENGAGEMENT_SHOOT_PHOTOS_GROUP = 'Engagement Shoot';
const ENGAGEMENT_PHOTOS_BASE_PATH = `https://spencer-katie-wedding-website.s3.amazonaws.com/`;

const EngagementPhotos = () => {
    const [imageIndex, setImageIndex] = useState(1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [engagementPhotosGroup, setEngagementPhotosGroup] = useState(PROPOSAL_PHOTOS_GROUP);
    const handle = useFullScreenHandle();
    const swipeHandlers = useSwipe({onSwipedLeft: () => nextImage(), onSwipedRight: () => previousImage()});
    useHotkeys([
        ['ArrowLeft', () => previousImage()],
        ['ArrowRight', () => nextImage()],
    ]);
    const black = 'rgba(255,255,255, 1)' as MantineColor;

    const maxImages = engagementPhotosGroup === PROPOSAL_PHOTOS_GROUP ? 88 : 72;

    function previousImage() {
        setIsImageLoaded(false);
        setImageIndex(imageIndex === 1 ? 1 : imageIndex - 1);
    }

    function nextImage() {
        setIsImageLoaded(false);
        setImageIndex(imageIndex === maxImages ? maxImages : imageIndex + 1);
    }

    const fileName = engagementPhotosGroup === PROPOSAL_PHOTOS_GROUP ?
        `spencer-katie-engagement-${imageIndex}.jpg` :
        encodeURIComponent(`ChicagoEngagementSession_K+S_BEP_2025${imageIndex === 1 ? '' : `-${imageIndex}`}.jpg`);
    const LoadingComponent = <div className={'w-full'}>
        <div className={'absolute inset-y-1/2 inset-x-1/2'}>
            <Loader/>
        </div>
        <div className={'text-white w-full text-center absolute inset-y-3/4'}>
            <p>Please allow up to 5 seconds for image to load.</p>
        </div>
    </div>;

    function getCompressedPhotosUrl() {
        return engagementPhotosGroup === PROPOSAL_PHOTOS_GROUP ?
            `${ENGAGEMENT_PHOTOS_BASE_PATH}engagement-photos/compressed-hq/${fileName}` :
            `${ENGAGEMENT_PHOTOS_BASE_PATH}engagement-shoot/${fileName}`;
    }

    const photoCredits = engagementPhotosGroup === PROPOSAL_PHOTOS_GROUP ?
        {name: 'Wendy Davis Photography', websiteUrl: 'https://wdavisphoto.com/'} :
        {name: 'Brooke Emily Photography', websiteUrl: 'https://brookeemilyphotography.pixieset.com/'};

    return (
        <div className={'flex flex-col items-center gap-4'}>
            <div>
                <SegmentedControl
                    value={engagementPhotosGroup}
                    onChange={(value) => {
                        setImageIndex(0);
                        setEngagementPhotosGroup(value);
                    }}
                    data={[PROPOSAL_PHOTOS_GROUP, ENGAGEMENT_SHOOT_PHOTOS_GROUP]}/>
            </div>
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
                        disabled={imageIndex === maxImages}
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
                                src={getCompressedPhotosUrl()}
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
                                src={getCompressedPhotosUrl()}
                            />}
                    </div>
                </FullScreen>
            </div>
            <div className={'flex p-8 justify-center items-center'}>
                <a className={'underline'} target={'_blank'} href={photoCredits.websiteUrl}>Photos
                    by {photoCredits.name}</a>
            </div>
        </div>
    );
};

export default EngagementPhotos;