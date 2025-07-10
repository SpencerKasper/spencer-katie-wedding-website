'use client';

import {useEffect, useRef, useState} from "react";
import {Button, Card, Checkbox, Divider, Select, Skeleton, Textarea} from "@mantine/core";
import axios from "axios";
import {useForm} from "@mantine/form";
import {RSVP} from "@/types/rsvp";
import {Guest} from "@/types/guest";
import {RSVPPill} from "@/app/rsvp/RSVPPill";
import {RSVPsReview} from "@/app/rsvp/RSVPsReview";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";
import EmailModal from "@/app/EmailModal";
import {REHEARSAL_DINNER_ROLE, RSVP_DEADLINE} from "@/constants/app-constants";

const IS_ATTENDING_POSTFIX = '_isAttending';
const IS_ATTENDING_REHEARSAL_DINNER_POSTFIX = '_isAttendingRehearsalDinner';

const DINNER_CHOICES = [
    {displayName: 'Grilled Filet Mignon', id: 'beef'},
    {displayName: 'Pistachio Crusted Chicken Breast', id: 'chicken'},
    {displayName: 'Pan-Seared Walleye', id: 'fish'},
    {displayName: 'I have a food restriction', id: 'restrictive-diet'}
];
export default function RSVPClient() {
    const {loggedInGuest} = useLoggedInGuest();
    const [guestsInParty, setGuestsInParty] = useState([] as Guest[]);
    const [rsvpPage, setRsvpPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [rsvps, setRsvps] = useState([] as RSVP[]);

    useEffect(() => {
        if (loggedInGuest) {
            const partyId = loggedInGuest.partyId;
            if (partyId && partyId !== '') {
                axios.get(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist?partyId=${partyId}`)
                    .then(guestListResponse => {
                        setGuestsInParty(guestListResponse.data.guests);
                        setIsLoading(false);
                    });
            }
            const query = loggedInGuest.partyId ? `partyId=${loggedInGuest.partyId}` : `guestIds=${loggedInGuest.guestId}`;
            axios.get(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/rsvp?${query}`)
                .then(getRsvpsResponse => {
                    setRsvps(getRsvpsResponse.data.rsvps);
                });
        }
    }, [loggedInGuest]);

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

    const incrementRsvpPage = () => {
        setRsvpPage(rsvpPage + 1);
    }
    const decrementRsvpPage = () => {
        setRsvpPage(rsvpPage - 1);
    }
    const rehearsalDinnerGuests = guestsInParty.filter(g => g.roles && g.roles.includes(REHEARSAL_DINNER_ROLE));
    const andYourGuests = !guestsInParty || guestsInParty.length <= 1 ? '' : ` and your guest${guestsInParty.length > 2 ? 's' : ''}`;
    const andYourGuestsRehearsal = !rehearsalDinnerGuests || rehearsalDinnerGuests.length <= 1 ? '' : ` and your guest${rehearsalDinnerGuests.length > 2 ? 's' : ''}`;

    const AreYouAttendingContent = () => {
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
    const DinnerChoiceContent = () => {
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
                                    data={DINNER_CHOICES.map(dc => dc.displayName)}
                                    key={form.key(`${getGuestPrefix(guest)}_dinnerChoice`)}
                                    {...form.getInputProps(`${getGuestPrefix(guest)}_dinnerChoice`)}
                                />
                            </div>
                            {<div>
                                <Textarea
                                    ref={ref}
                                    resize={'vertical'}
                                    label={'Dietary Restrictions'}
                                    placeholder={'Please tell us about any dietary restrictions you may have!'}
                                    key={form.key(`${getGuestPrefix(guest)}_dietaryRestrictions`)}
                                    {...form.getInputProps(`${getGuestPrefix(guest)}_dietaryRestrictions`)}
                                />
                            </div>}
                            {index + 1 !== attendingGuests.length ? <Divider my={'md'}/> : <></>}
                        </div>
                    ))}
            </div>
        );
    }
    const SongRequestsContent = () => {
        const ref = useRef();
        return (
            <div className={'flex flex-col gap-4'}>
                <div>
                    <Textarea
                        ref={ref}
                        resize={'vertical'}
                        label={'Share your must-play party song (This is not required):'}
                        placeholder={'Make sure to share the name of the song and the artist!'}
                        key={'must-play'}
                        {...form.getInputProps(`must-play`)}
                    />
                </div>
            </div>
        );
    }
    const RehearsalDinnerContent = () => {
        return (
            <div className={'flex flex-col gap-4'}>
                {rehearsalDinnerGuests
                    .map((guestInParty, index) => {
                        return (
                            <div key={`guest-response-${index}`} className={'flex justify-between'}>
                                <div>
                                    <p>{guestInParty.firstName} {guestInParty.lastName}</p>
                                </div>
                                <div>
                                    <Checkbox
                                        variant={'outline'}
                                        color={'green'}
                                        key={form.key(`${getGuestPrefix(guestInParty)}${IS_ATTENDING_REHEARSAL_DINNER_POSTFIX}`)}
                                        {...form.getInputProps(`${getGuestPrefix(guestInParty)}${IS_ATTENDING_REHEARSAL_DINNER_POSTFIX}`, {type: 'checkbox'})}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        )
    }

    const ReviewContent = () => {
        const reviewRsvps = getRsvpsFromForm();
        return <RSVPsReview rsvps={reviewRsvps} setRsvps={setRsvps}/>
    }

    const PAGES = [
        {title: `Will you${andYourGuests} be attending?`, content: () => <AreYouAttendingContent/>},
        {title: `What will you${andYourGuests} have for dinner?`, content: () => <DinnerChoiceContent/>},
        {title: 'We\'re taking requests!', content: () => <SongRequestsContent/>},
        ...(rehearsalDinnerGuests.length ?
                [{
                    title: `Will you${andYourGuestsRehearsal} be attending the rehearsal dinner?`,
                    content: () => <RehearsalDinnerContent/>
                }] :
                []
        ),
        {title: 'Review Your Selections:', content: () => <ReviewContent/>}
    ]

    function getRsvpsFromForm(): RSVP[] {
        return guestsInParty.map(guestInParty => {
            const isAttending = extractValueFromForm(guestInParty, IS_ATTENDING_POSTFIX);
            const isAttendingRehearsalDinner = extractValueFromForm(guestInParty, IS_ATTENDING_REHEARSAL_DINNER_POSTFIX);
            return {
                guest: guestInParty,
                isAttending: Boolean(isAttending),
                ...(guestInParty.roles && guestInParty.roles.includes(REHEARSAL_DINNER_ROLE) ?
                        {isAttendingRehearsalDinner: Boolean(isAttendingRehearsalDinner)} :
                        {}
                ),
                dinnerChoice: extractValueFromForm(guestInParty, '_dinnerChoice'),
                dietaryRestrictions: extractValueFromForm(guestInParty, '_dietaryRestrictions'),
                songRequests: form.getValues()['must-play']
            }
        });
    }

    const handleSubmit = async () => {
        const rsvpsFromForm = getRsvpsFromForm();
        await axios.post(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/rsvp`, {rsvps: rsvpsFromForm});
        setRsvps(rsvpsFromForm);
    }
    const deleteRSVPs = async () => {
        const guestIds = rsvps.map(rsvp => rsvp.guest.guestId);
        await axios.delete(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/rsvp?guestIds=${guestIds}`);
        setRsvps([]);
        form.reset();
        setRsvpPage(0);
    }
    const currentPage = PAGES[rsvpPage];
    return (
        <div>
            <Skeleton visible={isLoading}>
                <EmailModal loggedInGuest={loggedInGuest}/>
                <div className={'flex justify-center w-full'}>
                    <Card className={'w-full md:w-3/4 xl:w-1/2'}>
                        {rsvps.length ?
                            <div>
                                <RSVPsReview rsvps={rsvps}/>
                                <Divider my={'md'}/>
                                <div className={'flex flex-col gap-4'}>
                                    <div>
                                        <p>Need to change your selections? No problem! Just RSVP again
                                            before {RSVP_DEADLINE}.</p>
                                    </div>
                                    <div className={'flex justify-between'}>
                                        <div></div>
                                        <Button onClick={deleteRSVPs} variant={'outline'}>Delete RSVPs and Start
                                            Over</Button>
                                    </div>
                                </div>
                            </div> :
                            <form>
                                <h2 className={'text-4xl'}>{currentPage.title}</h2>
                                <Divider my={'md'}/>
                                <div>
                                    {currentPage.content()}
                                </div>
                                <Divider my={'md'}/>
                                <div className={'flex justify-between'}>
                                    <div></div>
                                    <div className={'flex gap-2'}>
                                        <Button disabled={rsvpPage === 0} variant={'outline'} color={'black'}
                                                onClick={() => {
                                                    if (rsvpPage + 1 === PAGES.length && attendingGuests.length === 0) {
                                                        setRsvpPage(0);
                                                    } else {
                                                        decrementRsvpPage();
                                                    }
                                                }}>Back</Button>
                                        {rsvpPage === PAGES.length - 1 ?
                                            <Button variant={'outline'} color={'black'}
                                                    onClick={handleSubmit}>Submit</Button> :
                                            <Button disabled={rsvpPage >= PAGES.length - 1} variant={'outline'}
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