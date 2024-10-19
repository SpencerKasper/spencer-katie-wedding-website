import {Guest} from "@/types/guest";

export interface RSVP {
    guest: Guest;
    isAttending: boolean;
    dinnerChoice: string;
    dietaryRestrictions: string;
}