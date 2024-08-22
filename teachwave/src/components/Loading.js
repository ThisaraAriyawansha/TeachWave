import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import logo from './image/logo3.webp'; // Adjust the path to your logo
import './Loading.css'; // Assuming you have custom styles here

const LoadingScreen = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setIsLoading(true); // Start loading animation
    simulateProgress();
  };

  const simulateProgress = () => {
    let interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete(); // Call onComplete when animation is complete
          return 100;
        }
        return prev + 2; // Increment progress more gradually
      });
    }, 20); // Adjust the interval for smoother animation (lower values make it smoother)
  };

  return (
    <Container className="loading-container">
      <img src={logo} alt="System Logo" className="loading-logo" style={{ width: '180px', height: '180px' }} />
      <h1 className="loading-title">ScanAttend</h1>
      <p className="loading-description">Streamlining attendance management with QR code technology.</p>
      <Button onClick={startLoading} className="loading-button">Let's Start</Button>
      {isLoading && (
        <div className="loading-animation">
          {/* Replace with your custom progress bar animation */}
          <div className="loading-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default LoadingScreen;
