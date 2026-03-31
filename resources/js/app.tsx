import { TooltipProvider } from '@/components/ui/tooltip';
import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Chukka Score';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#3b82f6',
    },
    setup({ App, props }) {
        return (
            <TooltipProvider delayDuration={300}>
                <App {...props} />
            </TooltipProvider>
        );
    },
});
