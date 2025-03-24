import {ScanCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';
import getDynamoDbClient from "@/app/api/aws-clients/dynamodb-client";
import {BatchWriteItemCommand} from "@aws-sdk/client-dynamodb";
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

async function updatePartyId(guest: Guest, newPartyId: string) {
    const dynamo = await getDynamoDbClient();
    await dynamo.send(new UpdateCommand({
        TableName: GUESTLIST_TABLE_NAME,
        Key: {
            guestId: guest.guestId
        },
        UpdateExpression: "SET #partyId = :partyId",
        ExpressionAttributeNames: {
            "#partyId": "partyId"
        },
        ExpressionAttributeValues: {
            ":partyId": newPartyId
        }
    }));
}

const getPartyIdV2 = async (guest: Guest, guests: Guest[]): Promise<string> => {
    if(isNullOrEmptyString(guest.guestPartyMember)) {
        return '';
    }
    const findPartyMember = () => guests.find(g => {
        if (guest.firstName === 'Katie') {
            console.error(`Party Member: "${g.firstName} ${g.lastName}"`);
        }
        return `${g.firstName} ${g.lastName}` === guest.guestPartyMember;
    });
    const foundPartyMember = findPartyMember();
    if (foundPartyMember && !isNullOrEmptyString(foundPartyMember.partyId)) {
        return foundPartyMember.partyId;
    }
    const newPartyId = uuidv4().toString();
    if (foundPartyMember) {
        await updatePartyId(foundPartyMember, newPartyId);
    }
    return newPartyId;
}


const getPartyId = async (guest: Guest, guests: Guest[]): Promise<string> => {
    console.error('partyId')
    console.error(guest);
    const findPartyMember = () => guests.find(g => `${g.firstName} ${g.lastName}` === guest.guestPartyMember);
    if (!guest) {
        return '';
    }
    if (guest.partyId && guest.partyId !== '') {
        const foundPartyMember = findPartyMember();
        if (foundPartyMember) {
            await updatePartyId(foundPartyMember, guest.partyId);
        }
        console.error('existing partyId')
        return guest.partyId.toString();
    }
    const partyMemberIsDefined = guest.guestPartyMember && guest.guestPartyMember.trim() !== '';
    if (!partyMemberIsDefined) {
        return '';
    }

    const foundPartyMember = findPartyMember();
    if (foundPartyMember && foundPartyMember.partyId && foundPartyMember.partyId !== '') {
        return foundPartyMember.partyId.toString();
    }
    console.error('creating new party')
    // Handles new parties
    const newPartyId = uuidv4().toString();
    await updatePartyId(foundPartyMember, newPartyId);
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

function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

function sortObjectFields(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObject = {};

    for (const key of sortedKeys) {
        sortedObject[key] = obj[key];
    }
    return sortedObject;
}

function shallowCompareObjects(object1, object2) {
    const sorted1 = sortObjectFields(object1);
    const sorted2 = sortObjectFields(object2);
    return JSON.stringify(sorted1) === JSON.stringify(sorted2);
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
            const foundGuest = allGuests.find(g => guest.guestId && guest.guestId !== '' && g.guestId === guest.guestId);
            const {
                firstName,
                lastName,
            } = {
                ...(foundGuest ? foundGuest : {}),
                ...guest
            };
            return isNullOrEmptyString(firstName) || isNullOrEmptyString(lastName);
        });
        if (invalidGuests.length > 0) {
            return NextResponse.json({error: 'You must provide both first and last name for each guest.'});
        }
        const guestListPutRequests = [];
        const guestListPatchRequests = [];
        for (let guest of guests) {
            const {firstName, lastName} = guest;
            const foundGuest = allGuests.find(g => (guest.guestId && g.guestId === guest.guestId) || `${g.firstName} ${g.lastName}` === `${firstName} ${lastName}`);
            const partyIdResolved = await getPartyIdV2(guest, allGuests);
            if (foundGuest) {
                if (shallowCompareObjects(foundGuest, guest)) {
                    console.error(`Skipping guest: ${foundGuest.firstName} ${foundGuest.lastName}`);
                    continue;
                }
                const modifiedGuest: Guest = {
                    ...foundGuest,
                    ...guest,
                    partyId: partyIdResolved,
                };
                guestListPatchRequests.push(new UpdateCommand({
                    TableName: GUESTLIST_TABLE_NAME,
                    Key: {
                        guestId: modifiedGuest.guestId
                    },
                    UpdateExpression: "SET #partyId = :partyId, #firstName = :firstName, #lastName = :lastName, #address = :address, #address2 = :address2, #city = :city, #state = :state, #zipCode = :zipCode, #emailAddress = :emailAddress, #optOutOfEmail = :optOutOfEmail, #phoneNumber = :phoneNumber",
                    ExpressionAttributeNames: {
                        "#partyId": "partyId",
                        '#firstName': 'firstName',
                        '#lastName': 'lastName',
                        '#address': 'address',
                        '#address2': 'address2',
                        '#city': 'city',
                        '#state': 'state',
                        '#zipCode': 'zipCode',
                        '#emailAddress': 'emailAddress',
                        '#optOutOfEmail': 'optOutOfEmail',
                        '#phoneNumber': 'phoneNumber'
                    },
                    ExpressionAttributeValues: {
                        ":partyId": modifiedGuest.partyId,
                        ':firstName': modifiedGuest.firstName,
                        ':lastName': modifiedGuest.lastName,
                        ':address': modifiedGuest.address,
                        ':address2': modifiedGuest.address2,
                        ':city': modifiedGuest.city,
                        ':state': modifiedGuest.state,
                        ':zipCode': modifiedGuest.zipCode,
                        ':emailAddress': modifiedGuest.emailAddress,
                        ':optOutOfEmail': modifiedGuest.optOutOfEmail,
                        ':phoneNumber': modifiedGuest.phoneNumber
                    }
                }));
                console.error(`Updating Guest: ${modifiedGuest.firstName} ${modifiedGuest.lastName}`);
            } else {
                const modifiedGuest = {
                    ...guest,
                    guestId: uuidv4().toString(),
                    partyId: partyIdResolved,
                };
                guestListPutRequests.push({
                    PutRequest: await toGuestListPutRequest(modifiedGuest)
                });
            }
        }
        const chunkSize = 25;
        for (let i = 0; i < guestListPutRequests.length; i += chunkSize) {
            const chunk = guestListPutRequests.slice(i, i + chunkSize);
            await dynamo.send(new BatchWriteItemCommand({
                RequestItems: {
                    [GUESTLIST_TABLE_NAME]: chunk
                }
            }));
            await delay(500);
        }
        for (let i = 0; i < guestListPatchRequests.length; i++) {
            const dynamo = await getDynamoDbClient();
            await dynamo.send(guestListPatchRequests[i]);
        }
        const updatedGuestsResponse = await dynamo.send(new ScanCommand({
            TableName: GUESTLIST_TABLE_NAME,
        }));
        const updatedGuests = updatedGuestsResponse.Items as Guest[];
        console.error(`Total Guests Added: ${guestListPutRequests.length}`);
        console.error(`Total Guests Updated: ${guestListPatchRequests.length}`);
        console.error(`Total Guests: ${updatedGuests.length}`);
        return NextResponse.json({guests: updatedGuests});
    } catch (e) {
        console.error(e);
        return NextResponse.json({statusCode: 500, message: e})
    }
}