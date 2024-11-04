'use client';
import {useEffect, useState} from "react";
import axios from "axios";
import {RSVP} from "@/types/rsvp";
import {Guest} from "@/types/guest";
import {Table, Card, Divider} from "@mantine/core";
import {RSVPPill} from "@/app/rsvp/RSVPPill";
import AdminAuthorizationRequired from "@/app/AdminAuthorizationRequired";

export default function RSVPReviewPage() {
    const [guestList, setGuestList] = useState([] as Guest[]);
    const [rsvps, setRsvps] = useState([] as RSVP[]);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`)
            .then(guestListResponse => {
                setGuestList(guestListResponse.data.guests);
                axios.get(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/rsvp`)
                    .then(rsvpsResponse => {
                        setRsvps(rsvpsResponse.data.rsvps);
                    });
            });
    }, []);
    const partyNumbersMap = guestList.reduce((acc, curr, index) => ({
        [curr.partyId]: acc.hasOwnProperty(curr.partyId) ? acc[curr.partyId] : index + 1,
    }), {});
    const rows = rsvps.map((x, index) => {
        const guest = x.guest;
        const partyNumber = x.guest.partyId ? partyNumbersMap[x.guest.partyId] : -1;
        return (
            <Table.Tr key={`rsvp-${index}`}>
                <Table.Td>{`${guest.firstName} ${guest.lastName}`}</Table.Td>
                <Table.Td><RSVPPill rsvp={x}/></Table.Td>
                <Table.Td>{x.isAttending ? x.dinnerChoice : '-'}</Table.Td>
                <Table.Td>{x.isAttending && x.dietaryRestrictions && x.dietaryRestrictions !== '' ? x.dietaryRestrictions : '-'}</Table.Td>
                <Table.Td>{partyNumber > 0 ? partyNumber : '-'}</Table.Td>
            </Table.Tr>
        );
    })

    return (
        <AdminAuthorizationRequired>

            <div className={'p-2 md:p-8'}>
                <Card>
                    <div>
                        <a className={'underline cursor-pointer'}
                           href={`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist-xlsx`}>Download Excel
                            Export</a>
                    </div>
                    <Divider my={'md'}/>
                    <Table.ScrollContainer minWidth={500}>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Guest Name</Table.Th>
                                    <Table.Th>Is Attending?</Table.Th>
                                    <Table.Th>Dinner Choice</Table.Th>
                                    <Table.Th>Dietary Restrictions</Table.Th>
                                    <Table.Th>Party Number</Table.Th>
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