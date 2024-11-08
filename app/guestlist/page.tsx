import axios from "axios";
import {GuestListTable} from "@/app/guestlist/GuestListTable";
import AdminAuthorizationRequired from "@/app/AdminAuthorizationRequired";

export default async function GuestListPage() {
    const url = `${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`;
    const guestListResponse = await axios.get(url);
    const {guests} = guestListResponse.data;
    return (
        <AdminAuthorizationRequired>
            <div className={'p-4 md:px-8'}>
                <GuestListTable guests={guests}/>
            </div>
        </AdminAuthorizationRequired>
    )
}