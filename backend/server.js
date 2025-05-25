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

// Path to the executable
const EXECUTABLE_PATH = 'C:\\Users\\Rhenel Jhon Sajol\\Documents\\ECHo- Full system\\EHCo\\audio_compressor.exe';

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
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, 'uploads', `compressed-${Date.now()}.bin`);

    // Call the executable for compression
    await execPromise(`"${EXECUTABLE_PATH}" "${inputPath}"`);

    // Copy the compressed file to uploads directory
    fs.copyFileSync('compressed.bin', outputPath);

    // Clean up original files
    fs.unlinkSync(inputPath);
    if (fs.existsSync('compressed.bin')) {
      fs.unlinkSync('compressed.bin');
    }

    // Return file information
    res.json({
      success: true,
      file: {
        name: path.basename(outputPath),
        path: `/uploads/${path.basename(outputPath)}`,
        size: fs.statSync(outputPath).size
      }
    });
  } catch (error) {
    console.error('Compression error:', error);
    res.status(500).json({ error: 'Compression failed' });
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
    const { stdout, stderr } = await execPromise(`"${EXECUTABLE_PATH}" -d`);

    if (!fs.existsSync('output.wav')) {
      throw new Error('Decompression failed: output.wav not created');
    }

    // Copy the decompressed file to uploads directory
    fs.copyFileSync('output.wav', outputPath);

    // Clean up temporary files
    fs.unlinkSync(inputPath);
    if (fs.existsSync('compressed.bin')) {
      fs.unlinkSync('compressed.bin');
    }
    if (fs.existsSync('output.wav')) {
      fs.unlinkSync('output.wav');
    }

    // Return file information
    res.json({
      success: true,
      file: {
        name: path.basename(outputPath),
        path: `/uploads/${path.basename(outputPath)}`,
        size: fs.statSync(outputPath).size
      }
    });
  } catch (error) {
    console.error('Decompression error details:', {
      message: error.message,
      code: error.code,
      cmd: error.cmd,
      stdout: error.stdout,
      stderr: error.stderr
    });
    res.status(500).json({ 
      error: 'Decompression failed',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Using executable at: ${EXECUTABLE_PATH}`);
}); 