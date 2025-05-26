const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const port = process.env.PORT || 3001;

// Function to parse metrics from text output
const parseMetrics = (metricsText) => {
  try {
    console.log('Raw metrics text:', metricsText);
    
    // Extract numeric values, handling different formats
    const getMeasurement = (pattern) => {
      const match = metricsText.match(pattern);
      if (!match) {
        console.log(`No match found for pattern: ${pattern}`);
        return 0;
      }
      // Remove any units (dB, %) and parse as float
      const value = parseFloat(match[1].replace(/dB|%/g, '').trim());
      console.log(`Found match for pattern ${pattern}:`, { raw: match[1], parsed: value });
      return value;
    };

    // Parse each metric with their specific patterns
    const metrics = {
      mse: getMeasurement(/MSE:\s*([\d.]+)/),
      psnr: getMeasurement(/PSNR:\s*([\d.]+)\s*dB/),
      snr: getMeasurement(/\bSNR:\s*([\d.]+)\s*dB/),  // Added word boundary to prevent PSNR match
      thd: {
        input: getMeasurement(/THD\s*\(Input\):\s*([\d.]+)%/),
        output: getMeasurement(/THD\s*\(Output\):\s*([\d.]+)%/)
      }
    };

    console.log('Parsed metrics:', metrics);
    return metrics;
  } catch (error) {
    console.error('Error parsing metrics:', error);
    return {
      mse: 0,
      psnr: 0,
      snr: 0,
      thd: {
        input: 0,
        output: 0
      }
    };
  }
};

// Create a temporary copy of a file
const createTempCopy = (sourcePath, prefix = 'temp') => {
  const tempPath = path.join(__dirname, 'uploads', `${prefix}-${Date.now()}.wav`);
  fs.copyFileSync(sourcePath, tempPath);
  return tempPath;
};

// Paths to the executables
const COMPRESSOR_PATH = 'C:\\Users\\Rhenel Jhon Sajol\\Documents\\final_final\\EHCo_Audio_Compression_System\\audio_compressor.exe';
const METRICS_PATH = 'C:\\Users\\Rhenel Jhon Sajol\\Documents\\final_final\\EHCo_Audio_Compression_System\\audio_metrics.exe';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.post('/api/compress', upload.single('audio'), async (req, res) => {
  let inputPath = null;
  let outputBinPath = null;
  let outputWavPath = null;
  let tempFiles = [];

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    inputPath = req.file.path;
    outputBinPath = path.join(__dirname, 'uploads', `compressed-${Date.now()}.bin`);
    outputWavPath = path.join(__dirname, 'uploads', `reconstructed-${Date.now()}.wav`);

    console.log('Starting compression process...');
    console.log('Input file:', inputPath);
    console.log('Output bin path:', outputBinPath);
    console.log('Output wav path:', outputWavPath);

    // Step 1: Compress the input file
    console.log('Running compression command...');
    const compressCmd = `"${COMPRESSOR_PATH}" "${inputPath}"`;
    console.log('Compression command:', compressCmd);
    const compressResult = await execPromise(compressCmd);
    console.log('Compression stdout:', compressResult.stdout);
    console.log('Compression stderr:', compressResult.stderr);

    if (!fs.existsSync('compressed.bin')) {
      throw new Error('Compression failed: compressed.bin not created');
    }

    // Copy compressed file to uploads directory
    console.log('Copying compressed.bin to output location...');
    fs.copyFileSync('compressed.bin', outputBinPath);
    tempFiles.push('compressed.bin');

    // Step 2: Decompress the file
    console.log('Running decompression command...');
    const decompressCmd = `"${COMPRESSOR_PATH}" -d`;
    console.log('Decompression command:', decompressCmd);
    const decompressResult = await execPromise(decompressCmd);
    console.log('Decompression stdout:', decompressResult.stdout);
    console.log('Decompression stderr:', decompressResult.stderr);

    if (!fs.existsSync('output.wav')) {
      throw new Error('Decompression failed: output.wav not created');
    }

    // Copy decompressed file to uploads directory
    console.log('Copying output.wav to final location...');
    fs.copyFileSync('output.wav', outputWavPath);
    tempFiles.push('output.wav');

    // Get file sizes for compression ratio
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputBinPath).size;
    const compressionRatio = originalSize / compressedSize;

    console.log('File sizes:', {
      originalSize,
      compressedSize,
      compressionRatio
    });

    let metrics = {
      thd: {
        input: 0,
        output: 0
      },
      mse: 0,
      snr: 0,
      psnr: 0
    };

    // Only calculate metrics if both files exist
    if (fs.existsSync(inputPath) && fs.existsSync(outputWavPath)) {
      try {
        console.log('Calculating metrics...');
        const metricsCmd = `"${METRICS_PATH}" "${inputPath}" "${outputWavPath}"`;
        console.log('Metrics command:', metricsCmd);
        const metricsResult = await execPromise(metricsCmd);
        console.log('Metrics stdout:', metricsResult.stdout);
        console.log('Metrics stderr:', metricsResult.stderr);
        metrics = parseMetrics(metricsResult.stdout);
      } catch (metricsError) {
        console.error('Metrics calculation failed:', metricsError);
        // Continue with default metrics values
      }
    } else {
      console.log('Skipping metrics calculation - files not found');
    }

    // Clean up temporary files
    console.log('Cleaning up temporary files...');
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

    // Send response with both files and metrics
    const response = {
      success: true,
      compressedFile: {
        name: path.basename(outputBinPath),
        path: `/uploads/${path.basename(outputBinPath)}`,
        size: compressedSize
      },
      reconstructedFile: {
        name: path.basename(outputWavPath),
        path: `/uploads/${path.basename(outputWavPath)}`,
        size: fs.statSync(outputWavPath).size
      },
      results: {
        originalSize: originalSize,
        compressedSize: compressedSize,
        compressionRatio: compressionRatio,
        originalTHD: metrics.thd.input,
        outputTHD: metrics.thd.output,
        mse: metrics.mse,
        snr: metrics.snr,
        psnr: metrics.psnr,
        thDifference: metrics.thd.output - metrics.thd.input
      }
    };

    console.log('Sending successful response:', response);
    res.json(response);

  } catch (error) {
    console.error('Compression error:', {
      message: error.message,
      stack: error.stack,
      stdout: error.stdout,
      stderr: error.stderr,
      cmd: error.cmd
    });

    // Clean up any files that might have been created
    try {
      // Clean up temporary files
      tempFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });

      // Clean up input and output files
      if (inputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
      if (outputBinPath && fs.existsSync(outputBinPath)) {
        fs.unlinkSync(outputBinPath);
      }
      if (outputWavPath && fs.existsSync(outputWavPath)) {
        fs.unlinkSync(outputWavPath);
      }
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }

    res.status(500).json({ 
      success: false,
      error: 'Compression failed', 
      details: error.message,
      command: error.cmd
    });
  }
});

app.post('/api/decompress', upload.single('compressed'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, 'uploads', `decompressed-${Date.now()}.wav`);
    
    // Copy the uploaded file to compressed.bin
    fs.copyFileSync(inputPath, 'compressed.bin');

    // Call the executable for decompression
    await execPromise(`"${COMPRESSOR_PATH}" -d`);

    if (!fs.existsSync('output.wav')) {
      throw new Error('Decompression failed: output.wav not created');
    }

    // Copy the decompressed file to uploads directory
    fs.copyFileSync('output.wav', outputPath);

    // For decompression, we can't calculate metrics since we don't have the original file
    // Return file information only
    res.json({
      success: true,
      reconstructedFile: {
        name: path.basename(outputPath),
        path: `/uploads/${path.basename(outputPath)}`,
        size: fs.statSync(outputPath).size
      }
    });

    // Clean up temporary files
    fs.unlinkSync(inputPath);
    if (fs.existsSync('compressed.bin')) {
      fs.unlinkSync('compressed.bin');
    }
    if (fs.existsSync('output.wav')) {
      fs.unlinkSync('output.wav');
    }
  } catch (error) {
    console.error('Decompression error:', error);
    res.status(500).json({ 
      error: 'Decompression failed',
      details: error.message
    });
  }
});

app.post('/api/metrics', upload.array('audio', 2), async (req, res) => {
  try {
    if (!req.files || req.files.length !== 2) {
      return res.status(400).json({ error: 'Two audio files are required' });
    }

    const [file1, file2] = req.files;

    // Get audio metrics comparing the two files
    const metricsResult = await execPromise(`"${METRICS_PATH}" "${file1.path}" "${file2.path}"`);
    const metrics = parseMetrics(metricsResult.stdout);

    // Clean up uploaded files
    fs.unlinkSync(file1.path);
    fs.unlinkSync(file2.path);

    // Return metrics
    res.json({
      success: true,
      metrics: metrics
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: 'Failed to get metrics', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Using compressor at: ${COMPRESSOR_PATH}`);
  console.log(`Using metrics tool at: ${METRICS_PATH}`);
}); 