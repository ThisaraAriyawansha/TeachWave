import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './IOT.css'; // Make sure to rename the CSS file if needed

const IoTQuiz = () => {
    const location = useLocation();
    const { username } = location.state;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [skippedQuestions, setSkippedQuestions] = useState(new Set());
    const [quizFinished, setQuizFinished] = useState(false);

    const quizQuestions = [
        { question: 'What does IoT stand for?', options: ['Internet of Things', 'Internet of Technology', 'Internet of Techniques', 'Internet of Time'], correctAnswer: 0 },
        { question: 'Which protocol is commonly used in IoT for device communication?', options: ['HTTP', 'MQTT', 'FTP', 'SMTP'], correctAnswer: 1 },
        { question: 'What is a common IoT communication method?', options: ['Zigbee', 'Wi-Fi', 'Bluetooth', 'All of the above'], correctAnswer: 3 },
        { question: 'Which company is known for its contributions to IoT platforms?', options: ['IBM', 'Microsoft', 'Apple', 'Samsung'], correctAnswer: 1 },
        { question: 'Which of the following is a popular IoT development platform?', options: ['Raspberry Pi', 'Arduino', 'Both', 'None'], correctAnswer: 2 },
        { question: 'What is the primary purpose of an IoT gateway?', options: ['Data storage', 'Data processing', 'Device management', 'Data collection'], correctAnswer: 3 },
        { question: 'What type of data is commonly transmitted in IoT systems?', options: ['Sensor data', 'Image data', 'Voice data', 'All of the above'], correctAnswer: 0 },
        { question: 'What is the role of a sensor in IoT?', options: ['Data transmission', 'Data reception', 'Data collection', 'Data storage'], correctAnswer: 2 },
        { question: 'Which programming language is frequently used for IoT development?', options: ['JavaScript', 'Python', 'C', 'Java'], correctAnswer: 2 },
        { question: 'Which of the following is not an IoT device?', options: ['Smart thermostat', 'Smartphone', 'Smart refrigerator', 'Web server'], correctAnswer: 3 },
    ];

    const handleAnswer = (index) => {
        setUserAnswers([...userAnswers, { questionIndex: currentQuestion, answerIndex: index }]);
        if (index === quizQuestions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }
        nextQuestion();
    };

    const handleSkip = () => {
        setSkippedQuestions(new Set(skippedQuestions.add(currentQuestion)));
        nextQuestion();
    };

    const nextQuestion = () => {
        const nextQuestionIndex = currentQuestion + 1;
        if (nextQuestionIndex < quizQuestions.length) {
            setCurrentQuestion(nextQuestionIndex);
        } else {
            finishQuiz();
        }
    };

    const prevQuestion = () => {
        const prevQuestionIndex = currentQuestion - 1;
        if (prevQuestionIndex >= 0) {
            setCurrentQuestion(prevQuestionIndex);
        }
    };

    const finishQuiz = async () => {
        setQuizFinished(true);
    
        // Increment the score by 1 before sending
        const finalScore = score + 1;
        console.log("Final score before sending:", finalScore); // Log final score before sending
    
        try {
            const response = await fetch('http://localhost:5000/submit-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    subject: 'IOT',
                    score: finalScore,  // Use the incremented score here
                }),
            });
    
            const data = await response.json();
            console.log('Backend response:', data.message);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
        <div className="main-container">
            <aside className="sidebar">
                <header className="sidebar-header">
                    <h2>IOT Quiz</h2>
                    <p className="username">{username}</p>
                </header>
                <nav>
                    <ul>
                        <li><a href="/dashboard">Dashboard</a></li>
                    </ul>
                </nav>
                <div className="question-summary">
                    <h3>Question Summary</h3>
                    <ul>
                        {quizQuestions.map((_, index) => (
                            <li
                                key={index}
                                className={`question-item ${userAnswers.some(answer => answer.questionIndex === index) ? 'answered' : skippedQuestions.has(index) ? 'skipped' : ''}`}
                                onClick={() => setCurrentQuestion(index)}
                            >
                                {index + 1}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            <main className="content">
                {!quizFinished ? (
                    <section className="quiz-container">
                        <div className="question-header">
                            <h3>Question {currentQuestion + 1}</h3>
                        </div>
                        <p className="question-text">{quizQuestions[currentQuestion].question}</p>
                        <ul className="quiz-options">
                            {quizQuestions[currentQuestion].options.map((option, index) => (
                                <li key={index} className="option-item">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`question${currentQuestion}`}
                                            value={index}
                                            checked={userAnswers.some(answer => answer.questionIndex === currentQuestion && answer.answerIndex === index)}
                                            onChange={() => handleAnswer(index)}
                                        />
                                        {option}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <div className="button-group">
                            <button onClick={prevQuestion} disabled={currentQuestion === 0} className="nav-button">Back</button>
                            <button onClick={handleSkip} className="skip-button">Skip</button>
                            <button onClick={nextQuestion} disabled={currentQuestion === quizQuestions.length - 1} className="nav-button">Next</button>
                            <button onClick={finishQuiz} className="finish-button">Finish</button>
                        </div>
                    </section>
                ) : (
                    <div className="message-box">
                        <h3>Quiz Completed!</h3>
                        <p>Your final score:</p>
                        <p className="score">{score}/{quizQuestions.length}</p>
                        <p className="feedback">Thank you for participating!</p>
                        <button onClick={() => window.location.href = '/dashboard'}>Return Home</button>
                    </div>
                )}
                <br/>
                <div className="progress-container">
                    <ProgressBar now={progress} label={`${currentQuestion + 1}/${quizQuestions.length}`} className="progress-bar" />
                </div>
            </main>
        </div>
    );
};

export default IoTQuiz;
