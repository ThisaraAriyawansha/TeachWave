// SoftwareEngineering.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const SoftwareEngineering = () => {
    const location = useLocation();
    const { username } = location.state;

    return (
        <div>
            <h2>SoftwareEngineering Programming Quiz</h2>
            <p>Welcome, {username}!</p>
            {/* Add your quiz questions and logic here */}
        </div>
    );
};

export default SoftwareEngineering;
