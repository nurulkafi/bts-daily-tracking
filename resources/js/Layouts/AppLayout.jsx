import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, Skeleton, Badge, NavLink, Image, Text } from '@mantine/core';
import { IconHome2, IconGauge, IconChevronRight, IconActivity, IconCircleOff, IconNotes } from '@tabler/icons-react';
export default function AppLayout({ children }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Image
                    height={40}
                    width={40}
                    src="https://yt3.googleusercontent.com/v1N6ZLmSuhIzMDiRzu1fdgJP9Yhi1H687cyHOLEJ5OFFNGJzWeC6cxDWXp2bqOKlyiC0oEcIJg=s900-c-k-c0x00ffffff-no-rj"/>
                    <Text size="xl" weight={500}>
                        Man United
                    </Text>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <NavLink
                    href="#required-for-focus"
                    label="Dashboard"
                    leftSection={<IconHome2 size="1rem" stroke={1.5}
                    active />}
                />
                <NavLink
                    href="#required-for-focus"
                    label="Daily Plan"
                    leftSection={<IconNotes size="1rem" stroke={1.5}
                    active />}
                />
               <NavLink
                    href="#required-for-focus"
                    label="Daily Actual Output"
                    leftSection={<IconActivity size="1rem" stroke={1.5}
                    active />}
                />
            </AppShell.Navbar>
            <AppShell.Main>
                <div>{children}</div>
            </AppShell.Main>
        </AppShell>
    );
}
