import { useCallback, useEffect, useState } from 'react';

type Appearance = 'light' | 'dark';

const STORAGE_KEY = 'chukka-appearance';
const DEFAULT: Appearance = 'dark';

function applyAppearance(mode: Appearance): void {
    document.documentElement.classList.toggle('dark', mode === 'dark');
}

function getStored(): Appearance {
    if (typeof window === 'undefined') {
        return DEFAULT;
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    return stored === 'light' || stored === 'dark' ? stored : DEFAULT;
}

export function useAppearance(): [Appearance, (mode: Appearance) => void] {
    const [appearance, setAppearanceState] = useState<Appearance>(getStored);

    const setAppearance = useCallback((mode: Appearance) => {
        setAppearanceState(mode);
        localStorage.setItem(STORAGE_KEY, mode);
        applyAppearance(mode);
    }, []);

    useEffect(() => {
        applyAppearance(appearance);
    }, []);

    return [appearance, setAppearance];
}
