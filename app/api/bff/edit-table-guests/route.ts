import axios from "axios";
import {NextResponse} from "next/server";
import {getGuestListEndpointUrl, getTablesEndpointUrl} from "@/app/util/api-util";

const groupBy = (xs, key) => xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
}, {});

export async function POST(request) {
    try {
        const body = await request.json();
        const guestTableUpdates = body.guestTableUpdates as { guestId: string; tableNumber: string; }[];
        const guestsResponse = await axios.get(getGuestListEndpointUrl());
        const guests = guestsResponse.data.guests;
        const getGuestsWithUpdatedTableNumbers = async () => {
            const guestsWithUpdatedTables = guests
                .filter(g => guestTableUpdates.filter(gt => gt.guestId === g.guestId).length === 1)
                .map(g => {
                    const foundGuestUpdate = guestTableUpdates.find(gtu => gtu.guestId === g.guestId);
                    return {...g, tableNumber: foundGuestUpdate.tableNumber};
                });
            const partyMembersWithUpdatedTables = guests
                .filter(g => guestsWithUpdatedTables.filter(gwut => gwut.guestId === g.guestId).length === 0)
                .filter(g =>
                    guestsWithUpdatedTables.filter(gtc => gtc.partyId && gtc.partyId !== '' && gtc.partyId === g.partyId).length
                )
                .map(g => {
                    const foundPartyMemberWithUpdatedTable = guestsWithUpdatedTables.find(gwut => gwut.partyId === g.partyId);
                    return ({...g, tableNumber: foundPartyMemberWithUpdatedTable.tableNumber});
                });
            return [...guestsWithUpdatedTables, ...partyMembersWithUpdatedTables];
        };
        const guestsWithUpdates = await getGuestsWithUpdatedTableNumbers();
        const groupedByParty = groupBy(guestsWithUpdates, 'partyId');
        for (let partyId of Object.keys(groupedByParty)) {
            if(partyId === '') {
                continue;
            }
            const guestsForParty = groupedByParty[partyId];
            const uniqueTableNumbersInParty = Array.from(new Set(guestsForParty.map(g => g.tableNumber)));
            if (uniqueTableNumbersInParty.length !== 1) {
                const guestErrorInfo = guestsForParty.reduce((acc, curr) => `${acc}; ${curr.firstName} ${curr.lastName} is at table ${curr.tableNumber}`, '')
                return NextResponse.json({
                    statusCode: 400,
                    message: `All members of the same party must be sat at the same table. ${guestErrorInfo}`
                })
            }
        }
        for (let guest of guestsWithUpdates) {
            await axios.post(getGuestListEndpointUrl(), guest);
        }
        const updatedGuestsResponse = await axios.get(getGuestListEndpointUrl());
        const updatedGuests = updatedGuestsResponse.data.guests;
        const tableNumbers = Array.from(new Set(updatedGuests.map(g => g.tableNumber)));
        const tablesResponse = await axios.get(getTablesEndpointUrl());
        const tables = tablesResponse.data.tables;
        return NextResponse.json({
            statusCode: 200,
            guests: updatedGuests
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({
            statusCode: 500,
            message: 'There was an internal server error.'
        });
    }
}