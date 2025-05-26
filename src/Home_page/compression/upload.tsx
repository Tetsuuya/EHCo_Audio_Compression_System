import React from 'react';

interface UploadProps {
  activeTab: 'compress' | 'decompress';
  selectedFile: File | null;
  isProcessing: boolean;
  compressionResults: any;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCompress: () => void;
  onDecompress: () => void;
}

const Upload: React.FC<UploadProps> = ({
  activeTab,
  selectedFile,
  isProcessing,
  compressionResults,
  onFileSelect,
  onCompress,
  onDecompress
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {activeTab === 'compress' && (
        <>
          <div className="mb-3 relative">
            {/* Input Label */}
            <div className="absolute -top-2.5 left-3 z-10">
              <span className="bg-gray-50 px-1 text-sm text-gray-600">Input Audio</span>
            </div>

            <div className="flex items-center border rounded-md overflow-hidden bg-white">
              <div className="flex-grow">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={onFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={isProcessing}
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full px-4 py-2"
                >
                  <div className="text-gray-900 truncate">
                    {selectedFile ? selectedFile.name : 'Upload input (.wav) audio file'}
                  </div>
                </label>
              </div>
              <label
                htmlFor="file-upload"
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
            onClick={onCompress}
            disabled={!selectedFile || isProcessing}
            className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compress Audio File
          </button>
        </>
      )}
    </div>
  );
};

export default Upload;
