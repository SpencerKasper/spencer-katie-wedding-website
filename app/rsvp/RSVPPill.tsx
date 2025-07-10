import {RSVP} from "@/types/rsvp";
import {Pill} from "@mantine/core";

export const RSVPPill = ({
                             rsvp,
                             attendingText = 'Attending',
                             notAttendingText = 'Not Attending'
                         }: { rsvp: RSVP, attendingText?: string, notAttendingText?: string }) => rsvp.isAttending ?
    <Pill size={'lg'} styles={{
        root: {
            backgroundColor: 'green',
            color: 'white'
        }
    }}>{attendingText}</Pill> :
    <Pill size={'lg'}
          styles={{root: {backgroundColor: 'red', color: 'white'}}}>{notAttendingText}</Pill>;