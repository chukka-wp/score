import { Head, Link, useForm } from '@inertiajs/react';

import { PageHeader } from '@/components/admin/page-header';
import { FormField } from '@/components/admin/form/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { store as playerStore, index as playerIndex } from '@/actions/App/Http/Controllers/Admin/PlayerController';

type Props = {
    teams: any[];
};

export default function PlayersCreate({ teams }: Props) {
    const form = useForm({
        name: '',
        preferred_name: '',
        preferred_cap_number: '',
        is_goalkeeper: false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(playerStore.url());
    }

    return (
        <>
            <Head title="Add Player" />
            <div className="space-y-6">
                <PageHeader title="Add Player" description="Add a new player to your club." />

                <Card>
                    <CardContent className="pt-2">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FormField
                                label="Full Name"
                                name="name"
                                value={form.data.name}
                                onChange={(value) => form.setData('name', value)}
                                error={form.errors.name}
                                placeholder="e.g. John Smith"
                                required
                            />

                            <FormField
                                label="Preferred Name"
                                name="preferred_name"
                                value={form.data.preferred_name}
                                onChange={(value) => form.setData('preferred_name', value)}
                                error={form.errors.preferred_name}
                                placeholder="e.g. Johnny"
                            />

                            <FormField
                                label="Preferred Cap Number"
                                name="preferred_cap_number"
                                value={form.data.preferred_cap_number}
                                onChange={(value) => form.setData('preferred_cap_number', value)}
                                error={form.errors.preferred_cap_number}
                                type="number"
                                placeholder="e.g. 7"
                            />

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_goalkeeper"
                                    checked={form.data.is_goalkeeper}
                                    onCheckedChange={(checked) =>
                                        form.setData('is_goalkeeper', checked === true)
                                    }
                                />
                                <Label htmlFor="is_goalkeeper">Goalkeeper</Label>
                            </div>
                            {form.errors.is_goalkeeper && (
                                <p className="text-destructive text-sm">{form.errors.is_goalkeeper}</p>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button variant="outline" asChild>
                                    <Link href={playerIndex.url()}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    Add Player
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PlayersCreate.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
