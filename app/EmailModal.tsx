'use client';
import {Button, Modal, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {Guest} from "@/types/guest";
import axios from "axios";

const EmailModal = ({loggedInGuest}: {loggedInGuest: Guest}) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            emailAddress: '',
        },
        validate: {
            emailAddress: (value) => (/^\S+@\S+$/.test(value) || value.trim() === '' ? null : 'Invalid email'),
        }
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const hasInvalidEmailAddress = loggedInGuest && (!loggedInGuest.emailAddress || loggedInGuest.emailAddress === '');
        setIsOpen(hasInvalidEmailAddress);
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
                    await axios.patch(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`, {guestId: loggedInGuest.guestId, emailAddress: formValues.emailAddress});
                    setIsLoading(false);
                    setIsOpen(false);
                })}
            >
                <p>
                    We will use your email address only to send you notifications when you or your party RSVPs and
                    alerts
                    related to the wedding.
                </p>
                <div className={'w-full'}>
                    <TextInput
                        disabled={isLoading}
                        required
                        placeholder={'Please Enter Your Email'}
                        key={form.key('emailAddress')}
                        {...form.getInputProps('emailAddress')}
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