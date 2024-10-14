import {AssumeRoleCommand, STSClient} from "@aws-sdk/client-sts";

const DEFAULT_REGION = "us-east-1";
const DEFAULT_ROLE = 'arn:aws:iam::771384749710:role/lightsail-wedding-website-role';

export const assumeRole = async ({roleArn, region} = {roleArn: DEFAULT_ROLE, region: DEFAULT_REGION}) => {
    const client = new STSClient({ region });
    try {
        const command = new AssumeRoleCommand({
            RoleArn: roleArn,
            RoleSessionName: "lightsailWeddingWebsiteSession",
            DurationSeconds: 900,
        });
        return client.send(command);
    } catch (err) {
        console.error(err);
    }
}