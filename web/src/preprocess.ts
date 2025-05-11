// @ts-nocheck
// load all files in ../../samples/*
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { spawn } from 'child_process';

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
        // Detect WAV header
        const head = (await readFile(filePath)).slice(0, 4).toString('ascii');
        let waveform: number[] = [];
        if (head === 'RIFF') {
            // WAV parsing fallback: existing code
            const buffer = await readFile(filePath);
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
                    waveform = [];
                    for (let b = 0; b < waveformPoints; b++) {
                        const start = dataOffset + b * samplesPerBucket * blockAlign;
                        let end = start + samplesPerBucket * blockAlign;
                        if (end > dataOffset + dataSize) end = dataOffset + dataSize;
                        let maxAmp = 0;
                        for (let pos = start; pos < end; pos += blockAlign) {
                            const sampleVal = buffer.readInt16LE(pos);
                            const absVal = Math.abs(sampleVal) / maxVal;
                            if (absVal > maxAmp) maxAmp = absVal;
                        }
                        waveform.push(maxAmp);
                    }
                    break;
                }
                offset += 8 + chunkSize;
            }
        } else {
            // MP3 support via ffmpeg
            try {
                const pcmBuffer: Buffer = await new Promise((resolve, reject) => {
                    const cp = spawn('ffmpeg', [
                        '-i', filePath,
                        '-f', 's16le',
                        '-acodec', 'pcm_s16le',
                        '-ac', '1',
                        '-'], { stdio: ['ignore', 'pipe', 'inherit'] });
                    const chunks: Buffer[] = [];
                    cp.stdout.on('data', (c: Buffer) => chunks.push(c));
                    cp.on('error', reject);
                    cp.on('close', (code) => code === 0 ? resolve(Buffer.concat(chunks)) : reject(new Error('ffmpeg exited ' + code)));
                });
                const bitsPerSample = 16;
                const blockAlign = bitsPerSample / 8;
                const sampleCount = Math.floor(pcmBuffer.length / blockAlign);
                const waveformPoints = 100;
                const samplesPerBucket = Math.floor(sampleCount / waveformPoints) || 1;
                const maxVal = Math.pow(2, bitsPerSample - 1) - 1;
                waveform = [];
                for (let b = 0; b < waveformPoints; b++) {
                    const start = b * samplesPerBucket * blockAlign;
                    const end = Math.min(pcmBuffer.length, start + samplesPerBucket * blockAlign);
                    let maxAmp = 0;
                    for (let pos = start; pos < end; pos += blockAlign) {
                        const sampleVal = pcmBuffer.readInt16LE(pos);
                        const absVal = Math.abs(sampleVal) / maxVal;
                        if (absVal > maxAmp) maxAmp = absVal;
                    }
                    waveform.push(maxAmp);
                }
            } catch (e) {
                console.warn(`Skipping waveform for ${filePath}: ${e}`);
                continue;
            }
        }
        const outFile = join(packOut, sampleFile + '.json');
        await writeFile(outFile, JSON.stringify(waveform));
    }
}
