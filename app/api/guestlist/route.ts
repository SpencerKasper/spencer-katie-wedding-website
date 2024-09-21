export const dynamic = 'force-dynamic';

import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

export async function GET() {
    const dynamo = new DynamoDBClient({
        credentials: {
            accessKeyId: process.env.WEDDING_AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.WEDDING_AWS_SECRET_ACCESS_KEY || ''
        }
    });
    const response = await dynamo.send(new ScanCommand({
        TableName: 'wedding_guest_list',
    }));
    return NextResponse.json({guests: response.Items});
}