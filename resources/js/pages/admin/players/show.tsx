import { Head, Link } from '@inertiajs/react';
import { UsersIcon } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { StatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { index as playerIndex } from '@/actions/App/Http/Controllers/Admin/PlayerController';

type Props = {
    player: any;
    stats: any;
};

export default function PlayersShow({ player, stats }: Props) {
    return (
        <>
            <Head title={player?.name ?? 'Player'} />
            <div className="space-y-6">
                <PageHeader title={player?.name ?? 'Player'}>
                    <Button variant="outline" asChild>
                        <Link href={playerIndex.url()}>Back to Players</Link>
                    </Button>
                </PageHeader>

                <Card>
                    <CardHeader>
                        <CardTitle>Player Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <dt className="text-muted-foreground text-sm">Full Name</dt>
                                <dd className="font-medium">{player?.name ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Preferred Name</dt>
                                <dd className="font-medium">{player?.preferred_name ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Preferred Cap #</dt>
                                <dd className="font-mono font-medium">
                                    {player?.preferred_cap_number ?? '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-sm">Position</dt>
                                <dd>
                                    {player?.is_goalkeeper ? (
                                        <Badge variant="secondary">Goalkeeper</Badge>
                                    ) : (
                                        <Badge variant="outline">Field Player</Badge>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <div>
                    <h2 className="mb-3 text-lg font-semibold tracking-tight">Statistics</h2>
                    {stats?.player_stats?.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Match</TableHead>
                                    <TableHead>Goals</TableHead>
                                    <TableHead>Exclusions</TableHead>
                                    <TableHead>Personal Fouls</TableHead>
                                    <TableHead>Cards</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.player_stats.map((matchStat: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {matchStat.match_label ?? `Match ${index + 1}`}
                                        </TableCell>
                                        <TableCell>{matchStat.goals ?? 0}</TableCell>
                                        <TableCell>{matchStat.exclusions ?? 0}</TableCell>
                                        <TableCell>{matchStat.personal_fouls ?? 0}</TableCell>
                                        <TableCell>
                                            {(matchStat.yellow_cards ?? 0) + (matchStat.red_cards ?? 0)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <EmptyState
                            icon={UsersIcon}
                            title="No statistics available"
                            description="Player statistics will appear here after they participate in matches."
                        />
                    )}
                </div>
            </div>
        </>
    );
}

PlayersShow.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
