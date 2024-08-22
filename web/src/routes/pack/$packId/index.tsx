import { createFileRoute } from '@tanstack/react-router';

import { SampleList } from '../../../components/SampleList';
import { PACKS } from '../../../config';

export const Route = createFileRoute('/pack/$packId/')({
    component: (parameters) => {
        console.log(parameters);
        const { packId } = Route.useParams();
        const pack = PACKS[packId];

        if (!pack) {
            return <div className="p-4">Pack not found!</div>;
        }

        return (
            <div className="p-4 space-y-4 w-full">
                <div className="flex items-center gap-4">
                    {pack.cover && (
                        <div className="w-48 h-48 bg-neutral-100 rounded-md">
                            <img
                                src={pack.cover}
                                className="w-full h-full object-cover rounded-md"
                                alt={pack.name}
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <div>
                            <h1 className="text-2xl font-bold">{pack.name}</h1>
                            <p>{pack.description}</p>
                            <ul className="flex items-center gap-2 text-sm">
                                <li>22 Samples</li>
                                <li>2 Loops</li>
                            </ul>
                        </div>
                        <div>
                            <button className="btn">Download All</button>
                        </div>
                    </div>
                </div>
                <SampleList />
            </div>
        );
    },
});
