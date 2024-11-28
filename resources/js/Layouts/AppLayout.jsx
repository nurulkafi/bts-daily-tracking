import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, NavLink, Image, Text } from '@mantine/core';
import { IconHome2, IconNotes, IconActivity } from '@tabler/icons-react';
import { Link, router } from '@inertiajs/react';

export default function AppLayout({ children }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: !opened }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" position="apart">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group spacing="xs" align="center">
            <Image
              height={40}
              width={40}
              src="https://yt3.googleusercontent.com/v1N6ZLmSuhIzMDiRzu1fdgJP9Yhi1H687cyHOLEJ5OFFNGJzWeC6cxDWXp2bqOKlyiC0oEcIJg=s900-c-k-c0x00ffffff-no-rj"
            />
            <Text size="xl" weight={500}>
              Build To Schedule MPI
            </Text>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavLink
          component={Link}
          href="/dashboard"
          label="Dashboard"
          leftSection={<IconHome2 size="1rem" stroke={1.5} />}
          active={location.pathname === '/dashboard'} // Active condition
        />
        <NavLink
          component={Link}
          href="/daily-plan"
          label="Daily Plan"
          leftSection={<IconNotes size="1rem" stroke={1.5} />}
          active={location.pathname === '/daily-plan'} // Active condition
        />
        <NavLink
          component={Link}
          href="/daily-actual-output"
          label="Daily Actual Output"
          leftSection={<IconActivity size="1rem" stroke={1.5} />}
          active={location.pathname === '/daily-actual-output'} // Active condition
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <div>{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
