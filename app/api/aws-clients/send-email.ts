import {SendEmailCommand, SendTemplatedEmailCommand, SESClient} from '@aws-sdk/client-ses';

const getSESClient = () => new SESClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_WEDDING_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.NEXT_PUBLIC_WEDDING_AWS_SECRET_ACCESS_KEY || ''
    }
});

const getCommonInputs = () => {
    return {
        Source: "info@keepingupwiththekaspers.com",
        ReplyToAddresses: [
            "skkasper7@gmail.com",
        ],
    }
}

export const sendEmail = async ({subject, text, toAddresses}) => {
    const sesClient = getSESClient();
    const input = {
        ...getCommonInputs(),
        Destination: {
            ToAddresses: toAddresses
        },
        Message: {
            Subject: {
                Data: subject,
            },
            Body: {
                Text: {
                    Data: text,
                },
            },
        },
    };
    const command = new SendEmailCommand(input);
    return sesClient.send(command);
};

export const sendTemplateEmail = async ({template, templateData, toAddresses}) => {
    const sesClient = getSESClient();
    const input = {
        ...getCommonInputs(),
        Destination: {
            ToAddresses: toAddresses
        },
        Template: template,
        TemplateData: templateData,
    };
    const command = new SendTemplatedEmailCommand(input);
    return sesClient.send(command);
};