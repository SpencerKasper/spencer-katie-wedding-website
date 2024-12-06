import {useCallback, useState} from 'react';
import {Handle, Position} from '@xyflow/react';
import {Popover, Button, Text, Modal} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import Circle from "@/app/table-chart/shapes/Circle";
import EditTableModal from "@/app/table-chart/EditTableModal";
import Rectangle from "@/app/table-chart/shapes/Rectangle";

const handleStyle = {left: 10};

const TABLE_COLOR = '#614051';

function TableNode({data}) {
    const [opened, {close, open}] = useDisclosure(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tableText = `Table ${data.tableNumber} - ${data.guestsAtTable.length} Guests`;
    return (
        <>
            <Popover position={'top'} withArrow shadow="md" opened={opened}>
                <EditTableModal
                    allGuests={data.allGuests}
                    tableNumber={data.tableNumber}
                    guestsAtTable={data.guestsAtTable}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                />
                <Popover.Target>
                    <div
                        onClick={() => setIsModalOpen(true)}
                        onMouseEnter={open}
                        onMouseLeave={close}
                    >
                        {data.shape && data.shape === 'rectangle' ?
                            <Rectangle
                                width={250}
                                height={100}
                                text={tableText}
                                color={TABLE_COLOR}
                            /> :
                            <Circle
                                color={TABLE_COLOR}
                                size={250}
                                text={tableText}
                            />
                        }
                    </div>
                </Popover.Target>
                <Popover.Dropdown style={{pointerEvents: 'none'}} className={'max-h-96 overflow-y-scroll'}>
                    <div className={'p-4'}>
                        <Text size="lg" className={'y-0'}>Table {data.tableNumber}</Text>
                        <ol>
                            {data.guestsAtTable.map(guest => {
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