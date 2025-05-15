type Pack = {
    name: string;
    description: string;
    cover?: string;
    license?: string;
};

export const PACKS: Record<string, Pack> = {
    activate_windows: {
        name: 'Activate Windows',
        description: 'Your license has expired.',
        cover: '/pack_activate_windows.png',
        license: 'Yes, own risk.',
    },
    duitsland: {
        name: 'Duitsland',
        description: 'Manderscheid 2024 Samples',
        cover: '/pack_duitsland.png',
        license: 'Yes, i made dis, u can use',
    },
    ah: {
        name: 'Albert Heijn',
        description: 'Albert Heijn Bits n Bobs',
        cover: '/pack_albert_heijn.png',
        license: 'Yes, own risk.',
    },
    bop_it: {
        name: 'Bop It',
        description: 'Bop It Samples',
        cover: '/pack_bop_it_.png',
        license: 'Yes, own risk.',
    },
    inside_job: {
        name: 'Inside Job',
        description: 'Inside Job Samples',
        cover: '/pack_ij.png',
        license: 'Yes, own risk.',
    },
    rust: {
        name: 'Rust',
        description: 'Rust Samples',
        cover: '/pack_rust_.png',
        license: 'Yes, own risk.',
    },
};
