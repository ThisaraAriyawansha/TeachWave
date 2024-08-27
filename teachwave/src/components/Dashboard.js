import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Jitsi from 'react-jitsi';


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
    const [isSessionJoined, setIsSessionJoined] = useState(false);
    const [roomName, setRoomName] = useState(''); // This will be the room name for Jitsi
    const [certificateSubject, setCertificateSubject] = useState('');

  

    useEffect(() => {
      if (selectedSection === 'Result') {
        fetchResults();
      }
    }, [selectedSection]);
    


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
    
      const handleJoinSession = () => {
        if (authKey !== '12345') {
            showMessage('Unauthorized to join session', 'error');
            return;
        }
        setRoomName('LiveClass-' + new Date().getTime()); // Generating a unique room name
        setIsSessionJoined(true);
    };

      const handleAssignmentDelete = async (assignmentId) => {
        try {
          const token = localStorage.getItem('authToken'); // Ensure you have a valid auth token
          await axios.delete(`http://localhost:5000/assignments/${assignmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          showMessage('Assignment deleted successfully!', 'success');
          fetchSubmittedAssignments(); // Refresh the list after deletion
        } catch (error) {
          console.error('Error deleting assignment:', error);
          showMessage('Failed to delete assignment. Please try again.', 'error');
        }
      };
      
    const [courseResults, setCourseResults] = useState([]);

const fetchResults = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/results/${username}`);
    setCourseResults(response.data);
  } catch (error) {
    console.error('Error fetching results:', error);
    showMessage('Failed to fetch course results. Please try again.', 'error');
  }
};





const handleDownloadCertificate = async (subject) => {
  try {
    const response = await axios.get(`http://localhost:5000/download-certificate/${username}/${subject}`, {
      responseType: 'blob', // Important for handling file downloads
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${subject}_Certificate.pdf`); // or whatever the file type is
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error downloading certificate:', error);
    showMessage('Failed to download certificate. Please try again.', 'error');
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

      const navigateToQuiz = (quizName) => {
        navigate(`/${quizName}`, { state: { username } });
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
              <option value="IoT">Internet of Things</option>
              <option value="Python Programming">Python Programming</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Computer Hardware">Computer Hardware</option>
            </select>
            <br/>
            <input
              type="password"
              placeholder="Enter authorization key"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
            /><br/>
            <input type="file" onChange={handleFileChange} />
            <button className="upload-button" onClick={handleUpload}>Upload File</button><br/><br/>
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
                      <button className="delete-button" onClick={() => handleAssignmentDelete(assignment._id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            );
    
            case 'JoinLiveSession':
                return (
                    <div className="content-section">
                        <h2>Join Live Session</h2>
                        {!isSessionJoined ? (
                            <>
                                <p>Click the button below to join the live session.</p>
                                <input
                                    type="password"
                                    placeholder="Enter authorization key"
                                    value={authKey}
                                    onChange={(e) => setAuthKey(e.target.value)}
                                />
                                <button type="button" className="join-button" onClick={handleJoinSession}>Join Session</button>
                            </>
                        ) : (
                            <div className="jitsi-container">
                                <Jitsi
                                    roomName={roomName}
                                    displayName={username}
                                    containerStyle={{ width: '100%', height: '500px' }}
                                    onAPILoad={(JitsiMeetAPI) => console.log('Jitsi API loaded', JitsiMeetAPI)}
                                />
                            </div>
                        )}
                    </div>
                );
                case 'TakeQuiz':
                  return (
                      <div className="content-section">
                          <h2>Take Quiz</h2>
                          <div className="quiz-section">
                              <div className="quiz-item">
                                  <h3>Python Programming</h3>
                                  <p>Test your knowledge in Python Programming.</p>
                                  <button className="quiz-button" onClick={() => navigateToQuiz('Python')}>Take Quiz</button>
                              </div>
                              <div className="quiz-item">
                                  <h3>Internet of Things (IOT)</h3>
                                  <p>Test your knowledge in Internet of Things.</p>
                                  <button className="quiz-button" onClick={() => navigateToQuiz('IOT')}>Take Quiz</button>
                              </div>
                              <div className="quiz-item">
                                  <h3>Data Structures</h3>
                                  <p>Test your knowledge in Data Structures.</p>
                                  <button className="quiz-button" onClick={() => navigateToQuiz('DataStructures')}>Take Quiz</button>
                              </div>
                              <div className="quiz-item">
                                  <h3>Software Engineering</h3>
                                  <p>Test your knowledge in Software Engineering.</p>
                                  <button className="quiz-button" onClick={() => navigateToQuiz('SoftwareEngineering')}>Take Quiz</button>
                              </div>
                              <div className="quiz-item">
                                  <h3>Computer Hardware</h3>
                                  <p>Test your knowledge in Computer Hardware.</p>
                                  <button className="quiz-button" onClick={() => navigateToQuiz('ComputerHardware')}>Take Quiz</button>
                              </div>
                          </div>
                      </div>
                  );


                  case 'Result':
                    return (
                      <div className="content-section">
                        <h2>View Course Results</h2>
                        {courseResults.length > 0 ? (
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Subject</th>
                                <th>Score</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {courseResults.map((result) => (
                                <tr key={result._id}>
                                  <td>{result.subject}</td>
                                  <td>{result.score}</td>
                                  <td>
                                    <button className="download-button" onClick={() => handleDownloadCertificate(result.subject)}>
                                      Download Certificate
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No results found.</p>
                        )}
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
              <button type="submit" className="submit-rating-button">Submit Rating</button>
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
                <li className={selectedSection === 'Result' ? 'active' : ''} onClick={() => setSelectedSection('Result')}>View Course Result</li>

                <li className={selectedSection === 'RateCourse' ? 'active' : ''} onClick={() => setSelectedSection('RateCourse')}>Rate Course</li>
            </ul>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        <div className="content">
            {renderContent()}
        </div>
        {message && (
            <div className={`message-box ${messageType}`}>
                {message}
            </div>
        )}
    </div>
);
};
export default Dashboard;
