import { FaPlay } from 'react-icons/fa';

export const SampleList = () => {
    return (
        <div className="w-full rounded-lg bg-neutral-100 p-2">
            <h2 className="px-2 text-md font-bold pt-1">Samples</h2>
            <ul>
                {Array.from({ length: 10 })
                    .fill(0)
                    .map((_, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 p-2 border-b border-neutral-200 hover:bg-neutral-300/10"
                        >
                            <div className="w-10 h-10 rounded-sm bg-neutral-200 flex items-center justify-center text-neutral-500">
                                <FaPlay />
                            </div>
                            <div>
                                <h3 className="text-base">
                                    Sample {index + 1}
                                </h3>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};
