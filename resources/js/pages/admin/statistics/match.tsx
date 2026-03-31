import { Head, Link } from '@inertiajs/react';
import { BarChart3Icon } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { EmptyState } from '@/components/admin/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { index as statisticsIndex, player as statisticsPlayer } from '@/actions/App/Http/Controllers/Admin/StatisticsController';

type Props = {
    match: any;
    stats: any;
};

function TeamStatsTable({ teamStats, label }: { teamStats: any; label: string }) {
    if (!teamStats?.player_stats?.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{label}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">No player statistics recorded.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border p-3">
                        <p className="text-muted-foreground text-xs">Goals</p>
                        <p className="text-lg font-semibold">{teamStats.goals_scored ?? 0}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-muted-foreground text-xs">Exclusions</p>
                        <p className="text-lg font-semibold">{teamStats.total_exclusions ?? 0}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-muted-foreground text-xs">Fouls</p>
                        <p className="text-lg font-semibold">{teamStats.total_personal_fouls ?? 0}</p>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cap #</TableHead>
                            <TableHead>Player</TableHead>
                            <TableHead className="text-right">Goals</TableHead>
                            <TableHead className="text-right">Excl.</TableHead>
                            <TableHead className="text-right">Fouls</TableHead>
                            <TableHead className="text-right">Cards</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamStats.player_stats.map((ps: any) => (
                            <TableRow key={ps.player_id}>
                                <TableCell className="font-mono">{ps.cap_number ?? '-'}</TableCell>
                                <TableCell className="font-medium">
                                    <Link
                                        href={statisticsPlayer.url(ps.player_id)}
                                        className="hover:underline"
                                    >
                                        {ps.player_name}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right">{ps.goals ?? 0}</TableCell>
                                <TableCell className="text-right">{ps.exclusions ?? 0}</TableCell>
                                <TableCell className="text-right">{ps.personal_fouls ?? 0}</TableCell>
                                <TableCell className="text-right">
                                    {(ps.yellow_cards ?? 0) + (ps.red_cards ?? 0)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function StatisticsMatch({ match, stats }: Props) {
    const homeScore = match?.home_score ?? stats?.home?.goals_scored ?? '-';
    const awayScore = match?.away_score ?? stats?.away?.goals_scored ?? '-';

    return (
        <>
            <Head title="Match Statistics" />
            <div className="space-y-6">
                <PageHeader title="Match Statistics" description={match?.venue ?? undefined}>
                    <Button variant="outline" asChild>
                        <Link href={statisticsIndex.url()}>Back to Statistics</Link>
                    </Button>
                </PageHeader>

                <Card>
                    <CardContent className="py-6">
                        <div className="flex items-center justify-center gap-6 text-center">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    {match?.home_team_name ?? 'Home'}
                                </p>
                                <p className="text-4xl font-bold tabular-nums">{homeScore}</p>
                            </div>
                            <span className="text-muted-foreground text-2xl">-</span>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    {match?.away_team_name ?? 'Away'}
                                </p>
                                <p className="text-4xl font-bold tabular-nums">{awayScore}</p>
                            </div>
                        </div>
                        {match?.scheduled_at && (
                            <p className="text-muted-foreground mt-2 text-center text-sm">
                                {new Date(match.scheduled_at).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {stats ? (
                    <div className="space-y-6">
                        <TeamStatsTable
                            teamStats={stats.home}
                            label={match?.home_team_name ?? 'Home Team'}
                        />
                        <TeamStatsTable
                            teamStats={stats.away}
                            label={match?.away_team_name ?? 'Away Team'}
                        />
                    </div>
                ) : (
                    <EmptyState
                        icon={BarChart3Icon}
                        title="No statistics available"
                        description="Match statistics will appear here once the match has been played."
                    />
                )}
            </div>
        </>
    );
}

StatisticsMatch.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
