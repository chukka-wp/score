import { Head, Link } from '@inertiajs/react';
import { TargetIcon, ShieldAlertIcon, AlertTriangleIcon, CreditCardIcon } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { index as statisticsIndex } from '@/actions/App/Http/Controllers/Admin/StatisticsController';

type Props = {
    player: any;
    stats: any;
};

export default function StatisticsPlayer({ player, stats }: Props) {
    return (
        <>
            <Head title={`${player?.name ?? 'Player'} Statistics`} />
            <div className="space-y-6">
                <PageHeader
                    title={`${player?.name ?? 'Player'} Statistics`}
                    description={player?.preferred_name ? `Also known as ${player.preferred_name}` : undefined}
                >
                    <Button variant="outline" asChild>
                        <Link href={statisticsIndex.url()}>Back to Statistics</Link>
                    </Button>
                </PageHeader>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Goals" value={stats?.goals ?? 0} icon={TargetIcon} />
                    <StatCard label="Exclusions" value={stats?.exclusions ?? 0} icon={ShieldAlertIcon} />
                    <StatCard label="Personal Fouls" value={stats?.personal_fouls ?? 0} icon={AlertTriangleIcon} />
                    <StatCard label="Cards" value={(stats?.yellow_cards ?? 0) + (stats?.red_cards ?? 0)} icon={CreditCardIcon} />
                </div>

                {stats && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Penalty Goals" value={stats?.penalty_goals ?? 0} />
                        <StatCard label="Penalty Attempts" value={stats?.penalty_attempts ?? 0} />
                        <StatCard label="Yellow Cards" value={stats?.yellow_cards ?? 0} />
                        <StatCard label="Red Cards" value={stats?.red_cards ?? 0} />
                    </div>
                )}

                {!stats && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                        <p className="text-sm font-medium">No statistics available</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Statistics will appear here after this player participates in matches.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

StatisticsPlayer.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
