'use client';
import {Autocomplete, Button, Divider, Group, List, Modal, NumberInput, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";
import CityStateAndZipCodeInput from "@/app/guestlist/CityStateAndZipCodeInput";
import axios from "axios";
import {Guest} from "@/types/guest";

interface AddEditGuestModalProps {
    guests: Guest[];
    setGuests: (guests: Guest[]) => void;
    opened: boolean;
    onClose: () => void;
    selectedGuest?: Guest;
    setSelectedGuest: (guest: Guest) => void;
}

const AddEditGuestModal = ({
                               guests,
                               setGuests,
                               opened,
                               onClose,
                               selectedGuest = null,
                               setSelectedGuest
                           }: AddEditGuestModalProps) => {
    const [zipCode, setZipCode] = useState(selectedGuest ? selectedGuest.zipCode : '');
    const getGuestPartyMember = (initialGuest: Guest) => {
        const foundGuest = guests.find(guest => guest.guestId !== initialGuest.guestId && guest.partyId === initialGuest.partyId);
        return foundGuest ? `${foundGuest.firstName} ${foundGuest.lastName}` : '';
    };
    const getSelectedGuestsPartyMember = () => selectedGuest && selectedGuest.partyId && selectedGuest.partyId !== '' ?
        getGuestPartyMember(selectedGuest) :
        '';
    const form = useForm({
        mode: 'uncontrolled',
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
            tableNumber: 1,
        },
        validate: {
            emailAddress: (value) => (/^\S+@\S+$/.test(value) || value.trim() === '' ? null : 'Invalid email'),
            firstName: (value) => {
                const hasLastName = getValueFromForm('lastName').trim() !== '';
                const isNameInList = guests.filter(guest => `${guest.firstName} ${guest.lastName}` === `${value} ${getValueFromForm('lastName')}`).length;
                return hasLastName && isNameInList && !selectedGuest ? 'Guest with this first and last name is already in list.' : null;
            },
            lastName: (value) => {
                const hasFirstName = getValueFromForm('firstName').trim() !== '';
                const isNameInList = guests.filter(guest => `${guest.firstName} ${guest.lastName}` === `${getValueFromForm('firstName')} ${value}`).length;
                return hasFirstName && isNameInList && !selectedGuest ? 'Guest with this first and last name is already in list.' : null;
            },
            tableNumber: (value) => {
                return isNaN(value) || value <= 0 ? 'Table number must be at least 1' : null;
            }
        },
    });

    useEffect(() => {
        if (selectedGuest && opened) {
            setZipCode(selectedGuest.zipCode);
            form.setValues({
                ...selectedGuest,
                guestPartyMember: getSelectedGuestsPartyMember()
            });
        }
    }, [selectedGuest, guests, opened]);

    const getValueFromForm = (property: PropertyKey) => form.getValues() && form.getValues().hasOwnProperty(property) ? form.getValues()[property] : '';

    const guestNames = guests
        .map(guest => `${guest.firstName} ${guest.lastName}`);

    function resetModal() {
        form.reset();
        setSelectedGuest(null);
        setZipCode('');
        onClose();
    }

    const guestsAtTable = guests
        .filter(g => g.tableNumber === form.getValues().tableNumber);
    return (
        <Modal opened={opened} onClose={() => resetModal()} title="Add Guest" centered>
            <form
                onSubmit={form.onSubmit(async (guestToAdd) => {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`, guestToAdd);
                    setGuests(response.data.guests);
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
                    {form.getValues() && form.getValues().tableNumber && guestsAtTable.length ?
                        <div>
                            <p className={'text-sm'}>People at Table</p>
                            <List>
                                {guestsAtTable
                                    .map((g, index) => (
                                        <List.Item key={`guest-at-table-${index}`}>{`- ${g.firstName} ${g.lastName}`}</List.Item>))
                                }
                            </List>
                        </div> :
                        <></>
                    }
                    <NumberInput
                        label={'Table Number'}
                        placeholder={'Enter a Table Number'}
                        key={form.key('tableNumber')}
                        {...form.getInputProps('tableNumber')}
                    />
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