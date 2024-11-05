import {Badge, Card, Divider, Text} from "@mantine/core";

export function HotelImage({hotelName, imageUrl, linkUrl, notes, isVenue = false}) {
    return (
        <div className={'full-w max-w-xl text-center'}>
            <a
                target={"_blank"}
                // className={"underline"}
                href={linkUrl}>
                <Card shadow="sm" padding="lg" radius="md" withBorder className={'h-full flex align-center'}>
                    <Card.Section className={'min-h-48 lg:min-h-64 xl:min-h-72'}>
                        <img
                            alt={'hotel-image'}
                            width={"auto"}
                            height={"164px"}
                            src={imageUrl}
                        />
                    </Card.Section>
                    <div className={'py-1'}>
                        <Text className={'font-bold'} fw={500} size="lg" mt="md">
                            {hotelName}
                        </Text>
                    </div>
                    {notes && notes !== '' ?
                        <Text>
                            {notes}
                        </Text> :
                        <></>
                    }
                    {isVenue ?
                        <div>
                            <Badge>Wedding Venue</Badge>
                        </div> :
                        <></>
                    }
                </Card>
            </a>
        </div>
    );
}