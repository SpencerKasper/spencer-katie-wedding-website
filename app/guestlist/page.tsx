'use client';
import {GuestListTable} from "@/app/guestlist/GuestListTable";
import AdminAuthorizationRequired from "@/app/AdminAuthorizationRequired";

export default function GuestListPage() {
    return (
        <AdminAuthorizationRequired>
            <div className={'p-4 md:px-8'}>
                <GuestListTable />
            </div>
        </AdminAuthorizationRequired>
    )
}