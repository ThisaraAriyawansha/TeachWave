import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState('CourseManagement');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // If no username found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear the authentication token and username from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/create-account');
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'CourseManagement':
        return (
          <div>
            <h2>Course Management</h2>
            <form>
              <label>
                Course Title:
                <input type="text" placeholder="Enter course title" />
              </label>
              <label>
                Description:
                <textarea placeholder="Enter course description"></textarea>
              </label>
              <label>
                Category:
                <input type="text" placeholder="Enter course category" />
              </label>
              <button type="submit">Save Course</button>
            </form>
          </div>
        );
      case 'QuizSettings':
        return (
          <div>
            <h2>Quiz Settings</h2>
            <form>
              <label>
                Quiz Title:
                <input type="text" placeholder="Enter quiz title" />
              </label>
              <label>
                Number of Questions:
                <input type="number" placeholder="Enter number of questions" />
              </label>
              <button type="submit">Save Quiz</button>
            </form>
          </div>
        );
      case 'CertificationManagement':
        return (
          <div>
            <h2>Certification Management</h2>
            <form>
              <label>
                Certification Title:
                <input type="text" placeholder="Enter certification title" />
              </label>
              <label>
                Issuing Authority:
                <input type="text" placeholder="Enter issuing authority" />
              </label>
              <button type="submit">Save Certification</button>
            </form>
          </div>
        );
      case 'LiveWebinars':
        return (
          <div>
            <h2>Live Webinars</h2>
            <form>
              <label>
                Webinar Title:
                <input type="text" placeholder="Enter webinar title" />
              </label>
              <label>
                Date and Time:
                <input type="datetime-local" />
              </label>
              <button type="submit">Schedule Webinar</button>
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
          <li
            className={selectedSection === 'CourseManagement' ? 'active' : ''}
            onClick={() => setSelectedSection('CourseManagement')}
          >
            Course Management
          </li>
          <li
            className={selectedSection === 'QuizSettings' ? 'active' : ''}
            onClick={() => setSelectedSection('QuizSettings')}
          >
            Quiz Settings
          </li>
          <li
            className={selectedSection === 'CertificationManagement' ? 'active' : ''}
            onClick={() => setSelectedSection('CertificationManagement')}
          >
            Certification Management
          </li>
          <li
            className={selectedSection === 'LiveWebinars' ? 'active' : ''}
            onClick={() => setSelectedSection('LiveWebinars')}
          >
            Live Webinars
          </li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
