import RSVPClient from "@/app/rsvp/RSVPClient";

export default async function RSVP() {
    return (
        <div className={'flex flex-col gap-8 p-4 md:p-16 justify-center align-center min-h-screen'}>
            <RSVPClient />
        </div>
    )
}