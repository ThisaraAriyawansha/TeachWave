import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState('ViewCourseMaterials');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [username, setUsername] = useState('');
  const [files, setFiles] = useState([]);
  const [authKey, setAuthKey] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/create-account');
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (authKey !== '12345') {
      alert('Unauthorized');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', event.target.file.files[0]);
    formData.append('subject', selectedSubject);
    formData.append('authKey', authKey);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/files/${selectedSubject}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files', error);
    }
  };

  const handleFileDelete = async (fileId) => {
    if (authKey !== '12345') {
      alert('Unauthorized');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/files/${fileId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file', error);
    }
  };

  const handleFileDownload = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'ViewCourseMaterials':
        return (
          <div className="content-section">
            <h2>View Course Materials</h2>
            <div className="subject-selection">
              <h3>Select a Subject:</h3>
              <ul>
                <li onClick={() => setSelectedSubject('Introduction to Software Engineering')}>Introduction to Software Engineering</li>
                <li onClick={() => setSelectedSubject('Internet of Things (IoT)')}>Internet of Things (IoT)</li>
                <li onClick={() => setSelectedSubject('Python Programming')}>Python Programming</li>
                <li onClick={() => setSelectedSubject('Data Structures and Algorithms')}>Data Structures and Algorithms</li>
                <li onClick={() => setSelectedSubject('Computer Hardware Fundamentals')}>Computer Hardware Fundamentals</li>
              </ul>
            </div>
            {selectedSubject && (
              <div className="subject-content">
                <h4>Materials for {selectedSubject}</h4>
                <form onSubmit={handleFileUpload}>
                  <label>
                    Upload File:
                    <input type="file" name="file" />
                  </label>
                  <label>
                    Authorization Key:
                    <input type="password" value={authKey} onChange={(e) => setAuthKey(e.target.value)} />
                  </label>
                  <button type="submit">Upload</button>
                </form>
                <div className="file-list">
                  <h5>Files:</h5>
                  <ul>
                    {files.map(file => (
                      <li key={file._id}>
                        <a href="#" onClick={() => handleFileDownload(file.url)}>{file.name}</a>
                        <button onClick={() => handleFileDelete(file._id)}>Delete</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      case 'SubmitAssignment':
        return (
          <div className="content-section">
            <h2>Submit Assignment</h2>
            <form>
              <label>
                Assignment Title:
                <input type="text" placeholder="Enter assignment title" />
              </label>
              <label>
                Upload File:
                <input type="file" />
              </label>
              <button type="submit">Submit Assignment</button>
            </form>
          </div>
        );
      case 'JoinLiveSession':
        return (
          <div className="content-section">
            <h2>Join Live Session</h2>
            <p>Click the button below to join the live session.</p>
            <button type="button">Join Session</button>
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
              <button type="submit">Start Quiz</button>
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
                <input type="number" placeholder="Enter rating (1-5)" min="1" max="5" />
              </label>
              <label>
                Feedback:
                <textarea placeholder="Enter your feedback"></textarea>
              </label>
              <button type="submit">Submit Rating</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Welcome, {username}</h3>
        </div>
        <ul>
          <li className={selectedSection === 'ViewCourseMaterials' ? 'active' : ''} onClick={() => setSelectedSection('ViewCourseMaterials')}>View Course Materials</li>
          <li className={selectedSection === 'SubmitAssignment' ? 'active' : ''} onClick={() => setSelectedSection('SubmitAssignment')}>Submit Assignment</li>
          <li className={selectedSection === 'JoinLiveSession' ? 'active' : ''} onClick={() => setSelectedSection('JoinLiveSession')}>Join Live Session</li>
          <li className={selectedSection === 'TakeQuiz' ? 'active' : ''} onClick={() => setSelectedSection('TakeQuiz')}>Take Quiz</li>
          <li className={selectedSection === 'RateCourse' ? 'active' : ''} onClick={() => setSelectedSection('RateCourse')}>Rate Course</li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
