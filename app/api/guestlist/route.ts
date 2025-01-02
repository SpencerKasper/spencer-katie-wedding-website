import {ScanCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {NextRequest, NextResponse} from 'next/server';
import getDynamoDbClient from "@/app/api/aws-clients/dynamodb-client";
import {BatchWriteItemCommand, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {Guest} from "@/types/guest";
import {v4 as uuidv4} from 'uuid';
import {booleanIsUndefined} from "@/app/util/general-util";
import {GUESTLIST_TABLE_NAME} from "@/app/api/constants/dynamo";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const search = new URLSearchParams(url.search);
        const guestId = search.get('guestId');
        const partyId = search.get('partyId');
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: GUESTLIST_TABLE_NAME,
        }));
        const guests = (guestId && guestId !== '') || (partyId && partyId !== '') ?
            response.Items.filter(guest =>
                (guestId && guestId !== '' && guest.guestId === guestId) ||
                (partyId && partyId !== '' && guest.partyId === partyId)
            ) :
            response.Items;
        return NextResponse.json({guests});
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e});
    }
}

const isNullOrEmptyString = (value) => {
    return !value || value === '';
}

const getPartyId = async (guest: Guest, guests: Guest[]): Promise<string> => {
    if (!guest) {
        return '';
    }
    if (guest.partyId && guest.partyId !== '') {
        return guest.partyId.toString();
    }
    const partyMemberIsDefined = guest.guestPartyMember && guest.guestPartyMember.trim() !== '';
    if (!partyMemberIsDefined) {
        return '';
    }
    const foundPartyMember = guests.find(g => `${g.firstName} ${g.lastName}` === guest.guestPartyMember);
    if (foundPartyMember && foundPartyMember.partyId && foundPartyMember.partyId !== '') {
        return foundPartyMember.partyId.toString();
    }

    // Handles new parties
    const newPartyId = uuidv4().toString();
    const dynamo = await getDynamoDbClient();
    // await dynamo.send(new UpdateCommand({
    //     TableName: GUESTLIST_TABLE_NAME,
    //     Key: {
    //         guestId: foundPartyMember.guestId
    //     },
    //     UpdateExpression: "SET #partyId = :partyId",
    //     ExpressionAttributeNames: {
    //         "#partyId": "partyId"
    //     },
    //     ExpressionAttributeValues: {
    //         ":partyId": newPartyId
    //     }
    // }));
    return newPartyId;
}

async function toGuestListPutRequest(guest: Partial<Guest>) {
    const {
        guestId,
        firstName,
        lastName,
        phoneNumber,
        emailAddress,
        address,
        address2,
        city,
        state,
        zipCode,
        optOutOfEmail,
        partyId
    } = guest;
    return {
        Item: {
            guestId: {S: guestId},
            firstName: {S: firstName},
            lastName: {S: lastName},
            phoneNumber: {S: phoneNumber ? phoneNumber.toString() : ''},
            emailAddress: {S: emailAddress ? emailAddress : ''},
            optOutOfEmail: {BOOL: booleanIsUndefined(optOutOfEmail) ? false : optOutOfEmail},
            address: {S: address ? address : ''},
            address2: {S: address2 ? address2 : ''},
            city: {S: city ? city : ''},
            state: {S: state ? state : ''},
            zipCode: {S: zipCode ? zipCode : ''},
            partyId: {S: partyId ? partyId : ''},
        }
    };
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export async function POST(request) {
    try {
        const {guests} = await request.json() as { guests: Guest[] };
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: GUESTLIST_TABLE_NAME,
        }));
        const allGuests = response.Items as Guest[];
        const invalidGuests = guests.filter(guest => {
            const {
                firstName,
                lastName,
            } = guest;
            return isNullOrEmptyString(firstName) || isNullOrEmptyString(lastName);
        });
        if (invalidGuests.length > 0) {
            return NextResponse.json({error: 'You must provide both first and last name for each guest.'});
        }
        const guestListPutRequests = [];
        for (let guest of guests) {
            const {firstName, lastName} = guest;
            const foundGuest = allGuests.find(g => `${g.firstName} ${g.lastName}` === `${firstName} ${lastName}`);
            // console.error(foundGuest);
            const partyIdResolved = await getPartyId(guest, guests);
            const modifiedGuest = {
                ...(foundGuest ? foundGuest : {}),
                ...guest,
                guestId: foundGuest && foundGuest.guestId && foundGuest.guestId !== '' ? foundGuest.guestId : uuidv4().toString(),
                partyId: partyIdResolved,
            };
            console.error(modifiedGuest);
            guestListPutRequests.push({
                PutRequest: await toGuestListPutRequest(modifiedGuest)
            });
        }
        const chunkSize = 25;
        for (let i = 0; i < guestListPutRequests.length; i += chunkSize) {
            const chunk = guestListPutRequests.slice(i, i + chunkSize);
            // console.error(chunk);
            // console.error('----------------------')
            // await dynamo.send(new BatchWriteItemCommand({
            //     RequestItems: {
            //         [GUESTLIST_TABLE_NAME]: chunk
            //     }
            // }));
            await delay(500);
        }
        const updatedGuestsResponse = await dynamo.send(new ScanCommand({
            TableName: GUESTLIST_TABLE_NAME,
        }));
        const updatedGuests = updatedGuestsResponse.Items as Guest[];
        return NextResponse.json({guests: updatedGuests});
    } catch (e) {
        console.error(e);
        return NextResponse.json({statusCode: 500, message: e})
    }
}