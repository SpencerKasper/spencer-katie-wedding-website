'use client';

import {TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useRouter} from "next/navigation";
import {useLocalStorage} from "@mantine/hooks";
import {useEffect} from "react";

export default function Home() {
    const [hasCompletedPasswordAuth, setValue] = useLocalStorage({
        key: 'hasCompletedPasswordAuthenticationYesIKnowYouCanHackThisIfYouSeeThisPleaseDont',
        defaultValue: false
    });
    const router = useRouter();
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            password: '',
        },
        validate: {
            password: (value) => value === 'Panini' ? null : 'Invalid password',
        },
    });
    useEffect(() => {
        if (hasCompletedPasswordAuth) {
            router.push('/home');
        }
    }, [router, hasCompletedPasswordAuth]);

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div>
                    <div className={'flex flex-col'}>
                        <h1 className={'text-6xl text-black text-center font-bold'}>
                            Katie and Spencer&apos;s Wedding
                        </h1>
                    </div>
                    {!hasCompletedPasswordAuth ?
                        <form onSubmit={form.onSubmit(() => {
                            setValue(true);
                            router.push('/home');
                        })}>
                            <TextInput
                                key={form.key('password')}
                                label={'Password (Hit enter to submit.)'}
                                placeholder={'Please enter the password to gain access to the website.'}
                                {...form.getInputProps('password')}
                            />
                        </form> :
                        <></>
                    }
                </div>
            </main>
        </div>
    );
}
