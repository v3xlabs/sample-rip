import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/pack/$packId/')({
    component: (parameters) => {
        console.log(parameters);
        const { packId } = Route.useParams();

        return (
            <div>
                <div>Hello /pack/$packId/! {packId}!</div>
            </div>
        );
    },
});
