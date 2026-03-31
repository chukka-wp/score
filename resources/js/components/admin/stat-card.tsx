import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';

type StatCardProps = {
    label: string;
    value: string | number;
    icon?: LucideIcon;
};

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
    return (
        <Card className="flex items-center gap-4 p-4">
            {Icon && (
                <div className="bg-muted rounded-lg p-2.5">
                    <Icon className="text-muted-foreground size-5" />
                </div>
            )}
            <div>
                <p className="text-muted-foreground text-sm">{label}</p>
                <p className="text-2xl font-semibold tabular-nums">{value}</p>
            </div>
        </Card>
    );
}
