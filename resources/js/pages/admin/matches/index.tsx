import { Head, Link } from '@inertiajs/react';
import { CalendarIcon, PlusIcon } from 'lucide-react';

import { EmptyState } from '@/components/admin/empty-state';
import { MatchStatusBadge } from '@/components/admin/match-status-badge';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { create as matchCreate, show as matchShow } from '@/actions/App/Http/Controllers/Admin/MatchController';

type Props = {
    team: any;
    matches: any[];
};

export default function MatchesIndex({ team, matches }: Props) {
    return (
        <>
            <Head title={`Matches - ${team?.name ?? 'Team'}`} />
            <div className="space-y-6">
                <PageHeader
                    title="Matches"
                    description={`Match schedule for ${team?.name ?? 'this team'}.`}
                >
                    <Button asChild>
                        <Link href={matchCreate.url(team?.id)}>
                            <PlusIcon />
                            Create Match
                        </Link>
                    </Button>
                </PageHeader>

                {matches?.length > 0 ? (
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
            </div>
        </>
    );
}

MatchesIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
