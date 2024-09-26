import Image from "next/image";
import {useState} from "react";
import {Button, ActionIcon, MantineColor} from "@mantine/core";
import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import {useHotkeys} from "@mantine/hooks";

const EngagementPhotos = () => {
    const [imageIndex, setImageIndex] = useState(1);
    useHotkeys([
        ['ArrowLeft', () => previousImage()],
        ['ArrowRight', () => nextImage()],
    ]);
    const black = 'rgba(0,0,0, 1)' as MantineColor;

    function previousImage() {
        setImageIndex(imageIndex === 1 ? 1 : imageIndex - 1);
    }

    function nextImage() {
        setImageIndex(imageIndex === 88 ? 88 : imageIndex + 1);
    }

    return (
        <div className={'relative flex items-center'} style={{minHeight: '516px'}}>
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
            <img
                alt={`engagement-photo-${imageIndex}`}
                sizes="100vw"
                style={{maxWidth: '90vw', height: 'auto', maxHeight: '85vh'}}
                src={`https://spencer-katie-wedding-website.s3.amazonaws.com/engagement-photos/compressed/spencer-katie-engagement-${imageIndex}.jpg`}
            />
        </div>
    )
};

export default EngagementPhotos;