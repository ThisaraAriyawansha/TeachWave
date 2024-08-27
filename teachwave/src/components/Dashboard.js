import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Jitsi from 'react-jitsi';
import { FaBook, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa'; // Importing icons



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
  const [relatedArticles, setRelatedArticles] = useState([]);



  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedArticle(null);
  };

 

  const hardcodedArticles = [
    { 
      id: 1, 
      title: "Understanding React Hooks", 
      author: "John Doe", 
      content: "React Hooks are a game-changer in the world of React development, allowing developers to use state and other React features without writing classes. This article explores the core concepts of Hooks, such as useState and useEffect, and how they can simplify your codebase by enabling functional components to manage state and side effects. The article also dives into advanced Hooks like useReducer and useContext, providing practical examples that showcase their utility in managing complex state logic and global state management. Additionally, it discusses the creation of custom Hooks to encapsulate and reuse logic across components, ultimately making your React applications more modular and maintainable."
    },
    { 
      id: 2, 
      title: "Introduction to Machine Learning", 
      author: "Jane Smith", 
      content: "Machine Learning is transforming industries by enabling systems to learn from data and make intelligent decisions with minimal human intervention. This article provides a comprehensive introduction to the field of machine learning, covering fundamental concepts such as supervised learning, unsupervised learning, and reinforcement learning. Readers will learn about key algorithms, including linear regression, decision trees, and neural networks, and their applications in various domains like finance, healthcare, and marketing. The article also discusses the importance of data preprocessing, feature engineering, and model evaluation in building robust machine learning models, and offers insights into the ethical considerations surrounding AI and machine learning technologies."
    },
    { 
      id: 3, 
      title: "Advanced JavaScript Techniques", 
      author: "Alice Johnson", 
      content: "JavaScript is a versatile language that offers numerous advanced features to enhance your development skills and build more efficient and scalable applications. This article delves into some of the most powerful techniques in JavaScript, such as closures, which allow you to create private variables and functions, enabling encapsulation and data hiding. It also covers the intricacies of asynchronous programming with promises and async/await, helping you manage complex operations like API calls with ease. Additionally, the article explores decorators, a meta-programming feature that lets you add or modify the behavior of classes and methods in a clean and declarative way. By mastering these advanced techniques, you'll be better equipped to tackle complex coding challenges and optimize your JavaScript applications."
    },
    { 
      id: 4, 
      title: "Getting Started with Flutter", 
      author: "Bob Brown", 
      content: "Flutter is a powerful and flexible UI toolkit from Google, enabling developers to create natively compiled applications for mobile, web, and desktop from a single codebase. This guide introduces the key concepts of Flutter, starting with widgets, which are the building blocks of any Flutter application. Readers will learn about different types of widgets, including stateful and stateless widgets, and how to manage state within a Flutter app. The article also covers Flutter's architecture, including the widget tree and the rendering process, providing insights into how Flutter achieves high-performance UI rendering. Additionally, it offers practical advice on setting up your development environment, creating your first Flutter app, and best practices for building responsive and adaptive UIs that work seamlessly across different platforms."
    },
    { 
      id: 5, 
      title: "Understanding RESTful APIs", 
      author: "Eve Davis", 
      content: "RESTful APIs are the backbone of modern web development, providing a standardized way to interact with web services using HTTP requests. This article covers the core principles of REST architecture, including stateless interactions, resource-based design, and the use of standard HTTP methods like GET, POST, PUT, and DELETE. Readers will learn how to design and implement effective RESTful APIs that adhere to best practices, such as using proper status codes, designing clear and consistent endpoints, and ensuring security with authentication and authorization mechanisms. The article also discusses how to integrate RESTful APIs into your applications, enabling seamless communication between different systems and services, and offers tips for debugging and testing APIs to ensure they function correctly."
    },
    { 
      id: 6, 
      title: "Introduction to Data Structures", 
      author: "Tom Green", 
      content: "Data structures are fundamental to computer science and software engineering, providing efficient ways to organize, store, and manage data. This article offers an in-depth overview of essential data structures, including arrays, linked lists, stacks, queues, trees, and graphs. Each data structure is explained in detail, highlighting its characteristics, use cases, and advantages. Readers will also learn about more advanced data structures like hash tables, heaps, and tries, and how they can be used to solve complex problems in various domains. The article includes practical examples and code snippets in different programming languages, demonstrating how to implement these data structures and utilize them to optimize algorithms and improve the performance of your applications."
    },
    { 
      id: 7, 
      title: "Modern Web Design Trends", 
      author: "Nancy Lee", 
      content: "Web design is constantly evolving, with new trends and technologies emerging each year that redefine how websites are created and experienced. This article explores the latest trends in modern web design, such as minimalism, which focuses on clean, simple layouts with plenty of white space; responsive design, which ensures that websites look and function well on any device; and interactive elements, which engage users and enhance the overall experience. Readers will also learn about the growing importance of accessibility in web design, and how to create websites that are inclusive and usable for people with disabilities. The article provides practical tips for incorporating these trends into your web projects, along with examples of websites that exemplify modern design principles."
    },
    { 
      id: 8, 
      title: "Getting Started with Node.js", 
      author: "Steve Wilson", 
      content: "Node.js has revolutionized server-side development by allowing developers to use JavaScript to build scalable, high-performance applications. This guide provides an introduction to Node.js, starting with its architecture, which is based on an event-driven, non-blocking I/O model that makes it ideal for handling concurrent requests. Readers will learn how to set up a Node.js development environment, create a basic server, and use core modules like HTTP and File System to build a simple web application. The article also covers popular Node.js frameworks and libraries, such as Express.js, which streamline the development process by providing powerful tools for routing, middleware, and more. By the end of this guide, you'll have a solid understanding of Node.js and be ready to start building server-side applications with ease."
    },
    { 
      id: 9, 
      title: "Basics of Database Management", 
      author: "Sarah Martinez", 
      content: "Databases are the foundation of most modern applications, providing a structured way to store, manage, and retrieve data. This article introduces the basics of database management, starting with relational databases and SQL, the standard language for querying and manipulating data. Readers will learn about key concepts such as tables, relationships, normalization, and indexing, and how to design efficient database schemas. The article also covers NoSQL databases, which offer flexible data models and scalability for handling large volumes of unstructured data. Practical examples illustrate how to perform common database operations, such as creating tables, inserting data, and writing complex queries, giving readers the knowledge they need to manage databases effectively in their projects."
    },
    { 
      id: 10, 
      title: "Exploring Internet of Things (IoT)", 
      author: "David Clark", 
      content: "The Internet of Things (IoT) is transforming the way we live and work by connecting physical devices to the internet, allowing them to collect, exchange, and act on data. This article provides an overview of IoT, including its architecture, key components, and common protocols like MQTT and CoAP. Readers will learn about various IoT applications, from smart homes and wearables to industrial automation and smart cities, and the potential benefits and challenges of implementing IoT solutions. The article also discusses the importance of security in IoT, given the growing number of connected devices and the potential risks associated with data breaches and cyberattacks. By understanding the fundamentals of IoT, you'll be better equipped to explore and develop innovative IoT solutions that can make a real impact."
    }
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
                        <div className="articles-section">
                        <div className="section-header">
                          <FaBook className="section-icon" />
                          <h2 className="section-title">Knowledge Hub</h2>
                        </div>
                        {!selectedArticle ? (
                          <>
                            <h3 className="articles-heading">Explore Our Articles</h3>
                            <ul className="articles-list">
                              {hardcodedArticles.map((article) => (
                                <li key={article.id} className="article-list-item">
                                  <h4 className="article-title" onClick={() => handleArticleClick(article)}>
                                    {article.title} <FaExternalLinkAlt className="external-link-icon" />
                                  </h4>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <div className="article-details">
                            <h3 className="article-title">{selectedArticle.title}</h3>
                            <p className="article-content">{selectedArticle.content}</p>
                            <ul className="related-articles-list">
                              {relatedArticles.map((relatedArticle) => (
                                <li key={relatedArticle.id} className="related-article-item">
                                  <h5 className="related-article-title" onClick={() => handleArticleClick(relatedArticle)}>
                                    {relatedArticle.title} <FaExternalLinkAlt className="external-link-icon" />
                                  </h5>
                                </li>
                              ))}
                            </ul>
                            <button className="back-button" onClick={() => setSelectedArticle(null)}>
                              <FaArrowLeft className="back-icon" /> Back to Articles
                            </button>
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
