import { FC } from 'react';
import { FaPlay } from 'react-icons/fa';

export const SampleTray: FC<{ sample: string }> = ({ sample }) => {
    return (
        <li className="flex items-center gap-2 p-2 border-b border-neutral-200 hover:bg-neutral-300/10">
            <div className="w-10 h-10 rounded-sm bg-neutral-200 flex items-center justify-center text-neutral-500">
                <FaPlay />
            </div>
            <div>
                <h3 className="text-base">{sample}</h3>
            </div>
        </li>
    );
};
