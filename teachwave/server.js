const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');



const PDFDocument = require('pdfkit');


const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/teachwave', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);


// Define QuizResult model
const quizResultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);


// Define File model
const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  subject: { type: String, required: true },
});

const File = mongoose.model('File', fileSchema);

// Define Assignment model
const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  username: { type: String, required: true },
  description: { type: String, required: false }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// File upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  const { subject, authKey } = req.body;
  if (authKey !== '12345') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const newFile = new File({
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      subject,
    });
    await newFile.save();
    res.status(201).json({ message: 'File uploaded successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get files for a subject
app.get('/files/:subject', async (req, res) => {
  try {
    const files = await File.find({ subject: req.params.subject });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete course material
app.delete('/files/:id', async (req, res) => {
    try {
      const fileId = req.params.id;
      const file = await File.findById(fileId);
  
      if (!file) {
        console.log(`File not found with ID: ${fileId}`);
        return res.status(404).json({ message: 'File not found' });
      }
  
      const filePath = path.join(__dirname, 'uploads', path.basename(file.url));
      console.log(`Attempting to delete file at: ${filePath}`);
  
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file from filesystem:', err);
          return res.status(500).json({ message: 'Failed to delete file from filesystem' });
        }
        console.log('File successfully deleted from filesystem');
      });
  
      await File.findByIdAndDelete(fileId);
      res.json({ message: 'File deleted successfully!' });
    } catch (error) {
      console.error('Error during file deletion:', error);
      res.status(500).json({ message: error.message });
    }
  });
  

  // Delete assignment route
app.delete('/assignments/:id', async (req, res) => {
    try {
      const assignmentId = req.params.id;
      const assignment = await Assignment.findById(assignmentId);
      
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
      
      const filePath = path.join(__dirname, 'uploads', path.basename(assignment.url));
      
      // Remove the assignment file from the filesystem
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to delete assignment file' });
        }
      });
      
      await Assignment.findByIdAndDelete(assignmentId);
      res.json({ message: 'Assignment deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Submit assignment route
app.post('/submit-assignment', upload.single('file'), async (req, res) => {
  const { title, username, description } = req.body;
  if (!title || !username || !req.file) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    const newAssignment = new Assignment({
      title,
      url: `/uploads/${req.file.filename}`,
      username,
      description
    });
    await newAssignment.save();
    res.status(201).json({ message: 'Assignment submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get submitted assignments for a user
app.get('/submitted-assignments/:username', async (req, res) => {
  try {
    const assignments = await Assignment.find({ username: req.params.username });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// Submit quiz result route
app.post('/submit-quiz', async (req, res) => {
  try {
    const { username, subject, score } = req.body;
    const quizResult = new QuizResult({ username, subject, score });
    await quizResult.save();
    res.status(201).json({ message: 'Quiz result saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Fetch quiz results by username
app.get('/results/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const results = await QuizResult.find({ username });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Ensure the 'certificates' directory exists
const certificatesDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir);
}

app.get('/generate-certificate/:subject/:username', (req, res) => {
    const { subject, username } = req.params;

    console.log(`Generating certificate for: Subject = ${subject}, Username = ${username}`);

    try {
        // Create a PDF document in A4 landscape format
        const doc = new PDFDocument({
            size: [842, 595], // A4 landscape dimensions in points (297mm x 210mm)
            margin: 50
        });

        const fileName = `Certificate-${username}-${subject}.pdf`;
        const filePath = path.join(certificatesDir, fileName);

        // Pipe the PDF into a file
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Add a high-quality background image
        const backgroundImagePath = path.join(__dirname, '2.png');
        if (fs.existsSync(backgroundImagePath)) {
            doc.image(backgroundImagePath, 0, 0, { width: 842, height: 595 });
        } else {
            console.error('Background image not found');
        }

        // Add certificate header
        doc.fillColor('#003366') // Dark blue
           .fontSize(40)
           .font('Times-Bold')
           .text('Certificate of Completion', {
               align: 'center',
               underline: true
           })
           .moveDown(1);

        // Add recipient name
        doc.fillColor('#000000') // Black
           .fontSize(28)
           .font('Times-Roman')
           .text('This is to certify that', {
               align: 'center'
           })
           .moveDown(1);

        doc.fontSize(36)
           .font('Times-Bold')
           .text(username, {
               align: 'center',
               underline: true
           })
           .moveDown(1);

        // Add course details
        doc.fontSize(28)
           .font('Times-Roman')
           .text('has successfully completed the', {
               align: 'center'
           })
           .moveDown(1);

        doc.fontSize(30)
           .font('Times-Bold')
           .text(`${subject} Course`, {
               align: 'center',
               underline: true
           })
           .moveDown(2);

        // Add issuing date
        doc.fontSize(16)
           .font('Times-Roman')
           .text(`Issued on: ${new Date().toLocaleDateString()}`, {
               align: 'center'
           })
           .moveDown(2);

        // Add issuing authority and system name at the bottom
        doc.fontSize(16)
           .fillColor('#003366')
           .text('Issued by TeachWave', {
               align: 'center'
           })
           .moveDown(1);

        // Finalize the PDF and end the stream
        doc.end();

        // Handle stream events for error and finish
        writeStream.on('finish', () => {
            res.download(filePath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send('Error generating certificate');
                } else {
                    console.log('Certificate sent successfully');
                }
            });
        });

        writeStream.on('error', (err) => {
            console.error('Error writing PDF file:', err);
            res.status(500).send('Error generating certificate');
        });

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).send('Error generating certificate');
    }
});




// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
