'use client';
import {Guest} from "@/types/guest";
import {Table, Card, Button} from "@mantine/core";
import AddGuestModal from "@/app/guestlist/AddGuestModal";
import {useState} from "react";

export function GuestListTable({guests}: { guests: Guest[] }) {
    const [addGuestOpen, setAddGuestOpen] = useState(false);
    const guestRows = guests.map((guest, index) => {
        const address2Portion = guest.address2 && guest.address2 !== '' ? ` ${guest.address2}` : '';
        const formattedAddress = guest.address ? `${guest.address}${address2Portion}, ${guest.city}, ${guest.state} ${guest.zipCode}` : '-';
        return (
            <Table.Tr key={`guest-${index}`}>
                <Table.Td>{guest.firstName} {guest.lastName}</Table.Td>
                <Table.Td>{guest.phoneNumber ? guest.phoneNumber : '-'}</Table.Td>
                <Table.Td>{guest.emailAddress ? guest.emailAddress : '-'}</Table.Td>
                <Table.Td>{formattedAddress}</Table.Td>
            </Table.Tr>
        );
    });
    return (
        <Card>
            <div className={'flex justify-end'}>
                <Button variant={'outline'} color={'green'} onClick={() => setAddGuestOpen(true)}>Add Guest</Button>
                <AddGuestModal guests={guests} opened={addGuestOpen} onClose={() => setAddGuestOpen(false)} />
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