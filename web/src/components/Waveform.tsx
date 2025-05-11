// @ts-nocheck
import React, { FC } from 'react';

interface WaveformProps {
    data: number[];
    height?: number;
    barWidth?: number;
}

const Waveform: FC<WaveformProps> = ({ data, height = 40, barWidth = 2 }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="flex items-end overflow-hidden" style={{ height }}>
            {data.map((value, idx) => (
                <div
                    key={idx}
                    className="bg-neutral-400"
                    style={{
                        width: barWidth,
                        height: `${value * height}px`,
                        marginRight: 1,
                    }}
                />
            ))}
        </div>
    );
};

export default Waveform; 