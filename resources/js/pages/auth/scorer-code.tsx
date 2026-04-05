import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function ScorerCode() {
    const form = useForm({
        code: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/score');
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
        form.setData('code', value);
    }

    return (
        <>
            <Head title="Enter Scorer Code" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Input
                            id="code"
                            type="text"
                            inputMode="text"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            value={form.data.code}
                            onChange={handleChange}
                            required
                            autoFocus
                            maxLength={6}
                            placeholder="abc123"
                            className="h-14 text-center font-mono text-2xl tracking-[0.3em] uppercase"
                        />
                        <InputError message={form.errors.code} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.processing || form.data.code.length !== 6}
                    >
                        {form.processing && <Spinner />}
                        Start Scoring
                    </Button>
                </div>
            </form>
        </>
    );
}

ScorerCode.layout = {
    title: 'Enter your scorer code',
    description: 'Enter the 6-character code shared by your match manager',
};
