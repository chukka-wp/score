import { Head, Link, useForm } from '@inertiajs/react';

import { PageHeader } from '@/components/admin/page-header';
import { FormField } from '@/components/admin/form/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { store as matchStore, update as matchUpdate } from '@/actions/App/Http/Controllers/Admin/MatchController';
import { show as teamShow } from '@/actions/App/Http/Controllers/Admin/TeamController';

type Props = {
    match?: any;
    team?: any;
    roster?: any[];
    ruleSets?: any[];
};

export default function MatchSetup({ match, team, roster, ruleSets }: Props) {
    const isEditing = !!match;

    const form = useForm({
        scheduled_at: match?.scheduled_at ?? '',
        venue: match?.venue ?? '',
        rule_set_id: match?.rule_set_id ?? '',
        home_team_id: match?.home_team_id ?? team?.id ?? '',
        away_team_id: match?.away_team_id ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            form.put(matchUpdate.url(match.id));
        } else {
            form.post(matchStore.url());
        }
    }

    const cancelHref = team ? teamShow.url(team.id) : '/admin/teams';

    return (
        <>
            <Head title={isEditing ? 'Edit Match' : 'Match Setup'} />
            <div className="space-y-6">
                <PageHeader
                    title={isEditing ? 'Edit Match' : 'Match Setup'}
                    description={
                        isEditing
                            ? 'Modify match details and roster.'
                            : `Schedule a new match${team ? ` for ${team.name}` : ''}.`
                    }
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Match Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                label="Scheduled At"
                                name="scheduled_at"
                                value={form.data.scheduled_at}
                                onChange={(value) => form.setData('scheduled_at', value)}
                                error={form.errors.scheduled_at}
                                type="datetime-local"
                                required
                            />

                            <FormField
                                label="Venue"
                                name="venue"
                                value={form.data.venue}
                                onChange={(value) => form.setData('venue', value)}
                                error={form.errors.venue}
                                placeholder="e.g. Olympic Aquatic Centre"
                            />

                            <div className="space-y-2">
                                <Label htmlFor="rule_set_id">
                                    Rule Set <span className="text-destructive ml-0.5">*</span>
                                </Label>
                                <Select
                                    value={form.data.rule_set_id}
                                    onValueChange={(value) => form.setData('rule_set_id', value)}
                                >
                                    <SelectTrigger className="w-full" id="rule_set_id">
                                        <SelectValue placeholder="Select a rule set" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ruleSets?.map((rs: any) => (
                                            <SelectItem key={rs.id} value={rs.id}>
                                                {rs.name}
                                                {rs.is_bundled ? ' (Bundled)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.rule_set_id && (
                                    <p className="text-destructive text-sm">{form.errors.rule_set_id}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {roster && roster.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Roster</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Cap #</TableHead>
                                            <TableHead>Player</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Starting</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {roster.map((entry: any) => (
                                            <TableRow key={entry.player_id ?? entry.id}>
                                                <TableCell className="font-mono">
                                                    {entry.cap_number ?? '-'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {entry.player?.preferred_name ??
                                                        entry.player?.name ??
                                                        'Unknown'}
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
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex items-center justify-end gap-3">
                        <Button variant="outline" asChild>
                            <Link href={cancelHref}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {isEditing ? 'Save Changes' : 'Create Match'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

MatchSetup.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
