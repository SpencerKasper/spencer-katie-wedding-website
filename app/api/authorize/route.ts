import getDynamoDbClient from "@/app/api/dynamodb-client";
import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';

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
        const isAuthorized = body.password === process.env.NEXT_PUBLIC_WEDDING_PASSWORD && foundGuests.length === 1;
        return NextResponse.json({
            isAuthorized,
            ...(isAuthorized ? {guest: foundGuests[0]} : {})
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e});
    }
}