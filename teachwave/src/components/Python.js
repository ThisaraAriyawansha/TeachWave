import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Python.css';

const PythonQuiz = () => {
    const location = useLocation();
    const { username } = location.state;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);

    const quizQuestions = [
        {
            question: "What is the correct syntax to output 'Hello World' in Python?",
            options: ["echo 'Hello World'", "print('Hello World')", "console.log('Hello World')", "cout << 'Hello World'"],
            correctAnswer: 1
        },
        {
            question: "How do you create a variable with the numeric value 5?",
            options: ["x = 5", "int x = 5", "x = int(5)", "All of the above"],
            correctAnswer: 0
        },
        {
            question: "Which operator is used to calculate the remainder in Python?",
            options: ["%", "//", "&", "/"],
            correctAnswer: 0
        },
        {
            question: "What is the correct syntax for defining a function in Python?",
            options: ["def function_name():", "function function_name():", "define function_name():", "func function_name():"],
            correctAnswer: 0
        },
        {
            question: "Which of the following is a mutable data type in Python?",
            options: ["tuple", "list", "string", "int"],
            correctAnswer: 1
        },
        {
            question: "How do you insert comments in Python code?",
            options: ["// Comment", "# Comment", "<!-- Comment -->", "/* Comment */"],
            correctAnswer: 1
        },
        {
            question: "What keyword is used to handle exceptions in Python?",
            options: ["catch", "try", "except", "finally"],
            correctAnswer: 2
        },
        {
            question: "How do you start a for loop in Python?",
            options: ["for i in range(0, 10):", "for i = 0; i < 10; i++:", "loop i from 0 to 10:", "foreach i in range(10):"],
            correctAnswer: 0
        },
        {
            question: "What is the output of the expression 5 ** 2 in Python?",
            options: ["25", "10", "5", "55"],
            correctAnswer: 0
        },
        {
            question: "Which method can be used to remove whitespace from the beginning and end of a string?",
            options: ["strip()", "trim()", "remove()", "cut()"],
            correctAnswer: 0
        }
    ];

    const handleAnswer = (index) => {
        setUserAnswers([...userAnswers, index]);
        if (index === quizQuestions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quizQuestions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            alert(`Quiz completed! Your score: ${score + 1}/${quizQuestions.length}`);
        }
    };

    return (
        <div className="quiz-container">
            <h2>Python Programming Quiz</h2>
            <p>Welcome, {username}! Let's test your Python skills.</p>

            {currentQuestion < quizQuestions.length ? (
                <div className="quiz-question">
                    <h3>{quizQuestions[currentQuestion].question}</h3>
                    <ul className="quiz-options">
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                            <li key={index}>
                                <button onClick={() => handleAnswer(index)}>{option}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="quiz-results">
                    <h3>Your final score: {score}/{quizQuestions.length}</h3>
                </div>
            )}
        </div>
    );
};

export default PythonQuiz;
