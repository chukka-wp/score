import { Head, Link, useForm } from '@inertiajs/react';

import { PageHeader } from '@/components/admin/page-header';
import { FormField } from '@/components/admin/form/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { store as ruleSetStore, update as ruleSetUpdate } from '@/actions/App/Http/Controllers/Admin/RuleSetController';
import { show as clubShow } from '@/actions/App/Http/Controllers/Admin/ClubController';

type Props = {
    ruleSet?: any;
};

export default function RuleSetEdit({ ruleSet }: Props) {
    const isEditing = !!ruleSet;

    const form = useForm({
        name: ruleSet?.name ?? '',
        periods: String(ruleSet?.periods ?? 4),
        period_duration_seconds: String(ruleSet?.period_duration_seconds ?? 480),
        running_time: ruleSet?.running_time ?? false,
        interval_duration_seconds: String(ruleSet?.interval_duration_seconds ?? 120),
        halftime_duration_seconds: String(ruleSet?.halftime_duration_seconds ?? 300),
        possession_clock_enabled: ruleSet?.possession_clock_enabled ?? true,
        possession_time_seconds: String(ruleSet?.possession_time_seconds ?? 30),
        second_possession_time_seconds: String(ruleSet?.second_possession_time_seconds ?? 20),
        exclusion_duration_seconds: String(ruleSet?.exclusion_duration_seconds ?? 20),
        violent_action_exclusion_duration_seconds: String(
            ruleSet?.violent_action_exclusion_duration_seconds ?? 240,
        ),
        personal_foul_limit: String(ruleSet?.personal_foul_limit ?? 3),
        foul_limit_enforced: ruleSet?.foul_limit_enforced ?? true,
        timeouts_per_team: String(ruleSet?.timeouts_per_team ?? 2),
        timeout_duration_seconds: String(ruleSet?.timeout_duration_seconds ?? 60),
        players_per_team: String(ruleSet?.players_per_team ?? 13),
        max_players_in_water: String(ruleSet?.max_players_in_water ?? 7),
        max_goalkeepers: String(ruleSet?.max_goalkeepers ?? 2),
        cap_number_scheme: ruleSet?.cap_number_scheme ?? 'sequential',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            form.put(ruleSetUpdate.url(ruleSet.id));
        } else {
            form.post(ruleSetStore.url());
        }
    }

    return (
        <>
            <Head title={isEditing ? 'Edit Rule Set' : 'Create Rule Set'} />
            <div className="space-y-6">
                <PageHeader
                    title={isEditing ? 'Edit Rule Set' : 'Create Rule Set'}
                    description={
                        isEditing
                            ? 'Modify the rules for this match configuration.'
                            : 'Define a new set of match rules.'
                    }
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                label="Name"
                                name="name"
                                value={form.data.name}
                                onChange={(value) => form.setData('name', value)}
                                error={form.errors.name}
                                placeholder="e.g. FINA 2025"
                                required
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Timing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                label="Periods"
                                name="periods"
                                value={form.data.periods}
                                onChange={(value) => form.setData('periods', value)}
                                error={form.errors.periods}
                                type="number"
                            />
                            <FormField
                                label="Period Duration (seconds)"
                                name="period_duration_seconds"
                                value={form.data.period_duration_seconds}
                                onChange={(value) => form.setData('period_duration_seconds', value)}
                                error={form.errors.period_duration_seconds}
                                type="number"
                            />
                            <div className="flex items-center justify-between">
                                <Label htmlFor="running_time">Running Time</Label>
                                <Switch
                                    id="running_time"
                                    checked={form.data.running_time}
                                    onCheckedChange={(checked) => form.setData('running_time', checked)}
                                />
                            </div>
                            <FormField
                                label="Interval Duration (seconds)"
                                name="interval_duration_seconds"
                                value={form.data.interval_duration_seconds}
                                onChange={(value) => form.setData('interval_duration_seconds', value)}
                                error={form.errors.interval_duration_seconds}
                                type="number"
                            />
                            <FormField
                                label="Halftime Duration (seconds)"
                                name="halftime_duration_seconds"
                                value={form.data.halftime_duration_seconds}
                                onChange={(value) => form.setData('halftime_duration_seconds', value)}
                                error={form.errors.halftime_duration_seconds}
                                type="number"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Possession</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="possession_clock_enabled">Possession Clock Enabled</Label>
                                <Switch
                                    id="possession_clock_enabled"
                                    checked={form.data.possession_clock_enabled}
                                    onCheckedChange={(checked) =>
                                        form.setData('possession_clock_enabled', checked)
                                    }
                                />
                            </div>
                            <FormField
                                label="Possession Time (seconds)"
                                name="possession_time_seconds"
                                value={form.data.possession_time_seconds}
                                onChange={(value) => form.setData('possession_time_seconds', value)}
                                error={form.errors.possession_time_seconds}
                                type="number"
                                disabled={!form.data.possession_clock_enabled}
                            />
                            <FormField
                                label="Second Possession Time (seconds)"
                                name="second_possession_time_seconds"
                                value={form.data.second_possession_time_seconds}
                                onChange={(value) =>
                                    form.setData('second_possession_time_seconds', value)
                                }
                                error={form.errors.second_possession_time_seconds}
                                type="number"
                                disabled={!form.data.possession_clock_enabled}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Exclusions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                label="Exclusion Duration (seconds)"
                                name="exclusion_duration_seconds"
                                value={form.data.exclusion_duration_seconds}
                                onChange={(value) => form.setData('exclusion_duration_seconds', value)}
                                error={form.errors.exclusion_duration_seconds}
                                type="number"
                            />
                            <FormField
                                label="Violent Action Exclusion Duration (seconds)"
                                name="violent_action_exclusion_duration_seconds"
                                value={form.data.violent_action_exclusion_duration_seconds}
                                onChange={(value) =>
                                    form.setData('violent_action_exclusion_duration_seconds', value)
                                }
                                error={form.errors.violent_action_exclusion_duration_seconds}
                                type="number"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fouls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                label="Personal Foul Limit"
                                name="personal_foul_limit"
                                value={form.data.personal_foul_limit}
                                onChange={(value) => form.setData('personal_foul_limit', value)}
                                error={form.errors.personal_foul_limit}
                                type="number"
                            />
                            <div className="flex items-center justify-between">
                                <Label htmlFor="foul_limit_enforced">Foul Limit Enforced</Label>
                                <Switch
                                    id="foul_limit_enforced"
                                    checked={form.data.foul_limit_enforced}
                                    onCheckedChange={(checked) =>
                                        form.setData('foul_limit_enforced', checked)
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Timeouts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                label="Timeouts Per Team"
                                name="timeouts_per_team"
                                value={form.data.timeouts_per_team}
                                onChange={(value) => form.setData('timeouts_per_team', value)}
                                error={form.errors.timeouts_per_team}
                                type="number"
                            />
                            <FormField
                                label="Timeout Duration (seconds)"
                                name="timeout_duration_seconds"
                                value={form.data.timeout_duration_seconds}
                                onChange={(value) => form.setData('timeout_duration_seconds', value)}
                                error={form.errors.timeout_duration_seconds}
                                type="number"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Players</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                label="Players Per Team"
                                name="players_per_team"
                                value={form.data.players_per_team}
                                onChange={(value) => form.setData('players_per_team', value)}
                                error={form.errors.players_per_team}
                                type="number"
                            />
                            <FormField
                                label="Max Players in Water"
                                name="max_players_in_water"
                                value={form.data.max_players_in_water}
                                onChange={(value) => form.setData('max_players_in_water', value)}
                                error={form.errors.max_players_in_water}
                                type="number"
                            />
                            <FormField
                                label="Max Goalkeepers"
                                name="max_goalkeepers"
                                value={form.data.max_goalkeepers}
                                onChange={(value) => form.setData('max_goalkeepers', value)}
                                error={form.errors.max_goalkeepers}
                                type="number"
                            />
                            <div className="space-y-2">
                                <Label htmlFor="cap_number_scheme">Cap Number Scheme</Label>
                                <Select
                                    value={form.data.cap_number_scheme}
                                    onValueChange={(value) => form.setData('cap_number_scheme', value)}
                                >
                                    <SelectTrigger className="w-full" id="cap_number_scheme">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sequential">Sequential</SelectItem>
                                        <SelectItem value="open">Open</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.cap_number_scheme && (
                                    <p className="text-destructive text-sm">
                                        {form.errors.cap_number_scheme}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Button variant="outline" asChild>
                            <Link href={clubShow.url()}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {isEditing ? 'Save Changes' : 'Create Rule Set'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RuleSetEdit.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
