'use client';
import {useRouter} from "next/navigation";

export default function Logout() {
    const router = useRouter();
    localStorage.clear();
    router.push('/');
}