'use client';

import {useForm} from "@mantine/form";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Button, Group, Loader, Modal, Notification, PasswordInput, Radio, TextInput} from "@mantine/core";
import axios from "axios";
import {OverrideFont} from "@/app/components/OverrideFont";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";
import {setPossibleGuests} from "@/lib/reducers/appReducer";
import {useAppDispatch} from "@/lib/hooks";
import {Guest} from "@/types/guest";

export const FIRST_NAME_LOCAL_STORAGE_KEY = 'WEDDING_FIRST_NAME';
export const LAST_NAME_LOCAL_STORAGE_KEY = 'WEDDING_LAST_NAME';
export const PASSWORD_LOCAL_STORAGE_KEY = 'WEDDING_PASSWORD';
export const WEDDING_GUEST_LOCAL_STORAGE_KEY = 'WEDDING_GUEST';

export default function LoginPageClient() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [hasError, setHasError] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null as Guest);
    const [userConfirmationModalOpen, setUserConfirmationModalOpen] = useState(false);
    const {validateLoginInfo, isLoading, possibleGuests} = useLoggedInGuest();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            firstName: '',
            lastName: '',
            password: '',
        },
    });
    const handleSubmit = async (loginInfo) => {
        setIsLoggingIn(true);
        const response = await validateLoginInfo(loginInfo, selectedGuest ? selectedGuest.guestId : '');
        if (response.isAuthorized) {
            router.push('/home');
            setIsLoggingIn(false);
        } else if (response.possibleGuests && response.possibleGuests.length) {
            dispatch(setPossibleGuests({possibleGuests: response.possibleGuests}));
            setUserConfirmationModalOpen(true);
            setIsLoggingIn(false);
        } else {
            setHasError(true);
            setIsLoggingIn(false);
        }
    };
    const getCompareFieldForGuests = (guests: Guest[]): keyof Guest => {
        const POSSIBLE_FIELDS: (keyof Guest)[] = ['emailAddress', "phoneNumber", 'state', 'city'];
        const foundField = POSSIBLE_FIELDS.find(field => new Set(guests.map(g => g[field])).size === guests.length);
        if (foundField) {
            return foundField;
        }
        return 'emailAddress';
    };
    const compareFieldForGuests = getCompareFieldForGuests(possibleGuests);
    const onSelectedGuestChange = (value) => {
        const key = compareFieldForGuests;
        const foundGuest = possibleGuests.find(g => g[key] === value);
        setSelectedGuest(foundGuest);
    };
    const camelCaseToDisplay = (value) => {
        const replaced = value
            .replace(/([A-Z])/g, ' $1');
        return replaced.toLowerCase();
    };
    return !isLoading ?
        <div
            className="text-white flex flex-col align-center min-h-screen w-full gap-8 font-[family-name:var(--font-geist-sans)]">
            {hasError ?
                <div className={'px-4 sm:px-16'}>
                    <Notification className={'w-full'} color={'red'} onClose={() => setHasError(false)}>
                        There was an error with the first name, last name, and/or password you entered. Please make sure
                        the
                        information matches exactly as spelled on your invite. If your invite was addressed to your
                        entire family
                        or doesn&apos;t include your name, try a few variations of your name. If your invite was
                        addressed as
                        &quot;Mr. Spencer Kasper & Ms. Katie Riek&quot;, Spencer&apos;s login would
                        be &quot;Spencer&quot; for first name and
                        &quot;Kasper&quot; for last name. Katie would have her own login similarly. If that still
                        doesn&apos;t work,
                        please text Spencer at (224)-567-9847 and he can help you login.
                    </Notification>
                </div> :
                <></>
            }
            <main className="flex flex-col gap-8">
                <Modal opened={userConfirmationModalOpen} onClose={() => setUserConfirmationModalOpen(false)}
                       className={'flex flex-col gap-8'}>
                    <Radio.Group
                        name="loggedInUserEmail"
                        label={`Which of the following is your ${camelCaseToDisplay(compareFieldForGuests)}?`}
                        description="This will help us determine which account to choose for you."
                        withAsterisk
                        onChange={onSelectedGuestChange}
                    >
                        <Group className={'flex flex-col gap-4 p-8'}>
                            {possibleGuests.map(g => {
                                const key = compareFieldForGuests;
                                return <Radio key={`radio-${key}`}
                                              label={g[key]}
                                              value={g.emailAddress}/>;
                            })}
                        </Group>
                    </Radio.Group>
                    <div>
                        <Button onClick={async () => handleSubmit(form.getValues())}>Submit</Button>
                    </div>
                </Modal>
                <div className={'flex flex-col gap-8'}>
                    <OverrideFont>
                        <h1 className={'text-6xl leading-relaxed text-white text-center font-bold'}>
                            Katie and Spencer&apos;s Wedding
                        </h1>
                        <h2 className={'text-4xl text-white text-center font-bold pt-8'}>
                            10.11.25
                        </h2>
                    </OverrideFont>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <div className={'flex flex-col gap-8 justify-center items-center'}>
                            <div className={'flex gap-8 flex-wrap justify-center items-center'}>
                                <TextInput
                                    disabled={isLoggingIn}
                                    key={form.key('firstName')}
                                    className={'min-w-80'}
                                    label={'Your First Name (As Spelled On Invite)'}
                                    placeholder={'Enter Your First Name Here'}
                                    {...form.getInputProps('firstName')}
                                />
                                <TextInput
                                    disabled={isLoggingIn}
                                    key={form.key('lastName')}
                                    className={'min-w-80'}
                                    label={'Your Last Name (As Spelled On Invite)'}
                                    placeholder={'Enter Your Last Name Here'}
                                    {...form.getInputProps('lastName')}
                                />
                            </div>
                            <div className={'px-4 md:px-8'}>
                                <PasswordInput
                                    // className={'min-w-80'}
                                    disabled={isLoggingIn}
                                    key={form.key('password')}
                                    label={'Please enter the password provided on your invite to gain access to the website.'}
                                    placeholder={'Enter password here.'}
                                    {...form.getInputProps('password')}
                                />
                            </div>
                            <Button loading={isLoggingIn} type={'submit'} variant={'outline'} color={'white'}>
                                Enter
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div> :
        <div className={'w-full flex justify-center align-center'}>
            <Loader color={'white'} type={'dots'}/>
        </div>;
}