import { Head, Link, useForm } from '@inertiajs/react';

import { PageHeader } from '@/components/admin/page-header';
import { FormField } from '@/components/admin/form/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { store as teamStore, index as teamIndex } from '@/actions/App/Http/Controllers/Admin/TeamController';

export default function TeamsCreate() {
    const form = useForm({
        name: '',
        short_name: '',
        gender: '',
        age_group: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(teamStore.url());
    }

    return (
        <>
            <Head title="Create Team" />
            <div className="space-y-6">
                <PageHeader title="Create Team" description="Add a new team to your club." />

                <Card>
                    <CardContent className="pt-2">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FormField
                                label="Team Name"
                                name="name"
                                value={form.data.name}
                                onChange={(value) => form.setData('name', value)}
                                error={form.errors.name}
                                placeholder="e.g. Senior Men"
                                required
                            />

                            <FormField
                                label="Short Name"
                                name="short_name"
                                value={form.data.short_name}
                                onChange={(value) => form.setData('short_name', value)}
                                error={form.errors.short_name}
                                placeholder="e.g. SM"
                            />

                            <div className="space-y-2">
                                <Label htmlFor="gender">
                                    Gender <span className="text-destructive ml-0.5">*</span>
                                </Label>
                                <Select
                                    value={form.data.gender}
                                    onValueChange={(value) => form.setData('gender', value)}
                                >
                                    <SelectTrigger className="w-full" id="gender">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="mixed">Mixed</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.gender && (
                                    <p className="text-destructive text-sm">{form.errors.gender}</p>
                                )}
                            </div>

                            <FormField
                                label="Age Group"
                                name="age_group"
                                value={form.data.age_group}
                                onChange={(value) => form.setData('age_group', value)}
                                error={form.errors.age_group}
                                placeholder="e.g. Open, U18, U16"
                            />

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button variant="outline" asChild>
                                    <Link href={teamIndex.url()}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    Create Team
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TeamsCreate.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
