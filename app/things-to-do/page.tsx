'use client';
import {ListItemCard} from "@/app/components/ListItemCard";
import {MultiSelect} from "@mantine/core";
import {useState} from "react";

interface Tag {
    name: string;
    color: string;
}

interface ThingToDo {
    title: string;
    imageUrl: string;
    linkUrl: string;
    notes: string;
    tags: Tag[];
}

const AT_WEDDING_HOTEL: Tag = {name: 'At Wedding Hotel', color: 'purple'}
const GAMES_TAG: Tag = {name: 'Games', color: 'red'};
const SHOPPING_TAG: Tag = {name: 'Shopping', color: 'blue'};
const OUTDOORS_TAG: Tag = {name: 'Outdoors', color: 'green'};
const INDOORS_TAG: Tag = {name: 'Indoors', color: 'yellow'};

const POSSIBLE_TAGS: Tag[] = [
    AT_WEDDING_HOTEL,
    GAMES_TAG,
    SHOPPING_TAG,
    OUTDOORS_TAG,
    INDOORS_TAG,
];

const THINGS_TO_DO: ThingToDo[] = [
    {
        title: 'Willow Crest Golf Club',
        imageUrl: 'https://www.hilton.com/im/en/CHIBHHH/3493761/willow-crest-gc-il-07-063.jpg?impolicy=crop&cw=3750&ch=2500&gravity=NorthWest&xposition=0&yposition=250&rw=768&rh=512',
        linkUrl: 'https://www.hilton.com/en/hotels/chibhhh-hilton-chicago-oak-brook-hills-resort-and-conference-center/golf/',
        notes: 'This is the golf course at our wedding venue. It is an 18 hole and 70 par golf course attached directly to the hotel where our wedding block is! You can book a tee time on their website!',
        tags: [AT_WEDDING_HOTEL, GAMES_TAG, OUTDOORS_TAG]
    },
    {
        title: 'Shopping at Oak Brook Center',
        imageUrl: 'https://brookfieldproperties-oakbrook-center-prod.web.arc-cdn.net/resizer/v2/AJJB7QPMKRGXLFFRUMUTT5ENNI.jpg?smart=true&auth=d12edbcb5fcd213ee74bf8002dc05b3cf678870f715342b3561dbe111bd431d7&width=1508&height=1004',
        linkUrl: 'https://www.oakbrookcenter.com/en/',
        notes: 'Oak Brook Center is an outdoor shopping mall just 5 minutes from the Hilton where our wedding is taking place.  They have all kinds of stores for everything including clothing, technology, restaurants, and more!',
        tags: [SHOPPING_TAG, OUTDOORS_TAG]
    },
    {
        title: 'Activate',
        imageUrl: 'https://res.cloudinary.com/playactivate/home/choose-your-adventure.jpg',
        linkUrl: 'https://playactivate.com/oakbrook',
        notes: 'Activate is an immersive game where you must jump over lights, climb things, and solve problems to complete challenges with your team.  It is a short distance from our wedding block hotel right across the street from Oak Brook Mall!',
        tags: [GAMES_TAG, INDOORS_TAG]
    },
    {
        title: 'Morton Arboretum',
        imageUrl: 'https://mortonarb.org/app/uploads/2023/12/Trees-in-winter_The-Morton-Arboretum_IG_720x720-720x720-c-default.jpg',
        linkUrl: 'https://mortonarb.org/',
        notes: 'A 15 minute drive away from the wedding venue is Morton Arboretum which is a place to wander around in nature and view beautiful exhibits based around trees and plants!',
        tags: [OUTDOORS_TAG]
    },
];

export default function ThingsToDoPage() {
    const [selectedTags, setSelectedTags] = useState([]);
    return (
        <div className={'flex flex-col justify-center items-center auto-rows-fr gap-4 md:gap-8 p-4'}>
            <div className={'w-full max-w-xl'}>
                <MultiSelect
                    placeholder={'Filter Things To Do'}
                    data={POSSIBLE_TAGS.map(pt => pt.name)}
                    onChange={value => setSelectedTags(value)}
                    clearable
                />
            </div>
            {THINGS_TO_DO
                .filter(toDo => {
                        return selectedTags.length === 0 ||
                            toDo.tags.filter(toDoTag => {
                                return selectedTags.filter(selectedTag => selectedTag === toDoTag.name).length;
                            }).length;
                    }
                )
                .map((toDo, index) => (
                    <ListItemCard
                        key={`to-do-item-${index}`}
                        title={toDo.title}
                        imageUrl={toDo.imageUrl}
                        linkUrl={toDo.linkUrl}
                        notes={toDo.notes}
                        tags={toDo.tags}
                    />
                ))}
        </div>
    )
}