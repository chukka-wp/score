import { Badge } from '@/components/ui/badge';

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    scheduled: 'outline',
    in_progress: 'default',
    completed: 'secondary',
    abandoned: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
    abandoned: 'Abandoned',
};

export function MatchStatusBadge({ status }: { status: string }) {
    return (
        <Badge variant={STATUS_VARIANTS[status] ?? 'outline'}>
            {STATUS_LABELS[status] ?? status}
        </Badge>
    );
}
