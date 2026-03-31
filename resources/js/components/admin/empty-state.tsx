import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            {Icon && (
                <div className="bg-muted mb-4 rounded-full p-3">
                    <Icon className="text-muted-foreground size-6" />
                </div>
            )}
            <h3 className="text-sm font-medium">{title}</h3>
            {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
