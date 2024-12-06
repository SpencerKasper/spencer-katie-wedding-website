import React, {useState} from 'react';
import {Button, Divider, Modal, NumberInput, Text} from "@mantine/core";
import {Guest} from "@/types/guest";
import {GuestAtTableRow} from "@/app/table-chart/GuestAtTableRow";

interface EditTableModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    allGuests: Guest[];
    guestsAtTable: Guest[];
}

const EditTableModal = ({isOpen, setIsOpen, tableNumber, allGuests, guestsAtTable}: EditTableModalProps) => {
    const [updatedTableNumber, setUpdatedTableNumber] = useState(Number(tableNumber));
    const [removingGuests, setRemovingGuests] = useState([] as Guest[]);
    const usedTableNumbers = allGuests
        .map(x => x.tableNumber)
        .filter(x => x);
    const firstEmptyTableNumber = Math.max(...usedTableNumbers) + 1;
    const [newTableNumberForMovingTable, setNewTableNumberForMovingTable] = useState(firstEmptyTableNumber);
    const guestsAtUpdatedTable = tableNumber !== updatedTableNumber ?
        allGuests.filter(g => g.tableNumber === updatedTableNumber) :
        guestsAtTable;
    const isNewTableNumberForMovingTableInvalid = usedTableNumbers.includes(newTableNumberForMovingTable) && Number(tableNumber) !== Number(newTableNumberForMovingTable);
    const isNonEmptyTable = Number(tableNumber) !== Number(updatedTableNumber) && guestsAtUpdatedTable.length;
    return (
        <Modal title={`Table ${tableNumber}`} opened={isOpen} onClose={() => setIsOpen(false)}>
            <div className={'flex flex-col justify-center items-center gap-4'}>
                <div className={'w-full flex flex-col gap-4 px-8'}>
                    <div>
                        <NumberInput
                            label={'Table Number'}
                            value={updatedTableNumber}
                            onChange={(value) => setUpdatedTableNumber(value)}
                        />
                    </div>
                    {isNonEmptyTable ?
                        <div>
                            {isNewTableNumberForMovingTableInvalid ?
                                <Text c={'red'}>
                                    Table {updatedTableNumber} is already assigned to other guests. Please select a new
                                    table number for that table.
                                </Text> :
                                <></>
                            }
                            <NumberInput
                                label={'New Table Number'}
                                value={newTableNumberForMovingTable}
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
                            disabled={isNewTableNumberForMovingTableInvalid || Number(tableNumber) === Number(newTableNumberForMovingTable)}
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
                                    guests={removingGuests}
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