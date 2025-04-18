import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    Button,
    ColorPicker,
    Divider,
    InputLabel,
    Modal,
    NumberInput,
    Popover,
    Select,
    Text
} from "@mantine/core";
import {Guest} from "@/types/guest";
import {GuestAtTableRow} from "@/app/table-chart/GuestAtTableRow";
import useGuestList from "@/app/hooks/useGuestList";
import useTables from "@/app/hooks/useTables";
import {getFirstMissingTableNumber} from "@/app/util/table-util";
import {Table} from "@/types/table";
import axios from "axios";
import {getGuestListBffEndpointUrl} from "@/app/util/api-util";
import {DEFAULT_TABLE_COLOR} from "@/constants/app-constants";

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
        <div className={'w-full flex justify-between items-end gap-4'}>
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

const COLOR_SAMPLE_SIZE = 48;
const EditTableModal = ({table, isOpen, setIsOpen, setTableToEdit}: EditTableModalProps) => {
    const {guests, getGuestsAtTable} = useGuestList();
    const {tables, createOrUpdateTable} = useTables();
    const [removingGuests, setRemovingGuests] = useState([] as Guest[]);
    const [selectedName, setSelectedName] = useState('');
    const [tableColor, setTableColor] = useState(table && table.color ? table.color : DEFAULT_TABLE_COLOR);
    const tableNumber = table ? table.tableNumber : -1;
    const guestsAtTable = getGuestsAtTable(table);

    useEffect(() => {
        setTableColor(table ? table.color : DEFAULT_TABLE_COLOR);
    }, [table]);

    return (
        <Modal title={`Table ${tableNumber}`} opened={isOpen} onClose={() => setIsOpen(false)}>
            <div className={'flex flex-col justify-center items-center gap-4 px-8'}>
                <UpdateTableNumber
                    table={table}
                    setTableToEdit={setTableToEdit}
                />
                <Divider/>
                <div className={'text-center w-full'}>
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
                <div className={'flex justify-between gap-4 w-full items-end'}>
                    <Autocomplete
                        label={'Add Guests to Table'}
                        placeholder={'Search for Guests Who Do Not Have a table'}
                        data={guests.filter(g => !tables.find(t => t.guests.find(guestId => g.guestId === guestId))).map(g => ({
                            label: `${g.firstName} ${g.lastName}`,
                            value: g.guestId
                        }))}
                        value={selectedName}
                        onChange={(value) => setSelectedName(value)}
                    />
                    <div className={'pt-4 flex justify-end'}>
                        <Button
                            variant={'outline'}
                            onClick={async () => {
                                const selectedGuest = guests.find(g => `${g.firstName} ${g.lastName}` === selectedName);
                                const partyGuestIds = selectedGuest && selectedGuest.partyId && selectedGuest.partyId !== '' ?
                                    guests.filter(g => g.partyId === selectedGuest.partyId && g.guestId !== selectedGuest.guestId).map(g => g.guestId) :
                                    [];

                                const updatedGuests = [...table.guests, selectedGuest.guestId, ...partyGuestIds];
                                await createOrUpdateTable({
                                    ...table,
                                    guests: updatedGuests
                                });
                                setSelectedName('');
                            }}>Add Guest</Button>
                    </div>
                </div>
                <Divider/>
                <div className={'flex w-full justify-between items-end flex-wrap'}>
                    <Select
                        data={[{label: 'Circle', value: 'circle'}, {label: 'Rectangle', value: 'rectangle'}]}
                        placeholder={'Select a Table Shape'}
                        label={'Table Shape'}
                        value={table ? table.shape : ''}
                        onChange={async (value) => {
                            await createOrUpdateTable({
                                ...table,
                                shape: value
                            })
                        }}
                    />
                    <div>
                        <InputLabel>Table Color</InputLabel>
                        <Popover>
                            <Popover.Target>
                                <div>
                                    <svg height={COLOR_SAMPLE_SIZE} width={COLOR_SAMPLE_SIZE}
                                         fill={tableColor}>
                                        <rect height={COLOR_SAMPLE_SIZE} width={COLOR_SAMPLE_SIZE}/>
                                    </svg>
                                </div>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <div className={'flex flex-col gap-4'}>
                                    <ColorPicker
                                        onChange={setTableColor}
                                        value={tableColor}
                                    />
                                    <div className={'flex justify-between items-end'}>
                                        <div></div>
                                        <Button
                                            variant={'outline'}
                                            onClick={async () => await createOrUpdateTable({
                                                ...table,
                                                color: tableColor
                                            })}>
                                            Save Color
                                        </Button>
                                    </div>
                                </div>
                            </Popover.Dropdown>
                        </Popover>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditTableModal;