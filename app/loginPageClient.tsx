'use client';

import {useForm} from "@mantine/form";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Button, Loader, Notification, PasswordInput, TextInput} from "@mantine/core";
import axios from "axios";

export const FIRST_NAME_LOCAL_STORAGE_KEY = 'WEDDING_FIRST_NAME';
export const LAST_NAME_LOCAL_STORAGE_KEY = 'WEDDING_LAST_NAME';
export const PASSWORD_LOCAL_STORAGE_KEY = 'WEDDING_PASSWORD';
export const WEDDING_GUEST_LOCAL_STORAGE_KEY = 'WEDDING_GUEST';

export const validateLoginInfo = async (loginInfo) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/authorize`, loginInfo);
    if (response.data.isAuthorized && response.data.guest) {
        const guest = response.data.guest;
        localStorage.setItem(FIRST_NAME_LOCAL_STORAGE_KEY, loginInfo.firstName);
        localStorage.setItem(LAST_NAME_LOCAL_STORAGE_KEY, loginInfo.lastName);
        localStorage.setItem(PASSWORD_LOCAL_STORAGE_KEY, loginInfo.password);
        localStorage.setItem(WEDDING_GUEST_LOCAL_STORAGE_KEY, JSON.stringify(guest));
    }
    return response.data;
};

export default function LoginPageClient() {
    const router = useRouter();
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const firstName = localStorage.getItem(FIRST_NAME_LOCAL_STORAGE_KEY);
        const lastName = localStorage.getItem(LAST_NAME_LOCAL_STORAGE_KEY);
        const password = localStorage.getItem(PASSWORD_LOCAL_STORAGE_KEY);
        if (firstName && lastName && password && firstName !== '' && lastName !== '' && password !== '') {
            validateLoginInfo({firstName, lastName, password})
                .then(response => {
                    if (response.isAuthorized) {
                        router.push('/home')
                            .then(x => setIsLoading(false))
                    } else {
                        setIsLoading(false);
                    }
                });
        }
    }, []);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            firstName: '',
            lastName: '',
            password: '',
        },
    });
    const handleSubmit = async (loginInfo) => {
        const response = await validateLoginInfo(loginInfo);
        if (response.isAuthorized) {
            router.push('/home');
        } else {
            setIsLoading(false);
            setHasError(true);
        }
    };
    return !isLoading ?
        <div
            className="text-white flex flex-col justify-center align-center min-h-screen w-full p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            {hasError ?
                <Notification className={'w-full'} color={'red'} onClose={() => setHasError(false)}>
                    There was an error with the first name, last name, and/or password you entered. Please make sure the
                    information matches exactly as spelled on your invite.
                </Notification> :
                <></>
            }
            <main className="flex flex-col gap-8">
                <div className={'flex flex-col gap-8'}>
                    <h1 className={'text-6xl text-white text-center font-bold'}>
                        Katie and Spencer&apos;s Wedding
                    </h1>
                    <h2>
                        10.11.25
                    </h2>
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
                            <PasswordInput
                                className={'min-w-80'}
                                key={form.key('password')}
                                label={'Please enter the password provided on your invite to gain access to the website.'}
                                placeholder={'Enter password here.'}
                                {...form.getInputProps('password')}
                            />
                            <Button type={'submit'} variant={'outline'} color={'white'}>
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