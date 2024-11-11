'use client';
import {Guest} from "@/types/guest";
import {Button, Card, Checkbox, Pagination, Select, Table, TextInput, Highlight} from "@mantine/core";
import AddEditGuestModal from "@/app/guestlist/AddEditGuestModal";
import {useEffect, useState} from "react";
import axios from "axios";

export function GuestListTable() {
    const [search, setSearch] = useState({search: '', includePartyMembers: false});
    const [guests, setGuests] = useState([] as Guest[]);
    const [paginationInfo, setPaginationInfo] = useState({guestsPerPage: 20, currentPage: 1});

    const refreshGuests = () => {
        const url = `${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`;
        axios.get(url)
            .then(guestListResponse => setGuests(guestListResponse.data.guests));
    };

    useEffect(() => {
        refreshGuests();
    }, []);

    const [selectedGuest, setSelectedGuest] = useState(null as Guest);
    const [modalOpen, setModalOpen] = useState(false);

    const doesSearchIncludeValue = (value: string) => value.toLowerCase().includes(search.search.toLowerCase());
    const matchingSearchCriteria = guests.filter(g => doesSearchIncludeValue(`${g.firstName} ${g.lastName}`));
    const nonMatchingSearchGuests = guests.filter(g => matchingSearchCriteria.filter(x => x.guestId === g.guestId).length === 0);
    const includedPartyMembers = search.includePartyMembers ?
        nonMatchingSearchGuests
            .filter(g => {
                return g.partyId && g.partyId !== '' && matchingSearchCriteria.find(match => match.partyId === g.partyId);
            }) :
        [];
    const minItemIndex = (paginationInfo.currentPage - 1) * paginationInfo.guestsPerPage;
    const maxItemIndex = paginationInfo.currentPage * paginationInfo.guestsPerPage;
    const sortedGuests = [...matchingSearchCriteria, ...includedPartyMembers]
        .sort((a, b) => a.partyId > b.partyId ? -1 : 1)
        .filter((g, index) => index >= minItemIndex && index < maxItemIndex);
    const guestRows = [];
    let currentPartyId = '';
    let index = 0;
    let currentWhiteIndex = 'even';
    const getDataStriped = (guest: Guest) => {
        if (currentPartyId === '') {
            return currentWhiteIndex;
        } else if (currentPartyId === guest.partyId && currentWhiteIndex === 'even') {
            return 'odd';
        } else if (currentPartyId === guest.partyId && currentWhiteIndex === 'odd') {
            return 'even';
        } else if (currentPartyId !== guest.partyId && currentWhiteIndex === 'even') {
            return 'even';
        } else if (currentPartyId !== guest.partyId && currentWhiteIndex === 'odd') {
            return 'odd';
        } else if (currentPartyId !== '' && guest.partyId === '' && currentWhiteIndex === 'even') {
            return 'even';
        } else {
            return 'odd';
        }
    };

    for (let guest of sortedGuests) {
        const address2Portion = guest.address2 && guest.address2 !== '' ? ` ${guest.address2}` : '';
        const formattedAddress = guest.address ? `${guest.address}${address2Portion}, ${guest.city}, ${guest.state} ${guest.zipCode}` : '-';

        // WARNING: This is garbage code and getDataStriped is dependent on currentPartyId and currentWhiteIndex between calls
        const dataStriped = getDataStriped(guest);
        currentPartyId = guest.partyId;
        currentWhiteIndex = dataStriped;
        index++;
        const guestName = `${guest.firstName} ${guest.lastName}`;
        guestRows.push(
            <Table.Tr
                className={'cursor-pointer hover:bg-yellow-100'}
                onClick={() => {
                    setSelectedGuest(guest);
                    setModalOpen(true);
                }}
                data-striped={dataStriped}
                key={`guest-${guest.firstName}-${guest.lastName}`}
            >
                <Table.Td><Highlight highlight={search.search}>{guestName}</Highlight></Table.Td>
                <Table.Td className={'min-w-48'}>{formattedAddress}</Table.Td>
                <Table.Td>{guest.phoneNumber ? guest.phoneNumber : '-'}</Table.Td>
                <Table.Td>{guest.emailAddress ? guest.emailAddress : '-'}</Table.Td>
            </Table.Tr>
        );
    }

    return (
        <Card>
            <div className={'flex flex-wrap justify-between pb-4 gap-4 sm:gap-0'}>
                <div className={'w-full sm:w-1/4'}></div>
                <div className={'flex flex-col gap-4 justify-center align-center w-full sm:w-1/2'}>
                    <TextInput
                        value={search.search}
                        onChange={(event) => setSearch({...search, search: event.currentTarget.value})}
                        placeholder={'Search for Names'}
                    />
                    <Checkbox
                        checked={search.includePartyMembers}
                        label={'Include Party Members in Search Results'}
                        onChange={(event) => {
                            setSearch({...search, includePartyMembers: event.currentTarget.checked});
                        }}
                    />
                </div>
                <div className={'w-full sm:w-1/4 flex justify-end'}>
                    <Button variant={'outline'} color={'green'} onClick={() => setModalOpen(true)}>Add Guest</Button>
                    <AddEditGuestModal
                        selectedGuest={selectedGuest}
                        setSelectedGuest={setSelectedGuest}
                        guests={guests}
                        setGuests={setGuests}
                        opened={modalOpen}
                        onClose={() => setModalOpen(false)}
                    />
                </div>
            </div>
            <Table.ScrollContainer minWidth={500}>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th className={'min-w-36'}>Address</Table.Th>
                            <Table.Th>Phone Number</Table.Th>
                            <Table.Th>Email Address</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {guestRows}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <div className={'flex justify-between items-end flex-wrap gap-4 sm:gap-0'}>
                <div className={'w-full sm:w-1/4 text-center sm:text-left'}><p>Showing Guests {minItemIndex + 1} - {maxItemIndex} of {guests.length}</p></div>
                <div className={'w-full sm:w-1/2 flex justify-center'}>
                    <Pagination
                        value={paginationInfo.currentPage}
                        onChange={value => setPaginationInfo({...paginationInfo, currentPage: value})}
                        total={paginationInfo.guestsPerPage ? Number(Math.ceil(guests.length / Number(paginationInfo.guestsPerPage)).toFixed(0)) : 1}
                    />
                </div>
                <Select
                    value={paginationInfo.guestsPerPage.toString()}
                    onChange={value => {
                        setPaginationInfo({...paginationInfo, guestsPerPage: Number(value)});
                    }}
                    label={'Guests Per Page'}
                    className={'w-full sm:w-1/4'}
                    data={['10', '20', '50', '100', '200']}
                    placeholder={'Guests Per Page'}
                    defaultValue={'20'}
                />
            </div>
        </Card>
    );
}