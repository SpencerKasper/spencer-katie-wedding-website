import {Popover, Text} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import Circle from "@/app/table-chart/shapes/Circle";
import Rectangle from "@/app/table-chart/shapes/Rectangle";
import useGuestList from "@/app/hooks/useGuestList";
import {DEFAULT_TABLE_COLOR} from "@/constants/app-constants";
import {getBrightness} from "@/app/util/rgb-util";

function TableNode({data}) {
    const {getGuestsAtTable} = useGuestList();
    const [opened, {close, open}] = useDisclosure(false);

    const tableText = `Table ${data.table.tableNumber} - ${data.table.guests.length} Guests`;
    const color = data.table ? data.table.color : '';
    return (
        <div className={getBrightness(color) > 40 ? 'text-black' : 'text-white'}>
            <Popover position={'top'} withArrow shadow="md" opened={opened}>
                <Popover.Target>
                    <div
                        onClick={() => data.setTableToEdit(data.table)}
                        onMouseEnter={open}
                        onMouseLeave={close}
                    >
                        {data.table  && data.table.shape && data.table.shape === 'rectangle' ?
                            <Rectangle
                                width={150}
                                height={100}
                                text={tableText}
                                color={color}
                            /> :
                            <Circle
                                color={color}
                                size={150}
                                text={tableText}
                            />
                        }
                    </div>
                </Popover.Target>
                <Popover.Dropdown style={{pointerEvents: 'none'}} className={'max-h-96 overflow-y-scroll'}>
                    <div className={'p-4'}>
                        <Text size="lg" className={'y-0'}>Table {data.table.tableNumber}</Text>
                        <ol>
                            {getGuestsAtTable(data.table).map(guest => {
                                return (
                                    <li key={guest.firstName}>{guest.firstName} {guest.lastName}</li>
                                )
                            })}
                        </ol>
                    </div>
                </Popover.Dropdown>
            </Popover>
        </div>
    );
};

export default TableNode;