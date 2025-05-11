// @ts-nocheck
// load all files in ../../samples/*
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

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

// Generate waveform data for each sample
const outBase = './public/waveforms';
await mkdir(outBase, { recursive: true });
for (const [pack, samples] of Object.entries(sampleList) as [string, string[]][]) {
    const packOut = join(outBase, pack);
    await mkdir(packOut, { recursive: true });
    for (const sampleFile of samples) {
        const filePath = resolve('../samples', pack, sampleFile);
        const buffer = await readFile(filePath);
        // parse WAV header and data
        let offset = 12;
        let numChannels = 1;
        let bitsPerSample = 16;
        while (offset < buffer.length) {
            const chunkId = buffer.toString('ascii', offset, offset + 4);
            const chunkSize = buffer.readUInt32LE(offset + 4);
            if (chunkId === 'fmt ') {
                numChannels = buffer.readUInt16LE(offset + 10);
                bitsPerSample = buffer.readUInt16LE(offset + 22);
            }
            if (chunkId === 'data') {
                const dataOffset = offset + 8;
                const dataSize = chunkSize;
                const blockAlign = numChannels * (bitsPerSample / 8);
                const sampleCount = Math.floor(dataSize / blockAlign);
                const waveformPoints = 100;
                const samplesPerBucket = Math.floor(sampleCount / waveformPoints) || 1;
                const maxVal = Math.pow(2, bitsPerSample - 1) - 1;
                const waveform: number[] = [];
                for (let b = 0; b < waveformPoints; b++) {
                    const start = dataOffset + b * samplesPerBucket * blockAlign;
                    let end = start + samplesPerBucket * blockAlign;
                    if (end > dataOffset + dataSize) end = dataOffset + dataSize;
                    let maxAmp = 0;
                    for (let pos = start; pos < end; pos += blockAlign) {
                        let sampleVal = 0;
                        if (bitsPerSample === 16) {
                            sampleVal = buffer.readInt16LE(pos);
                        } else if (bitsPerSample === 8) {
                            sampleVal = buffer.readUInt8(pos) - 128;
                        }
                        const absVal = Math.abs(sampleVal) / maxVal;
                        if (absVal > maxAmp) maxAmp = absVal;
                    }
                    waveform.push(maxAmp);
                }
                const outFile = join(packOut, sampleFile + '.json');
                await writeFile(outFile, JSON.stringify(waveform));
                break;
            }
            offset += 8 + chunkSize;
        }
    }
}
