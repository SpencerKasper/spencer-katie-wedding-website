import React, {useCallback, useEffect, useState} from 'react';
import {Button, Divider, Modal, NumberInput, Text} from "@mantine/core";
import {Guest} from "@/types/guest";
import {GuestAtTableRow} from "@/app/table-chart/GuestAtTableRow";
import useGuestList from "@/app/hooks/useGuestList";
import useTables from "@/app/hooks/useTables";
import {getFirstMissingInteger, getFirstMissingTableNumber, getUsedTableNumbers} from "@/app/util/table-util";
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
    isNewTableNumberForMovingTableInvalid: boolean;
    isNonEmptyTable: boolean;
    setTableToEdit: (value: Table) => void;
    newTableNumberForMovingTable: number;
}

const UpdateTableNumberButton = ({
                                     table,
                                     updatedTableNumber,
                                     isNewTableNumberForMovingTableInvalid,
                                     isNonEmptyTable,
                                     setTableToEdit,
                                     newTableNumberForMovingTable,
                                 }: UpdateTableNumberButtonProps) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const {tables, createOrUpdateTable} = useTables();

    const handleTableNumberUpdates = async () => {
        setIsUpdating(true);
        try {
            const movingTable = tables.find(t => t.tableNumber === updatedTableNumber)
            const updatedTable = {
                ...table,
                tableNumber: updatedTableNumber
            };
            await createOrUpdateTable(updatedTable);
            if (isNonEmptyTable && !isNewTableNumberForMovingTableInvalid && movingTable) {
                await createOrUpdateTable({
                    ...movingTable,
                    tableNumber: newTableNumberForMovingTable
                });
            }
            setTableToEdit(updatedTable);
        } catch (e) {
            console.error(e);
        }
        setIsUpdating(false);
    }

    const isUpdateTableNumberButtonDisabled = isNewTableNumberForMovingTableInvalid || Number(table.tableNumber) === Number(newTableNumberForMovingTable) || Number(table.tableNumber) === Number(updatedTableNumber);
    return (
        <Button
            color={'green'}
            variant={'outline'}
            disabled={isUpdateTableNumberButtonDisabled}
            onClick={handleTableNumberUpdates}
            loading={isUpdating}
        >
            Update Table Number{isNonEmptyTable ? 's' : ''}
        </Button>
    );
}

const UpdateTableNumber = ({table, setTableToEdit}: { table: Table; setTableToEdit: (table: Table) => void; }) => {
    const [updatedTableNumber, setUpdatedTableNumber] = useState(Number(table ? table.tableNumber : 1));
    const [newTableNumberForMovingTable, setNewTableNumberForMovingTable] = useState(1);

    const {tables, tableNumberExists} = useTables();

    useEffect(() => {
        if (table) {
            setUpdatedTableNumber(Number(table.tableNumber));
        }
    }, [table]);


    useEffect(() => {
        setNewTableNumberForMovingTable(getFirstMissingTableNumber(tables))
    }, [tables]);

    const isNewTableNumberForMovingTableInvalid = tableNumberExists(newTableNumberForMovingTable) &&
        Number(table.tableNumber) !== Number(newTableNumberForMovingTable);
    const movingTable = tables.find(t => t.tableNumber === updatedTableNumber);
    const isNonEmptyTable = movingTable && movingTable.guests.length > 0;

    return (
        <div className={'w-full flex flex-col gap-4 px-8'}>
            <div>
                <NumberInput
                    min={1}
                    label={'Table Number'}
                    value={updatedTableNumber}
                    // @ts-ignore
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
                        // @ts-ignore
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
                <UpdateTableNumberButton
                    table={table}
                    setTableToEdit={setTableToEdit}
                    newTableNumberForMovingTable={newTableNumberForMovingTable}
                    updatedTableNumber={updatedTableNumber}
                    isNonEmptyTable={isNonEmptyTable}
                    isNewTableNumberForMovingTableInvalid={isNewTableNumberForMovingTableInvalid}
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