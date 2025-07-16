import getDynamoDbClient from "@/app/api/aws-clients/dynamodb-client";
import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';
import {GUESTLIST_TABLE_NAME} from "@/app/api/constants/dynamo";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: GUESTLIST_TABLE_NAME,
        }));
        const guests = response.Items;
        const body = await request.json();
        const guestId = new URL(request.url).searchParams.get('guestId');
        const foundGuests = guests.filter(guest =>
            guest.firstName.toLowerCase() === body.firstName.toLowerCase() &&
            guest.lastName.toLowerCase() === body.lastName.toLowerCase() &&
            (!guestId || guestId === '' || guest.guestId === guestId)
        );
        if (foundGuests.length > 1) {
            return NextResponse.json({
                isAuthorized: false,
                possibleGuests: foundGuests,
                guestsInParties: guests.filter(g => foundGuests.filter(fg => fg.partyId && fg.partyId === g.partyId && g.guestId !== fg.guestId).length)
            });
        }
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