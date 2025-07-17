import {RSVP} from "@/types/rsvp";
import {Pill} from "@mantine/core";

export const RSVPPill = ({
                             isAttending,
                             attendingText = 'Attending',
                             notAttendingText = 'Not Attending'
                         }: { isAttending: boolean, attendingText?: string, notAttendingText?: string }) => isAttending ?
    <Pill size={'lg'} styles={{
        root: {
            backgroundColor: 'green',
            color: 'white'
        }
    }}>{attendingText}</Pill> :
    <Pill size={'lg'}
          styles={{root: {backgroundColor: 'red', color: 'white'}}}>{notAttendingText}</Pill>;