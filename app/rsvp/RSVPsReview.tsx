import {RSVP} from "@/types/rsvp";
import {RSVPPill} from "@/app/rsvp/RSVPPill";
import {Divider, Button} from "@mantine/core";
import axios from "axios";
import {RSVP_DEADLINE} from "@/constants/app-constants";

export const RSVPsReview = ({rsvps, setRsvps}: { rsvps: RSVP[], setRsvps: (value) => void }) => {
    const deleteRSVPs = async () => {
        const guestIds = rsvps.map(rsvp => rsvp.guest.guestId);
        await axios.delete(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/rsvp?guestIds=${guestIds}`);
        setRsvps([]);
    }
    return <div>
        {rsvps.map((rsvp, index) => {
            const rsvpGuest = rsvp.guest;
            return (
                <div key={`guest-rsvp-${index}`} className={'flex flex-col gap-4'}>
                    <div className={'flex justify-between'}>
                        <p className={'text-lg'}>{`${rsvpGuest.firstName} ${rsvpGuest.lastName}`}</p>
                        <RSVPPill rsvp={rsvp}/>
                    </div>
                    <div className={'flex justify-between flex-wrap'}>
                        {rsvp.isAttending ? <p>Dinner Choice: {rsvp.dinnerChoice}</p> : <></>}
                    </div>
                    <div>
                        {rsvp.dietaryRestrictions && rsvp.dietaryRestrictions !== '' ?
                            <p>Dietary Restrictions: {rsvp.dietaryRestrictions}</p> :
                            <></>
                        }
                    </div>
                    {index + 1 !== rsvps.length ? <Divider my={'md'}/> : <></>}
                </div>
            );
        })}
        <Divider my={'md'}/>
        <div className={'flex flex-col gap-4'}>
            <div>
                <p>Need to change your selections? No problem! Just RSVP again before {RSVP_DEADLINE}.</p>
            </div>
            <div className={'flex justify-between'}>
                <div></div>
                <Button onClick={deleteRSVPs} variant={'outline'}>Delete RSVPs and Start Over</Button>
            </div>
        </div>
    </div>;
};