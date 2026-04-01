import { Head, Link } from '@inertiajs/react';
import { PlusIcon, UsersIcon } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { create as playerCreate, show as playerShow } from '@/actions/App/Http/Controllers/Admin/PlayerController';

type Props = {
    players: any[];
};

export default function PlayersIndex({ players }: Props) {
    return (
        <>
            <Head title="Players" />
            <div className="space-y-6">
                <PageHeader title="Players" description="View and manage all players across your club.">
                    <Button asChild>
                        <Link href={playerCreate.url()}>
                            <PlusIcon />
                            Add Player
                        </Link>
                    </Button>
                </PageHeader>

                {players?.length > 0 ? (
                    <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Preferred Cap #</TableHead>
                                <TableHead>Goalkeeper</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.map((player: any) => (
                                <TableRow key={player.id}>
                                    <TableCell className="font-medium">
                                        {player.preferred_name ?? player.name}
                                    </TableCell>
                                    <TableCell>{player.preferred_cap_number ?? '-'}</TableCell>
                                    <TableCell>
                                        {player.is_goalkeeper ? (
                                            <Badge variant="secondary">GK</Badge>
                                        ) : null}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={playerShow.url(player.id)}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                ) : (
                    <EmptyState
                        icon={UsersIcon}
                        title="No players yet"
                        description="Add players to your club roster."
                        action={
                            <Button asChild>
                                <Link href={playerCreate.url()}>
                                    <PlusIcon />
                                    Add Player
                                </Link>
                            </Button>
                        }
                    />
                )}
            </div>
        </>
    );
}

PlayersIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
