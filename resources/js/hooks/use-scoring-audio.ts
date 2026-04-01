import { useCallback, useEffect, useRef } from 'react';

type SoundType =
    | 'event_accepted'
    | 'possession_expired'
    | 'period_expired'
    | 'exclusion_expired'
    | 'exclusion_warning';

const SOUNDS: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; ramp?: number; repeat?: number; gap?: number }> = {
    event_accepted: { frequency: 880, duration: 0.06, type: 'sine' },
    possession_expired: { frequency: 660, duration: 0.15, type: 'square', repeat: 2, gap: 0.1 },
    period_expired: { frequency: 440, duration: 0.3, type: 'square', repeat: 3, gap: 0.15 },
    exclusion_expired: { frequency: 520, duration: 0.12, type: 'sine', repeat: 2, gap: 0.08 },
    exclusion_warning: { frequency: 400, duration: 0.08, type: 'sine' },
};

export function useScoringAudio() {
    const ctxRef = useRef<AudioContext | null>(null);

    function getContext(): AudioContext {
        if (!ctxRef.current) {
            ctxRef.current = new AudioContext();
        }

        if (ctxRef.current.state === 'suspended') {
            ctxRef.current.resume();
        }

        return ctxRef.current;
    }

    const play = useCallback((sound: SoundType) => {
        const ctx = getContext();
        const config = SOUNDS[sound];
        const repeats = config.repeat ?? 1;
        const gap = config.gap ?? 0;

        for (let i = 0; i < repeats; i++) {
            const startTime = ctx.currentTime + i * (config.duration + gap);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = config.type;
            osc.frequency.value = config.frequency;

            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + config.duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + config.duration + 0.01);
        }
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            ctxRef.current?.close();
        };
    }, []);

    return play;
}
