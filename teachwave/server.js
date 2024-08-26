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



app.post('/generate-certificate', (req, res) => {
  console.log('Received request to generate certificate');
  const { subject } = req.body;

  // Ensure the certificates directory exists
  const certificatesDir = path.join(__dirname, 'certificates');
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir);
  }

  const doc = new PDFDocument();
  const filePath = path.join(certificatesDir, `certificate-${subject}.pdf`);

  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
  doc.fontSize(20).text(`Subject: ${subject}`, { align: 'center' });
  doc.end();

  res.json({ filePath });
});




// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
