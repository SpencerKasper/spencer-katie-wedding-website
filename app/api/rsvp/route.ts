import getDynamoDbClient from "@/app/api/aws-clients/dynamodb-client";
import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';
import {DeleteItemCommand, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {RSVP} from "@/types/rsvp";
import {Guest} from "@/types/guest";
import {getSearchParams} from "@/app/api/helpers/param-util";
import {GUESTLIST_TABLE_NAME, RSVPS_TABLE_NAME} from "@/app/api/constants/dynamo";
import {sendEmail} from "@/app/api/aws-clients/send-email";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: RSVPS_TABLE_NAME,
        }));
        const search = getSearchParams(request);
        const guestIds = search.get('guestIds');
        const partyId = search.get('partyId');
        const dynamoRsvps = response.Items as RSVP[];
        const guestIdStrings = guestIds && guestIds !== '' ? guestIds.split(',').map(x => x.trim()) : [];
        let rsvps;
        if (partyId && partyId !== '') {
            rsvps = dynamoRsvps.filter(rsvp => rsvp.guest.partyId && rsvp.guest.partyId === partyId);
        } else if (guestIdStrings.length > 0) {
            rsvps = dynamoRsvps.filter(rsvp => guestIdStrings.includes(rsvp.guest.guestId));
        } else {
            rsvps = dynamoRsvps;
        }

        return NextResponse.json({
            rsvps,
            statusCode: 200
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e});
    }

}

export async function POST(request) {
    try {
        const dynamo = await getDynamoDbClient();
        const guestListResponse = await dynamo.send(new ScanCommand({
            TableName: GUESTLIST_TABLE_NAME,
        }));
        const guests = guestListResponse.Items as Guest[];
        const body = await request.json();
        const rsvps = body.rsvps as RSVP[];

        // Check that the RSVPs are for people who were invited
        const foundGuests = guests.filter(guest => {
            const rsvpsFound = rsvps.filter(rsvp => rsvp.guest.guestId === guest.guestId);
            return rsvpsFound.length === 1;
        });
        if (foundGuests.length !== rsvps.length) {
            return NextResponse.json({
                statusCode: 400,
                message: 'Not all guests in RSVP were found on the guestlist.'
            });
        }
        for (let rsvp of rsvps) {
            const rsvpGuest = rsvp.guest;
            const response = await dynamo.send(new PutItemCommand({
                TableName: RSVPS_TABLE_NAME,
                Item: {
                    guestId: {S: rsvpGuest.guestId},
                    guest: {
                        M: {
                            guestId: {S: rsvpGuest.guestId},
                            firstName: {S: rsvpGuest.firstName},
                            lastName: {S: rsvpGuest.lastName},
                            address: {S: rsvpGuest.address},
                            address2: {S: rsvpGuest.address2},
                            city: {S: rsvpGuest.city},
                            zipCode: {S: rsvpGuest.zipCode},
                            state: {S: rsvpGuest.state},
                            emailAddress: {S: rsvpGuest.emailAddress},
                            phoneNumber: {S: rsvpGuest.phoneNumber},
                            ...(rsvpGuest.partyId && rsvpGuest.partyId !== '' ? {partyId: {S: rsvpGuest.partyId}} : {}),
                        }
                    },
                    isAttending: {BOOL: Boolean(rsvp.isAttending)},
                    dinnerChoice: {S: rsvp.dinnerChoice ? rsvp.dinnerChoice : ''},
                    dietaryRestrictions: {S: rsvp.dietaryRestrictions ? rsvp.dietaryRestrictions : ''}
                }
            }));
            console.error(response);
        }
        await sendEmail({
            subject: `You have successfully sent your RSVP to Katie and Spencer's wedding!`,
            text: `Thanks for RSVPing to Katie and Spencer's wedding.  Your options will be listed below eventually.`,
            toAddresses: ['spencer.kasper@gmail.com'],
        });
        return NextResponse.json({
            rsvps,
            statusCode: 200
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e});
    }
}

export async function DELETE(request) {
    try {
        const searchParams = getSearchParams(request);
        const dynamo = await getDynamoDbClient();
        const partyId = searchParams.get('partyId');
        const guestIdsSearch = searchParams.get('guestIds');
        let guestIds = [];
        if (partyId && partyId !== '') {
            const response = await dynamo.send(new ScanCommand({TableName: RSVPS_TABLE_NAME}));
            const party = response.Items.filter(f => f.guest.partyId === partyId);
            guestIds.push(party.map(f => f.guest.guestId));
        } else if (guestIdsSearch && guestIdsSearch !== '') {
            guestIds = [...guestIds, ...guestIdsSearch.split(',')];
        }
        for (let guestId of guestIds) {
            const deleteItemCommand = new DeleteItemCommand({
                TableName: RSVPS_TABLE_NAME,
                Key: {
                    guestId: {
                        S: guestId
                    }
                }
            });
            await dynamo.send(deleteItemCommand);
        }
        return NextResponse.json({statusCode: 200, deletedRSVPGuestIds: guestIds});

    } catch (e) {
        return NextResponse.json({error: e})
    }
}