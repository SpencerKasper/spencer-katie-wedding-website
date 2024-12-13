import React, {useEffect, useState} from 'react';
import {Button, Divider, Modal, NumberInput, Text} from "@mantine/core";
import {Guest} from "@/types/guest";
import {GuestAtTableRow} from "@/app/table-chart/GuestAtTableRow";
import useGuestList from "@/app/hooks/useGuestList";
import useTables from "@/app/hooks/useTables";
import {getFirstMissingTableNumber} from "@/app/util/table-util";
import {Table} from "@/types/table";

interface EditTableModalProps {
    table: Table;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    setTableToEdit: (value: Table) => void;
}

interface UpdateTableNumberButtonProps {
    table: Table;
    updatedTableNumber: number;
    setTableToEdit: (value: Table) => void;
}

const UpdateTableNumberButton = ({
                                     table,
                                     updatedTableNumber,
                                     setTableToEdit,
                                 }: UpdateTableNumberButtonProps) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const {tableNumberExists, createOrUpdateTable} = useTables();

    const handleTableNumberUpdates = async () => {
        setIsUpdating(true);
        try {
            const updatedTable = {
                ...table,
                tableNumber: updatedTableNumber
            };
            await createOrUpdateTable(updatedTable);
            setTableToEdit(updatedTable);
        } catch (e) {
            console.error(e);
        }
        setIsUpdating(false);
    }

    return (
        <Button
            color={'green'}
            variant={'outline'}
            disabled={!table || Number(table.tableNumber) === Number(updatedTableNumber) || tableNumberExists(updatedTableNumber)}
            onClick={handleTableNumberUpdates}
            loading={isUpdating}
        >
            Update Table Number
        </Button>
    );
}

const UpdateTableNumber = ({table, setTableToEdit}: { table: Table; setTableToEdit: (table: Table) => void; }) => {
    const [updatedTableNumber, setUpdatedTableNumber] = useState(Number(table ? table.tableNumber : 1));

    const {tableNumberExists} = useTables();

    useEffect(() => {
        if (table) {
            setUpdatedTableNumber(Number(table.tableNumber));
        }
    }, [table]);

    const error = tableNumberExists(updatedTableNumber) && table && updatedTableNumber !== table.tableNumber ?
        'Table numbers are meant to be unique. Please select a table number that is not already being used.' :
        null;
    return (
        <div className={'w-full flex flex-col gap-4 px-8'}>
            <div>
                <NumberInput
                    min={1}
                    label={'Table Number'}
                    value={updatedTableNumber}
                    // @ts-ignore
                    onChange={(value) => setUpdatedTableNumber(value)}
                    error={error}
                />
            </div>
            <div className={'flex justify-end'}>
                <UpdateTableNumberButton
                    table={table}
                    setTableToEdit={setTableToEdit}
                    updatedTableNumber={updatedTableNumber}
                />
            </div>
        </div>
    );
}

const EditTableModal = ({table, isOpen, setIsOpen, setTableToEdit}: EditTableModalProps) => {
    const {guests} = useGuestList();
    const [removingGuests, setRemovingGuests] = useState([] as Guest[]);
    const tableNumber = table ? table.tableNumber : -1;
    const guestsAtTable = table && table.guests ?
        table.guests.map(guestId => guests.find(g => g.guestId === guestId)) :
        [];

    return (
        <Modal title={`Table ${tableNumber}`} opened={isOpen} onClose={() => setIsOpen(false)}>
            <div className={'flex flex-col justify-center items-center gap-4'}>
                <UpdateTableNumber
                    table={table}
                    setTableToEdit={setTableToEdit}
                />
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
                                    table={table}
                                    removingGuests={removingGuests}
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