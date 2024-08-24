import React from 'react';
import { useLocation } from 'react-router-dom';

const Python = () => {
    const location = useLocation();
    const { username } = location.state;

    return (
        <div>
            <h2>Python Programming Quiz</h2>
            <p>Welcome, {username}! Let's test your Python skills.</p>
            {/* Add your quiz questions and logic here */}
        </div>
    );
};

export default Python;
