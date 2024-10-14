import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';
import getDynamoDbClient from "@/app/api/dynamodb-client";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: 'wedding_guest_list',
        }));
        return NextResponse.json({guests: response.Items});
    } catch (e) {
        return NextResponse.json({error: e});
    }
}