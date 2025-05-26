import React from 'react';

interface CompressionResultsProps {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalTHD: number;
  outputTHD: number;
  thDifference: number;
  mse: number;
  snr: number;
  psnr: number;
}

const CompressionResults: React.FC<CompressionResultsProps> = ({
  originalSize,
  compressedSize,
  compressionRatio,
  originalTHD,
  outputTHD,
  thDifference,
  mse,
  snr,
  psnr
}) => {
  return (
    <div className="mt-8">
      <div className="rounded-3xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h2 className="text-blue-600 text-xl font-medium text-center mb-6">Compression Results</h2>
        
        <div className="grid grid-cols-2 gap-x-16 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center rounded-lg bg-gray-50/50 p-2 hover:bg-gray-50 transition-colors">
              <span className="text-gray-600">Original Size</span>
              <span className="text-blue-600">{(originalSize / 1024).toFixed(3)} KB</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-gray-50/50 p-2 hover:bg-gray-50 transition-colors">
              <span className="text-gray-600">Compression Size</span>
              <span className="text-blue-600">{(compressedSize / 1024).toFixed(3)} KB</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-gray-50/50 p-2 hover:bg-gray-50 transition-colors">
              <span className="text-gray-600">Compression Ratio</span>
              <span className="text-blue-600">{compressionRatio.toFixed(4)}:1</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-gray-50/50 p-2 hover:bg-gray-50 transition-colors">
              <span className="text-gray-600">Input THD</span>
              <span className="text-blue-600">{originalTHD.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-gray-50/50 p-2 hover:bg-gray-50 transition-colors">
              <span className="text-gray-600">Output THD</span>
              <span className="text-blue-600">{outputTHD.toFixed(2)}%</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center rounded-lg bg-gray-50/50 p-2 hover:bg-gray-50 transition-colors">
              <span className="text-gray-600">THD Difference</span>
              <span className="text-blue-600">
                {(thDifference >= 0 ? '+' : '') + thDifference.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-gray-50/50 p-2 hover:bg-gray-50 transition-colors">
              <span className="text-gray-600">MSE</span>
              <span className="text-blue-600">
                {mse < 0.001 ? mse.toExponential(6) : mse.toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-gray-50/50 p-2 hover:bg-gray-50 transition-colors">
              <span className="text-gray-600">SNR</span>
              <span className="text-blue-600">{snr.toFixed(3)} dB</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-gray-50/50 p-2 hover:bg-gray-50 transition-colors">
              <span className="text-gray-600">PSNR</span>
              <span className="text-blue-600">{psnr.toFixed(3)} dB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-4 text-xs text-blue-600 px-4 py-0.5 rounded-xl bg-blue-50/50">
        <p><span className="font-medium">Notes:</span> Compression Ratio shows how much the data was reduced. Input THD and Output THD measure the level of unwanted harmonics in the signal before and after compression, with THD Difference showing any change. MSE (Mean Squared Error) quantifies the average squared difference between original and compressed data, SNR (Signal-to-Noise Ratio) measures the proportion of signal to noise power, and PSNR (Peak Signal-to-Noise Ratio) indicates the peak error between the original and compressed data.</p>
      </div>
    </div>
  );
};

export default CompressionResults;
