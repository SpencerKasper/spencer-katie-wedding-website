'use client'
import {Group, Card, Image, Text, Badge, Button} from "@mantine/core";

const RegistryLinkCard = ({registry}) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className={'flex flex-col justify-end'}>
            <Card.Section className={'h-200 p-8'}>
                <Image
                    src={registry.logo}
                    height={160}
                    alt={registry.name}
                />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{registry.name}</Text>
            </Group>

            <Text size="sm" c="dimmed">
                {registry.description}
            </Text>

            <a href={registry.url} target={'_blank'}>
                <Button color="blue" fullWidth mt="md" radius="md">
                    Go To {registry.name}
                </Button>
            </a>
        </Card>
    );
}

export default function RegistryPage() {
    const AMAZON_REGISTRY_URL = 'https://www.amazon.com/wedding/registry/3IXT40ZFWDF58';
    const CRATE_AND_BARREL_REGISTRY_URL = 'https://www.crateandbarrel.com/gift-registry/spencer-kasper-and-katie-riek/r7201289';
    const HONEY_FUND_URL = 'https://www.honeyfund.com/site/kasper-riek-10-11-2025';
    const REGISTRIES = [
        {
            name: 'Amazon Registry',
            url: AMAZON_REGISTRY_URL,
            logo: 'https://assets.aboutamazon.com/2e/d7/ac71f1f344c39f8949f48fc89e71/amazon-logo-squid-ink-smile-orange.png',
            description: 'This is our Amazon registry for miscellaneous household items!'
        },
        {
            name: 'Crate & Barrel Registry',
            url: CRATE_AND_BARREL_REGISTRY_URL,
            logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/CrateandBarrelLogo.svg',
            description: 'This is our Crate & Barrel registry for mostly kitchen items!'
        },
        {
            name: 'Future House Fund',
            url: HONEY_FUND_URL,
            logo: 'https://vectorseek.com/wp-content/uploads/2023/11/Honeyfund-Logo-Vector.svg-.png',
            description: 'This is where you can contribute money towards our future house!'
        }
    ]
    return (
        <div className={'flex justify-center align-center'}>
            <div className={'grid grid-cols-1 sm:grid-cols-3 gap-8 p-8'}>
                {REGISTRIES.map((registry, index) => {
                    return (
                        <RegistryLinkCard
                            key={`registry-link-card-${index}`}
                            registry={registry}
                        />
                    )
                })}
            </div>
            {/*<iframe*/}
            {/*    className={'w-full md:w-9/12 h-dvh'}*/}
            {/*    src={'https://www.honeyfund.com/site/kasper-riek-10-11-2025?no_gdpr=1'}*/}
            {/*/>*/}
        </div>
    )
}