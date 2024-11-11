export interface Guest {
    guestId: string;
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    emailAddress: string;
    partyId?: string;
    // This doesn't save to dynamoDb
    guestPartyMember?: string;
    phoneNumber: string;
}