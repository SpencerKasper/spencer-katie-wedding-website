import {RSVP} from "@/types/rsvp";
import {RSVPPill} from "@/app/rsvp/RSVPPill";
import {Divider, Button} from "@mantine/core";
import axios from "axios";
import {REHEARSAL_DINNER_ROLE, RSVP_DEADLINE} from "@/constants/app-constants";

export const RSVPsReview = ({rsvps}: { rsvps: RSVP[] }) => {
    return <div>
        {rsvps.map((rsvp, index) => {
            const rsvpGuest = rsvp.guest;
            const roles = rsvpGuest.roles;
            return (
                <div key={`guest-rsvp-${index}`} className={'flex flex-col gap-4'}>
                    <div className={'flex justify-between'}>
                        <p className={'font-bold text-lg'}>{`${rsvpGuest.firstName} ${rsvpGuest.lastName}`}</p>
                        <div></div>
                    </div>
                    <div className={'px-16 flex flex-col gap-2'}>
                        <div className={'flex justify-between'}>
                            <p className={'font-semibold italic text-md'}>Attending Wedding:</p>
                            <p>{rsvp.isAttending ? 'Yes' : 'No'}</p>
                        </div>
                        {rsvp.isAttending && roles.includes(REHEARSAL_DINNER_ROLE) ?
                            <div className={'flex justify-between'}>
                                <p className={'font-semibold italic text-md'}>Attending Rehearsal Dinner:</p>
                                <p>{rsvp.isAttendingRehearsalDinner ? 'Yes' : 'No'}</p>
                            </div> :
                            <></>
                        }
                        {rsvp.isAttending ?
                            <div className={'flex justify-between flex-wrap'}>
                                <p className={'font-semibold italic text-md'}>Dinner Choice:</p>
                                <p>{rsvp.dinnerChoice}</p>
                            </div> :
                            <></>
                        }
                        {rsvp.isAttending && rsvp.dietaryRestrictions && rsvp.dietaryRestrictions !== '' ?
                            <div className={'flex justify-between flex-wrap'}>
                                <p className={'font-semibold italic text-md'}>Dietary Restrictions:</p>
                                <p>{rsvp.dietaryRestrictions}</p>
                            </div> :
                            <></>
                        }
                        {rsvp.isAttending ?
                            <div className={'flex justify-between flex-wrap'}>
                                <p className={'font-semibold italic text-md'}>Song Requests:</p>
                                <p>{rsvp.songRequests && rsvp.songRequests !== '' ? rsvp.songRequests : '-'}</p>
                            </div> :
                            <></>
                        }
                    </div>
                    {index + 1 !== rsvps.length ? <Divider my={'md'}/> : <></>}
                </div>
            );
        })}
    </div>;
};