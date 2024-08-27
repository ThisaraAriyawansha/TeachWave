import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ComputerHardware.css'; // Rename or create a new CSS file if needed

const ComputerHardwareQuiz = () => {
    const location = useLocation();
    const { username } = location.state;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [skippedQuestions, setSkippedQuestions] = useState(new Set());
    const [quizFinished, setQuizFinished] = useState(false);

    const quizQuestions = [
        { question: 'What is the primary function of a CPU?', options: ['Processing instructions', 'Storing data', 'Managing input/output', 'Connecting peripherals'], correctAnswer: 0 },
        { question: 'Which component is used for long-term data storage?', options: ['RAM', 'CPU', 'Hard Drive', 'GPU'], correctAnswer: 2 },
        { question: 'What does GPU stand for?', options: ['Graphics Processing Unit', 'General Processing Unit', 'Graphics Power Unit', 'General Power Unit'], correctAnswer: 0 },
        { question: 'What is the function of the motherboard?', options: ['Power supply', 'Connects all components', 'Cooling system', 'Data storage'], correctAnswer: 1 },
        { question: 'Which type of memory is non-volatile?', options: ['RAM', 'Cache', 'ROM', 'Register'], correctAnswer: 2 },
        { question: 'What is the purpose of a power supply unit (PSU)?', options: ['Cooling', 'Providing electrical power', 'Storing data', 'Processing data'], correctAnswer: 1 },
        { question: 'Which component is responsible for heat dissipation in a computer?', options: ['Power supply', 'Heat sink', 'RAM', 'SSD'], correctAnswer: 1 },
        { question: 'What is the main role of RAM in a computer system?', options: ['Long-term storage', 'Temporary storage for active processes', 'Graphics rendering', 'Network connectivity'], correctAnswer: 1 },
        { question: 'Which interface is commonly used to connect external peripherals?', options: ['USB', 'HDMI', 'SATA', 'PCI'], correctAnswer: 0 },
        { question: 'What does BIOS stand for?', options: ['Basic Integrated Operating System', 'Basic Input/Output System', 'Binary Input/Output System', 'Basic Internet Operating System'], correctAnswer: 1 },
    ];

    const handleAnswer = (index) => {
        console.log(`Answer selected for question ${currentQuestion}:`, index);
        console.log(`Correct answer for question ${currentQuestion}:`, quizQuestions[currentQuestion].correctAnswer);
        
        const isCorrect = index === quizQuestions[currentQuestion].correctAnswer;
        
        if (isCorrect) {
            setScore(prevScore => {
                console.log(`Incrementing score. Current score: ${prevScore}`);
                return prevScore + 1;
            });
        }
        
        setUserAnswers([...userAnswers, { questionIndex: currentQuestion, answerIndex: index }]);
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
                    subject: 'Computer Hardware',
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
                    <h2>Computer Hardware Quiz</h2>
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

export default ComputerHardwareQuiz;
