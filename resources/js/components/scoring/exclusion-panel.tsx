import { ExclusionTimer } from './exclusion-timer';

type Exclusion = {
    player_id: string;
    team_id: string;
    cap_number: number;
    display_seconds: number;
    exclusion_type: string;
};

type Props = {
    exclusions: Exclusion[];
    homeTeamId: string;
    sidesSwapped: boolean;
};

export function ExclusionPanel({ exclusions, homeTeamId, sidesSwapped }: Props) {
    const homeExclusions = exclusions.filter((e) => e.team_id === homeTeamId);
    const awayExclusions = exclusions.filter((e) => e.team_id !== homeTeamId);

    if (exclusions.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-card p-3 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Left side */}
            <div className="space-y-2">
                <div className="font-mono text-xs font-medium uppercase tracking-wide text-foreground">
                    {sidesSwapped ? 'Blue' : 'White'}
                </div>
                {(sidesSwapped ? awayExclusions : homeExclusions).length === 0 ? (
                    <div className="text-xs text-muted-foreground/50">None</div>
                ) : (
                    (sidesSwapped ? awayExclusions : homeExclusions).map((ex) => (
                        <ExclusionTimer
                            key={ex.player_id}
                            capNumber={ex.cap_number}
                            teamSide={sidesSwapped ? 'blue' : 'white'}
                            displaySeconds={ex.display_seconds}
                            exclusionType={ex.exclusion_type}
                        />
                    ))
                )}
            </div>

            {/* Right side */}
            <div className="space-y-2">
                <div className="font-mono text-xs font-medium uppercase tracking-wide text-foreground">
                    {sidesSwapped ? 'White' : 'Blue'}
                </div>
                {(sidesSwapped ? homeExclusions : awayExclusions).length === 0 ? (
                    <div className="text-xs text-muted-foreground/50">None</div>
                ) : (
                    (sidesSwapped ? homeExclusions : awayExclusions).map((ex) => (
                        <ExclusionTimer
                            key={ex.player_id}
                            capNumber={ex.cap_number}
                            teamSide={sidesSwapped ? 'white' : 'blue'}
                            displaySeconds={ex.display_seconds}
                            exclusionType={ex.exclusion_type}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
