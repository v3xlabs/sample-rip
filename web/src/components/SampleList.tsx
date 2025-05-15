// @ts-nocheck

import { FC } from 'react';

import { PACKS } from '../config';
import { SAMPLES_BY_PACK } from '../config.gen';
import { SampleTray } from './SampleTray';

export const SampleList: FC<{ pack: string }> = ({ pack }) => {
    // @ts-ignore
    const samples = SAMPLES_BY_PACK[pack] as string[];
    const packInfo = PACKS[pack];

    if (!samples) {
        return <>No samples sound for {pack}</>;
    }

    return (
        <div className="w-full rounded-lg bg-neutral-100 p-2">
            <h2 className="px-2 text-md font-bold pt-1">Samples</h2>
            <table className="min-w-full">
                <thead className="hidden md:table-header-group">
                    <tr>
                        <th className="px-2 text-left">Play</th>
                        <th className="px-2 text-left">Title</th>
                        <th className="px-2 text-left">Waveform</th>
                        <th className="px-2 text-left whitespace-nowrap">
                            Can I use plz?
                        </th>
                        <th className="px-2 text-left">Download</th>
                    </tr>
                </thead>
                <tbody>
                    {samples.map((sample) => (
                        <SampleTray
                            key={`${pack}-${sample}`}
                            sampleId={sample}
                            packId={pack}
                            license={packInfo.license}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
