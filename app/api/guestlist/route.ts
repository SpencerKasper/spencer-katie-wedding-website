import {ScanCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {NextRequest, NextResponse} from 'next/server';
import getDynamoDbClient from "@/app/api/dynamodb-client";
import {PutItemCommand} from "@aws-sdk/client-dynamodb";
import {Guest} from "@/types/guest";
import { v4 as uuidv4 } from 'uuid';
import {found} from "@jridgewell/trace-mapping/dist/types/binary-search";

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
        const {firstName, lastName, phoneNumber, emailAddress, address, address2, city, state, zipCode, guestPartyMember} = guest;
        if(isNullOrEmptyString(firstName) || isNullOrEmptyString(lastName)) {
            return NextResponse.json({error: 'You must provide both first and last name.'});
        }
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: WEDDING_GUEST_LIST_TABLE,
        }));
        const guests = response.Items as Guest[];

        const getPartyId = async () => {
            const partyMemberIsDefined = guestPartyMember && guestPartyMember.trim() !== '';
            if(!partyMemberIsDefined) {
                return '';
            }
            const foundPartyMember = guests.find(g => `${g.firstName} ${g.lastName}` === guestPartyMember);
            console.error(foundPartyMember);
            if(foundPartyMember && foundPartyMember.partyId && foundPartyMember.partyId !== '') {
                return foundPartyMember.partyId;
            }
            const newPartyId = uuidv4();
            console.error(foundPartyMember.guestId)
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

        await dynamo.send(new PutItemCommand({
            TableName: WEDDING_GUEST_LIST_TABLE,
            Item: {
                guestId: {S: uuidv4()},
                firstName: {S: firstName},
                lastName: {S: lastName},
                phoneNumber: {S: phoneNumber ? phoneNumber.toString() : ''},
                emailAddress: {S: emailAddress ? emailAddress : ''},
                address: {S: address ? address : ''},
                address2: {S: address2 ? address2 : ''},
                city: {S: city ? city : ''},
                state: {S: state ? state : ''},
                zipCode: {S: zipCode ? zipCode : ''},
                partyId: {S: await getPartyId()}
            }
        }));
        const updatedGuestsResponse = await dynamo.send(new ScanCommand({
            TableName: WEDDING_GUEST_LIST_TABLE,
        }));
        const updatedGuests = updatedGuestsResponse.Items as Guest[];
        return NextResponse.json({guests: updatedGuests});
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e})
    }
}