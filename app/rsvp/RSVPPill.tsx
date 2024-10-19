import {RSVP} from "@/types/rsvp";
import {Pill} from "@mantine/core";

export const RSVPPill = ({rsvp}: { rsvp: RSVP }) => rsvp.isAttending ?
    <Pill size={'lg'} styles={{
        root: {
            backgroundColor: 'green',
            color: 'white'
        }
    }}>Attending</Pill> :
    <Pill size={'lg'}
          styles={{root: {backgroundColor: 'red', color: 'white'}}}>Not
        Attending</Pill>;