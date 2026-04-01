import type { PropsWithChildren } from 'react';

import { useAppearance } from '@/hooks/use-appearance';

export default function ScoringLayout({ children }: PropsWithChildren) {
    const [appearance] = useAppearance();

    return (
        <div className={`${appearance === 'dark' ? 'dark' : ''} isolate flex h-svh flex-col overflow-hidden bg-background text-foreground`}>
            {children}
        </div>
    );
}
