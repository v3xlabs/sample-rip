// load all files in ../../samples/*
import { readdir, writeFile } from 'node:fs/promises';

export type Sample = {
    name: string;
    url: string;
};

const packs = await readdir('../samples');

const samples = packs.map(async (pack) => {
    const samples = await readdir('../samples/' + pack);

    console.log({ samples });

    return [pack, samples];
});

const sampleList: Record<string, Sample[]> = Object.fromEntries(
    await Promise.all(samples)
);

console.log(sampleList);

const prelude = 'export const SAMPLES_BY_PACK = ' + JSON.stringify(sampleList);

await writeFile('./src/config.gen.ts', prelude);
