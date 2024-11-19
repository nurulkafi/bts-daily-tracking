import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
createInertiaApp({
    resolve: name => import(`./Pages/${name}.jsx`),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
            >
                <App {...props} />
            </MantineProvider>
        );
    },
});
