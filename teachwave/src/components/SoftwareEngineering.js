import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SoftwareEngineering.css'; // Rename or create a new CSS file if needed

const SoftwareEngineeringQuiz = () => {
    const location = useLocation();
    const { username } = location.state;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [skippedQuestions, setSkippedQuestions] = useState(new Set());
    const [quizFinished, setQuizFinished] = useState(false);

    const quizQuestions = [
        { question: 'What does UML stand for?', options: ['Unified Modeling Language', 'Universal Modeling Language', 'Uniform Modeling Language', 'Unified Metrics Language'], correctAnswer: 0 },
        { question: 'Which of the following is a phase in the Software Development Life Cycle (SDLC)?', options: ['Design', 'Implementation', 'Testing', 'All of the above'], correctAnswer: 3 },
        { question: 'What is the primary purpose of software testing?', options: ['To find bugs', 'To write code', 'To design software', 'To deploy software'], correctAnswer: 0 },
        { question: 'What type of testing is done to check the integration of different modules?', options: ['Unit Testing', 'Integration Testing', 'System Testing', 'Acceptance Testing'], correctAnswer: 1 },
        { question: 'In Agile methodology, what is a sprint?', options: ['A period of development', 'A type of test', 'A project phase', 'A coding standard'], correctAnswer: 0 },
        { question: 'What is the purpose of a design pattern?', options: ['To solve common design problems', 'To write code faster', 'To debug software', 'To manage databases'], correctAnswer: 0 },
        { question: 'Which software development methodology focuses on continuous improvement?', options: ['Waterfall', 'Agile', 'V-Model', 'Spiral'], correctAnswer: 1 },
        { question: 'What does MVP stand for in software development?', options: ['Model-View-Process', 'Model-View-Provider', 'Model-View-Presenter', 'Model-View-Project'], correctAnswer: 2 },
        { question: 'What is a use case in software engineering?', options: ['A requirement specification', 'A test case', 'A user story', 'A design pattern'], correctAnswer: 0 },
        { question: 'Which of the following is a common version control system?', options: ['Git', 'JIRA', 'Jenkins', 'Docker'], correctAnswer: 0 },
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
        try {
            const response = await fetch('http://localhost:5000/submit-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    subject: 'Software Engineering',
                    score,
                }),
            });
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
        <div className="main-container">
            <aside className="sidebar">
                <header className="sidebar-header">
                    <h2>Software Engineering Quiz</h2>
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

export default SoftwareEngineeringQuiz;
