import { Head, Link } from '@inertiajs/react';
import { BarChart3Icon, ShieldIcon } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { team as statisticsTeam } from '@/actions/App/Http/Controllers/Admin/StatisticsController';

type Props = {
    teams: any[];
};

export default function StatisticsIndex({ teams }: Props) {
    return (
        <>
            <Head title="Statistics" />
            <div className="space-y-6">
                <PageHeader
                    title="Statistics"
                    description="Season stats, top scorers, and disciplinary records."
                />

                {teams?.length > 0 ? (
                    <div>
                        <h2 className="mb-3 text-lg font-semibold tracking-tight">Select a team</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {teams.map((team: any) => (
                                <Link key={team.id} href={statisticsTeam.url(team.id)}>
                                    <Card className="transition-colors hover:bg-muted/50">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BarChart3Icon className="text-muted-foreground size-4" />
                                                {team.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2">
                                                {team.gender && (
                                                    <Badge variant="outline">{team.gender}</Badge>
                                                )}
                                                {team.age_group && (
                                                    <Badge variant="outline">{team.age_group}</Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        icon={ShieldIcon}
                        title="No teams yet"
                        description="Create teams first to view their statistics."
                        action={
                            <Link
                                href="/admin/teams/create"
                                className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                Create Team
                            </Link>
                        }
                    />
                )}
            </div>
        </>
    );
}

StatisticsIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
