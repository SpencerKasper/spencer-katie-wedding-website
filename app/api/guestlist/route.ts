import {ScanCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {NextRequest, NextResponse} from 'next/server';
import getDynamoDbClient from "@/app/api/aws-clients/dynamodb-client";
import {PutItemCommand} from "@aws-sdk/client-dynamodb";
import {Guest} from "@/types/guest";
import {v4 as uuidv4} from 'uuid';
import {booleanIsUndefined} from "@/app/util/general-util";

export const dynamic = 'force-dynamic';

const WEDDING_GUEST_LIST_TABLE = 'wedding_guest_list';

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const search = new URLSearchParams(url.search);
        const partyId = search.get('partyId');
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: WEDDING_GUEST_LIST_TABLE,
        }));
        const guests = partyId && partyId !== '' ?
            response.Items.filter(guest => guest.partyId === partyId) :
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

export async function POST(request) {
    try {
        const guest = await request.json() as Guest;
        const {
            firstName,
            lastName,
            phoneNumber,
            emailAddress,
            address,
            address2,
            city,
            state,
            zipCode,
            guestPartyMember,
            tableNumber,
            optOutOfEmail
        } = guest;
        if (isNullOrEmptyString(firstName) || isNullOrEmptyString(lastName)) {
            return NextResponse.json({error: 'You must provide both first and last name.'});
        }
        const getPartyId = async () => {
            const partyMemberIsDefined = guestPartyMember && guestPartyMember.trim() !== '';
            if (!partyMemberIsDefined) {
                return '';
            }
            const foundPartyMember = guests.find(g => `${g.firstName} ${g.lastName}` === guestPartyMember);
            if (foundPartyMember && foundPartyMember.partyId && foundPartyMember.partyId !== '') {
                return foundPartyMember.partyId;
            }

            // Handles new parties
            const newPartyId = uuidv4();
            await dynamo.send(new UpdateCommand({
                TableName: WEDDING_GUEST_LIST_TABLE,
                Key: {
                    guestId: foundPartyMember.guestId
                },
                UpdateExpression: "SET #partyId = :partyId",
                ExpressionAttributeNames: {
                    "#partyId": "partyId"
                },
                ExpressionAttributeValues: {
                    ":partyId": newPartyId
                }
            }));
            return newPartyId;
        }
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: WEDDING_GUEST_LIST_TABLE,
        }));
        const guests = response.Items as Guest[];
        const foundGuest = guests.find(g => `${g.firstName} ${g.lastName}` === `${firstName} ${lastName}`);
        if (foundGuest) {
            await dynamo.send(new UpdateCommand({
                TableName: WEDDING_GUEST_LIST_TABLE,
                Key: {
                    guestId: foundGuest.guestId
                },
                UpdateExpression: "SET #address = :address, #address2 = :address2, #city = :city, #state = :state, #zipCode = :zipCode, #emailAddress = :emailAddress, #optOutOfEmail = :optOutOfEmail, #partyId = :partyId, #phoneNumber = :phoneNumber, #tableNumber = :tableNumber",
                ExpressionAttributeNames: {
                    "#address": "address",
                    "#address2": "address2",
                    "#city": "city",
                    "#state": "state",
                    "#zipCode": "zipCode",
                    "#emailAddress": "emailAddress",
                    "#optOutOfEmail": "optOutOfEmail",
                    "#phoneNumber": "phoneNumber",
                    "#partyId": "partyId",
                    "#tableNumber": "tableNumber",
                },
                ExpressionAttributeValues: {
                    ":address": guest && guest.address ? guest.address : '',
                    ":address2": guest && guest.address2 ? guest.address2 : '',
                    ":city": guest && guest.city ? guest.city : '',
                    ":state": guest && guest.state ? guest.state : '',
                    ":zipCode": guest && guest.zipCode ? guest.zipCode : '',
                    ":emailAddress": guest && guest.emailAddress ? guest.emailAddress : '',
                    ":optOutOfEmail": guest && !booleanIsUndefined(guest.optOutOfEmail) ? guest.optOutOfEmail : false,
                    ":phoneNumber": guest && guest.phoneNumber ? guest.phoneNumber : '',
                    ":partyId": guest ? await getPartyId() : '',
                    ":tableNumber": guest && guest.tableNumber ? guest.tableNumber : '',
                }
            }));
        } else {
            await dynamo.send(new PutItemCommand({
                TableName: WEDDING_GUEST_LIST_TABLE,
                Item: {
                    guestId: {S: uuidv4()},
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
                    partyId: {S: await getPartyId()},
                    tableNumber: {N: tableNumber ? tableNumber.toString() : '-1'}
                }
            }));
        }

        const updatedGuestsResponse = await dynamo.send(new ScanCommand({
            TableName: WEDDING_GUEST_LIST_TABLE,
        }));
        const updatedGuests = updatedGuestsResponse.Items as Guest[];
        return NextResponse.json({guests: updatedGuests});
    } catch (e) {
        console.error(e);
        return NextResponse.json({statusCode: 500, message: e})
    }
}

export const PATCH = async (request) => {
    try {
        const body = await request.json() as Partial<Guest>;
        if(!body.guestId) {
            return NextResponse.json({statusCode: 400, message: 'The "guestId" you wish to update is required.'});
        }
        if(!body.emailAddress && booleanIsUndefined(body.optOutOfEmail)) {
            return NextResponse.json({statusCode: 400, message: 'At least one field to update is required of the following: emailAddress, optOutOfEmail.'})
        }
        const dynamo = await getDynamoDbClient();
        await dynamo.send(new UpdateCommand({
            TableName: WEDDING_GUEST_LIST_TABLE,
            Key: {
                guestId: body.guestId
            },
            UpdateExpression: `set #emailAddress = :emailAddress, #optOutOfEmail = :optOutOfEmail`,
            ExpressionAttributeNames: {
                "#emailAddress": "emailAddress",
                "#optOutOfEmail": "optOutOfEmail",
            },
            ExpressionAttributeValues: {
                ":emailAddress": body.emailAddress,
                ":optOutOfEmail": body.optOutOfEmail,
            }
        }));
        const response = await dynamo.send(new ScanCommand({
            TableName: WEDDING_GUEST_LIST_TABLE,
        }));
        const guests = response.Items;
        return NextResponse.json({guests, statusCode: 200});
    } catch (e) {
        console.error(e);
        return NextResponse.json({statusCode: 500, message: e});
    }
}