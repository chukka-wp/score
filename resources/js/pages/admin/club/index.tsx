import { Head, Link, useForm, router } from '@inertiajs/react';
import { CopyIcon, PencilIcon, PlusIcon, BookOpenIcon } from 'lucide-react';

import { EmptyState } from '@/components/admin/empty-state';
import { FormField } from '@/components/admin/form/form-field';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { update as clubUpdate } from '@/actions/App/Http/Controllers/Admin/ClubController';
import { create as ruleSetCreate, show as ruleSetShow, clone as ruleSetClone } from '@/actions/App/Http/Controllers/Admin/RuleSetController';

type Props = {
    club: any;
    ruleSets: any[];
};

export default function ClubSettings({ club, ruleSets }: Props) {
    const form = useForm({
        name: club?.name ?? '',
        short_name: club?.short_name ?? '',
        primary_colour: club?.primary_colour ?? '#000000',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.put(clubUpdate.url());
    }

    function handleClone(ruleSetId: string) {
        router.post(ruleSetClone.url(ruleSetId));
    }

    return (
        <>
            <Head title="Club Settings" />
            <div className="space-y-6">
                <PageHeader
                    title="Club Settings"
                    description="Club profile, rule sets, and configuration."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Club Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FormField
                                label="Club Name"
                                name="name"
                                value={form.data.name}
                                onChange={(value) => form.setData('name', value)}
                                error={form.errors.name}
                                required
                            />
                            <FormField
                                label="Short Name"
                                name="short_name"
                                value={form.data.short_name}
                                onChange={(value) => form.setData('short_name', value)}
                                error={form.errors.short_name}
                            />
                            <div className="space-y-2">
                                <Label htmlFor="primary_colour">
                                    Primary Colour
                                </Label>
                                <div className="flex items-center gap-3">
                                    <input
                                        id="primary_colour"
                                        type="color"
                                        value={form.data.primary_colour}
                                        onChange={(e) => form.setData('primary_colour', e.target.value)}
                                        className="h-8 w-12 cursor-pointer rounded border border-border"
                                    />
                                    <span className="text-muted-foreground text-sm">
                                        {form.data.primary_colour}
                                    </span>
                                </div>
                                {form.errors.primary_colour && (
                                    <p className="text-destructive text-sm">{form.errors.primary_colour}</p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={form.processing}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Rule Sets</CardTitle>
                        <Button size="sm" asChild>
                            <Link href={ruleSetCreate.url()}>
                                <PlusIcon />
                                Create Rule Set
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {ruleSets?.length > 0 ? (
                            <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ruleSets.map((ruleSet: any) => (
                                        <TableRow key={ruleSet.id}>
                                            <TableCell className="font-medium">{ruleSet.name}</TableCell>
                                            <TableCell>
                                                {ruleSet.is_bundled ? (
                                                    <Badge variant="secondary">Bundled</Badge>
                                                ) : (
                                                    <Badge variant="outline">Custom</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={ruleSetShow.url(ruleSet.id)}>
                                                            <PencilIcon />
                                                            View
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleClone(ruleSet.id)}
                                                    >
                                                        <CopyIcon />
                                                        Clone
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </div>
                        ) : (
                            <EmptyState
                                icon={BookOpenIcon}
                                title="No rule sets"
                                description="Create a rule set to configure match parameters."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ClubSettings.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
