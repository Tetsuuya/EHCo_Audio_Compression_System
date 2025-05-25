import React from 'react';
import ConnectorImage from '../../assets/images/Connector.png';

interface UploadProps {
  selectedFile: File | null;
  isProcessing: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDecompress: () => void;
  processedFile?: { name: string } | null;
  onDownload?: () => void;
}

const Upload: React.FC<UploadProps> = ({
  selectedFile,
  isProcessing,
  onFileSelect,
  onDecompress,
  processedFile,
  onDownload
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Section */}
      <div className="mb-3 relative">
        {/* Input Label */}
        <div className="absolute -top-2.5 left-3 z-10">
          <span className="bg-gray-50 px-1 text-sm text-gray-600">Input File</span>
        </div>

        <div className="flex items-center border rounded-md overflow-hidden bg-white">
          <div className="flex-grow">
            <input
              type="file"
              accept=".bin"
              onChange={onFileSelect}
              className="hidden"
              id="file-upload-decompress"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload-decompress"
              className="block w-full px-4 py-2"
            >
              <div className="text-gray-900 truncate">
                {selectedFile ? selectedFile.name : 'Upload compressed (.bin) file'}
              </div>
            </label>
          </div>
          <label
            htmlFor="file-upload-decompress"
            className="flex-none px-2 self-center mr-2"
          >
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={onDecompress}
        disabled={!selectedFile || isProcessing}
        className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reconstruct Audio File
      </button>

      {/* Connector Image */}
      <div className="flex justify-center my-4">
        <img 
          src={ConnectorImage} 
          alt="" 
          className="w-120 h-120 object-contain"
        />
      </div>

      {/* Download Section - Always visible */}
      <div className="mt-6">
        <div className="relative">
          {/* Output Label */}
          <div className="absolute -top-2.5 left-3 z-10">
            <span className="bg-gray-50 px-1 text-sm text-gray-600">Output File</span>
          </div>

          <div className="border rounded-md overflow-hidden bg-white">
            <input
              type="text"
              value={processedFile ? processedFile.name : 'Reconstructed audio...'}
              readOnly
              className="w-full px-4 py-2 bg-white text-gray-700 border-none focus:ring-0"
            />
          </div>
          
          <button
            onClick={onDownload}
            disabled={!processedFile || isProcessing}
            className="mt-2 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
