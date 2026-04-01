import { cn } from '@/lib/utils';

type Props = {
    remaining: number;
    total: number;
};

export function TimeoutsIndicator({ remaining, total }: Props) {
    return (
        <div
            className="flex items-center gap-1"
            role="img"
            aria-label={`${remaining} of ${total} timeouts remaining`}
        >
            {Array.from({ length: total }, (_, i) => (
                <div
                    key={i}
                    className={cn(
                        'size-2 rounded-full',
                        i < remaining ? 'bg-foreground' : 'bg-muted',
                    )}
                />
            ))}
        </div>
    );
}
