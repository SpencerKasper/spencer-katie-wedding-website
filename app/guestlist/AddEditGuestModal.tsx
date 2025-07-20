'use client';
import {Autocomplete, Button, Divider, Group, List, Modal, NumberInput, Select, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";
import CityStateAndZipCodeInput from "@/app/guestlist/CityStateAndZipCodeInput";
import axios from "axios";
import {Guest} from "@/types/guest";
import useGuestList from "@/app/hooks/useGuestList";
import useTables from "@/app/hooks/useTables";
import {getGuestListBffEndpointUrl} from "@/app/util/api-util";

interface AddEditGuestModalProps {
    opened: boolean;
    onClose: () => void;
    selectedGuest?: Guest;
    setSelectedGuest: (guest: Guest) => void;
}

const AddEditGuestModal = ({
                               opened,
                               onClose,
                               selectedGuest = null,
                               setSelectedGuest
                           }: AddEditGuestModalProps) => {
    const {guests, setGuests, getGuestsAtTable} = useGuestList();
    const {tables, getGuestsTable, setTables} = useTables({fetchTablesOnInit: true});
    const guestsTable = getGuestsTable(selectedGuest);
    const [guestsAtTable, setGuestsAtTable] = useState(getGuestsAtTable(guestsTable));
    const [zipCode, setZipCode] = useState(selectedGuest ? selectedGuest.zipCode : '');
    const getGuestPartyMember = (initialGuest: Guest) => {
        const foundGuest = guests.find(guest => guest.guestId !== initialGuest.guestId && guest.partyId === initialGuest.partyId);
        return foundGuest ? `${foundGuest.firstName} ${foundGuest.lastName}` : '';
    };
    const getSelectedGuestsPartyMember = () => selectedGuest && selectedGuest.partyId && selectedGuest.partyId !== '' ?
        getGuestPartyMember(selectedGuest) :
        '';

    const atLeastOneUniqueFieldRequired = () => {
        const hasFirstName = getValueFromForm('firstName').trim() !== '';
        const hasLastName = getValueFromForm('lastName').trim() !== '';
        const isNameInList = guests.filter(guest => `${guest.firstName} ${guest.lastName}` === `${getValueFromForm('firstName')} ${getValueFromForm('lastName')}`).length;
        return hasFirstName && hasLastName && isNameInList;
    };

    const validateEmail = (value) => {
        const isValidEmailFormat = /^\S+@\S+$/.test(value);
        const trimmedEmailFormValue = value.trim();
        if(isValidEmailFormat || trimmedEmailFormValue === '') {
            return null
        }
        if(!isValidEmailFormat) {
            return 'Invalid email format.';
        }
        return trimmedEmailFormValue === '' ? 'Another guest with this first and last name exists. Email address is required to differentiate.' : null;
    };
    const form = useForm({
        mode: 'uncontrolled',
        // @ts-ignore
        initialValues: {
            firstName: selectedGuest ? selectedGuest.firstName : '',
            lastName: selectedGuest ? selectedGuest.lastName : '',
            emailAddress: selectedGuest ? selectedGuest.emailAddress : '',
            phoneNumber: selectedGuest ? selectedGuest.phoneNumber : '',
            address: selectedGuest ? selectedGuest.address : '',
            address2: selectedGuest ? selectedGuest.address2 : '',
            city: selectedGuest ? selectedGuest.city : '',
            state: selectedGuest ? selectedGuest.state : '',
            zipCode: selectedGuest ? selectedGuest.zipCode : '',
            guestPartyMember: getSelectedGuestsPartyMember(),
            tableId: guestsTable ? guestsTable.tableId : null,
        },
        // @ts-ignore
        validate: {
            emailAddress: validateEmail,
        },
        onValuesChange: (values, previous) => {
            if (values.tableId !== previous.tableId) {
                const table = tables.find(t => t.tableId === values.tableId);
                setGuestsAtTable(getGuestsAtTable(table));
            }
        }
    });

    useEffect(() => {
        if (selectedGuest && opened) {
            setGuestsAtTable(getGuestsAtTable(getGuestsTable(selectedGuest)));
            setZipCode(selectedGuest.zipCode);
            form.setValues({
                ...selectedGuest,
                guestPartyMember: getSelectedGuestsPartyMember()
            });
        }
    }, [selectedGuest, guests, opened]);

    useEffect(() => {
        form.setValues((prev) => ({
            ...prev,
            tableId: guestsTable ? guestsTable.tableId : null,
        }));
    }, [guestsTable]);

    const getValueFromForm = (property: PropertyKey) => form.getValues() && form.getValues().hasOwnProperty(property) ? form.getValues()[property] : '';

    const guestNames = Array.from(new Set(guests
        .map(guest => `${guest.firstName} ${guest.lastName}`)));

    function resetModal() {
        form.reset();
        setSelectedGuest(null);
        setZipCode('');
        onClose();
    }

    const tableOptions = tables.map(t => ({label: `${t.tableNumber}`, value: t.tableId}));
    return (
        <Modal opened={opened} onClose={() => resetModal()} title={
            <div className={'flex flex-col gap-4'}>
                <h2 className={'font-bold'}>{selectedGuest ? `Edit Guest` : "Add Guest"}</h2>
                {selectedGuest ? <p className={'text-sm'}>Guest Id: {selectedGuest.guestId}</p> : <></>}
            </div>} centered>
            <form
                onSubmit={form.onSubmit(async (guestToAdd) => {
                    const tableToAddTo = tables.find(t => t.tableId === guestToAdd.tableId);
                    const response = await axios.post(getGuestListBffEndpointUrl(), {
                        guest: guestToAdd,
                        tableId: tableToAddTo ? tableToAddTo.tableId : '',
                    });
                    setGuests(response.data.guests);
                    setTables(response.data.tables);
                    resetModal();
                })}
            >
                <div className={'flex flex-col gap-4'}>
                    <p className={'text-md'}>Name</p>
                    <TextInput
                        required
                        label={'First Name'}
                        key={form.key('firstName')}
                        {...form.getInputProps('firstName')}
                    />
                    <TextInput
                        required
                        label={'Last Name'}
                        key={form.key('lastName')}
                        {...form.getInputProps('lastName')}
                    />
                    <div className={'py-4'}>
                        <Divider/>
                    </div>
                    <div>
                        <p className={'text-md'}>Party</p>
                        <Autocomplete
                            onOptionSubmit={(value) => {
                                const guest = guests.find(g => `${g.firstName} ${g.lastName}` === value);
                                setZipCode(guest.zipCode);
                                form.setValues((prev) => ({
                                    ...prev,
                                    address: guest.address,
                                    address2: guest.address2,
                                    city: guest.city,
                                    state: guest.state,
                                    zipCode: guest.zipCode,
                                }));
                            }}
                            className={'pt-4'}
                            label={`Guest's Party`}
                            placeholder={`Select a Member of This Guest's Party`}
                            data={guestNames}
                            key={form.key('guestPartyMember')}
                            {...form.getInputProps('guestPartyMember')}
                        />
                    </div>
                    <div className={'py-4'}>
                        <Divider/>
                    </div>
                    <p className={'text-md'}>Address</p>
                    <TextInput
                        label={'Address'}
                        key={form.key('address')}
                        {...form.getInputProps('address')}
                    />
                    <TextInput
                        label={'Address 2 (Apt, Ste, etc)'}
                        key={form.key('address2')}
                        {...form.getInputProps('address2')}
                    />
                    <CityStateAndZipCodeInput
                        zipCode={zipCode}
                        setZipCode={setZipCode}
                        form={form}
                    />
                    <div className={'py-4'}>
                        <Divider/>
                    </div>
                    <p className={'text-md'}>Table</p>
                    <Select
                        placeholder={'Select a Table'}
                        data={tableOptions}
                        key={form.key('tableId')}
                        {...form.getInputProps('tableId')}
                    />
                    {guestsAtTable.length ?
                        <div>
                            <p className={'text-md'}>People at Table</p>
                            <List>
                                {guestsAtTable
                                    .map((g, index) => (
                                        <List.Item
                                            key={`guest-at-table-${index}`}
                                            className={'text-sm'}
                                        >
                                            {`- ${g.firstName} ${g.lastName}`}
                                        </List.Item>
                                    ))
                                }
                            </List>
                        </div> :
                        <></>
                    }
                    <div className={'py-4'}>
                        <Divider/>
                    </div>
                    <p className={'text-md'}>Contact Info</p>
                    <TextInput
                        label={'Email Address'}
                        key={form.key('emailAddress')}
                        {...form.getInputProps('emailAddress')}
                    />
                    <NumberInput
                        hideControls
                        type={'tel'}
                        label={'Phone Number'}
                        key={form.key('phoneNumber')}
                        {...form.getInputProps('phoneNumber')}
                    />
                    <div className={'py-4'}>
                        <Divider/>
                    </div>
                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Save</Button>
                    </Group>
                </div>
            </form>
        </Modal>
    )
};

export default AddEditGuestModal;