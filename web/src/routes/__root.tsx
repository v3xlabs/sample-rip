import { createRootRoute, Outlet } from '@tanstack/react-router';

import { Navbar } from '../components/Navbar';
import { PackSidebar } from '../components/PackSidebar';

export const Route = createRootRoute({
    component: () => (
        <div className="w-full h-screen flex flex-col">
            <Navbar />
            <div className="grow h-full overflow-y-auto flex">
                <PackSidebar />
                <Outlet />
            </div>
            {/* <TanStackRouterDevtools /> */}
        </div>
    ),
});
