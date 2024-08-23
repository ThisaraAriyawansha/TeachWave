import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState('ViewCourseMaterials');
  const [username, setUsername] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [authKey, setAuthKey] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'info', 'success', 'error'
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedSubject) {
      fetchFiles(selectedSubject);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedSection === 'SubmitAssignment') {
      fetchSubmittedAssignments();
    }
  }, [selectedSection]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/create-account');
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedSubject || authKey !== '12345') {
      showMessage('Invalid input or unauthorized', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', selectedSubject);
    formData.append('authKey', authKey);
    try {
      await axios.post('http://localhost:5000/upload', formData);
      showMessage('File uploaded successfully!', 'success');
      fetchFiles(selectedSubject);
    } catch (error) {
      console.error('Error uploading file:', error);
      showMessage('Failed to upload file. Please try again.', 'error');
    }
  };

  const fetchFiles = async (subject) => {
    try {
      const response = await axios.get(`http://localhost:5000/files/${subject}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      showMessage('Failed to fetch files. Please try again.', 'error');
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage('File deleted successfully!', 'success');
      fetchFiles(selectedSubject);
    } catch (error) {
      console.error('Error deleting file:', error.response.data);
      showMessage('Failed to delete file. Please try again.', 'error');
    }
  };

  const handleDownload = (fileUrl) => {
    window.open(`http://localhost:5000${fileUrl}`, '_blank');
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 5000); // Clear message after 5 seconds
  };

  const handleAssignmentSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const file = event.target.file.files[0];
    
    if (!title || !file) {
      showMessage('Please provide a title and upload a file.', 'error');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('username', username);
  
    try {
      await axios.post('http://localhost:5000/submit-assignment', formData);
      showMessage('Assignment submitted successfully!', 'success');
      fetchSubmittedAssignments(); // Refresh the list after submission
    } catch (error) {
      console.error('Error submitting assignment:', error);
      showMessage('Failed to submit assignment. Please try again.', 'error');
    }
  };

  const fetchSubmittedAssignments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/submitted-assignments/${username}`);
      setSubmittedAssignments(response.data);
    } catch (error) {
      console.error('Error fetching submitted assignments:', error);
      showMessage('Failed to fetch submitted assignments. Please try again.', 'error');
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'ViewCourseMaterials':
        return (
          <div className="content-section">
            <h2>View Course Materials</h2>
            <select value={selectedSubject} onChange={handleSubjectChange}>
              <option value="">Select Subject</option>
              <option value="Introduction to Software Engineering">Introduction to Software Engineering</option>
              <option value="IoT">IoT</option>
              <option value="Python Programming">Python Programming</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Computer Hardware">Computer Hardware</option>
            </select>
            <input
              type="text"
              placeholder="Enter authorization key"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
            />
            <input type="file" onChange={handleFileChange} />
            <button className="upload-button" onClick={handleUpload}>Upload File</button>
            <h3>Uploaded Files:</h3>
            <ul>
              {files.map((file) => (
                <li key={file._id} className="file-item">
                  <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer" className="file-link">
                    {file.name}
                  </a>
                  <button className="download-button" onClick={() => handleDownload(file.url)}>Download</button>
                  <button className="delete-button" onClick={() => handleDelete(file._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'SubmitAssignment':
        return (
          <div className="content-section">
            <h2>Submit Assignment</h2>
            <form onSubmit={handleAssignmentSubmit}>
              <label>
                Assignment Title:
                <input type="text" name="title" placeholder="Enter assignment title" />
              </label>
              <label>
                Upload File:
                <input type="file" name="file" />
              </label>
              <button type="submit" className="submit-button">Submit Assignment</button>
            </form>
            <h3>Submitted Assignments:</h3>
            <ul>
              {submittedAssignments.map((assignment) => (
                <li key={assignment._id} className="file-item">
                  <a href={`http://localhost:5000${assignment.url}`} target="_blank" rel="noopener noreferrer" className="file-link">
                    {assignment.title}
                  </a>
                  <button className="download-button" onClick={() => handleDownload(assignment.url)}>Download</button>
                  <button className="delete-button" onClick={() => handleDelete(assignment._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'JoinLiveSession':
        return (
          <div className="content-section">
            <h2>Join Live Session</h2>
            <p>Click the button below to join the live session.</p>
            <button type="button" className="join-button">Join Session</button>
          </div>
        );
      case 'TakeQuiz':
        return (
          <div className="content-section">
            <h2>Take Quiz</h2>
            <form>
              <label>
                Quiz Title:
                <input type="text" placeholder="Enter quiz title" />
              </label>
              <label>
                Number of Questions:
                <input type="number" placeholder="Enter number of questions" />
              </label>
              <button type="submit" className="start-quiz-button">Start Quiz</button>
            </form>
          </div>
        );
      case 'RateCourse':
        return (
          <div className="content-section">
            <h2>Rate Course</h2>
            <form>
              <label>
                Course Title:
                <input type="text" placeholder="Enter course title" />
              </label>
              <label>
                Rating:
                <select>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
              <label>
                Feedback:
                <textarea placeholder="Enter your feedback" />
              </label>
              <button type="submit" className="submit-feedback-button">Submit Feedback</button>
            </form>
          </div>
        );
      default:
        return <div>Select a section to view content.</div>;
    }
  };

  return (
    <div className="dashboard">
      <nav>
        <button onClick={() => setSelectedSection('ViewCourseMaterials')}>View Course Materials</button>
        <button onClick={() => setSelectedSection('SubmitAssignment')}>Submit Assignment</button>
        <button onClick={() => setSelectedSection('JoinLiveSession')}>Join Live Session</button>
        <button onClick={() => setSelectedSection('TakeQuiz')}>Take Quiz</button>
        <button onClick={() => setSelectedSection('RateCourse')}>Rate Course</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <div className="content">
        {renderContent()}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
