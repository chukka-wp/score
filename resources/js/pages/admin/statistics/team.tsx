import { Head, Link } from '@inertiajs/react';
import { TrophyIcon, TargetIcon, ShieldAlertIcon, CalendarIcon } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { EmptyState } from '@/components/admin/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { index as statisticsIndex } from '@/actions/App/Http/Controllers/Admin/StatisticsController';
import { show as matchShow } from '@/actions/App/Http/Controllers/Admin/MatchController';
import { player as statisticsPlayer } from '@/actions/App/Http/Controllers/Admin/StatisticsController';

type Props = {
    team: any;
    stats: any;
    matches: any[];
};

export default function StatisticsTeam({ team, stats, matches }: Props) {
    return (
        <>
            <Head title={`${team?.name ?? 'Team'} Statistics`} />
            <div className="space-y-6">
                <PageHeader
                    title={`${team?.name ?? 'Team'} Statistics`}
                    description="Season overview and performance metrics."
                >
                    <Button variant="outline" asChild>
                        <Link href={statisticsIndex.url()}>All Teams</Link>
                    </Button>
                </PageHeader>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Wins" value={stats?.wins ?? 0} icon={TrophyIcon} />
                    <StatCard label="Losses" value={stats?.losses ?? 0} icon={ShieldAlertIcon} />
                    <StatCard label="Goals For" value={stats?.goals_for ?? 0} icon={TargetIcon} />
                    <StatCard label="Goals Against" value={stats?.goals_against ?? 0} icon={TargetIcon} />
                </div>

                {stats?.draws !== undefined && (
                    <div className="grid gap-4 sm:grid-cols-3">
                        <StatCard label="Draws" value={stats.draws} />
                        <StatCard label="Matches Played" value={stats.matches_played ?? 0} />
                        <StatCard
                            label="Goal Difference"
                            value={(stats.goals_for ?? 0) - (stats.goals_against ?? 0)}
                        />
                    </div>
                )}

                <div>
                    <h2 className="mb-3 text-lg font-semibold tracking-tight">Top Scorers</h2>
                    {stats?.top_scorers?.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Player</TableHead>
                                    <TableHead className="text-right">Goals</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.top_scorers.map((scorer: any, index: number) => (
                                    <TableRow key={scorer.player_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={statisticsPlayer.url(scorer.player_id)}
                                                className="hover:underline"
                                            >
                                                {scorer.player_name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {scorer.goals}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-sm">No scoring data available yet.</p>
                    )}
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-semibold tracking-tight">Recent Matches</h2>
                    {matches?.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Opponent</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matches.map((match: any) => (
                                    <TableRow key={match.match_id ?? match.id}>
                                        <TableCell>
                                            {match.scheduled_at
                                                ? new Date(match.scheduled_at).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {match.away_team_name ?? match.opponent ?? '-'}
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {match.home_score !== undefined
                                                ? `${match.home_score} - ${match.away_score}`
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{match.status ?? '-'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={matchShow.url(match.match_id ?? match.id)}>
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <EmptyState
                            icon={CalendarIcon}
                            title="No matches yet"
                            description="Match results will appear here once matches are completed."
                        />
                    )}
                </div>
            </div>
        </>
    );
}

StatisticsTeam.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
