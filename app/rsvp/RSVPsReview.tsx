import {RSVP} from "@/types/rsvp";
import {Divider} from "@mantine/core";
import {REHEARSAL_DINNER_ROLE} from "@/constants/app-constants";
import {guestHasPlusOne} from "@/app/rsvp/RSVPClient";

const labelClasses = 'font-semibold italic text-md';
export const RSVPsReview = ({rsvps}: { rsvps: RSVP[] }) => {
    const firstRsvp = rsvps.length ? rsvps[0] : null;
    return <div>
        {rsvps.map((rsvp, index) => {
            const rsvpGuest = rsvp.guest;
            const roles = rsvpGuest.roles;
            const hasPlusOne = guestHasPlusOne(rsvp.guest);
            return (
                <div key={`guest-rsvp-${index}`} className={'flex flex-col gap-4'}>
                    <div className={'flex justify-between'}>
                        <p className={'font-bold text-lg'}>{`${rsvpGuest.firstName} ${rsvpGuest.lastName}`}</p>
                        <div></div>
                    </div>
                    <div className={'px-16 flex flex-col gap-2'}>
                        <div className={'flex justify-between'}>
                            <p className={labelClasses}>Attending Wedding:</p>
                            <p>{rsvp.isAttending ? 'Yes' : 'No'}</p>
                        </div>
                        {rsvp.isAttending && roles && roles.includes(REHEARSAL_DINNER_ROLE) ?
                            <div className={'flex justify-between'}>
                                <p className={labelClasses}>Attending Rehearsal Dinner:</p>
                                <p>{rsvp.isAttendingRehearsalDinner ? 'Yes' : 'No'}</p>
                            </div> :
                            <></>
                        }
                        {rsvp.isAttending ?
                            <div className={'flex justify-between flex-wrap'}>
                                <p className={labelClasses}>Dinner Choice:</p>
                                <p>{rsvp.dinnerChoice}</p>
                            </div> :
                            <></>
                        }
                        {rsvp.isAttending && rsvp.dietaryRestrictions && rsvp.dietaryRestrictions !== '' ?
                            <div className={'flex justify-between flex-wrap'}>
                                <p className={labelClasses}>Dietary Restrictions:</p>
                                <p>{rsvp.dietaryRestrictions}</p>
                            </div> :
                            <></>
                        }
                        {hasPlusOne && rsvp.plusOne && rsvp.plusOne.firstName !== '' ?
                            <div className={'flex justify-between'}>
                                <p className={labelClasses}>Plus One Name:</p>
                                <p>{rsvp.plusOne.firstName} {rsvp.plusOne.lastName}</p>
                            </div> :
                            <></>
                        }
                        {hasPlusOne && rsvp.plusOne && rsvp.plusOne.firstName !== '' ?
                            <div className={'flex justify-between'}>
                                <p className={labelClasses}>Plus One Dinner Choice:</p>
                                <p>{rsvp.plusOne.dinnerChoice}</p>
                            </div> :
                            <></>
                        }
                        {hasPlusOne && rsvp.plusOne && rsvp.plusOne.dietaryRestrictions !== '' ?
                            <div className={'flex justify-between'}>
                                <p className={labelClasses}>Plus One Dietary Restrictions:</p>
                                <p>{rsvp.plusOne.dietaryRestrictions}</p>
                            </div> :
                            <></>
                        }
                    </div>
                    {index + 1 !== rsvps.length ? <Divider my={'md'}/> : <></>}
                </div>
            );
        })}
        {firstRsvp && firstRsvp.songRequests ?
            <div className={'pt-16 px-8'}>
                {firstRsvp.isAttending && firstRsvp.songRequests && firstRsvp.songRequests !== '' ?
                    <div className={'flex justify-between flex-wrap'}>
                        <p className={labelClasses}>Song Requests:</p>
                        <p>{firstRsvp.songRequests && firstRsvp.songRequests !== '' ? firstRsvp.songRequests : '-'}</p>
                    </div> :
                    <></>
                }
            </div> :
            <></>
        }
    </div>;
};