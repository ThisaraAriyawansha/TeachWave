import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import './Python.css';

// Register the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const PythonQuiz = () => {
    const location = useLocation();
    const { username } = location.state;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [skippedQuestions, setSkippedQuestions] = useState(new Set());

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
        setUserAnswers([...userAnswers, index]);
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
            alert(`Quiz completed! Your score: ${score}/${quizQuestions.length}`);
        }
    };

    const prevQuestion = () => {
        const prevQuestionIndex = currentQuestion - 1;
        if (prevQuestionIndex >= 0) {
            setCurrentQuestion(prevQuestionIndex);
        }
    };

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    const data = {
        labels: ['Answered', 'Remaining'],
        datasets: [
            {
                label: 'Questions',
                data: [userAnswers.length, quizQuestions.length - userAnswers.length - skippedQuestions.size],
                backgroundColor: ['#007bff', '#e0e0e0'],
            },
        ],
    };

    return (
        <div className="main-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>Python Quiz</h2>
                    <p className="username">{username}</p>
                </div>
                <ul>
                    <li>Home</li>
                    <li>Quiz</li>
                    <li>Results</li>
                </ul>
            </div>
            <div className="content">
                <ProgressBar now={progress} label={`${currentQuestion + 1}/${quizQuestions.length}`} />

                <div className="chart-container">
                    <Chart type="bar" data={data} />
                </div>

                {currentQuestion < quizQuestions.length ? (
                    <div className="quiz-question">
                        <h3>Question {currentQuestion + 1}</h3>
                        <p>{quizQuestions[currentQuestion].question}</p>
                        <ul className="quiz-options">
                            {quizQuestions[currentQuestion].options.map((option, index) => (
                                <li key={index}>
                                    <button onClick={() => handleAnswer(index)}>{option}</button>
                                </li>
                            ))}
                        </ul>
                        <div className="navigation-buttons">
                            <button onClick={prevQuestion} disabled={currentQuestion === 0}>Back</button>
                            <button onClick={handleSkip} className="skip-button">Skip Question</button>
                            <button onClick={nextQuestion} disabled={currentQuestion === quizQuestions.length - 1}>Next</button>
                        </div>
                    </div>
                ) : (
                    <div className="quiz-results">
                        <h3>Your final score: {score}/{quizQuestions.length}</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PythonQuiz;
