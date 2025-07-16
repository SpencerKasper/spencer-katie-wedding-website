import {createEmailTemplate, updateEmailTemplate} from "@/app/api/aws-clients/send-email";

const emailTemplate = {
    name: 'wedding-rsvp-alert-template',
    subject: 'Someone has RSVP\'d to your wedding!',
    html: `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /*body {*/
                    /*    background-image: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(https://spencer-katie-wedding-website.s3.amazonaws.com/engagement-photos/compressed/spencer-katie-engagement-10.jpg);*/
                    /*}*/
                    .guest-name {
                        font-size: 14px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div>
                    <p>Hi Katie and Spencer,</p>
                    <p>The following RSVPs have been received for your wedding:</p>
                    {{#each rsvps}}
                        <div>
                            <p class="guest-name">{{name}}</p>
                            <ul>
                                <li>Will you be attending?: {{isAttending}}</li>
                                <li>What will you have for dinner?: {{dinnerChoice}}</li>
                                <li>Any dietary restrictions?: {{dietaryRestrictions}}</li>
                                {{#if plusOne}}
                                    <li>Plus One Name: {{plusOne.firstName}} {{plusOne.lastName}}</li>
                                    <li>Plus One Dinner Choice: {{plusOne.dinnerChoice}}</li>
                                    <li>Plus One Dietary Restrictions: {{plusOne.dietaryRestrictions}}</li>
                                {{/if}}
                            </ul>
                        </div>
                    {{/each}}
                    <p>Love You!</p>
                    <p>Spencer</p>
                </div>
            </body>
        </html>
    `};

export const createRsvpAlertEmailTemplate = async () => {
    await createEmailTemplate(emailTemplate);
}

export const updateRsvpAlertEmailTemplate = async () => {
    await updateEmailTemplate(emailTemplate);
}