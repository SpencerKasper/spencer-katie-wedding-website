'use client';
import {useEffect, useState} from "react";
import axios from "axios";
import {RSVP} from "@/types/rsvp";
import {Guest} from "@/types/guest";
import {Table, Card, Divider} from "@mantine/core";
import {RSVPPill} from "@/app/rsvp/RSVPPill";
import AdminAuthorizationRequired from "@/app/AdminAuthorizationRequired";
import {REHEARSAL_DINNER_ROLE} from "@/constants/app-constants";

export default function RSVPReviewPage() {
    const [guestList, setGuestList] = useState([] as Guest[]);
    const [rsvps, setRsvps] = useState([] as RSVP[]);

    useEffect(() => {
        Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`)
                .then(guestListResponse => {
                    const guests = guestListResponse.data.guests as Guest[];
                    setGuestList(guests.sort((a, b) => a.partyId !== '' ? -1 : 1));
                }),
            axios.get(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/rsvp`)
                .then(rsvpsResponse => {
                    setRsvps(rsvpsResponse.data.rsvps);
                }),
        ]).then();

    }, []);
    const partyNumbersMap = guestList
        .filter(g => rsvps.filter(r => r.guest.guestId === g.guestId).length)
        .reduce((acc, curr) =>
            ({
                ...acc,
                [curr.partyId]: acc.hasOwnProperty(curr.partyId) ? acc[curr.partyId] : Object.values(acc).length === 0 ? 1 : Math.max(...(Object.values(acc) as number[])) + 1,
            }), {});
    const rows = rsvps.sort((a, b) => {
        const partyIdA = a.guest.partyId || '';
        const partyIdB = b.guest.partyId || '';

        if (partyIdA === '') return 1;
        if (partyIdB === '') return -1;

        const partyNumberA = Number(partyNumbersMap[partyIdA] ?? Infinity);
        const partyNumberB = Number(partyNumbersMap[partyIdB] ?? Infinity);

        if (isNaN(partyNumberA)) return 1;
        if (isNaN(partyNumberB)) return -1;

        return partyNumberA - partyNumberB;
    })
        .map((x, index) => {
            const guest = x.guest;
            const partyNumber = x.guest.partyId ? partyNumbersMap[x.guest.partyId] : -1;
            return (
                <Table.Tr key={`rsvp-${index}`}>
                    <Table.Td>{`${guest.firstName} ${guest.lastName}`}</Table.Td>
                    <Table.Td><RSVPPill isAttending={x.isAttending}/></Table.Td>
                    <Table.Td>{x.guest.roles && x.guest.roles.includes(REHEARSAL_DINNER_ROLE) ?
                        <RSVPPill isAttending={x.isAttendingRehearsalDinner}/> : <p>N/A</p>}</Table.Td>
                    <Table.Td>{x.isAttending ? x.dinnerChoice : '-'}</Table.Td>
                    <Table.Td>{x.isAttending && x.dietaryRestrictions && x.dietaryRestrictions !== '' ? x.dietaryRestrictions : '-'}</Table.Td>
                    <Table.Td>{x.isAttending && x.songRequests ? x.songRequests : '-'}</Table.Td>
                    <Table.Td>{partyNumber > 0 ? partyNumber : '-'}</Table.Td>
                    <Table.Td>{x.plusOne && x.plusOne.firstName !== '' ? `${x.plusOne.firstName} ${x.plusOne.lastName}` : '-'}</Table.Td>
                    <Table.Td>{x.plusOne && x.plusOne.firstName !== '' ? x.plusOne.dinnerChoice : '-'}</Table.Td>
                    <Table.Td>{x.plusOne && x.plusOne.firstName !== '' && x.plusOne.dietaryRestrictions !== '' ? x.plusOne.dietaryRestrictions : '-'}</Table.Td>
                </Table.Tr>
            );
        })

    const dinnerBreakdownMap = rsvps
        .filter(r => r.isAttending)
        .reduce((acc, curr) => ({
            ...acc,
            [curr.dinnerChoice]: acc.hasOwnProperty(curr.dinnerChoice) ? acc[curr.dinnerChoice] + 1 : 1
        }), {});
    return (
        <AdminAuthorizationRequired>
            <div className={'p-2 md:p-8'}>
                <Card>
                    <div className={'flex justify-between flex-wrap gap-4'}>
                        <div>
                            <a className={'underline cursor-pointer'}
                               href={`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist-xlsx`}
                            >
                                Download Excel Export
                            </a>
                        </div>
                        <div>
                            <div className={'flex gap-8 items-center'}>
                                <p className={'font-bold'}>Total Attending:</p>
                                <p> {rsvps.filter(r => r.isAttending).length}</p>
                            </div>
                            <div className={'flex gap-8 items-center'}>
                                <p className={'font-bold'}>Total Not Attending:</p>
                                <p> {rsvps.filter(r => !r.isAttending).length}</p>
                            </div>
                        </div>
                        <div className={'flex-col gap-8 items-center'}>
                            <p className={'font-bold'}>Dinner Breakdown:</p>
                            <div>
                                <p>
                                    {Object.keys(dinnerBreakdownMap)
                                        .sort((a, b) => dinnerBreakdownMap[a] > dinnerBreakdownMap[b] ? -1 : 1)
                                        .map((d, index) => (
                                            <p key={`dinner-choice-summary-${index}`}>{d} - {dinnerBreakdownMap[d]}</p>
                                        ))}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Divider my={'md'}/>
                    <Table.ScrollContainer minWidth={500}>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Guest Name</Table.Th>
                                    <Table.Th>Is Attending?</Table.Th>
                                    <Table.Th>Is Attending Rehearsal Dinner?</Table.Th>
                                    <Table.Th>Dinner Choice</Table.Th>
                                    <Table.Th>Dietary Restrictions</Table.Th>
                                    <Table.Th>Song Recs</Table.Th>
                                    <Table.Th>Party Number</Table.Th>
                                    <Table.Th>Plus One Name</Table.Th>
                                    <Table.Th>Plus One Dinner Choice</Table.Th>
                                    <Table.Th>Plus One Dietary Restrictions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Card>
            </div>
        </AdminAuthorizationRequired>
    )
}