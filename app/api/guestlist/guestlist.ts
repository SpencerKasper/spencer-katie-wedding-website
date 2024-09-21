export interface GuestListDynamo {
    guestId: {S: string};
    firstName: {S: string};
    lastName: {S: string};
    emailAddress: {S: string};
    phoneNumber: {S: string};
    address: {S: string};
    address2: {S: string};
    city: {S: string};
    state: {S: string};
    zipCode: {S: string};
}

export interface Guest {
    guestId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
}

export const toGuestListItemFromDynamo = (guestListDynamo: GuestListDynamo) => {
    return {
        guestId: guestListDynamo.guestId.S,
        firstName: guestListDynamo.firstName.S,
        lastName: guestListDynamo.lastName.S,
        emailAddress: guestListDynamo.emailAddress.S,
        phoneNumber: guestListDynamo.phoneNumber.S,
        address: guestListDynamo.address.S,
        address2: guestListDynamo.address2.S,
        city: guestListDynamo.city.S,
        state: guestListDynamo.state.S,
        zipCode: guestListDynamo.zipCode.S,
    }
}