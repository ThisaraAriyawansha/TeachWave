import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DataStructures.css'; // Rename the CSS file if needed or create a new one

const DataStructuresQuiz = () => {
    const location = useLocation();
    const { username } = location.state;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [skippedQuestions, setSkippedQuestions] = useState(new Set());
    const [quizFinished, setQuizFinished] = useState(false);

    const quizQuestions = [
        { question: 'What is the time complexity of accessing an element in an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 0 },
        { question: 'Which data structure is used for implementing a LRU cache?', options: ['Queue', 'Stack', 'Hash Map', 'Binary Search Tree'], correctAnswer: 2 },
        { question: 'What type of data structure is a stack?', options: ['FIFO', 'LIFO', 'Priority Queue', 'Deque'], correctAnswer: 1 },
        { question: 'Which data structure is used for breadth-first search?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctAnswer: 1 },
        { question: 'In a binary search tree, the left child is always...', options: ['Greater than the parent', 'Smaller than the parent', 'Equal to the parent', 'None of the above'], correctAnswer: 1 },
        { question: 'What is the worst-case time complexity of bubble sort?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], correctAnswer: 2 },
        { question: 'Which data structure uses pointers to connect nodes?', options: ['Array', 'Linked List', 'Hash Table', 'Heap'], correctAnswer: 1 },
        { question: 'What is the space complexity of a hash table with chaining?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 0 },
        { question: 'Which data structure is ideal for implementing recursion?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correctAnswer: 1 },
        { question: 'Which algorithm is used for finding the shortest path in a graph?', options: ['Dijkstra’s Algorithm', 'Kruskal’s Algorithm', 'Bellman-Ford Algorithm', 'A* Search Algorithm'], correctAnswer: 0 },
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
                    subject: 'Data Structures',
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
                    <h2>Data Structures Quiz</h2>
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

export default DataStructuresQuiz;
