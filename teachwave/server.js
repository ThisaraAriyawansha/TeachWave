const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
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

// Delete a file
app.delete('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    // Delete the file from the filesystem
    fs.unlink(path.join(__dirname, 'uploads', path.basename(file.url)), (err) => {
      if (err) {
        console.error('Error deleting file from filesystem:', err);
      }
    });
    // Delete the file record from the database
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'File deleted successfully!' });
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

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
