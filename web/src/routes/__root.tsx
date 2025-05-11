// @ts-nocheck
import { createRootRoute, Outlet } from '@tanstack/react-router';

import { Navbar } from '../components/Navbar';
import { PackSidebar } from '../components/PackSidebar';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';
import AudioPlayerOverlay from '../components/AudioPlayerOverlay';

export const Route = createRootRoute({
    component: () => (
        <AudioPlayerProvider>
            <div className="w-full h-screen flex flex-col overflow-y-hidden">
                <Navbar />
                <div className="flex-1 h-full flex">
                    <PackSidebar />
                    <div className="w-full overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
                {/* <TanStackRouterDevtools /> */}
                <AudioPlayerOverlay />
            </div>
        </AudioPlayerProvider>
    ),
});
