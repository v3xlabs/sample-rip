import { FC, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaCheck, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { slugify } from '../utils/downloadUtils';

type DownloadStatus = 'loading' | 'downloading' | 'error' | 'completed';

export interface DownloadModalProperties {
    isOpen: boolean;
    onClose: () => void;
    packName: string;
    status: DownloadStatus;
    progress: number;
    totalFiles: number;
    currentFile: number;
}

export const DownloadModal: FC<DownloadModalProperties> = ({
    isOpen,
    onClose,
    packName,
    status,
    progress,
    totalFiles,
    currentFile,
}) => {
    useEffect(() => {
        // Prevent scrolling on body when modal is open
        // eslint-disable-next-line no-undef
        document.body.style.overflow = isOpen ? 'hidden' : '';

        return () => {
            // eslint-disable-next-line no-undef
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return;

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {status === 'completed'
                            ? 'Download Complete'
                            : 'Downloading Samples'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-neutral-500 hover:text-neutral-800"
                    >
                        <FaTimesCircle />
                    </button>
                </div>

                <div className="mb-4">
                    {status === 'loading' && (
                        <p className="mb-2">Preparing to download samples...</p>
                    )}

                    {status === 'downloading' && (
                        <p className="mb-2">
                            Downloading {currentFile} of {totalFiles} files...
                        </p>
                    )}

                    {status === 'error' && (
                        <p className="mb-2 text-red-500">
                            Error occurred during download.
                        </p>
                    )}

                    {status === 'completed' && (
                        <div className="space-y-3">
                            <p>
                                All samples have been downloaded and zipped
                                successfully.
                            </p>
                            <p>
                                The file has been saved to your downloads folder
                                as "sample_rip_{slugify(packName)}.zip"
                            </p>
                        </div>
                    )}

                    {status !== 'completed' && (
                        <div className="w-full bg-neutral-200 rounded-full h-4 mb-2">
                            <div
                                className={`h-4 rounded-full ${
                                    status === 'error'
                                        ? 'bg-red-500'
                                        : 'bg-blue-500'
                                }`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}

                    {status !== 'loading' &&
                        status !== 'error' &&
                        status !== 'completed' && (
                            <p className="text-sm text-neutral-500 text-right">
                                {Math.round(progress)}%
                            </p>
                        )}
                </div>

                <div className="flex justify-center">
                    {status === 'loading' && (
                        <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    )}

                    {status === 'error' && (
                        <button
                            onClick={onClose}
                            className="btn bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Close
                        </button>
                    )}

                    {status === 'completed' && (
                        <button
                            onClick={onClose}
                            className="btn bg-blue-500 hover:bg-blue-600 text-white flex items-center"
                        >
                            <FaCheck className="mr-2" />
                            <span>Close</span>
                        </button>
                    )}
                </div>
            </div>
        </div>,
        // eslint-disable-next-line no-undef
        document.body
    );
};
