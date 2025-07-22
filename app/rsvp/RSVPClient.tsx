'use client';

import {useEffect, useRef, useState} from "react";
import {Alert, Button, Card, Checkbox, Divider, Select, Skeleton, Textarea, TextInput} from "@mantine/core";
import axios from "axios";
import {useForm, UseFormReturnType} from "@mantine/form";
import {PlusOne, RSVP} from "@/types/rsvp";
import {Guest} from "@/types/guest";
import {RSVPsReview} from "@/app/rsvp/RSVPsReview";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";
import EmailModal from "@/app/EmailModal";
import {GUEST_IDS_WITH_PLUS_ONE, REHEARSAL_DINNER_ROLE, RSVP_DEADLINE} from "@/constants/app-constants";

const IS_ATTENDING_SUFFIX = '_isAttending';
const IS_ATTENDING_REHEARSAL_DINNER_SUFFIX = '_isAttendingRehearsalDinner';
const DINNER_CHOICE_SUFFIX = '_dinnerChoice';
const DIETARY_RESTRICTIONS_SUFFIX = `_dietaryRestrictions`;
const NO_GUEST_SUFFIX = `_noGuest`;
const PLUS_ONE_FIRST_NAME_SUFFIX = '_plusOneFirstName';
const PLUS_ONE_LAST_NAME_SUFFIX = '_plusOneLastName';
const PLUS_ONE_DINNER_CHOICE_SUFFIX = '_plusOneDinnerChoice';
const PLUS_ONE_DIETARY_RESTRICTIONS = '_plusOneDietaryRestrictions';
const NO_PLUS_ONE_SUFFIX = '_noGuest';

export const RESTRICTIVE_DIET_DINNER_CHOICE = 'restrictive-diet';
const RESTRICTIVE_DIET_DISPLAY_NAME = 'I have a food restriction';
const DINNER_CHOICES = [
    {displayName: 'Grilled Filet Mignon', id: 'beef'},
    {displayName: 'Pistachio Crusted Chicken Breast', id: 'chicken'},
    {displayName: 'Pan-Seared Walleye', id: 'fish'},
    {displayName: RESTRICTIVE_DIET_DISPLAY_NAME, id: RESTRICTIVE_DIET_DINNER_CHOICE}

];

interface FormPage {
    title: string,
    content: () => JSX.Element,
    onValidate?: (values) => string,
}

export const guestHasPlusOne = (guest: Guest): boolean => GUEST_IDS_WITH_PLUS_ONE.includes(guest.guestId);

function FoodChoices(props: { dinnerChoiceKey, dietaryRestrictionsKey, guest: Guest | PlusOne, form: UseFormReturnType<any, (values: any) => any>, index: number, guests: Guest[] }) {
    return <div className={"flex flex-col gap-4"}>
        <div className={"flex justify-between"}>
            <p>{props.guest.firstName} {props.guest.lastName}</p>
            <Select
                label={"Dinner choice"}
                placeholder={"Select your dinner option"}
                data={DINNER_CHOICES.map(dc => dc.displayName)}
                {...props.form.getInputProps(props.dinnerChoiceKey)}
            />
        </div>
        {<div>
            <Textarea
                resize={"vertical"}
                label={"Dietary Restrictions"}
                placeholder={"Please tell us about any dietary restrictions you may have!"}

                {...props.form.getInputProps(props.dietaryRestrictionsKey)}
            />
        </div>}
        {props.index + 1 !== props.guests.length ? <Divider my={"md"}/> : <></>}
    </div>;
}

export default function RSVPClient() {
    const {loggedInGuest} = useLoggedInGuest();
    const [guestsInParty, setGuestsInParty] = useState([] as Guest[]);
    const [rsvpPage, setRsvpPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [rsvps, setRsvps] = useState([] as RSVP[]);
    const [formErrorMessage, setFormErrorMessage] = useState(null);

    async function getGuests(partyId: string = '', guestId: string = '') {
        const partyQueryParam = partyId !== '' ? `partyId=${partyId}` : '';
        const guestQueryParam = guestId !== '' ? `guestId=${guestId}` : '';
        const queryParam = partyQueryParam === '' && guestQueryParam === '' ?
            '' :
            `?${partyQueryParam}${guestQueryParam}`;
        return axios.get(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist${queryParam}`)
            .then(guestListResponse => {
                setGuestsInParty(guestListResponse.data.guests);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (loggedInGuest) {
            const partyId = loggedInGuest.partyId ? loggedInGuest.partyId : '';
            if (partyId !== '') {
                getGuests(partyId).then();
            } else {
                getGuests('', loggedInGuest.guestId).then();
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
        dietaryRestrictions: '',
        plusOne: {
            firstName: '',
            lastName: '',
            dinnerChoice: '',
        }
    };
    const getGuestPrefix = (guest: Guest) => `guest-${guest.guestId}`;
    const getFormFieldId = (guest: Guest, suffix: string) => `${getGuestPrefix(guest)}${suffix}`;
    const getInitialValues = () => {
        const prefixes = guestsInParty.map(getGuestPrefix);
        const allFields = FIELDS.reduce((acc, curr) => [...acc, ...prefixes.map(prefix => `${prefix}_${curr}`)], []);
        return allFields.reduce((acc, curr) => ({...acc, [curr]: FIELD_DEFAULTS[curr.split('_')[1]]}), {});
    }

    // const buildValidators = () => {
    //     return guestsInParty.reduce((acc, curr) => {
    //         return {
    //             ...acc,
    //             [getFormFieldId(curr, )]: (value) => {
    //
    //             }
    //         }
    //     }, {})
    // }

    const initialValues = getInitialValues();
    const form = useForm({
        mode: 'uncontrolled',
        initialValues,
        // validate: buildValidators(),
        onValuesChange: (value, previous) => {
            for (let guest of guestsInParty) {
                const key = getFormFieldId(guest, NO_PLUS_ONE_SUFFIX);
                if (value[key] !== previous[key]) {
                    setGuestIdsDecliningGuest(value[key] ?
                        [...guestIdsDecliningGuest, guest.guestId] :
                        guestIdsDecliningGuest.filter(g => g !== guest.guestId)
                    )
                }
            }
        }
    });
    const [guestIdsDecliningGuest, setGuestIdsDecliningGuest] = useState([]);
    const extractValueFromForm = (guest: Guest, suffix: string) => {
        const valuesWithId = form.getValues();
        return valuesWithId[`${getGuestPrefix(guest)}${suffix}`];

    }
    const removeGuestsWhoAreNotAttending = (guest) => {
        return extractValueFromForm(guest, IS_ATTENDING_SUFFIX);
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
                        <div key={`guest-response-${index}`}>
                            <div className={'flex justify-between pb-4'}>
                                <div>
                                    <p className={'font-semibold'}>{guestInParty.firstName} {guestInParty.lastName}</p>
                                </div>
                                <div>
                                    <Checkbox
                                        variant={'outline'}
                                        color={'green'}
                                        key={form.key(getFormFieldId(guestInParty, IS_ATTENDING_SUFFIX))}
                                        {...form.getInputProps(getFormFieldId(guestInParty, IS_ATTENDING_SUFFIX), {type: 'checkbox'})}
                                    />
                                </div>
                            </div>
                            {guestHasPlusOne(guestInParty) ?
                                <div className={'flex flex-col gap-4 items-center'}>
                                    {!guestIdsDecliningGuest.includes(guestInParty.guestId) ?
                                        <>
                                            <div className={'text-center italic'}>
                                                <p>{guestInParty.firstName} is invited to bring a guest to this event!
                                                    Please enter their name:</p>
                                            </div>
                                            <div className={'flex justify-between px-16 py-4 w-full flex-wrap gap-4'}>
                                                <TextInput
                                                    label={'First Name'}
                                                    placeholder={'Please enter plus one\'s first name'}
                                                    key={form.key(getFormFieldId(guestInParty, PLUS_ONE_FIRST_NAME_SUFFIX))}
                                                    {...form.getInputProps(getFormFieldId(guestInParty, PLUS_ONE_FIRST_NAME_SUFFIX))}
                                                />
                                                <TextInput
                                                    label={'Last Name'}
                                                    placeholder={'Please enter plus one\'s last name'}
                                                    key={form.key(`${getGuestPrefix(guestInParty)}${PLUS_ONE_LAST_NAME_SUFFIX}`)}
                                                    {...form.getInputProps(`${getGuestPrefix(guestInParty)}_plusOneLastName`)}
                                                />
                                            </div>
                                        </> :
                                        <></>
                                    }

                                    <div>
                                        <Checkbox
                                            label={'I do not want to bring a guest'}
                                            variant={'outline'}
                                            color={'green'}
                                            key={form.key(getFormFieldId(guestInParty, NO_GUEST_SUFFIX))}
                                            {...form.getInputProps(getFormFieldId(guestInParty, NO_GUEST_SUFFIX), {type: 'checkbox'})}
                                        />
                                    </div>
                                </div> :
                                <></>
                            }
                            <div className={'pt-4'}>
                                {index + 1 !== guestsInParty.length ? <Divider/> : <></>}
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    };
    const DinnerChoiceContent = () => {
        return (
            <div className={'flex flex-col gap-4'}>
                {attendingGuests
                    .map((guest, index) => {
                        return (<>
                                <FoodChoices
                                    dietaryRestrictionsKey={`${getGuestPrefix(guest)}${DIETARY_RESTRICTIONS_SUFFIX}`}
                                    dinnerChoiceKey={`${getGuestPrefix(guest)}${DINNER_CHOICE_SUFFIX}`}
                                    guest={guest}
                                    form={form}
                                    index={index}
                                    guests={attendingGuests}
                                />
                                {guestHasPlusOne(guest) && !extractValueFromForm(guest, NO_GUEST_SUFFIX) ?
                                    <FoodChoices
                                        dinnerChoiceKey={`${getGuestPrefix(guest)}${PLUS_ONE_DINNER_CHOICE_SUFFIX}`}
                                        dietaryRestrictionsKey={`${getGuestPrefix(guest)}${PLUS_ONE_DIETARY_RESTRICTIONS}`}
                                        guest={getPlusOneFromForm(guest)}
                                        form={form}
                                        index={index}
                                        guests={attendingGuests}
                                    /> :
                                    <></>
                                }
                            </>
                        );
                    })}
            </div>
        );
    }
    const SongRequestsContent = () => {
        return (
            <div className={'flex flex-col gap-4'}>
                <div>
                    <Textarea
                        resize={'vertical'}
                        label={'Share your must-play party song(s) for your group! (This is not required):'}
                        placeholder={'Make sure to share the name, artist and version of the song!'}
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
                                        key={form.key(`${getGuestPrefix(guestInParty)}${IS_ATTENDING_REHEARSAL_DINNER_SUFFIX}`)}
                                        {...form.getInputProps(`${getGuestPrefix(guestInParty)}${IS_ATTENDING_REHEARSAL_DINNER_SUFFIX}`, {type: 'checkbox'})}
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
        return <RSVPsReview rsvps={reviewRsvps}/>
    }

    const PAGES: FormPage[] = [
        {
            title: `Will you${andYourGuests} be attending?`,
            content: () => <AreYouAttendingContent/>,
            onValidate: (values) => {
                const guestsWithInvalidPlusOneDecisions = guestsInParty
                    .filter(guest => {
                        if (!guestHasPlusOne(guest)) {
                            return false;
                        }
                        const plusOneHasFirstAndLastName = values[getFormFieldId(guest, PLUS_ONE_FIRST_NAME_SUFFIX)] &&
                            values[getFormFieldId(guest, PLUS_ONE_LAST_NAME_SUFFIX)];
                        const guestNotBringingPlusOne = values[getFormFieldId(guest, NO_GUEST_SUFFIX)];
                        return !(guestNotBringingPlusOne || plusOneHasFirstAndLastName);
                    });
                return guestsWithInvalidPlusOneDecisions.length ?
                    'Plus ones must either have both a first name and last name OR you must decline bringing one.' :
                    null;
            },
        },
        {
            title: `What will you${andYourGuests} have for dinner?`,
            content: () => <DinnerChoiceContent/>,
            onValidate: values => {
                const missingDinnerChoice = guestsInParty.filter(guest => {
                    const dinnerChoice = values[getFormFieldId(guest, DINNER_CHOICE_SUFFIX)];
                    const plusOneDinnerChoice = values[getFormFieldId(guest, PLUS_ONE_DINNER_CHOICE_SUFFIX)];
                    const plusOneIsComingButDidNotPickDinnerChoice = guestHasPlusOne(guest) &&
                        !values[getFormFieldId(guest, NO_PLUS_ONE_SUFFIX)] &&
                        (plusOneDinnerChoice === '' || !plusOneDinnerChoice);
                    return !dinnerChoice || dinnerChoice === '' || plusOneIsComingButDidNotPickDinnerChoice;
                });
                if (missingDinnerChoice.length > 0) {
                    return 'Each guest must select what they want to eat for dinner.'
                }

                const missingDietaryRestrictions = guestsInParty.filter(guest => {
                    const dinnerChoice = values[getFormFieldId(guest, DINNER_CHOICE_SUFFIX)];
                    const dietaryRestrictions = values[getFormFieldId(guest, DIETARY_RESTRICTIONS_SUFFIX)];
                    const plusOneDinnerChoice = values[getFormFieldId(guest, PLUS_ONE_DINNER_CHOICE_SUFFIX)];
                    const plusOneDietaryRestrictions = values[getFormFieldId(guest, PLUS_ONE_DIETARY_RESTRICTIONS)];
                    const hasRestrictiveButDidntSayWhat = dinnerChoice === RESTRICTIVE_DIET_DISPLAY_NAME &&
                        (!dietaryRestrictions || dietaryRestrictions === '');
                    const plusOneHasRestrictiveButDidntSayWhat = plusOneDinnerChoice === RESTRICTIVE_DIET_DISPLAY_NAME &&
                        (!plusOneDietaryRestrictions || dietaryRestrictions === '');
                    return hasRestrictiveButDidntSayWhat || plusOneHasRestrictiveButDidntSayWhat;
                });
                return missingDietaryRestrictions.length ?
                    'If you have selected the restrictive diet dinner choice, you must provide your dietary restrictions.' :
                    null;
            }
        },
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

    const getPlusOneFromForm = (guest: Guest): PlusOne => {
        return {
            guestId: guest.guestId,
            firstName: extractValueFromForm(guest, PLUS_ONE_FIRST_NAME_SUFFIX),
            lastName: extractValueFromForm(guest, PLUS_ONE_LAST_NAME_SUFFIX),
            dinnerChoice: extractValueFromForm(guest, PLUS_ONE_DINNER_CHOICE_SUFFIX),
            dietaryRestrictions: extractValueFromForm(guest, PLUS_ONE_DIETARY_RESTRICTIONS),
        }
    };

    function getRsvpsFromForm(): RSVP[] {
        return guestsInParty.map(guestInParty => {
            const isAttending = extractValueFromForm(guestInParty, IS_ATTENDING_SUFFIX);
            const isAttendingRehearsalDinner = extractValueFromForm(guestInParty, IS_ATTENDING_REHEARSAL_DINNER_SUFFIX);
            return {
                guest: guestInParty,
                isAttending: Boolean(isAttending),
                ...(guestInParty.roles && guestInParty.roles.includes(REHEARSAL_DINNER_ROLE) ?
                        {isAttendingRehearsalDinner: Boolean(isAttendingRehearsalDinner)} :
                        {}
                ),
                dinnerChoice: extractValueFromForm(guestInParty, DINNER_CHOICE_SUFFIX),
                dietaryRestrictions: extractValueFromForm(guestInParty, DIETARY_RESTRICTIONS_SUFFIX),
                songRequests: form.getValues()['must-play'],
                plusOne: guestHasPlusOne(guestInParty) && !extractValueFromForm(guestInParty, NO_GUEST_SUFFIX) ?
                    getPlusOneFromForm(guestInParty) :
                    null,
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
                                {formErrorMessage && formErrorMessage !== '' ?
                                    <div className={'pb-4'}>
                                        <Alert
                                            title={'Something doesn\'t look quite right...'}
                                            color={'red'}
                                            variant={'light'}
                                            onClose={() => setFormErrorMessage(null)}
                                            withCloseButton
                                        >
                                            {formErrorMessage}
                                        </Alert>
                                    </div> :
                                    <></>
                                }
                                <h2 className={'text-4xl'}>{currentPage.title}</h2>
                                <Divider my={'md'}/>
                                <div>
                                    {currentPage.content()}
                                </div>
                                <Divider my={'md'}/>
                                <div className={'flex justify-between'}>
                                    <div></div>
                                    <div className={'flex gap-2'}>
                                        <Button
                                            disabled={rsvpPage === 0}
                                            variant={'outline'}
                                            color={'black'}
                                            onClick={() => {
                                                if (rsvpPage === PAGES.length - 1 || attendingGuests.length === 0) {
                                                    setRsvpPage(0);
                                                } else {
                                                    decrementRsvpPage();
                                                }
                                            }}>
                                            Back
                                        </Button>
                                        {rsvpPage === PAGES.length - 1 ?
                                            <Button
                                                variant={'outline'}
                                                color={'black'}
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </Button> :
                                            <Button
                                                disabled={rsvpPage >= PAGES.length - 1}
                                                variant={'outline'}
                                                color={'black'}
                                                onClick={() => {
                                                    const errorMessage = currentPage.onValidate ?
                                                        currentPage.onValidate(form.getValues()) :
                                                        '';
                                                    if (!errorMessage || errorMessage === '') {
                                                        setFormErrorMessage(null);
                                                        if (attendingGuests.length === 0) {
                                                            setRsvpPage(PAGES.length - 1)
                                                        } else {
                                                            incrementRsvpPage();
                                                        }
                                                    } else {
                                                        setFormErrorMessage(errorMessage);
                                                    }
                                                }}>
                                                Next
                                            </Button>
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