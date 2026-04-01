import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function AuthLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh">
            {/* Photo panel — hidden on mobile */}
            <div className="relative hidden w-1/2 lg:block">
                <picture>
                    <source srcSet="/images/auth-bg.webp" type="image/webp" />
                    <img
                        src="/images/auth-bg.jpg"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
                <div className="absolute bottom-0 left-0 p-10">
                    <img
                        src="/images/logo-dark-400.png"
                        alt="Chukka"
                        className="h-12 w-auto"
                    />
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                        Live water polo scoring, broadcasting, and match management for clubs.
                    </p>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex w-full flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 lg:w-1/2">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href="/"
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <img
                                    src="/images/logo-icon-96.png"
                                    alt="Chukka"
                                    className="h-16 w-auto"
                                    width={96}
                                    height={96}
                                />
                                <span className="sr-only">Chukka</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-center text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
