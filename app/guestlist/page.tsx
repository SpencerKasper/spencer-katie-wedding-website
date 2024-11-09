'use client';
import axios from "axios";
import {GuestListTable} from "@/app/guestlist/GuestListTable";
import AdminAuthorizationRequired from "@/app/AdminAuthorizationRequired";
import {useEffect, useState} from "react";

export default function GuestListPage() {
    const [guests, setGuests] = useState([]);
    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`;
        axios.get(url)
            .then(guestListResponse => setGuests(guestListResponse.data.guests));
    }, []);
    return (
        <AdminAuthorizationRequired>
            <div className={'p-4 md:px-8'}>
                <GuestListTable guests={guests}/>
            </div>
        </AdminAuthorizationRequired>
    )
}