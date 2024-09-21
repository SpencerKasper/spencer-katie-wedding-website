import {AssumeRoleCommand, AssumeRoleResponse, STSClient} from "@aws-sdk/client-sts";

export const dynamic = 'force-dynamic';

import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from 'next/server';
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

export async function GET() {
    try {
        let dynamo;
        if(process.env.WEDDING_ENV !== 'local') {
            console.error('Using sts for permissions.')
            const sts = new STSClient();
            const stsResponse: AssumeRoleResponse = await sts.send(new AssumeRoleCommand({
                RoleArn: 'arn:aws:iam::771384749710:role/service-role/AmplifySSRLoggingRole-4e772789-d4bd-41d0-b846-607e2782af30',
                RoleSessionName: `spencer-katie-wedding-${Date.now()}`
            }));
            const credentials = stsResponse ? stsResponse['Credentials'] : null;
            const accessKey = credentials ? credentials['AccessKeyId'] : '';
            const secretAccessKey = credentials ? credentials['SecretAccessKey'] : '';
            const sessionToken = credentials ? credentials['SessionToken'] : '';
            dynamo = new DynamoDBClient({
                credentials: {
                    accessKeyId: accessKey,
                    secretAccessKey,
                    ...(process.env.WEDDING_ENV !== 'local' ? {sessionToken} : {}),
                }
            });
        } else {
            console.error('Using credentials for permission.')
            dynamo = new DynamoDBClient({
                credentials: {
                    accessKeyId: process.env.WEDDING_AWS_ACCESS_KEY_ID || '',
                    secretAccessKey: process.env.WEDDING_AWS_SECRET_ACCESS_KEY || ''
                }
            });
        }
        const response = await dynamo.send(new ScanCommand({
            TableName: 'wedding_guest_list',
        }));
        return NextResponse.json({guests: response.Items});
    } catch (e) {
        return NextResponse.json({error: e});
    }
}