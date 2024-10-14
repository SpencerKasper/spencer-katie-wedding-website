'use client';

import {useForm} from "@mantine/form";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Button, Loader, Notification, PasswordInput, TextInput} from "@mantine/core";
import axios from "axios";

const FIRST_NAME_LOCAL_STORAGE_KEY = 'WEDDING_FIRST_NAME';
const LAST_NAME_LOCAL_STORAGE_KEY = 'WEDDING_LAST_NAME';
const PASSWORD_LOCAL_STORAGE_KEY = 'WEDDING_PASSWORD';

export default function LoginPageClient() {
    const router = useRouter();
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        validateLoginInfo({
            firstName: localStorage.getItem(FIRST_NAME_LOCAL_STORAGE_KEY),
            lastName: localStorage.getItem(LAST_NAME_LOCAL_STORAGE_KEY),
            password: localStorage.getItem(PASSWORD_LOCAL_STORAGE_KEY),
        }).then()
    }, []);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            firstName: '',
            lastName: '',
            password: '',
        },
    });
    const validateLoginInfo = async (loginInfo) => {
        const response = await axios.post(`/api/authorize`, loginInfo);
        if (response.data.isAuthorized) {
            localStorage.setItem(FIRST_NAME_LOCAL_STORAGE_KEY, loginInfo.firstName);
            localStorage.setItem(LAST_NAME_LOCAL_STORAGE_KEY, loginInfo.lastName);
            localStorage.setItem(PASSWORD_LOCAL_STORAGE_KEY, loginInfo.password);
            router.push('/home');
        } else {
            setHasError(true);
            setIsLoading(false);
        }
    };
    return (
        <div
            className="flex flex-col justify-center align-center min-h-screen w-full p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
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
                    {!isLoading ?
                        <form onSubmit={form.onSubmit(validateLoginInfo)}>
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
                        </form> :
                        <div className={'w-full flex justify-center align-center'}>
                            <Loader color={'white'} type={'dots'}/>
                        </div>
                    }
                </div>
            </main>
        </div>
    )
}