import {useCallback, useState} from 'react';
import {Handle, Position} from '@xyflow/react';
import {Popover, Button, Text, Modal} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import Circle from "@/app/table-chart/shapes/Circle";
import EditTableModal from "@/app/table-chart/EditTableModal";
import Rectangle from "@/app/table-chart/shapes/Rectangle";
import useGuestList from "@/app/hooks/useGuestList";

const handleStyle = {left: 10};

const TABLE_COLOR = '#614051';

function TableNode({data}) {
    const {guests} = useGuestList();
    const [opened, {close, open}] = useDisclosure(false);

    const guestsAtTable = guests.filter(g => g.tableNumber === data.tableNumber);

    const tableText = `Table ${data.tableNumber} - ${guestsAtTable.length} Guests`;
    return (
        <>
            <Popover position={'top'} withArrow shadow="md" opened={opened}>
                <Popover.Target>
                    <div
                        onClick={() => data.setTableNumberToEdit(data.tableNumber)}
                        onMouseEnter={open}
                        onMouseLeave={close}
                    >
                        {data.shape && data.shape === 'rectangle' ?
                            <Rectangle
                                width={150}
                                height={100}
                                text={tableText}
                                color={TABLE_COLOR}
                            /> :
                            <Circle
                                color={TABLE_COLOR}
                                size={150}
                                text={tableText}
                            />
                        }
                    </div>
                </Popover.Target>
                <Popover.Dropdown style={{pointerEvents: 'none'}} className={'max-h-96 overflow-y-scroll'}>
                    <div className={'p-4'}>
                        <Text size="lg" className={'y-0'}>Table {data.tableNumber}</Text>
                        <ol>
                            {guestsAtTable.map(guest => {
                                return (
                                    <li key={guest.firstName}>{guest.firstName} {guest.lastName}</li>
                                )
                            })}
                        </ol>
                    </div>
                </Popover.Dropdown>
            </Popover>
        </>
    );
};

export default TableNode;