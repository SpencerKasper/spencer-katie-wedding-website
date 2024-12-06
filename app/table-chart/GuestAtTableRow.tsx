import {Guest} from "@/types/guest";
import {Button, ButtonGroup, Popover, Text} from "@mantine/core";
import {TiCancelOutline, TiDeleteOutline} from "react-icons/ti";
import React from "react";
import {FaRegCheckCircle} from "react-icons/fa";
import {MdOutlineCancel} from "react-icons/md";
import {useDisclosure} from "@mantine/hooks";

interface GuestAtTableRowProps {
    guest: Guest;
    guests: Guest[];
    guestsAtTable: Guest[];
    setRemovingGuests: (guests: Guest[]) => void;
}

export const GuestAtTableRow = ({
                                    guest,
                                    guests,
                                    guestsAtTable,
                                    setRemovingGuests
                                }: GuestAtTableRowProps) => {
    const [opened, { close, open }] = useDisclosure(false);
    const [cancelOpened, { close: cancelClose, open: cancelOpen }] = useDisclosure(false);
    return (
        <div className={"flex justify-between align-center gap-6"}>
            <Text ta={"left"}>{guest.firstName} {guest.lastName}</Text>
            <div className={"max-w-32 sm:max-w-48"}>
                {guests.filter(g => g.guestId === guest.guestId).length === 0 ?
                    <Button
                        onClick={(event) => {
                            event.preventDefault();
                            setRemovingGuests(
                                guest.partyId && guest.partyId !== '' ?
                                    guestsAtTable.filter(g => g.partyId === guest.partyId) :
                                    [guest]
                            );
                        }}
                        size={"compact-md"}
                        color={"red"}
                        variant={"outline"}
                    >
                        <TiDeleteOutline/>
                    </Button> :
                    (guests.find(g => g.partyId === guest.partyId).guestId === guest.guestId ?
                            <ButtonGroup>
                                <Popover opened={opened}>
                                    <Popover.Target>
                                        <Button
                                            onMouseEnter={open}
                                            onMouseLeave={close}
                                            color={"green"}
                                            variant={"outline"}
                                        >
                                            <FaRegCheckCircle/>
                                        </Button>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Text>Confirm Removing Guest(s) From This Table</Text>
                                    </Popover.Dropdown>
                                </Popover>
                                <Popover opened={cancelOpened}>
                                    <Popover.Target>
                                        <Button
                                            onMouseEnter={cancelOpen}
                                            onMouseLeave={cancelClose}
                                            color={"red"}
                                            variant={"outline"}
                                            onClick={() => setRemovingGuests([])}
                                        >
                                            <MdOutlineCancel/>
                                        </Button>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Text>Cancel Removing Guest(s) From This Table</Text>
                                    </Popover.Dropdown>
                                </Popover>
                            </ButtonGroup> :
                            <Text size={"xs"} fw={"bold"} c={"red"} ta={"right"}>*This member of the party will be
                                removed
                                from the table too.</Text>
                    )
                }
            </div>
        </div>
    );
};