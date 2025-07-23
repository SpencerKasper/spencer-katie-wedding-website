'use client';
import {Button, Checkbox, Modal, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {Guest} from "@/types/guest";
import axios from "axios";
import {booleanIsDefined} from "@/app/util/general-util";
import useGuestList from "@/app/hooks/useGuestList";

const EmailModal = ({loggedInGuest}: { loggedInGuest: Guest }) => {
    const {getGuestPartyMember} = useGuestList()
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            emailAddress: loggedInGuest && loggedInGuest.emailAddress ? loggedInGuest.emailAddress : '',
            emailOptOut: loggedInGuest && booleanIsDefined(loggedInGuest.optOutOfEmail) ? loggedInGuest.optOutOfEmail : false,
        },
        validate: {
            emailAddress: (value) => (form.getValues().emailOptOut || /^\S+@\S+$/.test(value) || (value.trim() === '') ? null : 'Invalid email'),
        }
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (loggedInGuest) {
            const hasInvalidEmailAddress = loggedInGuest && (!loggedInGuest.emailAddress || loggedInGuest.emailAddress === '');
            setIsOpen(hasInvalidEmailAddress && !loggedInGuest.optOutOfEmail);
        }
    }, [loggedInGuest]);

    return (
        <Modal
            opened={isOpen}
            onClose={() => setIsOpen(false)}
            title={'Can We Get Your Email Address?'}
        >
            <form
                className={'flex flex-col justify-center items-center p-4 gap-4'}
                onSubmit={form.onSubmit(async (formValues) => {
                    setIsLoading(true);
                    if (loggedInGuest) {
                        await axios.post(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/update-email-address`, {
                            guestId: loggedInGuest.guestId,
                            emailAddress: formValues.emailAddress,
                        });
                        setIsOpen(false);
                    }
                    setIsLoading(false);
                })}
            >
                <p>
                    Your email will only be seen by Spencer Kasper and Katie Riek. We will use your email address only
                    to send you notifications when you or your party RSVPs and
                    alerts
                    related to the wedding.
                </p>
                <div className={'w-full'}>
                    <TextInput
                        disabled={isLoading}
                        placeholder={'Please Enter Your Email'}
                        key={form.key('emailAddress')}
                        {...form.getInputProps('emailAddress')}
                    />
                </div>
                <div>
                    <Checkbox
                        label={'Opt out and do not send reminders to RSVP and update about the wedding via email.'}
                        variant={'outline'}
                        color={'green'}
                        key={form.key(`emailOptOut`)}
                        {...form.getInputProps('emailOptOut', {type: 'checkbox'})}
                    />
                </div>
                <div>
                    <Button loading={isLoading} type='submit' variant={'outline'}>Save</Button>
                </div>
            </form>
        </Modal>
    )
};

export default EmailModal;