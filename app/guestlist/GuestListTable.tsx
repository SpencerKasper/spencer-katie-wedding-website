'use client';
import {Guest} from "@/types/guest";
import {Table, Card, Button} from "@mantine/core";
import AddGuestModal from "@/app/guestlist/AddGuestModal";
import {useState} from "react";

export function GuestListTable({guests}: { guests: Guest[] }) {
    const [addGuestOpen, setAddGuestOpen] = useState(false);
    const sortedGuests = guests
        .sort((a, b) => a.partyId > b.partyId ? -1 : 1);
    const guestRows = [];
    let currentPartyId = '';
    let currentWhiteIndex = 'odd';
    let index = 0;
    for(let guest of sortedGuests) {
        const address2Portion = guest.address2 && guest.address2 !== '' ? ` ${guest.address2}` : '';
        const formattedAddress = guest.address ? `${guest.address}${address2Portion}, ${guest.city}, ${guest.state} ${guest.zipCode}` : '-';
        let dataStriped = '';
        if(currentPartyId === '' && currentWhiteIndex === 'even' && index % 2 === 0) {
            dataStriped = 'odd';
        } else if(currentPartyId === '' && currentWhiteIndex === 'odd' && index % 2 === 0) {
            dataStriped = 'even';
        } else if(currentPartyId === '' && currentWhiteIndex === 'even' && index % 2 !== 0) {
            dataStriped = 'even';
        } else if(currentPartyId === '' && currentWhiteIndex === 'odd' && index % 2 !== 0) {
            dataStriped = 'odd';
        } else if(currentPartyId === guest.partyId && currentWhiteIndex === 'even') {
            dataStriped = 'odd';
        } else if(currentPartyId === guest.partyId && currentWhiteIndex === 'odd') {
            dataStriped = 'even';
        } else if(currentPartyId !== guest.partyId && currentWhiteIndex === 'even') {
            dataStriped = 'even';
        } else if(currentPartyId !== guest.partyId && currentWhiteIndex === 'odd') {
            dataStriped = 'odd';
        } else if(currentPartyId !== '' && guest.partyId === '' && currentWhiteIndex === 'even') {
            dataStriped = 'even';
        } else {
            dataStriped = 'odd';
        }
        currentPartyId = guest.partyId;
        currentWhiteIndex = dataStriped;
        index++;
        guestRows.push(
            <Table.Tr data-striped={dataStriped} key={`guest-${guest.firstName}-${guest.lastName}`}>
                <Table.Td>{guest.firstName} {guest.lastName}</Table.Td>
                <Table.Td>{guest.phoneNumber ? guest.phoneNumber : '-'}</Table.Td>
                <Table.Td>{guest.emailAddress ? guest.emailAddress : '-'}</Table.Td>
                <Table.Td>{formattedAddress}</Table.Td>
            </Table.Tr>
        );
    }

    return (
        <Card>
            <div className={'flex justify-end'}>
                <Button variant={'outline'} color={'green'} onClick={() => setAddGuestOpen(true)}>Add Guest</Button>
                <AddGuestModal guests={guests} opened={addGuestOpen} onClose={() => setAddGuestOpen(false)}/>
            </div>
            <Table.ScrollContainer minWidth={500}>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Phone Number</Table.Th>
                            <Table.Th>Email Address</Table.Th>
                            <Table.Th>Address</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {guestRows}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Card>
    );
}