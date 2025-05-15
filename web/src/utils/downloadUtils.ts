import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const slugify = (text: string) => {
  return text.toLowerCase().replace(/ /g, '_');
};

export interface DownloadOptions {
  onProgress?: (currentFile: number, totalFiles: number, percentage: number) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

/**
 * Downloads sample files from GitHub, zips them, and saves them locally
 */
export const downloadPackSamples = async (
  packId: string,
  packName: string,
  sampleIds: string[],
  options?: DownloadOptions
): Promise<void> => {
  const { onProgress, onError, onComplete } = options || {};
  const totalFiles = sampleIds.length;

  try {
    // Show starting progress
    onProgress?.(0, totalFiles, 0);

    // Create a zip file
    const zip = new JSZip();

    // Fetch and add each file to the zip
    for (let i = 0; i < sampleIds.length; i++) {
      const sampleId = sampleIds[i];
      const url = `https://raw.githubusercontent.com/v3xlabs/sample-rip/refs/heads/master/samples/${packId}/${sampleId}`;

      // Fetch the file
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download ${sampleId}: ${response.statusText}`);
      }

      // Get file data as array buffer
      const fileData = await response.arrayBuffer();

      // Add to zip
      zip.file(sampleId, fileData);

      // Update progress
      const percentage = Math.round(((i + 1) / totalFiles) * 100);
      onProgress?.(i + 1, totalFiles, percentage);
    }

    // Generate the zip file
    const zipContent = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // Update progress to 100% after zip generation
    onProgress?.(totalFiles, totalFiles, 100);

    // Save the zip file
    saveAs(zipContent, `sample_rip_${slugify(packName)}.zip`);

    // Mark as complete
    onComplete?.();
  } catch (error) {
    console.error('Error during download:', error);
    onError?.(
      error instanceof Error
        ? error
        : new Error('Unknown error during download')
    );
  }
}; 