import { createReadStream, statSync } from 'node:fs';
import { extname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

const SAMPLES_DIR = fileURLToPath(new URL('../samples', import.meta.url));

const MIME_TYPES: Record<string, string> = {
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
};

const byteRange = (header: string | undefined, size: number) => {
    const match = /^bytes=(\d*)-(\d*)$/.exec(header ?? '');

    if (!match) return;

    if (!match[1]) return { start: size - Number(match[2]), end: size - 1 };

    return {
        start: Number(match[1]),
        end: match[2] ? Math.min(Number(match[2]), size - 1) : size - 1,
    };
};

// The app reads samples from GitHub in production; dev serves the working tree so unpushed samples play.
const serveSamples = (): Plugin => ({
    name: 'serve-samples',
    apply: 'serve',
    configureServer(server) {
        server.middlewares.use('/samples', (request, response, next) => {
            const file = join(
                SAMPLES_DIR,
                decodeURIComponent((request.url ?? '').split('?')[0])
            );
            const stats = statSync(file, { throwIfNoEntry: false });

            if (!file.startsWith(SAMPLES_DIR + sep) || !stats?.isFile())
                return next();

            const range = byteRange(request.headers.range, stats.size);
            const { start, end } = range ?? { start: 0, end: stats.size - 1 };

            response.writeHead(range ? 206 : 200, {
                'Accept-Ranges': 'bytes',
                'Content-Length': end - start + 1,
                'Content-Type':
                    MIME_TYPES[extname(file)] ?? 'application/octet-stream',
                ...(range && {
                    'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                }),
            });
            createReadStream(file, { start, end }).pipe(response);
        });
    },
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [TanStackRouterVite(), react(), serveSamples()],
});
