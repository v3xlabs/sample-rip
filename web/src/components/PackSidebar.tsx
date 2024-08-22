import { Link } from '@tanstack/react-router';

import { PACKS } from '../config';

export const PackSidebar = () => {
    return (
        <div className="w-full max-w-sm h-full border-r border-neutral-200 bg-neutral-50">
            <ul>
                {Object.entries(PACKS).map(([packId, pack]) => (
                    <li key={packId} className="">
                        <Link
                            href={'/pack/$packId'}
                            params={{ packId }}
                            className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2 hover:bg-neutral-100"
                        >
                            {pack.cover && (
                                <img
                                    src={pack.cover}
                                    className="w-10 h-10 rounded-sm"
                                    alt={pack.name}
                                />
                            )}
                            <div className="flex-1">
                                <div className="font-semibold">{pack.name}</div>
                                <div className="text-neutral-600">
                                    {pack.description}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
