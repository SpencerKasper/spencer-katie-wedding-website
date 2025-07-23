import {QueryCommand, ScanCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';
import getDynamoDbClient from "@/app/api/aws-clients/dynamodb-client";
import {BatchWriteItemCommand} from "@aws-sdk/client-dynamodb";
import {Guest} from "@/types/guest";
import {v4 as uuidv4} from 'uuid';
import {booleanIsUndefined} from "@/app/util/general-util";
import {GUESTLIST_TABLE_NAME} from "@/app/api/constants/dynamo";

export const dynamic = 'force-dynamic';

async function updateEmailAddress(guest: Guest, emailAddress: string) {
    const dynamo = await getDynamoDbClient();
    await dynamo.send(new UpdateCommand({
        TableName: GUESTLIST_TABLE_NAME,
        Key: {
            guestId: guest.guestId
        },
        UpdateExpression: "SET #emailAddress = :emailAddress",
        ExpressionAttributeNames: {
            "#emailAddress": "emailAddress"
        },
        ExpressionAttributeValues: {
            ":emailAddress": emailAddress
        }
    }));
}

export async function POST(request) {
    try {
        const {guestId, emailAddress} = await request.json() as { guestId: string; emailAddress: string; };
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new QueryCommand({
            TableName: GUESTLIST_TABLE_NAME,
            KeyConditionExpression: "guestId = :guestId",
            ExpressionAttributeValues: {
                ":guestId": guestId
            },
        }));
        const foundGuests = response.Items as Guest[];
        if (foundGuests.length !== 1) {
            return NextResponse.json({error: `Guest was not found for guestId = "${guestId}".`});
        }
        const guest = foundGuests[0];
        console.error(`Changing emailAddress for ${guest.firstName} ${guest.lastName} (${guest.guestId})...`)
        await updateEmailAddress(guest, emailAddress);
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