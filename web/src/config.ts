type Pack = {
    name: string;
    description: string;
    cover?: string;
};

export const PACKS: Record<string, Pack> = {
    activate_windows: {
        name: 'Activate Windows',
        description: 'Your license has expired.',
        cover: '/pack_activate_windows.png',
    },
    duitsland: {
        name: 'Duitsland',
        description: 'Manderscheid 2024 Samples',
        cover: '/pack_duitsland.png',
    },
};
