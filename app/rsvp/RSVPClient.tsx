'use client';

import {useEffect, useRef, useState} from "react";
import {Button, Card, Checkbox, Divider, Select, Skeleton, Textarea} from "@mantine/core";
import {
    FIRST_NAME_LOCAL_STORAGE_KEY,
    LAST_NAME_LOCAL_STORAGE_KEY,
    PASSWORD_LOCAL_STORAGE_KEY,
    validateLoginInfo
} from "@/app/loginPageClient";
import axios from "axios";
import {useForm} from "@mantine/form";
import {RSVP} from "@/types/rsvp";
import {Guest} from "@/types/guest";
import {RSVPPill} from "@/app/rsvp/RSVPPill";
import {RSVPsReview} from "@/app/rsvp/RSVPsReview";

const NUMBER_OF_PAGES = 2;

const IS_ATTENDING_POSTFIX = '_isAttending';

export default function RSVPClient() {
    const [guest, setGuest] = useState(null as Guest);
    const [guestsInParty, setGuestsInParty] = useState([] as Guest[]);
    const [rsvpPage, setRsvpPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [rsvps, setRsvps] = useState([] as RSVP[]);

    useEffect(() => {
        if (guest) {
            const query = guest.partyId ? `partyId=${guest.partyId}` : `guestIds=${guest.guestId}`;
            axios.get(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/rsvp?${query}`)
                .then(getRsvpsResponse => {
                    setRsvps(getRsvpsResponse.data.rsvps);
                });
        }
    }, [guest]);

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
    const form = useForm({
        mode: 'uncontrolled',
        initialValues,
    });
    const extractValueFromForm = (guest, postfix) => {
        const valuesWithId = form.getValues();
        return valuesWithId[`${getGuestPrefix(guest)}${postfix}`];

    }
    const removeGuestsWhoAreNotAttending = (guest) => {
        return extractValueFromForm(guest, IS_ATTENDING_POSTFIX);
    }

    const attendingGuests = guestsInParty
        .filter(removeGuestsWhoAreNotAttending);

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
                axios.get(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist?partyId=${partyId}`)
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
                                    key={form.key(`${getGuestPrefix(guestInParty)}${IS_ATTENDING_POSTFIX}`)}
                                    {...form.getInputProps(`${getGuestPrefix(guestInParty)}${IS_ATTENDING_POSTFIX}`, {type: 'checkbox'})}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    };

    const PageTwoContent = () => {
        const ref = useRef();
        if (attendingGuests.length === 0) {
            incrementRsvpPage();
        }
        return (
            <div className={'flex flex-col gap-4'}>
                {attendingGuests
                    .map((guest, index) => (
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
                                    ref={ref}
                                    resize={'vertical'}
                                    label={'Dietary Restrictions'}
                                    placeholder={'Please tell us about any dietary restrictions you may have!'}
                                    key={form.key(`${getGuestPrefix(guest)}_dietaryRestrictions`)}
                                    {...form.getInputProps(`${getGuestPrefix(guest)}_dietaryRestrictions`)}
                                />
                            </div>
                            {index + 1 !== attendingGuests.length ? <Divider my={'md'}/> : <></>}
                        </div>
                    ))}
            </div>
        );
    }

    const ReviewPage = () => {
        const reviewRsvps = getRsvpsFromForm();
        return (
            <div className={'flex flex-col flex-wrap gap-8'}>
                {reviewRsvps.map((rsvp, index) => {
                    return (
                        <div key={`rsvp-${index}`}>
                            <div className={'flex flex-wrap justify-between'}>
                                <p>{`${rsvp.guest.firstName} ${rsvp.guest.lastName}`}</p>
                                <div><RSVPPill rsvp={rsvp}/></div>
                            </div>
                            {rsvp.isAttending ?
                                <div className={'flex flex-wrap justify-between'}>
                                    <p>{`Dinner Choice: ${rsvp.dinnerChoice}`}</p>
                                    <div>
                                        <p>{`Dietary Restrictions: ${rsvp.dietaryRestrictions && rsvp.dietaryRestrictions !== '' ? rsvp.dietaryRestrictions : 'N/A'}`}</p>
                                    </div>
                                    {index + 1 === reviewRsvps.length ? <></> : <Divider my={'md'}/>}
                                </div> :
                                <></>
                            }
                        </div>
                    )
                })}
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

    function getRsvpsFromForm() {
        return guestsInParty.map(guestInParty => {
            const isAttending = extractValueFromForm(guestInParty, IS_ATTENDING_POSTFIX);
            return {
                guest: guestInParty,
                isAttending: Boolean(isAttending),
                dinnerChoice: extractValueFromForm(guestInParty, '_dinnerChoice'),
                dietaryRestrictions: extractValueFromForm(guestInParty, '_dietaryRestrictions'),
            }
        });
    }

    const handleSubmit = async () => {
        const rsvpsFromForm = getRsvpsFromForm();
        await axios.post(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/rsvp`, {rsvps: rsvpsFromForm});
        setRsvps(rsvpsFromForm);
    }

    return (
        <div>
            <Skeleton visible={isLoading}>
                <div className={'flex justify-center'}>
                    <Card className={'max-w-lg'}>
                        {rsvps.length ?
                            <RSVPsReview rsvps={rsvps} setRsvps={(value) => {
                                setRsvps(value);
                                form.reset();
                                setRsvpPage(0);
                            }}/> :
                            <form>
                                <h2 className={'text-4xl'}>{getPageTitle()}</h2>
                                <Divider my={'md'}/>
                                {getPageContent()}
                                <Divider my={'md'}/>
                                <div className={'flex justify-between'}>
                                    <div></div>
                                    <div className={'flex gap-2'}>
                                        <Button disabled={rsvpPage === 0} variant={'outline'} color={'black'}
                                                onClick={() => {
                                                    if (rsvpPage === 2 && attendingGuests.length === 0) {
                                                        setRsvpPage(0);
                                                    } else {
                                                        decrementRsvpPage();
                                                    }
                                                }}>Back</Button>
                                        {rsvpPage === NUMBER_OF_PAGES ?
                                            <Button variant={'outline'} color={'black'}
                                                    onClick={handleSubmit}>Submit</Button> :
                                            <Button disabled={rsvpPage >= NUMBER_OF_PAGES} variant={'outline'}
                                                    color={'black'}
                                                    onClick={() => incrementRsvpPage()}>Next</Button>
                                        }
                                    </div>
                                </div>
                            </form>
                        }
                    </Card>
                </div>
            </Skeleton>
        </div>
    )
}