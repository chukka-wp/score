import type { EventType } from './events';

export type TeamSide = 'white' | 'blue';

export type SyncStatus = 'online' | 'syncing' | 'offline';

export type ReverbConfig = {
    key: string;
    host: string;
    port: number;
    scheme: 'wss' | 'ws';
};

export type EventEntryStep = 'idle' | 'type_selected' | 'awaiting_cap' | 'awaiting_team' | 'awaiting_outcome' | 'awaiting_confirm';

export type EventEntryState = {
    step: EventEntryStep;
    eventType: EventType | null;
    capNumber: string;
    team: TeamSide | null;
    outcome: string | null;
    playerPreview: string | null;
};

export type ScorerSession = {
    token: string;
    matchId: string;
    teamScope: TeamSide | null;
    scorerName: string | null;
};
