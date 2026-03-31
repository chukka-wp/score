import type { PropsWithChildren } from 'react';

export default function ScoringLayout({ children }: PropsWithChildren) {
    return (
        <div className="dark flex h-svh flex-col overflow-hidden bg-background text-foreground">
            {children}
        </div>
    );
}
