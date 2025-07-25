'use client';
import {Guest} from "@/types/guest";
import {Button, Card, Checkbox, Pagination, Select, Table, TextInput, Highlight} from "@mantine/core";
import AddEditGuestModal from "@/app/guestlist/AddEditGuestModal";
import {useState} from "react";
import {booleanIsDefined} from "@/app/util/general-util";
import useGuestList from "@/app/hooks/useGuestList";
import useTables from "@/app/hooks/useTables";
import ImportGuestsModal from "@/app/guestlist/ImportGuestsModal";

export function GuestListTable() {
    const [search, setSearch] = useState({search: '', includePartyMembers: false});
    const [paginationInfo, setPaginationInfo] = useState({guestsPerPage: 20, currentPage: 1});

    const {guests} = useGuestList({getGuestsOnInstantiation: true});
    const {tables} = useTables();

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
    const allMatchingGuests = [...matchingSearchCriteria, ...includedPartyMembers];
    const maxItemIndex = Math.min(paginationInfo.currentPage * paginationInfo.guestsPerPage, allMatchingGuests.length);
    const grouped = Object.groupBy(allMatchingGuests, item => item.partyId);
    const nonPartiesRemapped = '' in grouped ? grouped[''].reduce((acc, curr) => ({
        ...acc,
        [curr.guestId]: [curr]
    }), {}) : {};
    if ('' in grouped) {
        delete grouped[''];
    }
    const groupedWithNonParties = {
        ...grouped,
        ...nonPartiesRemapped
    };

    const sortedGuests = Object.keys(groupedWithNonParties)
        .map(partyIdOrGuestId => groupedWithNonParties[partyIdOrGuestId].sort((a, b) => a.firstName > b.firstName ? 1 : -1))
        .sort((a, b) => a[0].firstName > b[0].firstName ? 1 : -1)
        .reduce((acc, curr) => [...acc, ...curr], [])
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
        const guestsTable = tables.find(t => t.guests.find(g => g === guest.guestId));
        guestRows.push(
            <Table.Tr
                className={'cursor-pointer hover:bg-yellow-100'}
                onClick={() => {
                    setSelectedGuest(guest);
                    setModalOpen(true);
                }}
                data-striped={dataStriped}
                key={`guest-${guest.guestId}`}
            >
                <Table.Td><Highlight highlight={search.search}>{guestName}</Highlight></Table.Td>
                <Table.Td className={'min-w-48'}>{formattedAddress}</Table.Td>
                <Table.Td>{guestsTable ? guestsTable.tableNumber : '-'}</Table.Td>
                <Table.Td>{guest.phoneNumber ? guest.phoneNumber : '-'}</Table.Td>
                <Table.Td>{guest.emailAddress ? guest.emailAddress : '-'}</Table.Td>
                <Table.Td>{booleanIsDefined(guest.optOutOfEmail) ? (guest.optOutOfEmail ? 'Yes' : 'No') : '-'}</Table.Td>
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
                        onChange={(event) => {
                            setPaginationInfo({...paginationInfo, currentPage: 1})
                            setSearch({...search, search: event.currentTarget.value});
                        }}
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
                <div className={'w-full sm:w-1/4 flex justify-end gap-2'}>
                    <Button variant={'outline'} color={'green'} onClick={() => setModalOpen(true)}>Add Guest</Button>
                    <AddEditGuestModal
                        selectedGuest={selectedGuest}
                        setSelectedGuest={setSelectedGuest}
                        opened={modalOpen}
                        onClose={() => setModalOpen(false)}
                    />
                    <ImportGuestsModal/>
                </div>
            </div>
            <Table.ScrollContainer minWidth={500}>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th className={'min-w-36'}>Address</Table.Th>
                            <Table.Th>Table Number</Table.Th>
                            <Table.Th>Phone Number</Table.Th>
                            <Table.Th>Email Address</Table.Th>
                            <Table.Th>Opted Out of Email</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {guestRows}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <div className={'flex justify-between items-end flex-wrap gap-4 sm:gap-0'}>
                <div className={'w-full sm:w-1/4 text-center sm:text-left'}><p>Showing
                    Guests {minItemIndex + 1} - {maxItemIndex} of {allMatchingGuests.length}</p></div>
                <div className={'w-full sm:w-1/2 flex justify-center'}>
                    <Pagination
                        value={paginationInfo.currentPage}
                        onChange={value => setPaginationInfo({...paginationInfo, currentPage: value})}
                        total={paginationInfo.guestsPerPage ? Number(Math.ceil(allMatchingGuests.length / Number(paginationInfo.guestsPerPage)).toFixed(0)) : 1}
                    />
                </div>
                <Select
                    value={paginationInfo.guestsPerPage.toString()}
                    onChange={value => {
                        setPaginationInfo({...paginationInfo, currentPage: 1, guestsPerPage: Number(value)});
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