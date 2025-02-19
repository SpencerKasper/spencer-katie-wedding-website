import {Badge, Card, Divider, Text} from "@mantine/core";

export function ListItemCard({title, imageUrl, linkUrl, notes, tags = [], isVenue = false}) {
    return (
        <div className={'max-w-xl text-center'}>
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
                            {title}
                        </Text>
                    </div>
                    {notes && notes !== '' ?
                        <Text>
                            {notes}
                        </Text> :
                        <></>
                    }
                    {tags && tags.length ?
                        <div className={'flex justify-center gap-x-4 pt-8'}>
                            {tags.map(tag => (<Badge color={tag.color} key={`tag-${tag.name}`}>{tag.name}</Badge>))}
                        </div> :
                        <></>
                    }
                </Card>
            </a>
        </div>
    );
}