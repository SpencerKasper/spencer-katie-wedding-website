'use client';

import {useForm} from "@mantine/form";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Button, Loader, Notification, PasswordInput, TextInput} from "@mantine/core";
import axios from "axios";
import {OverrideFont} from "@/app/components/OverrideFont";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";

export const FIRST_NAME_LOCAL_STORAGE_KEY = 'WEDDING_FIRST_NAME';
export const LAST_NAME_LOCAL_STORAGE_KEY = 'WEDDING_LAST_NAME';
export const PASSWORD_LOCAL_STORAGE_KEY = 'WEDDING_PASSWORD';
export const WEDDING_GUEST_LOCAL_STORAGE_KEY = 'WEDDING_GUEST';

export default function LoginPageClient() {
    const router = useRouter();
    const [hasError, setHasError] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const {validateLoginInfo, isLoading} = useLoggedInGuest()

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
        const response = await validateLoginInfo(loginInfo);
        if (response.isAuthorized) {
            setIsLoggingIn(false);
            router.push('/home');
        } else {
            setHasError(true);
            setIsLoggingIn(false);
        }
    };
    return !isLoading ?
        <div
            className="text-white flex flex-col align-center min-h-screen w-full gap-8 font-[family-name:var(--font-geist-sans)]">
            {hasError ?
                <div className={'px-4 sm:px-16'}>
                    <Notification className={'w-full'} color={'red'} onClose={() => setHasError(false)}>
                        There was an error with the first name, last name, and/or password you entered. Please make sure the
                        information matches exactly as spelled on your invite. If your invite was addressed to your entire family
                        or doesn&apos;t include your name, try a few variations of your name.  If that still doesn&apos;t work,
                        please text Spencer at (224)-567-9847 and he can help you login.
                    </Notification>
                </div> :
                <></>
            }
            <main className="flex flex-col gap-8">
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
                                    key={form.key('firstName')}
                                    className={'min-w-80'}
                                    label={'First Name (As Written On Invite)'}
                                    placeholder={'Enter First Name Here'}
                                    {...form.getInputProps('firstName')}
                                />
                                <TextInput
                                    key={form.key('lastName')}
                                    className={'min-w-80'}
                                    label={'Last Name (As Written On Invite)'}
                                    placeholder={'Enter Last Name Here'}
                                    {...form.getInputProps('lastName')}
                                />
                            </div>
                            <div className={'px-4 md:px-8'}>
                                <PasswordInput
                                    // className={'min-w-80'}
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