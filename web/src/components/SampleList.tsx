import { FC } from 'react';

import { SAMPLES_BY_PACK } from '../config.gen';
import { SampleTray } from './SampleTray';

export const SampleList: FC<{ pack: string }> = ({ pack }) => {
    // @ts-ignore
    const samples = SAMPLES_BY_PACK[pack] as string[];

    if (!samples) {
        return <>No samples sound for {pack}</>;
    }

    return (
        <div className="w-full rounded-lg bg-neutral-100 p-2">
            <h2 className="px-2 text-md font-bold pt-1">Samples</h2>
            <ul>
                {samples?.map((sample, index) => (
                    <SampleTray key={index} sample={sample} />
                ))}
            </ul>
        </div>
    );
};
