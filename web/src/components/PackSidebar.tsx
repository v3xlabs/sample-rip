import { Link } from '@tanstack/react-router';
import { MdAudiotrack } from 'react-icons/md';

import { PACKS } from '../config';
import { SAMPLES_BY_PACK } from '../config.gen';

export const PackSidebar = () => {
    return (
        <>
            <input
                type="checkbox"
                className="hidden peer"
                id="sidebar-toggle"
            />
            <div className="peer-checked:block hidden lg:block absolute lg:static w-full max-w-sm h-full border-r border-neutral-200 bg-neutral-50">
                <ul>
                    {Object.entries(PACKS).map(([packId, pack]) => {
                        // @ts-ignore
                        const samples = SAMPLES_BY_PACK[packId] as string[];

                        return (
                            <li key={packId} className="">
                                <Link
                                    to={'/pack/$packId'}
                                    params={{ packId }}
                                    className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2 hover:bg-neutral-100"
                                >
                                    {pack.cover && (
                                        <img
                                            src={pack.cover}
                                            className="w-10 h-10 rounded-sm "
                                            alt={pack.name}
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="font-semibold">
                                            {pack.name}
                                        </div>
                                        <div className="text-neutral-600">
                                            {pack.description}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-neutral-600">
                                        <span>{samples.length}</span>
                                        <MdAudiotrack />
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};
