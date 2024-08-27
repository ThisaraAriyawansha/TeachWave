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
  const [courseResults, setCourseResults] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  const hardcodedArticles = [
    { id: 1, title: "Understanding React Hooks", author: "John Doe", content: "This article explains React Hooks and how they can be used to manage state and side effects in functional components." },
    { id: 2, title: "Introduction to Machine Learning", author: "Jane Smith", content: "A beginner's guide to machine learning, covering basic concepts and algorithms." },
    { id: 3, title: "Advanced JavaScript Techniques", author: "Alice Johnson", content: "Explore advanced JavaScript techniques, including closures, promises, and async/await." },
    { id: 4, title: "Getting Started with Flutter", author: "Bob Brown", content: "Learn how to get started with Flutter for building cross-platform mobile applications." },
    { id: 5, title: "Understanding RESTful APIs", author: "Eve Davis", content: "This article covers the principles of RESTful APIs and how to use them for web services." },
    { id: 6, title: "Introduction to Data Structures", author: "Tom Green", content: "An overview of fundamental data structures such as arrays, linked lists, stacks, and queues." },
    { id: 7, title: "Modern Web Design Trends", author: "Nancy Lee", content: "Discover the latest trends in web design and how to create modern, user-friendly websites." },
    { id: 8, title: "Getting Started with Node.js", author: "Steve Wilson", content: "A guide to getting started with Node.js for server-side development." },
    { id: 9, title: "Basics of Database Management", author: "Sarah Martinez", content: "Learn the basics of database management systems, including SQL and NoSQL databases." },
    { id: 10, title: "Exploring Internet of Things (IoT)", author: "David Clark", content: "An introduction to IoT, its applications, and how to build IoT solutions." }
  ];
 

  

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
      

const fetchResults = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/results/${username}`);
    setCourseResults(response.data);
  } catch (error) {
    console.error('Error fetching results:', error);
    showMessage('Failed to fetch course results. Please try again.', 'error');
  }
};


const handleDownloadCertificate = async (subject, user) => {
  try {
      const response = await axios.get(`http://localhost:5000/generate-certificate/${subject}/${username}`, {
          responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
  } catch (error) {
      console.error('Error downloading certificate:', error.response ? error.response.data : error.message);
      alert('Failed to download certificate. Please try again.');
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


    const handleArticleClick = (article) => {
      setSelectedArticle(article);
      // Mock related articles for demonstration
      const related = hardcodedArticles.filter(a => a.id !== article.id);
      setRelatedArticles(related);
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
                </form><br/>
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
                                                    <button
                                                        className="download-button"
                                                        onClick={() => handleDownloadCertificate(result.subject)}
                                                    >
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
                    
                    case 'ReadArticle':
                      return (
                        <div className="content-section">
                          <h2>Read Articles</h2>
                          {!selectedArticle ? (
                            <>
                              <h3>Available Articles:</h3>
                              <ul>
                                {hardcodedArticles.map((article) => (
                                  <li key={article.id} className="article-item">
                                    <h4 onClick={() => handleArticleClick(article)}>{article.title}</h4>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <div className="article-details">
                              <h3>{selectedArticle.title}</h3>
                              <p>{selectedArticle.content}</p>
                              <h4>Related Articles:</h4>
                              <ul>
                                {relatedArticles.map((relatedArticle) => (
                                  <li key={relatedArticle.id} className="article-item">
                                    <h5 onClick={() => handleArticleClick(relatedArticle)}>{relatedArticle.title}</h5>
                                  </li>
                                ))}
                              </ul>
                              <button onClick={() => setSelectedArticle(null)}>Back to Articles</button>
                            </div>
                          )}
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
    <li className={selectedSection === 'ReadArticle' ? 'active' : ''} onClick={() => setSelectedSection('ReadArticle')}>Read Article</li>
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
