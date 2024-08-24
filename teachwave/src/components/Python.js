import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Python.css';

const PythonQuiz = () => {
    const location = useLocation();
    const { username } = location.state;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [skippedQuestions, setSkippedQuestions] = useState(new Set());
    const [quizFinished, setQuizFinished] = useState(false);

    const quizQuestions = [
        { question: 'What is the output of print(2 ** 3)?', options: ['6', '8', '9', '12'], correctAnswer: 1 },
        { question: 'What keyword is used to define a function in Python?', options: ['function', 'def', 'func', 'define'], correctAnswer: 1 },
        { question: 'Which of the following is mutable in Python?', options: ['String', 'Tuple', 'List', 'Integer'], correctAnswer: 2 },
        { question: 'What is the output of len("hello")?', options: ['4', '5', '6', 'None'], correctAnswer: 1 },
        { question: 'How do you start a comment in Python?', options: ['#', '//', '/*', '<!--'], correctAnswer: 0 },
        { question: 'What is the default return value of a function in Python?', options: ['0', 'None', 'False', 'Null'], correctAnswer: 1 },
        { question: 'How do you include a module in Python?', options: ['import module', 'include module', 'require module', 'using module'], correctAnswer: 0 },
        { question: 'Which method is used to remove whitespace from the beginning and end of a string?', options: ['strip()', 'trim()', 'cut()', 'delete()'], correctAnswer: 0 },
        { question: 'What type of error is raised for invalid syntax?', options: ['RuntimeError', 'SyntaxError', 'NameError', 'TypeError'], correctAnswer: 1 },
        { question: 'Which data structure does not allow duplicates?', options: ['List', 'Set', 'Tuple', 'Dictionary'], correctAnswer: 1 },
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

    const finishQuiz = () => {
        setQuizFinished(true);
    };

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
        <div className="main-container">
            <aside className="sidebar">
                <header className="sidebar-header">
                    <h2>Python Quiz</h2>
                    <p className="username">{username}</p>
                </header>
                <nav>
                    <ul>
                        <li><a href="#">Home</a></li>
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
                        <button onClick={() => window.location.href = '/'}>Return Home</button>
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

export default PythonQuiz;
