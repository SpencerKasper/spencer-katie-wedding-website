import {FileInput, Modal, Button, Divider, Select} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";
import {useForm} from "@mantine/form";
import axios from "axios";
import {getGuestListEndpointUrl} from "@/app/util/api-util";
import useGuestList from "@/app/hooks/useGuestList";
import {Guest} from "@/types/guest";

const ImportGuestsModal = () => {
    const form = useForm();
    const [isOpen, {toggle}] = useDisclosure();
    const [fileContent, setFileContent] = useState([]);
    const {setGuests} = useGuestList();
    const firstFileContent = fileContent.slice(0, 1);
    const FIELDS = [{label: 'First Name', value: 'firstName'}, {label: 'Last Name', value: 'lastName'}];
    const onClose = () => {
        toggle();
        setFileContent([]);
        form.reset();
    };
    return (
        <>
            <Button variant={'outline'} onClick={toggle}>Import Guests</Button>
            <Modal opened={isOpen} onClose={onClose}>
                {firstFileContent.length > 0 ?
                    <div className={'flex flex-col gap-4 pb-4'}>
                        <div>
                            <p>Please tell us which columns correspond to which information so we import it
                                correctly.</p>
                        </div>
                        <div className={'flex flex-col gap-2 px-8'}>
                            <form onSubmit={form.onSubmit(async (columnMappings) => {
                                if (columnMappings.firstName && columnMappings.lastName) {
                                    const guests = fileContent
                                        .map(r => ({
                                            firstName: r[columnMappings.firstName],
                                            lastName: r[columnMappings.lastName]
                                        }))
                                        .filter(g => g.firstName && g.lastName && g.firstName !== '' && g.lastName !== '');
                                    const addUpdateGuestResponse = await axios.post(getGuestListEndpointUrl(), {guests});
                                    const updatedGuests: Guest[] = addUpdateGuestResponse.data.guests;
                                    setGuests(updatedGuests);
                                    onClose();
                                }
                            })}>
                                {FIELDS.map(key =>
                                    <div key={key.value} className={'flex justify-between'}>
                                        <p>{key.label}</p>
                                        <Select
                                            label={'Column'}
                                            placeholder={'Select a Column'}
                                            data={Object.keys(firstFileContent[0])}
                                            key={form.key(key.value)}
                                            {...form.getInputProps(key.value)}
                                        />
                                    </div>
                                )}
                                <div className={'py-4 flex justify-between'}>
                                    <div></div>
                                    <Button variant={'outline'} type={'submit'}>Submit</Button>
                                </div>
                            </form>
                        </div>
                    </div> :
                    <></>
                }
                <div className={'flex flex-col gap-4 pb-4'}>
                    {fileContent.length > 0 ? <p className={'text-xl'}>First Record In File</p> : <></>}
                    <div className={'px-8'}>
                        {firstFileContent.map((x, guestIndex) => (
                            <>
                                <div className={'flex flex-col gap-4'} key={`guest-${guestIndex}`}>
                                    {Object.keys(x).map((key, keyIndex) =>
                                        <div className={'flex justify-between'}
                                             key={`guest-${guestIndex}-key-${keyIndex}`}>
                                            <p className={'font-bold'}>{key}</p>
                                            <p>{x[key]}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ))}
                    </div>
                </div>
                <div>
                    <FileInput
                        label={'Upload .xlsx or .csv file'}
                        placeholder={'Select a File'}
                        onChange={(file) => {
                            console.error(file);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const text = event.target.result.toString();
                                console.log(text);
                                const lines = text.split('\n');
                                const headerLine = lines[0];
                                const columnNames = headerLine.split(',');
                                const columnsPerLine = lines.slice(1).map(line => line.split(','));
                                const csvAsJson = columnsPerLine.reduce((acc, curr, lineIndex) =>
                                    [
                                        ...acc,
                                        curr.reduce((lineAcc, currColumnValue, colIndex) => columnNames[colIndex] !== '' ?
                                            ({
                                                ...lineAcc,
                                                [columnNames[colIndex]]: currColumnValue
                                            }) :
                                            lineAcc, {}),
                                    ], []);
                                console.error(csvAsJson);
                                setFileContent(csvAsJson);
                            };
                            reader.readAsText(file);
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ImportGuestsModal;