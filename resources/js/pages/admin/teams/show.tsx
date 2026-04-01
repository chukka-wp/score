import { Head, Link } from '@inertiajs/react';
import { BarChart3Icon, CalendarIcon, PlusIcon, ShieldIcon, TargetIcon, UsersIcon } from 'lucide-react';

import { EmptyState } from '@/components/admin/empty-state';
import { MatchStatusBadge } from '@/components/admin/match-status-badge';
import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { index as teamIndex } from '@/actions/App/Http/Controllers/Admin/TeamController';
import { create as matchCreate, show as matchShow } from '@/actions/App/Http/Controllers/Admin/MatchController';
import { show as playerShow } from '@/actions/App/Http/Controllers/Admin/PlayerController';

type Props = {
    team: any;
    roster: any[];
    matches: any[];
    stats: any;
};

export default function TeamsShow({ team, roster, matches, stats }: Props) {
    return (
        <>
            <Head title={team?.name ?? 'Team'} />
            <div className="space-y-6">
                <PageHeader
                    title={team?.name ?? 'Team'}
                    description={[team?.gender, team?.age_group].filter(Boolean).join(' / ') || undefined}
                >
                    <Button variant="outline" asChild>
                        <Link href={teamIndex.url()}>Back to Teams</Link>
                    </Button>
                </PageHeader>

                <Tabs defaultValue="roster">
                    <TabsList>
                        <TabsTrigger value="roster">Roster</TabsTrigger>
                        <TabsTrigger value="matches">Matches</TabsTrigger>
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                    </TabsList>

                    <TabsContent value="roster" className="space-y-4">
                        {roster?.length > 0 ? (
                            <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cap #</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Starting</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roster.map((entry: any) => (
                                        <TableRow key={entry.player_id ?? entry.id}>
                                            <TableCell className="font-mono">{entry.cap_number ?? '-'}</TableCell>
                                            <TableCell className="font-medium">
                                                {entry.player?.preferred_name ?? entry.player?.name ?? 'Unknown'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {entry.role === 'goalkeeper'
                                                        ? 'GK'
                                                        : entry.role === 'substitute_goalkeeper'
                                                          ? 'Sub GK'
                                                          : 'Field'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {entry.is_starting ? (
                                                    <Badge variant="secondary">Starting</Badge>
                                                ) : null}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {entry.player_id && (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={playerShow.url(entry.player_id)}>
                                                            View Player
                                                        </Link>
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </div>
                        ) : (
                            <EmptyState
                                icon={UsersIcon}
                                title="No roster entries"
                                description="Players will appear here once they are assigned to this team."
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="matches" className="space-y-4">
                        <div className="flex justify-end">
                            <Button asChild>
                                <Link href={matchCreate.url(team?.id)}>
                                    <PlusIcon />
                                    Create Match
                                </Link>
                            </Button>
                        </div>
                        {matches?.length > 0 ? (
                            <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Opponent</TableHead>
                                        <TableHead>Venue</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {matches.map((match: any) => (
                                        <TableRow key={match.id}>
                                            <TableCell>
                                                {match.scheduled_at
                                                    ? new Date(match.scheduled_at).toLocaleDateString()
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {match.opponent ?? match.away_team_name ?? '-'}
                                            </TableCell>
                                            <TableCell>{match.venue ?? '-'}</TableCell>
                                            <TableCell>
                                                <MatchStatusBadge status={match.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={matchShow.url(match.id)}>View</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </div>
                        ) : (
                            <EmptyState
                                icon={CalendarIcon}
                                title="No matches yet"
                                description="Schedule a match for this team."
                                action={
                                    <Button asChild>
                                        <Link href={matchCreate.url(team?.id)}>
                                            <PlusIcon />
                                            Create Match
                                        </Link>
                                    </Button>
                                }
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-4">
                        {stats ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard label="Matches Played" value={stats.matches_played ?? 0} icon={CalendarIcon} />
                                <StatCard label="Wins" value={stats.wins ?? 0} icon={ShieldIcon} />
                                <StatCard label="Goals For" value={stats.goals_for ?? 0} icon={TargetIcon} />
                                <StatCard label="Goals Against" value={stats.goals_against ?? 0} icon={BarChart3Icon} />
                            </div>
                        ) : (
                            <EmptyState
                                icon={UsersIcon}
                                title="No stats available"
                                description="Statistics will appear here after matches are completed."
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

TeamsShow.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
