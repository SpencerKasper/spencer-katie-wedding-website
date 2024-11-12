import {assumeRole} from "@/app/api/aws-clients/assume-role";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

export default async function getDynamoDbClient() {
    if (process.env.NEXT_PUBLIC_WEDDING_ENV !== 'local') {
        const stsResponse = await assumeRole();
        console.error('assumed');
        const credentials = stsResponse ? stsResponse['Credentials'] : null;
        const accessKey = credentials ? credentials['AccessKeyId'] : '';
        const secretAccessKey = credentials ? credentials['SecretAccessKey'] : '';
        const sessionToken = credentials ? credentials['SessionToken'] : '';

        return new DynamoDBClient({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey,
                sessionToken,
            }
        });
    }
    return new DynamoDBClient({
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_WEDDING_AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.NEXT_PUBLIC_WEDDING_AWS_SECRET_ACCESS_KEY || ''
        }
    });
}
