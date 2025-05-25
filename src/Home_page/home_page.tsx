import { useState, useEffect } from 'react'
import Switch from './compression/switch'
import Upload from './compression/upload'
import DecompressionUpload from './decompression/upload'
import { Link } from 'react-router-dom'
import CompressionResults from './compression/compression results'
import DownloadOutput from './compression/download_output'
import IconImage from '../assets/images/Icon.png'

interface CompressionResults {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalTHD: number;
  recommendedTHD: number;
  thDifference: number;
  mse: number;
  snr: number;
  psnr: number;
}

function ProgressBar({ operationType }: { operationType: 'compress' | 'decompress' | null }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 1
        if (newProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return newProgress
      })
    }, 50)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const getBarColor = () => {
    switch (operationType) {
      case 'compress':
        return 'bg-blue-500'
      case 'decompress':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getOperationText = () => {
    switch (operationType) {
      case 'compress':
        return 'Compressing'
      case 'decompress':
        return 'Decompressing'
      default:
        return 'Processing'
    }
  }

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${getBarColor()} h-2.5 rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <p className="text-sm text-gray-600">{getOperationText()}...</p>
        <p className="text-sm text-gray-600">{progress}%</p>
      </div>
    </div>
  )
}

function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [outputMessage, setOutputMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedFile, setProcessedFile] = useState<{ name: string; path: string; size: number } | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [operationType, setOperationType] = useState<'compress' | 'decompress' | null>(null)
  const [compressionResults, setCompressionResults] = useState<CompressionResults>({
    originalSize: 0,
    compressedSize: 0,
    compressionRatio: 0,
    originalTHD: 0,
    recommendedTHD: 0,
    thDifference: 0,
    mse: 0,
    snr: 0,
    psnr: 0
  })
  const [activeTab, setActiveTab] = useState<'compress' | 'decompress'>('compress')

  const resetState = () => {
    setSelectedFile(null)
    setOutputMessage('')
    setProcessedFile(null)
    setAudioUrl(null)
    setCompressionResults({
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      originalTHD: 0,
      recommendedTHD: 0,
      thDifference: 0,
      mse: 0,
      snr: 0,
      psnr: 0
    })
    setIsProcessing(false)
    setOperationType(null)
  }

  const handleTabChange = (tab: 'compress' | 'decompress') => {
    setActiveTab(tab)
    resetState()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setOutputMessage('')
      setProcessedFile(null)
      setAudioUrl(null)
    }
  }

  const handleCancel = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsProcessing(false)
      setOperationType(null)
      setOutputMessage('Operation cancelled')
    }
  }

  const handleCompress = async () => {
    if (!selectedFile) {
      setOutputMessage('Please select a file first')
      return
    }

    const controller = new AbortController()
    setAbortController(controller)
    setOperationType('compress')

    setIsProcessing(true)
    setOutputMessage('Compressing...')
    setProcessedFile(null)
    setAudioUrl(null)

    const formData = new FormData()
    formData.append('audio', selectedFile)

    try {
      const response = await fetch('http://localhost:3001/api/compress', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error('Compression failed')
      }

      const data = await response.json()
      setProcessedFile(data.file)
      setCompressionResults(data.results)
      setOutputMessage('')
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        setOutputMessage('Operation cancelled')
      } else {
        setOutputMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    } finally {
      setIsProcessing(false)
      setOperationType(null)
      setAbortController(null)
    }
  }

  const handleDecompress = async () => {
    if (!selectedFile) {
      setOutputMessage('Please select a file first')
      return
    }

    const controller = new AbortController()
    setAbortController(controller)
    setOperationType('decompress')

    setIsProcessing(true)
    setOutputMessage('Decompressing...')
    setProcessedFile(null)
    setAudioUrl(null)

    const formData = new FormData()
    formData.append('compressed', selectedFile)

    try {
      const response = await fetch('http://localhost:3001/api/decompress', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error('Decompression failed')
      }

      const data = await response.json()
      setProcessedFile(data.file)
      setAudioUrl(`http://localhost:3001${data.file.path}`)
      setOutputMessage('Decompression completed successfully')
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        setOutputMessage('Operation cancelled')
      } else {
        setOutputMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    } finally {
      setIsProcessing(false)
      setOperationType(null)
      setAbortController(null)
    }
  }

  const handleDownload = () => {
    if (processedFile) {
      const link = document.createElement('a')
      link.href = `http://localhost:3001${processedFile.path}`
      link.download = processedFile.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Logo in upper left */}
      <Link 
        to="/"
        className="absolute z-10 hover:opacity-80 transition-opacity"
        style={{
          top: '2%',
          left: '2%',
          width: '300px',
          height: '110px'
        }}
      >
        <img 
          src="/Logo/Logo_Blue.png" 
          alt="EHCo Logo" 
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            fontFamily: 'Open Sans, sans-serif',
            fontWeight: 400
          }} 
        />
      </Link>

      {/* Background Icon */}
      <div className="fixed inset-0 flex items-center justify-center -z-10">
        <img 
          src={IconImage}
          alt="" 
          className="w-[1000px] h-[1000px] object-contain opacity-[0.3]"
        />
      </div>

      {/* Switch Component - Adjusted higher */}
      <div className="relative z-10 mr-18" style={{ marginTop: '95px' }}>
        <Switch activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 relative z-10">
        <div className="rounded-lg p-6">
          {/* Main content area */}
          {activeTab === 'compress' ? (
            <>
              <Upload
                activeTab={activeTab}
                selectedFile={selectedFile}
                isProcessing={isProcessing}
                compressionResults={compressionResults}
                onFileSelect={handleFileSelect}
                onCompress={handleCompress}
                onDecompress={handleDecompress}
              />
              {/* Compression Results - Show always in compress tab */}
              <CompressionResults {...compressionResults} />
              {/* Download Output Section - Only show in compress tab */}
              <DownloadOutput
                compressedFileName={processedFile ? processedFile.name : 'Output compressed file...'}
                reconstructedFileName="Reconstructed audio..."
                onCompressedDownload={processedFile ? handleDownload : undefined}
                onReconstructedDownload={undefined}
              />
            </>
          ) : (
            <DecompressionUpload
              selectedFile={selectedFile}
              isProcessing={isProcessing}
              onFileSelect={handleFileSelect}
              onDecompress={handleDecompress}
            />
          )}

          {/* Error Message */}
          {outputMessage && (
            <div className="mt-4 text-center text-red-600">
              {outputMessage}
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="mt-4">
              <ProgressBar operationType={operationType} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
