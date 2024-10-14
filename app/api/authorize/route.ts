import getDynamoDbClient from "@/app/api/dynamodb-client";

export const dynamic = 'force-dynamic';

import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {assumeRole} from "@/app/api/assume-role";
import {decrypt, encrypt} from "@/utils/encryption";

export async function POST(request) {
    try {
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: 'wedding_guest_list',
        }));
        const guests = response.Items;
        const body = await request.json();
        const foundGuests = guests.filter(guest =>
            guest.firstName.toLowerCase() === body.firstName.toLowerCase() &&
            guest.lastName.toLowerCase() === body.lastName.toLowerCase()
        );
        return NextResponse.json({isAuthorized: body.password === process.env.WEDDING_PASSWORD && foundGuests.length === 1});
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e});
    }
}