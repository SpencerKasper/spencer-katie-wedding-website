'use client';
import {Group, Modal, TextInput, Button, NumberInput, InputLabel, Divider, Autocomplete} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useState} from "react";
import CityStateAndZipCodeInput from "@/app/guestlist/CityStateAndZipCodeInput";
import axios from "axios";

const AddGuestModal = ({guests, opened, onClose}) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            address: '',
            address2: '',
            city: '',
            state: '',
            zipCode: '',
            guestPartyMember: '',
        },
        validate: {
            emailAddress: (value) => (/^\S+@\S+$/.test(value) || value.trim() === '' ? null : 'Invalid email'),
            firstName: (value) => {
                const hasLastName = getValueFromForm('lastName').trim() !== '';
                const isNameInList = guests.filter(guest => `${guest.firstName} ${guest.lastName}` === `${value} ${getValueFromForm('lastName')}`).length;
                return hasLastName && isNameInList ? 'Guest with this first and last name is already in list.' : null;
            },
            lastName: (value) => {
                const hasFirstName = getValueFromForm('firstName').trim() !== '';
                const isNameInList = guests.filter(guest => `${guest.firstName} ${guest.lastName}` === `${getValueFromForm('firstName')} ${value}`).length;
                return hasFirstName && isNameInList ? 'Guest with this first and last name is already in list.' : null;
            },
        },
    });

    const getValueFromForm = (property: PropertyKey) => form.getValues() && form.getValues().hasOwnProperty(property) ? form.getValues()[property] : '';

    const guestNames = guests
        .map(guest => `${guest.firstName} ${guest.lastName}`);
    return (
        <Modal opened={opened} onClose={onClose} title="Add Guest" centered>
            <form onSubmit={form.onSubmit(async (guestToAdd) => {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`, guestToAdd);
                console.error(response);
                onClose();
            })}>
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
                    <p className={'text-md'}>Contact Info</p>
                    <TextInput
                        label={'Email Address'}
                        key={form.key('emailAddress')}
                        {...form.getInputProps('emailAddress')}
                    />
                    <NumberInput
                        type={'tel'}
                        label={'Phone Number'}
                        key={form.key('phoneNumber')}
                        {...form.getInputProps('phoneNumber')}
                    />
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

                    <CityStateAndZipCodeInput form={form}/>
                    <div className={'py-4'}>
                        <Divider/>
                    </div>
                    <div>
                        <p className={'text-md'}>Party</p>
                        <Autocomplete
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
                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </div>
            </form>
        </Modal>
    )
};

export default AddGuestModal;