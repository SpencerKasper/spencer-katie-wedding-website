'use client';
import {Button, Modal, TextInput} from "@mantine/core";
import {useState} from "react";
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
    console.error(loggedInGuest);
    const hasInvalidEmailAddress = loggedInGuest && (!loggedInGuest.emailAddress || loggedInGuest.emailAddress === '');
    console.error(hasInvalidEmailAddress);
    const [isOpen, setIsOpen] = useState(hasInvalidEmailAddress);
    return (
        <Modal
            opened={isOpen}
            onClose={() => setIsOpen(false)}
            title={'Can We Get Your Email Address?'}
        >
            <form
                className={'flex flex-col justify-center items-center p-4 gap-4'}
                onSubmit={form.onSubmit(async (formValues) => {
                    await axios.patch(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`, {guestId: loggedInGuest.guestId, emailAddress: formValues.emailAddress});
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
                        required
                        placeholder={'Please Enter Your Email'}
                        key={form.key('emailAddress')}
                        {...form.getInputProps('emailAddress')}
                    />
                </div>
                <div>
                    <Button type='submit' variant={'outline'}>Save</Button>
                </div>
            </form>
        </Modal>
    )
};

export default EmailModal;