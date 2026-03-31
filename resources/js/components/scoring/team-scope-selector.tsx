import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Props = {
    value: 'white' | 'blue' | null;
    onChange: (scope: 'white' | 'blue' | null) => void;
};

export function TeamScopeSelector({ value, onChange }: Props) {
    function handleChange(newValue: string): void {
        if (newValue === '') {
            onChange(null);

            return;
        }

        onChange(newValue as 'white' | 'blue');
    }

    return (
        <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Team Scope
            </span>

            <ToggleGroup
                type="single"
                value={value ?? ''}
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

                <ToggleGroupItem value="">
                    Both
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}
