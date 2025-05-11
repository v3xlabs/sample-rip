// @ts-nocheck
import React, { FC } from 'react';

interface WaveformProperties {
    data: number[];
    progress?: number;
    height?: number;
    barWidth?: number;
}

const Waveform: FC<WaveformProperties> = ({
    data,
    height = 40,
    barWidth = 2,
    progress = 0,
}) => {
    if (!data || data.length === 0) return null;

    const total = data.length;
    const playedBars = Math.floor(progress * total);

    return (
        <div className="flex items-end overflow-hidden" style={{ height }}>
            {data.map((value, index) => {
                let colorClass = 'bg-neutral-400';

                if (index < playedBars) {
                    colorClass = 'bg-neutral-800';
                } else if (index === playedBars) {
                    colorClass = 'bg-blue-500';
                }

                return (
                    <div
                        key={index}
                        className={colorClass}
                        style={{
                            width: barWidth,
                            height: `${value * height}px`,
                            marginRight: 1,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Waveform;
