import { Head, Link } from '@inertiajs/react';
import { ShieldIcon, UsersIcon, CalendarIcon } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { EmptyState } from '@/components/admin/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { show as teamShow } from '@/actions/App/Http/Controllers/Admin/TeamController';

type Props = {
    club: any;
    teams: any[];
    user: any;
};

export default function Dashboard({ club, teams, user }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <PageHeader
                    title="Dashboard"
                    description={`Welcome back${user?.name ? `, ${user.name}` : ''}. Manage your club, teams, and matches.`}
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard label="Teams" value={teams?.length ?? 0} icon={ShieldIcon} />
                    <StatCard label="Players" value="-" icon={UsersIcon} />
                    <StatCard label="Matches" value="-" icon={CalendarIcon} />
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-semibold tracking-tight">Teams</h2>
                    {teams?.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {teams.map((team: any) => (
                                <Link key={team.id} href={teamShow.url(team.id)}>
                                    <Card className="transition-colors hover:bg-muted/50">
                                        <CardHeader>
                                            <CardTitle>{team.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2">
                                                {team.short_name && (
                                                    <Badge variant="secondary">{team.short_name}</Badge>
                                                )}
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
                    ) : (
                        <EmptyState
                            icon={ShieldIcon}
                            title="No teams yet"
                            description="Create your first team to get started."
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
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
