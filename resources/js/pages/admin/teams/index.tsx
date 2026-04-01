import { Head, Link } from '@inertiajs/react';
import { PlusIcon, ShieldIcon } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { create as teamCreate, show as teamShow } from '@/actions/App/Http/Controllers/Admin/TeamController';

type Props = {
    teams: any[];
};

export default function TeamsIndex({ teams }: Props) {
    return (
        <>
            <Head title="Teams" />
            <div className="space-y-6">
                <PageHeader title="Teams" description="Manage your club's teams and rosters.">
                    <Button asChild>
                        <Link href={teamCreate.url()}>
                            <PlusIcon />
                            Create Team
                        </Link>
                    </Button>
                </PageHeader>

                {teams?.length > 0 ? (
                    <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Short Name</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Age Group</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teams.map((team: any) => (
                                <TableRow key={team.id}>
                                    <TableCell className="font-medium">{team.name}</TableCell>
                                    <TableCell>{team.short_name ?? '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{team.gender ?? '-'}</Badge>
                                    </TableCell>
                                    <TableCell>{team.age_group ?? '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={teamShow.url(team.id)}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                ) : (
                    <EmptyState
                        icon={ShieldIcon}
                        title="No teams yet"
                        description="Create your first team to get started with match management."
                        action={
                            <Button asChild>
                                <Link href={teamCreate.url()}>
                                    <PlusIcon />
                                    Create Team
                                </Link>
                            </Button>
                        }
                    />
                )}
            </div>
        </>
    );
}

TeamsIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
