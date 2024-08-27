import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.css'; 
import logoImage from './image/man.avif'; // Import the image
import { FaBookOpen } from 'react-icons/fa'; // Import Font Awesome icon

const LoadingScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/create-account');
    }, 3000);
  };

  return (
    <div className="loading-screen">
      <div className="background-graphic"></div> {/* Background graphic */}
      <div className="logo">
        <img src={logoImage} alt="TeachWave Logo" />
      </div>
      <div className="description">
        <FaBookOpen className="icon" /> {/* Educational icon */}
        <h1>Welcome to TeachWave</h1>
        <p>TeachWave is a refined online learning platform offering interactive courses, quizzes, certifications, 
           and live webinars, connecting students and instructors for an exceptional educational experience.</p>
      </div>
      {!loading ? (
        <button onClick={handleStart} className="start-button">Get Started</button>
      ) : (
        <div className="loading-container">
          <div className="loading-bar"></div>
          <div className="loading-text">Loading...</div>
        </div>
      )}
      <div className="footer-text">
        <p>Empowering learners and educators for a brighter future...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
