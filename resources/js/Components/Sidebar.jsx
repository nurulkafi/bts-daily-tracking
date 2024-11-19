import React from 'react';
// import { NavLink } from '@inertiajs/react';
import { Text } from '@mantine/core';

export default function Sidebar() {
    const links = [
        { label: 'Dashboard', href: '/' },
        { label: 'Profile', href: '/profile' },
        { label: 'Settings', href: '/settings' },
    ];

    return (
        <Text size="xl" weight={700} mb="md">
        My App
    </Text>
    );
}
