import React from 'react';

interface DownloadOutputProps {
  compressedFileName?: string;
  reconstructedFileName?: string;
  onCompressedDownload?: () => void;
  onReconstructedDownload?: () => void;
}

const DownloadOutput: React.FC<DownloadOutputProps> = ({
  compressedFileName = 'Output compressed file...',
  reconstructedFileName = 'Reconstructed audio...',
  onCompressedDownload,
  onReconstructedDownload
}) => {
  return (
    <div className="mt-6 flex justify-between">
      {/* Compressed File Section */}
      <div className="space-y-1.5 max-w-[280px]">
        <div className="relative">
          <div className="absolute -top-2 left-2">
            <span className="text-gray-500 text-xs px-1 bg-white">Compressed File</span>
          </div>
          <input
            type="text"
            value={compressedFileName}
            readOnly
            className="w-full px-3 py-3 text-sm border rounded-md focus:outline-none text-gray-600"
          />
        </div>
        <button
          onClick={onCompressedDownload}
          className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Download File
        </button>
      </div>

      {/* Output Audio Section */}
      <div className="space-y-1.5 max-w-[280px]">
        <div className="relative">
          <div className="absolute -top-2 left-2">
            <span className="text-gray-500 text-xs px-1 bg-white">Output Audio</span>
          </div>
          <input
            type="text"
            value={reconstructedFileName}
            readOnly
            className="w-full px-3 py-3 text-sm border rounded-md focus:outline-none text-gray-600"
          />
        </div>
        <button
          onClick={onReconstructedDownload}
          className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Download File
        </button>
      </div>
    </div>
  );
};

export default DownloadOutput;
