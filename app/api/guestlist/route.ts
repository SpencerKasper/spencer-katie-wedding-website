import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';
import getDynamoDbClient from "@/app/api/dynamodb-client";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const search = new URLSearchParams(url.search);
        const partyId = search.get('partyId');
        console.error(partyId);
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: 'wedding_guest_list',
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