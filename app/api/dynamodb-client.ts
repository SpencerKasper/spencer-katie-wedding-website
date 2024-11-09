import {assumeRole} from "@/app/api/assume-role";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

export default async function getDynamoDbClient() {
    if (process.env.NEXT_PUBLIC_WEDDING_ENV !== 'local') {
        const stsResponse = await assumeRole();
        const credentials = stsResponse ? stsResponse['Credentials'] : null;
        const accessKey = credentials ? credentials['AccessKeyId'] : '';
        const secretAccessKey = credentials ? credentials['SecretAccessKey'] : '';
        const sessionToken = credentials ? credentials['SessionToken'] : '';
        return new DynamoDBClient({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey,
                ...(process.env.NEXT_PUBLIC_WEDDING_ENV !== 'local' ? {sessionToken} : {}),
            }
        });
    }
    return new DynamoDBClient();
}
