'use client';

import {useEffect, useState} from "react";
import {Button, Card, Checkbox, Divider, Pill, SegmentedControl, Select, Skeleton, Textarea} from "@mantine/core";
import {
    FIRST_NAME_LOCAL_STORAGE_KEY,
    LAST_NAME_LOCAL_STORAGE_KEY,
    PASSWORD_LOCAL_STORAGE_KEY,
    validateLoginInfo
} from "@/app/loginPageClient";
import axios from "axios";
import {useForm} from "@mantine/form";

const NUMBER_OF_PAGES = 2;

export default function RSVPClient() {
    const [guest, setGuest] = useState(null);
    const [guestsInParty, setGuestsInParty] = useState([]);
    const [rsvpPage, setRsvpPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [rsvps, setRsvps] = useState([]);
    const FIELDS = ['isAttending', 'dinnerChoice', 'dietaryRestrictions'];
    const FIELD_DEFAULTS = {
        isAttending: 'Yes',
        dinnerChoice: '',
        dietaryRestrictions: ''
    };
    const getGuestPrefix = (guest) => `guest-${guest.guestId}`;
    const getInitialValues = () => {
        const prefixes = guestsInParty.map(getGuestPrefix);
        const allFields = FIELDS.reduce((acc, curr) => [...acc, ...prefixes.map(prefix => `${prefix}_${curr}`)], []);
        return allFields.reduce((acc, curr) => ({...acc, [curr]: FIELD_DEFAULTS[curr.split('_')[1]]}), {});
    }

    const initialValues = getInitialValues();
    console.error(initialValues);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues,
    });

    useEffect(() => {
        setIsLoading(true);
        validateLoginInfo({
            firstName: localStorage.getItem(FIRST_NAME_LOCAL_STORAGE_KEY),
            lastName: localStorage.getItem(LAST_NAME_LOCAL_STORAGE_KEY),
            password: localStorage.getItem(PASSWORD_LOCAL_STORAGE_KEY),
        }).then(response => {
            setGuest(response.guest);
            const partyId = response.guest.partyId;
            if (partyId && partyId !== '') {
                axios.get(`/api/guestlist?partyId=${partyId}`)
                    .then(guestListResponse => {
                        setGuestsInParty(guestListResponse.data.guests);
                        setIsLoading(false);
                    });
            }
        });
    }, []);

    const incrementRsvpPage = () => {
        setRsvpPage(rsvpPage + 1);
    }

    const decrementRsvpPage = () => {
        setRsvpPage(rsvpPage - 1);
    }

    const andYourGuests = !guestsInParty || guestsInParty.length === 0 ? '' : ` and your guest${guestsInParty.length > 2 ? 's' : ''}`;
    const PageOneContent = () => {
        return (
            <div className={'flex flex-col gap-4'}>
                {guestsInParty.map((guestInParty, index) => {
                    return (
                        <div key={`guest-response-${index}`} className={'flex justify-between'}>
                            <div>
                                <p>{guestInParty.firstName} {guestInParty.lastName}</p>
                            </div>
                            <div>
                                <Checkbox
                                    variant={'outline'}
                                    color={'green'}
                                    key={form.key(`${getGuestPrefix(guestInParty)}_isAttending`)}
                                    {...form.getInputProps(`${getGuestPrefix(guestInParty)}_isAttending`, {type: 'checkbox'})}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    };

    const PageTwoContent = () => {
        return (
            <div className={'flex flex-col gap-4'}>
                {guestsInParty.map((guest, index) => (
                    <div key={`guest-response-${index}`} className={'flex flex-col gap-4'}>
                        <div className={'flex justify-between'}>
                            <p>{guest.firstName} {guest.lastName}</p>
                            <Select
                                label={'Dinner choice'}
                                placeholder={'Select your dinner option'}
                                data={['Steak', 'Chicken', 'Fish']}
                                key={form.key(`${getGuestPrefix(guest)}_dinnerChoice`)}
                                {...form.getInputProps(`${getGuestPrefix(guest)}_dinnerChoice`)}
                            />
                        </div>
                        <div>
                            <Textarea
                                label={'Dietary Restrictions'}
                                key={form.key(`${getGuestPrefix(guest)}_dietaryRestrictions`)}
                                {...form.getInputProps(`${getGuestPrefix(guest)}_dietaryRestrictions`)}
                            />
                        </div>
                        {index + 1 !== guestsInParty.length ? <Divider my={'md'}/> : <></>}
                    </div>
                ))}
            </div>
        );
    }

    const ReviewPage = () => {
        return (
            <div>
                Selections go here
            </div>
        );
    }

    const getPageTitle = () => {
        if (rsvpPage === 0) {
            return `Will you${andYourGuests} be attending?`
        } else if (rsvpPage === 1) {
            return `What will you${andYourGuests} have for dinner?`
        }
        return 'Review Your Selections:'
    }

    const getPageContent = () => {
        if (rsvpPage === 0) {
            return <PageOneContent/>;
        } else if (rsvpPage === 1) {
            return <PageTwoContent/>;
        }
        return <ReviewPage/>;
    }

    const handleSubmit = () => {
        const valuesWithId = form.getValues();
        setRsvps(guestsInParty.map(guestInParty => {
            console.error(valuesWithId);
            const isAttending = valuesWithId[`${getGuestPrefix(guestInParty)}_isAttending`];
            console.error(isAttending)
            return {
                guest: guestInParty,
                isAttending: Boolean(isAttending),
                dinnerChoice: valuesWithId[`${getGuestPrefix(guestInParty)}_dinnerChoice`],
                dietaryRestrictions: valuesWithId[`${getGuestPrefix(guestInParty)}_dietaryRestrictions`],
            }
        }));
    }
    return (
        <div>
            <Skeleton visible={isLoading}>
                <Card>
                    {rsvps.length ?
                        <div>
                            {rsvps.map((rsvp, index) => {
                                const rsvpGuest = rsvp.guest;
                                return (
                                    <div key={`guest-rsvp-${index}`} className={'flex flex-col gap-4'}>
                                        <div className={'flex justify-between'}>
                                            <p className={'text-lg'}>{`${rsvpGuest.firstName} ${rsvpGuest.lastName}`}</p>
                                            {rsvp.isAttending ? <Pill size={'lg'} styles={{root: {backgroundColor: 'green', color: 'white'}}}>Attending</Pill> :
                                                <Pill size={'lg'} styles={{root: {backgroundColor: 'red', color: 'white'}}}>Not Attending</Pill>}
                                        </div>
                                        <div className={'flex justify-between flex-wrap'}>
                                            <p>Dinner Choice: {rsvp.dinnerChoice}</p>
                                            {rsvp.dietaryRestrictions && rsvp.dietaryRestrictions !== '' ?
                                                <p>Dietary Restrictions: {rsvp.dietaryRestrictions}</p> :
                                                <></>
                                            }
                                        </div>
                                        {index + 1 !== rsvps.length ? <Divider my={'md'}/> : <></>}
                                    </div>
                                );
                            })}
                        </div> :
                        <form>
                            <h2 className={'text-4xl'}>{getPageTitle()}</h2>
                            <Divider my={'md'}/>
                            {getPageContent()}
                            <Divider my={'md'}/>
                            <div className={'flex justify-between'}>
                                <div></div>
                                <div className={'flex gap-2'}>
                                    <Button disabled={rsvpPage === 0} variant={'outline'} color={'black'}
                                            onClick={decrementRsvpPage}>Back</Button>
                                    {rsvpPage === NUMBER_OF_PAGES ?
                                        <Button variant={'outline'} color={'black'}
                                                onClick={handleSubmit}>Submit</Button> :
                                        <Button disabled={rsvpPage >= NUMBER_OF_PAGES} variant={'outline'}
                                                color={'black'}
                                                onClick={incrementRsvpPage}>Next</Button>
                                    }
                                </div>
                            </div>
                        </form>
                    }
                </Card>
            </Skeleton>
        </div>
    )
}