import React, {useCallback, useEffect, useState} from 'react';
import {Button, Divider, Modal, NumberInput, Text} from "@mantine/core";
import {Guest} from "@/types/guest";
import {GuestAtTableRow} from "@/app/table-chart/GuestAtTableRow";
import useGuestList from "@/app/hooks/useGuestList";
import axios from "axios";
import {getEditTableGuestsEndpointUrl} from "@/app/util/api-util";

interface EditTableModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    tableNumber: number;
    setTableNumber: (value: number) => void;
}

const EditTableModal = ({isOpen, setIsOpen, tableNumber, setTableNumber}: EditTableModalProps) => {
    const {guests, setGuests} = useGuestList();
    const [updatedTableNumber, setUpdatedTableNumber] = useState(Number(tableNumber));
    const [removingGuests, setRemovingGuests] = useState([] as Guest[]);
    const [isUpdatingTableNumber, setIsUpdatingTableNumber] = useState(false);
    const [newTableNumberForMovingTable, setNewTableNumberForMovingTable] = useState(1);

    const getUsedTableNumbers = () => guests
        .map(x => x.tableNumber)
        .filter(x => x);

    useEffect(() => {
        const usedTableNumbers = getUsedTableNumbers();
        const firstEmptyTableNumber = usedTableNumbers.length ? Math.max(...usedTableNumbers) + 1 : 1;
        setNewTableNumberForMovingTable(firstEmptyTableNumber)
    }, [guests]);

    useEffect(() => {
        setUpdatedTableNumber(Number(tableNumber));
    }, [tableNumber]);

    const guestsAtTable = guests.filter(g => g.tableNumber === tableNumber);
    const guestsAtUpdatedTable = tableNumber !== updatedTableNumber ?
        guests.filter(g => g.tableNumber === updatedTableNumber) :
        guestsAtTable;
    const isNewTableNumberForMovingTableInvalid = getUsedTableNumbers().includes(newTableNumberForMovingTable) &&
        Number(tableNumber) !== Number(newTableNumberForMovingTable);
    const isNonEmptyTable = Number(tableNumber) !== Number(updatedTableNumber) && guestsAtUpdatedTable.length;

    const handleTableNumberUpdates = async () => {
        setIsUpdatingTableNumber(true);
        try {
            const guestTableUpdates = [
                ...guestsAtTable.map(g => ({guestId: g.guestId, tableNumber: updatedTableNumber})),
                ...guestsAtUpdatedTable.map(g => ({guestId: g.guestId, tableNumber: newTableNumberForMovingTable})),
            ]
            const response = await axios.post(getEditTableGuestsEndpointUrl(), {guestTableUpdates});
            setGuests(response.data.guests);
            setTableNumber(updatedTableNumber);
        } catch (e) {
            console.error(e);
        }
        setIsUpdatingTableNumber(false);
    }

    return (
        <Modal title={`Table ${tableNumber}`} opened={isOpen} onClose={() => setIsOpen(false)}>
            <div className={'flex flex-col justify-center items-center gap-4'}>
                <div className={'w-full flex flex-col gap-4 px-8'}>
                    <div>
                        <NumberInput
                            min={1}
                            label={'Table Number'}
                            value={updatedTableNumber}
                            onChange={(value) => setUpdatedTableNumber(value)}
                        />
                    </div>
                    {isNonEmptyTable ?
                        <div>
                            <NumberInput
                                min={1}
                                label={'New Table Number'}
                                value={newTableNumberForMovingTable}
                                description={`Table ${updatedTableNumber} is already assigned to other guests. Please select a new table number for that table.`}
                                onChange={(value) => setNewTableNumberForMovingTable(value)}
                                error={isNewTableNumberForMovingTableInvalid ?
                                    'People are already assigned to this table. Please select a table number that is not already in use.' :
                                    null
                                }
                            />
                        </div> :
                        <></>
                    }
                    <div className={'flex justify-end'}>
                        <Button
                            color={'green'}
                            variant={'outline'}
                            disabled={isNewTableNumberForMovingTableInvalid || Number(tableNumber) === Number(newTableNumberForMovingTable) || Number(tableNumber) === Number(updatedTableNumber)}
                            onClick={handleTableNumberUpdates}
                            loading={isUpdatingTableNumber}
                        >
                            Update Table Number{isNonEmptyTable ? 's' : ''}
                        </Button>
                    </div>
                </div>
                <div className={'text-center w-full px-8'}>
                    <Text size={'lg'}>Guests at Table</Text>
                    <Divider className={'pb-4'}/>
                    <div className={'flex flex-col gap-2 w-full'}>
                        {guestsAtTable
                            .sort((a, b) => a.partyId > b.partyId ? -1 : 1)
                            .map((guest, index) =>
                                <GuestAtTableRow
                                    key={`guest-${index}`}
                                    guest={guest}
                                    removingGuests={removingGuests}
                                    guestsAtTable={guestsAtTable}
                                    setRemovingGuests={setRemovingGuests}
                                />
                            )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditTableModal;