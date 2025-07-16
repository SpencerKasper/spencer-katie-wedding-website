'use client';
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        localStorage.clear();
        router.push('/');
    }, []);

    return (
        <div>
            <p className={'text-center text-white w-full'}>Logging out...</p>
        </div>
    )
}