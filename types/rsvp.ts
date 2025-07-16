import {Guest} from "@/types/guest";

export interface PlusOne {
    guestId: string;
    firstName: string;
    lastName: string;
    dinnerChoice: string;
    dietaryRestrictions?: string;
}

export interface RSVP {
    guest: Guest;
    isAttending: boolean;
    isAttendingRehearsalDinner?: boolean;
    dinnerChoice: string;
    dietaryRestrictions: string;
    songRequests: string;
    plusOne?: PlusOne;
}