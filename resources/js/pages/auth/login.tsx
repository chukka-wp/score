import { Head, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
    const form = useForm({
        email: '',
        password: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/login');
    }

    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-svh items-center justify-center p-4">
                <Card className="w-full max-w-sm space-y-6 p-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <img
                            src="/images/logo-icon-96.png"
                            alt="Chukka"
                            className="size-12"
                            width={96}
                            height={96}
                        />
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight">Chukka Score</h1>
                            <p className="text-muted-foreground text-sm">Sign in with your manager account</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                autoComplete="email"
                                autoFocus
                            />
                            {form.errors.email && (
                                <p className="text-destructive text-sm">{form.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                autoComplete="current-password"
                            />
                            {form.errors.password && (
                                <p className="text-destructive text-sm">{form.errors.password}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={form.processing}>
                            {form.processing ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </Card>
            </div>
        </>
    );
}
