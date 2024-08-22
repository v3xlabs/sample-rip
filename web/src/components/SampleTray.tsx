import { FC } from 'react';
import { FaDownload, FaPlay } from 'react-icons/fa';

export const SampleTray: FC<{ packId: string; sampleId: string }> = ({
    packId,
    sampleId,
}) => {
    return (
        <li className="flex items-center gap-2 p-2 border-b border-neutral-200 hover:bg-neutral-300/10">
            <div className="w-10 h-10 rounded-sm bg-neutral-200 flex items-center justify-center text-neutral-500">
                <FaPlay />
            </div>
            <div className="flex-1">
                <h3 className="text-base">{sampleId}</h3>
            </div>
            <div>
                <a
                    href={`https://github.com/v3xlabs/sample-rip/raw/master/samples/${packId}/${sampleId}`}
                    target="_blank"
                    className="btn !py-2 flex"
                >
                    <FaDownload />
                </a>
            </div>
        </li>
    );
};
