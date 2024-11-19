import React from 'react';
import { Button, Text, Container } from '@mantine/core';
import AppLayout from '../Layouts/AppLayout';

export default function Home() {
    return (
        <AppLayout>
            <h1>Dashboard</h1>
            <p>This is the home page.</p>
        </AppLayout>
    );
}
