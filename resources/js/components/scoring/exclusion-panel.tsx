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
};

export function ExclusionPanel({ exclusions, homeTeamId }: Props) {
    const homeExclusions = exclusions.filter((e) => e.team_id === homeTeamId);
    const awayExclusions = exclusions.filter((e) => e.team_id !== homeTeamId);

    return (
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-card p-4">
            {/* White (home) exclusions */}
            <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    White
                </span>
                {homeExclusions.length === 0 ? (
                    <p className="text-xs text-muted-foreground/50">No exclusions</p>
                ) : (
                    homeExclusions.map((ex) => (
                        <ExclusionTimer
                            key={ex.player_id}
                            capNumber={ex.cap_number}
                            teamSide="white"
                            displaySeconds={ex.display_seconds}
                            exclusionType={ex.exclusion_type}
                        />
                    ))
                )}
            </div>

            {/* Blue (away) exclusions */}
            <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Blue
                </span>
                {awayExclusions.length === 0 ? (
                    <p className="text-xs text-muted-foreground/50">No exclusions</p>
                ) : (
                    awayExclusions.map((ex) => (
                        <ExclusionTimer
                            key={ex.player_id}
                            capNumber={ex.cap_number}
                            teamSide="blue"
                            displaySeconds={ex.display_seconds}
                            exclusionType={ex.exclusion_type}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
