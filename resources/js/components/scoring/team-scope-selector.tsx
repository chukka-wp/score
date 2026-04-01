import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Props = {
    value: 'white' | 'blue' | null;
    onChange: (scope: 'white' | 'blue' | null) => void;
};

export function TeamScopeSelector({ value, onChange }: Props) {
    function handleChange(newValue: string): void {
        // ToggleGroup sends empty string when deselecting — treat as "both"
        const resolved = newValue || 'both';

        onChange(resolved === 'both' ? null : (resolved as 'white' | 'blue'));
    }

    return (
        <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Team Scope
            </span>

            <ToggleGroup
                type="single"
                value={value ?? 'both'}
                onValueChange={handleChange}
                variant="outline"
            >
                <ToggleGroupItem
                    value="white"
                    className={cn(
                        value === 'white' && 'bg-team-white text-team-white-foreground',
                    )}
                >
                    White
                </ToggleGroupItem>

                <ToggleGroupItem
                    value="blue"
                    className={cn(
                        value === 'blue' && 'bg-team-blue text-team-blue-foreground',
                    )}
                >
                    Blue
                </ToggleGroupItem>

                <ToggleGroupItem value="both">
                    Both
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}
