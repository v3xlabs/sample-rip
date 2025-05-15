import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { SampleList } from '../../../components/SampleList';
import { DownloadModal } from '../../../components/DownloadModal';
import { PACKS } from '../../../config';
import { SAMPLES_BY_PACK } from '../../../config.gen';
import { downloadPackSamples } from '../../../utils/downloadUtils';

export const Route = createFileRoute('/pack/$packId/')({
    component: (parameters) => {
        console.log(parameters);
        const { packId } = Route.useParams();
        const pack = PACKS[packId];
        // @ts-ignore
        const samples = SAMPLES_BY_PACK[packId] as string[];

        // Modal state and download progress tracking
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [downloadStatus, setDownloadStatus] = useState<
            'loading' | 'downloading' | 'error' | 'completed'
        >('loading');
        const [progress, setProgress] = useState(0);
        const [currentFile, setCurrentFile] = useState(0);
        const [totalFiles, setTotalFiles] = useState(0);

        if (!pack || !samples) {
            return <div className="p-4">Pack not found!</div>;
        }

        // Handle download all samples
        const handleDownloadAll = () => {
            setIsModalOpen(true);
            setDownloadStatus('loading');
            setProgress(0);
            setCurrentFile(0);
            setTotalFiles(samples.length);
            
            // Start the download process
            setTimeout(() => {
                downloadPackSamples(packId, pack.name, samples, {
                    onProgress: (current, total, percentage) => {
                        setDownloadStatus('downloading');
                        setCurrentFile(current);
                        setTotalFiles(total);
                        setProgress(percentage);
                    },
                    onError: (error) => {
                        console.error('Download error:', error);
                        setDownloadStatus('error');
                    },
                    onComplete: () => {
                        setDownloadStatus('completed');
                        setProgress(100);
                    },
                });
            }, 300); // Short delay to allow modal to render first
        };

        // Close modal handler
        const handleCloseModal = () => {
            setIsModalOpen(false);
        };

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
                            <button className="btn" onClick={handleDownloadAll}>
                                Download All
                            </button>
                        </div>
                    </div>
                </div>
                <SampleList pack={packId} />
                
                {/* Download Progress Modal */}
                <DownloadModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    packName={pack.name}
                    status={downloadStatus}
                    progress={progress}
                    totalFiles={totalFiles}
                    currentFile={currentFile}
                />
            </div>
        );
    },
});
