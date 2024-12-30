import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
createInertiaApp({
    progress: {
        color: '#29d',
      },
    resolve: name => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
            >
            <Notifications />
                <App {...props} />
            </MantineProvider>
        );
    },
});

