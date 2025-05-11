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
    ah: {
        name: 'Albert Heijn',
        description: 'Albert Heijn Bits n Bobs',
        cover: '/pack_albert_heijn.png',
    },
    bop_it: {
        name: 'Bop It',
        description: 'Bop It Samples',
        cover: '/pack_bop_it_.png',
    },
    inside_job: {
        name: 'Inside Job',
        description: 'Inside Job Samples',
        cover: '/pack_ij.png',
    },
    rust: {
        name: 'Rust',
        description: 'Rust Samples',
        cover: '/pack_rust_.png',
    },
};
