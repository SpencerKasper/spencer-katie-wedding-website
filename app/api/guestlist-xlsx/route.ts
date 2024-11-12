import {NextResponse} from "next/server";
import {getSearchParams} from "@/app/api/helpers/param-util";
import xlsx, {WorkSheet} from 'node-xlsx';
import getDynamoDbClient from "@/app/api/aws-clients/dynamodb-client";
import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {RSVP} from "@/types/rsvp";
import {Guest} from "@/types/guest";
import {GUESTLIST_TABLE_NAME, RSVPS_TABLE_NAME} from "@/app/api/constants/dynamo";

function getDefaultValue(value?: string) {
    return value && value !== '' ? value : '-';
}

export async function GET(request) {
    const getNameFields = () => ['First Name', 'Last Name'];
    const getRSVPFields = () => ['Is Attending', 'Dinner Choice', 'Dietary Restrictions'];
    const getContactFields = () => ['Email Address', 'Phone Number'];
    const getAddressFields = () => ['Address', 'Address 2', 'City', 'State', 'Zip Code'];

    function getRSVPsWorksheet(rsvps: RSVP[]): WorkSheet<string> {
        const headerRow = [...getNameFields(), ...getRSVPFields(), ...getContactFields(), ...getAddressFields()];
        const rsvpRows = rsvps.map(rsvp => {
            const guest = rsvp.guest;
            return [
                guest.firstName, guest.lastName, rsvp.isAttending ? 'Yes' : 'No', getDefaultValue(rsvp.dinnerChoice),
                getDefaultValue(rsvp.dietaryRestrictions), guest.emailAddress, guest.phoneNumber, guest.address,
                guest.address2, guest.city, guest.state, guest.zipCode,
            ];
        });
        const rsvpsExcelData = [headerRow, ...rsvpRows];
        return {name: 'RSVPs', data: rsvpsExcelData, options: null};
    }

    const searchParams = getSearchParams(request);
    const dynamo = await getDynamoDbClient();
    const guestListResponse = await dynamo.send(new ScanCommand({
        TableName: GUESTLIST_TABLE_NAME,
    }));
    const rsvpResponse = await dynamo.send(new ScanCommand({
        TableName: RSVPS_TABLE_NAME
    }));
    const rsvps = rsvpResponse.Items as RSVP[];
    const rsvpsWorksheet = getRSVPsWorksheet(rsvps);
    const guestList = guestListResponse.Items as Guest[];
    const noResponse = guestList.filter(guest => !rsvps.find(rsvp => rsvp.guest.guestId === guest.guestId));
    const noResponseExcelData = [
        [...getNameFields(), ...getContactFields(), ...getAddressFields()],
        ...noResponse.map(nr => [nr.firstName, nr.lastName, nr.emailAddress, nr.phoneNumber, nr.address,
            nr.address2, nr.city, nr.state, nr.zipCode,])
    ]
    const noResponseWorksheet: WorkSheet<string> = {name: 'No Response', data: noResponseExcelData, options: null};
    const buffer = xlsx.build([rsvpsWorksheet, noResponseWorksheet]);
    return new Response(buffer, {
        status: 200,
        headers: {
            'Content-Disposition': `attachment; filename="spencer-katie-wedding-guestlist-${Date.now()}.xlsx"`,
            'Content-Type': 'application/vnd.ms-excel',
        }
    })
}