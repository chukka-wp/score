import type { PropsWithChildren } from 'react';

type PageHeaderProps = PropsWithChildren<{
    title: string;
    description?: string;
}>;

export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
            </div>
            {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
        </div>
    );
}
