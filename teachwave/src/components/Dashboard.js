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
  
    const handleArticleClick = (article) => {
      setSelectedArticle(article);
    };
  
    const handleBackClick = () => {
      setSelectedArticle(null);
    };
  
 

  const hardcodedArticles = [
    { 
      id: 1, 
      title: "Understanding React Hooks", 
      author: "John Doe", 
      content: "React Hooks have revolutionized the way developers write React applications, offering a powerful and flexible way to work with state and side effects without needing to rely on class components. In this article, we dive deep into the fundamental concepts of Hooks, such as useState and useEffect, exploring how they allow you to manage state and lifecycle events in functional components. We will discuss how these Hooks can replace traditional class-based approaches, leading to more concise and readable code. You’ll learn how useEffect can be used for data fetching, subscriptions, and more, all while maintaining clean and predictable state management.\n\nBeyond the basics, the article also covers advanced Hooks like useReducer and useContext, which provide robust solutions for managing complex state logic and global state. We will explore how to create custom Hooks, enabling you to encapsulate and reuse logic across different components in your application. By the end of this article, you'll be equipped with the knowledge to refactor your React applications, making them more efficient, easier to maintain, and more aligned with modern React development practices."
    },
    { 
      id: 2, 
      title: "Introduction to Machine Learning", 
      author: "Jane Smith", 
      content: "Machine Learning is one of the most exciting and rapidly growing fields in technology, driving innovations in various industries, from healthcare to finance. This article provides a comprehensive introduction to the core principles of machine learning, explaining how algorithms learn from data to make predictions and decisions. You’ll explore different types of learning paradigms, including supervised learning, where models are trained on labeled data, and unsupervised learning, which uncovers hidden patterns in data without predefined labels. The article also touches on reinforcement learning, where agents learn to make decisions by interacting with their environment and receiving feedback.\n\nIn addition to the theoretical foundations, the article delves into practical aspects of machine learning, such as data preprocessing, feature selection, and model evaluation. You will learn about popular algorithms like linear regression, decision trees, and neural networks, and understand how to choose the right algorithm for your specific problem. The article also discusses real-world applications of machine learning, highlighting how businesses are using these technologies to gain a competitive edge, automate processes, and deliver personalized experiences. Ethical considerations, such as fairness and transparency in AI, are also examined to provide a well-rounded understanding of the impact and responsibilities associated with machine learning."
    },
    { 
      id: 3, 
      title: "Advanced JavaScript Techniques", 
      author: "Alice Johnson", 
      content: "JavaScript is a dynamic and versatile language that has become essential for modern web development. In this article, we explore some of the advanced techniques in JavaScript that can take your coding skills to the next level. One of the key topics discussed is closures, a feature that allows for the creation of functions with private variables, enabling data encapsulation and more secure code. We will provide detailed examples of how closures can be used to create modular and maintainable code, especially in complex applications where managing state and data flow can become challenging.\n\nThe article also covers asynchronous programming in JavaScript, which is crucial for handling operations like API calls and event-driven programming. We’ll delve into the nuances of promises, async/await, and how they simplify asynchronous code by avoiding callback hell and making it easier to read and maintain. Furthermore, the article introduces decorators, a meta-programming feature that allows you to extend or modify the behavior of classes and methods. By the end of this article, you'll have a deeper understanding of these advanced techniques, empowering you to write more efficient, scalable, and sophisticated JavaScript code."
    },
    { 
      id: 4, 
      title: "Getting Started with Flutter", 
      author: "Bob Brown", 
      content: "Flutter is a revolutionary framework by Google that enables developers to create natively compiled applications for mobile, web, and desktop from a single codebase. This article serves as a comprehensive guide for beginners to get started with Flutter, covering everything from setting up your development environment to building your first app. We begin with an introduction to Flutter’s core concepts, such as widgets, which are the building blocks of any Flutter application. You’ll learn the difference between stateful and stateless widgets, and how to manage state effectively within your app to create dynamic and responsive user interfaces.\n\nBeyond the basics, this article also explores the architectural aspects of Flutter, such as the widget tree, rendering process, and the role of the Flutter engine in ensuring high-performance UIs. We provide practical tips on best practices for building cross-platform applications, including how to optimize your code for different screen sizes and platforms. Additionally, we discuss the importance of state management in Flutter, introducing popular state management solutions like Provider and Riverpod, and how they can simplify your app’s architecture. By the end of this article, you’ll have a solid foundation in Flutter, ready to build beautiful and efficient applications that run smoothly on any platform."
    },
    { 
      id: 5, 
      title: "Understanding RESTful APIs", 
      author: "Eve Davis", 
      content: "RESTful APIs have become a cornerstone of modern web development, providing a standard way for different systems to communicate over the internet. This article explains the principles behind REST (Representational State Transfer) and how they guide the design of APIs that are scalable, stateless, and easy to maintain. You’ll learn about the key components of RESTful APIs, such as resources, endpoints, and HTTP methods (GET, POST, PUT, DELETE), and how they interact to perform CRUD operations. The article also covers best practices for designing APIs, including naming conventions, versioning, and the use of appropriate status codes to improve clarity and consistency in your API’s behavior.\n\nFurthermore, the article explores how to implement RESTful APIs in various programming languages and frameworks, such as Node.js with Express or Python with Flask. You’ll learn about the importance of authentication and authorization in securing your API, as well as techniques for managing rate limiting and caching to enhance performance. The article concludes with a discussion on API documentation and testing, providing tools and tips for ensuring that your API is well-documented, easy to use, and thoroughly tested for reliability. Whether you’re a seasoned developer or new to API development, this article will equip you with the knowledge needed to design and build robust RESTful APIs."
    },
    { 
      id: 6, 
      title: "Introduction to Data Structures", 
      author: "Tom Green", 
      content: "Data structures are a fundamental aspect of computer science, crucial for organizing and managing data efficiently. This article provides an in-depth introduction to the most commonly used data structures, including arrays, linked lists, stacks, and queues. We explore the characteristics of each data structure, such as how data is stored, how operations like insertion, deletion, and traversal are performed, and the time complexity associated with these operations. Understanding these basics is essential for any developer, as choosing the right data structure can significantly impact the performance and scalability of your applications.\n\nIn addition to the basics, the article covers more advanced data structures like trees, graphs, hash tables, and heaps. You’ll learn about their use cases, such as how binary search trees facilitate efficient searching and sorting, or how graphs can represent complex relationships in social networks or routing algorithms. The article also provides practical examples and code snippets in languages like Python and Java, illustrating how to implement and use these data structures effectively. By mastering these data structures, you’ll be better equipped to tackle complex algorithmic challenges and optimize your code for better performance."
    },
    { 
      id: 7, 
      title: "Modern Web Design Trends", 
      author: "Nancy Lee", 
      content: "Web design is an ever-evolving field, with new trends emerging each year that redefine the way we create and experience websites. This article explores the latest trends in modern web design, starting with minimalism, a design philosophy that emphasizes simplicity, clean lines, and ample white space to create a visually appealing and user-friendly interface. We also delve into the growing importance of responsive design, which ensures that websites function smoothly across a variety of devices, from desktops to smartphones, providing an optimal user experience regardless of screen size.\n\nAnother trend highlighted in the article is the use of interactive elements, such as animations, micro-interactions, and hover effects, which engage users and enhance the overall experience by making websites feel more dynamic and responsive. The article also discusses the rise of accessibility in web design, emphasizing the importance of creating websites that are inclusive and usable for people with disabilities. This includes implementing features like keyboard navigation, screen reader compatibility, and high-contrast color schemes. By understanding and incorporating these modern design trends, you can create websites that not only look great but also provide an exceptional user experience that meets the needs of all users."
    },
    { 
      id: 8, 
      title: "Getting Started with Node.js", 
      author: "Steve Wilson", 
      content: "Node.js has transformed the landscape of server-side development by allowing developers to use JavaScript, traditionally a client-side language, on the server. This article introduces the core concepts of Node.js, starting with its event-driven, non-blocking I/O model, which makes it particularly well-suited for building scalable and high-performance applications that handle numerous concurrent connections. You’ll learn how to set up a Node.js environment, create a simple server, and use built-in modules like HTTP, URL, and File System to handle requests and serve files.\n\nBeyond the basics, the article explores the rich ecosystem of Node.js libraries and frameworks, such as Express.js, which simplifies the process of building robust web applications by providing a minimal and flexible structure for handling routing, middleware, and more. We also discuss best practices for developing with Node.js, including error handling, asynchronous programming, and modularization to keep your codebase clean and maintainable. By the end of this article, you’ll have a solid understanding of Node.js and be ready to start building your own server-side applications with JavaScript."
    },
    { 
      id: 9, 
      title: "Exploring Cybersecurity Basics", 
      author: "Carol White", 
      content: "Cybersecurity has become a critical concern in today’s digital age, where cyber threats are increasingly sophisticated and prevalent. This article provides a comprehensive introduction to the basics of cybersecurity, starting with an overview of the common types of cyber threats, such as malware, phishing, ransomware, and DDoS attacks. You’ll learn about the techniques cybercriminals use to exploit vulnerabilities in systems and the devastating impact these attacks can have on individuals and organizations alike. The article emphasizes the importance of understanding these threats to effectively protect sensitive data and maintain the integrity of digital systems.\n\nIn addition to threat awareness, the article delves into fundamental cybersecurity practices that everyone should follow, such as using strong passwords, enabling two-factor authentication, and regularly updating software to patch security vulnerabilities. We also discuss the role of firewalls, antivirus software, and encryption in safeguarding digital assets. The article concludes with an exploration of more advanced concepts like penetration testing, which involves simulating cyberattacks to identify and fix security weaknesses, and the importance of developing a cybersecurity strategy that aligns with an organization’s specific needs and risk profile. Whether you’re a beginner or looking to deepen your understanding of cybersecurity, this article provides valuable insights to help you navigate the increasingly complex world of digital security."
    },
    { 
      id: 10, 
      title: "Building Scalable Web Applications", 
      author: "Mike Black", 
      content: "Scalability is a key consideration in web application development, ensuring that your application can handle increased traffic and data loads without compromising performance. This article explores the principles and practices of building scalable web applications, starting with the importance of designing a solid architecture that can grow with your user base. We discuss the role of load balancing in distributing traffic across multiple servers, preventing any single server from becoming a bottleneck, and the use of caching strategies to reduce the load on your database by storing frequently accessed data in memory.\n\nThe article also covers database scalability, explaining the differences between vertical and horizontal scaling, and how to choose the right approach based on your application’s needs. We’ll delve into the use of microservices, which break down your application into smaller, independent services that can be scaled individually, allowing for greater flexibility and resilience. Additionally, the article touches on the importance of monitoring and optimizing performance, using tools to track server load, response times, and other key metrics to ensure your application remains responsive and reliable under heavy usage. By understanding and applying these scalability practices, you can build web applications that are robust, efficient, and capable of handling growth effectively."
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
                <h2>Submit Assignment</h2><br/>
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
          <p className="article-author">By {selectedArticle.author}</p>
          <div className="article-content">
            {/* Here, split the content into paragraphs with titles */}
            <p><strong>Introduction:</strong></p>
            <p>{selectedArticle.content.split('\n')[0]}</p>
            <p><strong>Details:</strong></p>
            <p>{selectedArticle.content.split('\n').slice(1).join('\n')}</p>
          </div>
          <ul className="related-articles-list">
            {hardcodedArticles
              .filter((article) => article.id !== selectedArticle.id)
              .map((relatedArticle) => (
                <li key={relatedArticle.id} className="related-article-item">
                  <h5 className="related-article-title" onClick={() => handleArticleClick(relatedArticle)}>
                    {relatedArticle.title} <FaExternalLinkAlt className="external-link-icon" />
                  </h5>
                </li>
              ))}
          </ul>
          <button className="back-button" onClick={handleBackClick}>
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
