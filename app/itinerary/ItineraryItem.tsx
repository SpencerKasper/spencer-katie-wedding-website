import {List} from "@mantine/core";

export const ItineraryItem = ({startTime, endTime, eventDescription, notes}) => {
    return (
        <div className={'flex flex-col w-full px-4 md:px-32'}>
            <div className={'flex justify-between py-4'}>
                <div style={{minWidth: '164px'}}><p className={'font-bold'}>{startTime} - {endTime}</p></div>
                <div className={'max-w-md'}><p className={'text-right'}>{eventDescription}</p></div>
            </div>
            <div className={'flex w-full justify-center'}>
                {notes && notes.length ?
                    <List>
                        {notes.map((note, index) =>
                            <List.Item key={`note-${index}`}>
                                <p className={'italic'}>{note}</p>
                            </List.Item>
                        )}
                    </List> :
                    <></>
                }
            </div>
        </div>
    )
}