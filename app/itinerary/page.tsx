'use client';

import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";
import AllGuestItinerary from "@/app/itinerary/AllGuestItinerary";
import {Switch, Tabs, Card, Divider} from "@mantine/core";
import {
    IconBellRinging,
    IconMessageCircle,
    IconPhoto,
    IconSettings,
    IconToolsKitchen,
    IconToolsKitchen2
} from "@tabler/icons-react";
import {ItineraryItem} from "@/app/itinerary/ItineraryItem";
import {REHEARSAL_DINNER_ROLE} from "@/constants/app-constants";

const REHEARSAL_SCHEDULE_TAB_ID = 'rehearsal-schedule';
const DAY_OF_SCHEDULE_TAB_ID = 'day-of-schedule';
const DAY_OF_SCHEDULE = {
    events: [
        {
            startTime: '5:15 PM',
            endTime: '5:30 PM',
            eventDescription: 'Guests arrive to the ceremony',
            notes: ['The ceremony will take place outside the tent in front of the pond.']
        },
        {startTime: '5:30 PM', endTime: '6:00 PM', eventDescription: 'Wedding ceremony takes place'},
        {startTime: '6:00 PM', endTime: '7:00 PM', eventDescription: 'Cocktail hour', notes: ['Cocktail hour will be out on the patio next to the tent unless weather prohibits.']},
        {
            startTime: '7:00 PM',
            endTime: '12:00 AM',
            eventDescription: 'Dinner, dancing, and more drinks (or just dinner and dancing if you are the designated driver)',
            notes: ['The reception will be held in the tent next to the patio and ceremony space.']
        },
        {startTime: '12:00 AM', endTime: '2:00 AM', eventDescription: 'After party at the hotel bar'},
    ]
}
export default function ItineraryPage() {
    const {loggedInGuest} = useLoggedInGuest();
    const isInvitedToRehearsalDinner = loggedInGuest && loggedInGuest.roles && loggedInGuest.roles.includes(REHEARSAL_DINNER_ROLE);
    const getDefaultTab = () => isInvitedToRehearsalDinner && new Date() <= new Date('2025-10-11') ?
        REHEARSAL_SCHEDULE_TAB_ID :
        DAY_OF_SCHEDULE_TAB_ID;

    return (
        <div className={'p-2 sm:px-8 flex flex-col items-center'}>
            <Card title={'Schedule'} className={'sm:max-w-3xl'}>
                <Card.Section>
                    <div className={'p-4'}>
                        <p className={'text-xl'}>Itinerary</p>
                    </div>
                </Card.Section>
                <Tabs defaultValue={getDefaultTab()}>
                    <Tabs.List>
                        {isInvitedToRehearsalDinner ?
                            <Tabs.Tab value={REHEARSAL_SCHEDULE_TAB_ID} leftSection={<IconToolsKitchen2 size={12}/>}>
                                Rehearsal Dinner
                            </Tabs.Tab> :
                            <></>
                        }
                        <Tabs.Tab value={DAY_OF_SCHEDULE_TAB_ID} leftSection={<IconBellRinging size={12}/>}>
                            Wedding Day
                        </Tabs.Tab>
                    </Tabs.List>

                    <div className={'py-4'}>
                        {isInvitedToRehearsalDinner ?
                            <Tabs.Panel value={REHEARSAL_SCHEDULE_TAB_ID}>
                                <ItineraryItem startTime={'6:00 PM'} endTime={'9:00 PM'}
                                               eventDescription={'Guests start arriving'}/>
                            </Tabs.Panel> :
                            <></>
                        }
                        <Tabs.Panel value={DAY_OF_SCHEDULE_TAB_ID}>
                            <div className={'flex flex-col items-center'}>
                                {DAY_OF_SCHEDULE.events.map((event, index) =>
                                    <>
                                        <ItineraryItem
                                            key={`itinerary-item-${index}`}
                                            startTime={event.startTime}
                                            endTime={event.endTime}
                                            eventDescription={event.eventDescription}
                                            notes={event.notes}
                                        />
                                        <Divider my={'md'} className={'w-1/2'}/>
                                    </>
                                )}
                            </div>
                        </Tabs.Panel>
                    </div>
                    { /* Ceremony on grass; pickleball*/}
                </Tabs>
            </Card>
        </div>
    )
}