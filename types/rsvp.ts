import {Guest} from "@/types/guest";

export interface RSVP {
    guest: Guest;
    isAttending: boolean;
    isAttendingRehearsalDinner?: boolean;
    dinnerChoice: string;
    dietaryRestrictions: string;
    songRequests: string;
}