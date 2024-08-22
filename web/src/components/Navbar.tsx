/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-undef */
import { Link } from '@tanstack/react-router';

const LOGIN_URL = 'http://localhost:3000/login';

export const Navbar = () => {
    return (
        <div className="w-full bg-white border-b h-8 flex items-center justify-between">
            <div className="h-full flex space-x-2">
                <div className="font-semibold text-base pl-4 pr-4 hover:bg-black/10 border-r h-full flex items-center">
                    sample.rip
                </div>
                <div className="h-full flex items-center">
                    {[
                        ['/', 'Home'],
                        ['/sounds', 'Sounds'],
                    ].map(([path, name]) => (
                        <Link
                            key={path}
                            to={path}
                            className="[&.active]:font-bold hover:bg-black/10 py-1 px-2"
                        >
                            {name}
                        </Link>
                    ))}
                </div>
            </div>
            {/* <Link
                href={'/'}
                className="h-full border-l px-2 py-0.5 flex items-center hover:bg-black/10"
            >
                Login
            </Link> */}
        </div>
    );
};
