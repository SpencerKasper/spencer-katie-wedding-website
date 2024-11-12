import {createEmailTemplate, updateEmailTemplate} from "@/app/api/aws-clients/send-email";

const emailTemplate = {
    name: 'wedding-rsvp-response-template',
    subject: 'You have successfully sent your RSVP to Katie and Spencer\'s wedding!',
    html: `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    .body {
                        padding:8px;
                        background-size: 516px;
                        background-image: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(https://spencer-katie-wedding-website.s3.amazonaws.com/engagement-photos/compressed/spencer-katie-engagement-10.jpg);
                        color: white;
                        width: 509px;
                        height: 754px;
                        font-size: 14px;
                    }
                    .guest-name {
                        font-size: 14px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body class="body">
                <div>
                    <p>Hi {{greetingName}},</p>
                    <p>Thanks for sending in your RSVP for Katie and Spencer's wedding!  We have received it.  Here are the responses we got:</p>
                    {{#each rsvps}}
                        <div>
                            <p class="guest-name">{{name}}</p>
                            <ul>
                                <li>Will you be attending?: {{isAttending}}</li>
                                <li>What will you have for dinner?: {{dinnerChoice}}</li>
                                <li>Any dietary restrictions?: {{dietaryRestrictions}}</li>
                            </ul>
                        </div>
                    {{/each}}
                    <p>Thanks,</p>
                    <p>Katie & Spencer</p>
                </div>
            </body>
        </html>
    `};

export const createRsvpResponseEmailTemplate = async () => {
    await createEmailTemplate(emailTemplate);
}

export const updateRsvpResponseEmailTemplate = async () => {
    await updateEmailTemplate(emailTemplate);
}