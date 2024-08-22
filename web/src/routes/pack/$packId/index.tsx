import { createFileRoute } from '@tanstack/react-router';

import { SampleList } from '../../../components/SampleList';
import { PACKS } from '../../../config';
import { SAMPLES_BY_PACK } from '../../../config.gen';

export const Route = createFileRoute('/pack/$packId/')({
    component: (parameters) => {
        console.log(parameters);
        const { packId } = Route.useParams();
        const pack = PACKS[packId];
        // @ts-ignore
        const samples = SAMPLES_BY_PACK[packId] as string[];

        if (!pack || !samples) {
            return <div className="p-4">Pack not found!</div>;
        }

        return (
            <div className="p-4 space-y-4 w-full pb-16">
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
                                <li>{samples.length} Samples</li>
                            </ul>
                        </div>
                        <div>
                            <button
                                className="btn"
                                onClick={() => {
                                    // eslint-disable-next-line no-undef
                                    alert('Not implemented yet!');
                                }}
                            >
                                Download All
                            </button>
                        </div>
                    </div>
                </div>
                <SampleList pack={packId} />
            </div>
        );
    },
});
